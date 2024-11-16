// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "chronicle-std/contracts/IChronicle.sol";
import "chronicle/self-kisser/contracts/ISelfKisser.sol";

interface IMarketResolver {
    function resolveMarket(uint256 marketId) external returns (uint256 winningOptionIndex);
}

// Oracle resolver for token price predictions
contract PriceResolver is IMarketResolver {
    struct PriceTarget {
        address priceFeed;
        uint256 targetPrice;
        bool above; // true if betting price will be above target
    }
    
    mapping(uint256 => PriceTarget) public priceTargets;
    
    function setPriceTarget(
        uint256 marketId,
        address priceFeed,
        uint256 targetPrice,
        bool above
    ) external {
        priceTargets[marketId] = PriceTarget(priceFeed, targetPrice, above);
    }
    
    function resolveMarket(uint256 marketId) external override returns (uint256) {
        PriceTarget memory target = priceTargets[marketId];
        require(target.priceFeed != address(0), "Price target not set");
        
        // Get latest price from Chronicle
        IChronicle chronicle = IChronicle(target.priceFeed);
        ISelfKisser selfKisser = ISelfKisser(address(0x70E58b7A1c884fFFE7dbce5249337603a28b8422));
        // Add address(this) to chronicle oracle's whitelist.
        selfKisser.selfKiss(address(chronicle));
        (
            uint256 val,
        ) = chronicle.readWithAge();
        
        // If price is above target and betting above, option 0 wins
        // If price is below target and betting below, option 0 wins
        if ((val > target.targetPrice && target.above) ||
            (val < target.targetPrice && !target.above)) {
            return 0; // "Yes" wins
        } else {
            return 1; // "No" wins
        }
    }
}

contract MarketToken is ERC20, Ownable {
    address public marketFactory;
    bool public resolved;
    bool public isWinner;
    
    constructor(
        string memory name,
        string memory symbol,
        address _marketFactory
    ) ERC20(name, symbol) Ownable(_marketFactory) {
        marketFactory = _marketFactory;
        // transferOwnership(_marketFactory);
    }
    
    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }
    
    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
    
    function setResolved(bool _isWinner) external onlyOwner {
        resolved = true;
        isWinner = _isWinner;
    }
}

contract BetokenMarkets is ReentrancyGuard {
    enum MarketType {
        MANUAL,          // Manual resolution
        PRICE_ORACLE     // Chronicle price feed resolution
    }
    
    struct Market {
        string title;
        uint256 createdAt;
        uint256 resolutionTime;
        address creator;
        address[] tokens;
        string[] options;
        bool resolved;
        MarketType marketType;
        IMarketResolver resolver;
        mapping(uint256 => LiquidityPool) pools;
        uint256 totalLiquidity;
    }
    
    struct LiquidityPool {
        uint256 ethBalance;
        uint256 tokenBalance;
    }
    
    mapping(uint256 => Market) public markets;
    uint256 public marketCount;
    uint256 public constant PRECISION = 1e18;
    uint256 public constant MIN_LIQUIDITY = 1e15;
    uint256 public constant FEE_PERCENTAGE = 30; // 0.3% fee
    
    event MarketCreated(
        uint256 indexed marketId,
        string title,
        string[] options,
        MarketType marketType,
        address resolver
    );
    event TokensPurchased(uint256 indexed marketId, address buyer, uint256 optionIndex, uint256 tokenAmount, uint256 ethPaid);
    event TokensSold(uint256 indexed marketId, address seller, uint256 optionIndex, uint256 tokenAmount, uint256 ethReceived);
    event MarketResolved(uint256 indexed marketId, uint256 winningOptionIndex);

    function createPriceMarket(
        string memory _title,
        uint256 _resolutionTime,
        address _priceFeed,
        uint256 _targetPrice,
        bool _above
    ) external payable returns (uint256) {
        require(_resolutionTime > block.timestamp, "Invalid resolution time");
        require(msg.value >= MIN_LIQUIDITY * 2, "Insufficient initial liquidity");
        
        string[] memory options = new string[](2);
        options[0] = "Yes";
        options[1] = "No";
        
        uint256 marketId = _createMarket(_title, options, _resolutionTime, MarketType.PRICE_ORACLE);
        
        // Set up price resolver
        PriceResolver resolver = new PriceResolver();
        resolver.setPriceTarget(marketId, _priceFeed, _targetPrice, _above);
        markets[marketId].resolver = resolver;
        
        // Initialize liquidity pools
        _initializePools(marketId, msg.value);
        
        return marketId;
    }
    
    function createManualMarket(
        string memory _title,
        string[] memory _options,
        uint256 _resolutionTime
    ) external payable returns (uint256) {
        require(_options.length >= 2, "Minimum 2 options required");
        require(_options.length <= 6, "Maximum 6 options allowed");
        require(_resolutionTime > block.timestamp, "Invalid resolution time");
        require(msg.value >= MIN_LIQUIDITY * _options.length, "Insufficient initial liquidity");
        
        uint256 marketId = _createMarket(_title, _options, _resolutionTime, MarketType.MANUAL);
        _initializePools(marketId, msg.value);
        
        return marketId;
    }
    
    function _createMarket(
        string memory _title,
        string[] memory _options,
        uint256 _resolutionTime,
        MarketType _marketType
    ) internal returns (uint256) {
        uint256 marketId = marketCount++;
        Market storage market = markets[marketId];
        
        market.title = _title;
        market.createdAt = block.timestamp;
        market.resolutionTime = _resolutionTime;
        market.options = _options;
        market.marketType = _marketType;
        market.creator = msg.sender;
        
        // Create tokens for each option
        for (uint256 i = 0; i < _options.length; i++) {
            string memory tokenName = string(abi.encodePacked("PM_", _options[i]));
            string memory tokenSymbol = string(abi.encodePacked("PM", uint256ToStr(i)));
            
            MarketToken token = new MarketToken(
                tokenName,
                tokenSymbol,
                address(this)
            );
            
            market.tokens.push(address(token));
        }
        
        emit MarketCreated(marketId, _title, _options, _marketType, address(market.resolver));
        return marketId;
    }
    
    function _initializePools(uint256 marketId, uint256 initialLiquidity) internal {
        Market storage market = markets[marketId];
        uint256 initialLiquidityPerOption = initialLiquidity / market.options.length;
        
        for (uint256 i = 0; i < market.options.length; i++) {
            market.pools[i].ethBalance = initialLiquidityPerOption;
            market.pools[i].tokenBalance = initialLiquidityPerOption; // 1:1 initial ratio
            MarketToken(market.tokens[i]).mint(address(this), initialLiquidityPerOption);
        }
        
        market.totalLiquidity = initialLiquidity;
    }
    
    function resolveMarket(uint256 _marketId, uint256 inputWinningOptionIndex) external {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Already resolved");
        require(block.timestamp >= market.resolutionTime, "Too early");
        
        uint256 winningOptionIndex;
        
        if (market.marketType == MarketType.PRICE_ORACLE) {
            require(address(market.resolver) != address(0), "No resolver set");
            winningOptionIndex = market.resolver.resolveMarket(_marketId);
        } else {
            require(msg.sender == market.creator, "Only market creator can resolve manual markets");
            winningOptionIndex = inputWinningOptionIndex;
            require(winningOptionIndex < market.options.length, "Invalid option");
        }
        
        market.resolved = true;
        
        // Set resolution status for all tokens
        for (uint256 i = 0; i < market.tokens.length; i++) {
            MarketToken token = MarketToken(market.tokens[i]);
            token.setResolved(i == winningOptionIndex);
        }
        
        emit MarketResolved(_marketId, winningOptionIndex);
    }
    
    function buyTokens(
        uint256 _marketId,
        uint256 _optionIndex,
        uint256 _minTokensOut
    ) external payable nonReentrant returns (uint256 tokenAmount) {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market resolved");
        require(block.timestamp < market.resolutionTime, "Market expired");
        require(_optionIndex < market.options.length, "Invalid option");
        require(msg.value > 0, "Must send ETH");
        
        LiquidityPool storage pool = market.pools[_optionIndex];
        
        // Calculate tokens out using constant product formula
        uint256 ethInWithFee = (msg.value * (10000 - FEE_PERCENTAGE)) / 10000;
        tokenAmount = getTokensOutForExactETH(pool.ethBalance, pool.tokenBalance, ethInWithFee);
        require(tokenAmount >= _minTokensOut, "Slippage limit exceeded");
        
        // Update pool balances
        pool.ethBalance += msg.value;
        pool.tokenBalance -= tokenAmount;
        market.totalLiquidity += msg.value;
        
        // Transfer tokens to buyer
        MarketToken(market.tokens[_optionIndex]).transfer(msg.sender, tokenAmount);
        
        emit TokensPurchased(_marketId, msg.sender, _optionIndex, tokenAmount, msg.value);
    }
    
    function sellTokens(
        uint256 _marketId,
        uint256 _optionIndex,
        uint256 _tokenAmount,
        uint256 _minEthOut
    ) external nonReentrant returns (uint256 ethAmount) {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market resolved");
        require(_optionIndex < market.options.length, "Invalid option");
        
        LiquidityPool storage pool = market.pools[_optionIndex];
        MarketToken token = MarketToken(market.tokens[_optionIndex]);
        
        // Calculate ETH out using constant product formula
        uint256 tokenInWithFee = (_tokenAmount * (10000 - FEE_PERCENTAGE)) / 10000;
        ethAmount = getETHOutForExactTokens(pool.ethBalance, pool.tokenBalance, tokenInWithFee);
        require(ethAmount >= _minEthOut, "Slippage limit exceeded");
        
        // Update pool balances
        pool.ethBalance -= ethAmount;
        pool.tokenBalance += _tokenAmount;
        market.totalLiquidity -= ethAmount;
        
        // Transfer tokens from seller
        token.transferFrom(msg.sender, address(this), _tokenAmount);
        
        // Transfer ETH to seller
        payable(msg.sender).transfer(ethAmount);
        
        emit TokensSold(_marketId, msg.sender, _optionIndex, _tokenAmount, ethAmount);
    }
    
    function getTokensOutForExactETH(
        uint256 ethBalance,
        uint256 tokenBalance,
        uint256 ethIn
    ) public pure returns (uint256) {
        require(ethIn > 0, "ETH amount must be greater than 0");
        require(ethBalance > 0 && tokenBalance > 0, "Empty pool");
        
        uint256 numerator = ethIn * tokenBalance;
        uint256 denominator = ethBalance + ethIn;
        return numerator / denominator;
    }
    
    function getETHOutForExactTokens(
        uint256 ethBalance,
        uint256 tokenBalance,
        uint256 tokenIn
    ) public pure returns (uint256) {
        require(tokenIn > 0, "Token amount must be greater than 0");
        require(ethBalance > 0 && tokenBalance > 0, "Empty pool");
        
        uint256 numerator = tokenIn * ethBalance;
        uint256 denominator = tokenBalance + tokenIn;
        return numerator / denominator;
    }

    function claimWinnings(uint256 _marketId, uint256 _optionIndex) external nonReentrant returns (uint256) {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved yet");
        
        MarketToken token = MarketToken(market.tokens[_optionIndex]);
        require(token.isWinner(), "Option did not win");
        
        uint256 tokenBalance = token.balanceOf(msg.sender);
        require(tokenBalance > 0, "No tokens to claim");
        
        // Calculate winnings based on market's total liquidity and winning token supply
        uint256 totalWinningTokens = token.totalSupply();
        uint256 winningsShare = (market.totalLiquidity * tokenBalance) / totalWinningTokens;
        
        // Burn the tokens
        token.burn(msg.sender, tokenBalance);
        
        // Transfer ETH winnings
        payable(msg.sender).transfer(winningsShare);
        
        return winningsShare;
    }

    // Helper function
    function uint256ToStr(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}