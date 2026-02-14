"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Timeline from "@/components/Timeline";
import { fetchDiamondCutLogs } from "@/lib/etherscan";
import { decodeDiamondCutEvents } from "@/lib/decoder";
import { resolveSelectors } from "@/lib/resolver";
import { DiamondCutEvent } from "@/types/diamond";

export default function Home() {
  const [events, setEvents] = useState<DiamondCutEvent[]>([]);
  const [selectorNames, setSelectorNames] = useState<Map<string, string>>(
    new Map()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (address: string) => {
    setLoading(true);
    setError("");
    setEvents([]);
    setSelectorNames(new Map());

    try {
      const rawLogs = await fetchDiamondCutLogs(address);
      const decoded = decodeDiamondCutEvents(rawLogs);

      const allSelectors = decoded.flatMap((e) =>
        e.facetCuts.flatMap((c) => c.functionSelectors)
      );
      const names = await resolveSelectors(allSelectors);

      setEvents(decoded);
      setSelectorNames(names);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="flex flex-col items-center px-4 py-16 gap-8">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Diamond Timeline
          </h1>
          <p className="text-zinc-400 mt-2">
            Visualize EIP-2535 Diamond Proxy upgrade history
          </p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <p className="text-red-400 text-sm max-w-2xl text-center">{error}</p>
        )}

        <Timeline events={events} selectorNames={selectorNames} />
      </div>
    </div>
  );
}
