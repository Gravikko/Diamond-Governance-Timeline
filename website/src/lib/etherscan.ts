import { RawEtherscanLog } from "@/types/diamond";

const DIAMOND_CUT_TOPIC =
  "0x8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb673";

const ETHERSCAN_API = "https://api.etherscan.io/api";

interface EtherscanResponse {
  status: string;
  message: string;
  result: RawEtherscanLog[] | string;
}

export async function fetchDiamondCutLogs(
  contractAddress: string,
): Promise<RawEtherscanLog[]> {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_ETHERSCAN_API_KEY is not set");
  }

  const params = new URLSearchParams({
    module: "logs",
    action: "getLogs",
    address: contractAddress,
    topic0: DIAMOND_CUT_TOPIC,
    fromBlock: "0",
    toBlock: "latest",
    apikey: apiKey,
  });
  const response = await fetch(`${ETHERSCAN_API}?${params}`);

  if (!response.ok) {
    throw new Error(`Etherscan HTTP error: ${response.status}`);
  }

  const data: EtherscanResponse = await response.json();

  if (data.status === "0" && data.message !== "No records found") {
    throw new Error(`Etherscan API error: ${data.result}`);
  }
  
  if (!Array.isArray(data.result)) {
    return [];
  }

  return data.result;
}
