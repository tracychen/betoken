export type MarketFormValues = {
  title: string;
  description: string;
  options: {
    name: string;
  }[];
  closingTimestamp: Date;
  initialLiquidity: number;
  //   image: string;
};
