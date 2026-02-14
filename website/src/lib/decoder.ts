import { decodeAbiParameters } from "viem";
import {
  RawEtherscanLog,
  DiamondCutEvent,
  FacetCut,
  FacetCutAction,
} from "@/types/diamond";

const DIAMOND_CUT_PARAMS = [
  {
    name: "_diamondCut",
    type: "tuple[]",
    components: [
      { name: "facetAddress", type: "address" },
      { name: "action", type: "uint8" },
      { name: "functionSelectors", type: "bytes4[]" },
    ],
  },
  { name: "_init", type: "address" },
  { name: "_calldata", type: "bytes" },
] as const;

export function decodeDiamondCutEvents(
  rawLogs: RawEtherscanLog[]
): DiamondCutEvent[] {
  return rawLogs.map((log) => {
    const [facetCuts, init, calldata] = decodeAbiParameters(
      DIAMOND_CUT_PARAMS,
      log.data as `0x${string}`
    );

    const parsedCuts: FacetCut[] = facetCuts.map((cut) => ({
      facetAddress: cut.facetAddress,
      action: cut.action as FacetCutAction,
      functionSelectors: [...cut.functionSelectors],
    }));

    return {
      txHash: log.transactionHash,
      blockNumber: parseInt(log.blockNumber, 16),
      timestamp: parseInt(log.timeStamp, 10),
      caller: "",
      facetCuts: parsedCuts,
      init: init as string,
      calldata: calldata as string,
    };
  });
}
