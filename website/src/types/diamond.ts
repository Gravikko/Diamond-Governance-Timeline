export enum FacetCutAction {
  Add = 0,
  Replace = 1,
  Remove = 2,
}

export interface FacetCut {
  facetAddress: string;
  action: FacetCutAction;
  functionSelectors: string[];
}

export interface DiamondCutEvent {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  caller: string;
  facetCuts: FacetCut[];
  init: string;
  calldata: string;
}

export interface RawEtherscanLog {
  address: string; 
  topics: string[]; 
  data: string;
  transactionHash: string;
  blockNumber: string; 
  timeStamp: string; 
}
