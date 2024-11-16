// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {BetokenMarkets} from "../../src/BetokenMarkets.sol";

contract DeployBetokenMarketsScript is Script {
    function run() public {
        vm.startBroadcast();
        BetokenMarkets bm = new BetokenMarkets();
        console.log("Betoken markets deployed at: %s", address(bm));
        vm.stopBroadcast();
    }
}
