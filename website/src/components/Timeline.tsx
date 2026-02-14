"use client";

import { DiamondCutEvent, FacetCutAction } from "@/types/diamond";

const ACTION_STYLES = {
  [FacetCutAction.Add]: { label: "ADD", color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  [FacetCutAction.Replace]: { label: "REPLACE", color: "text-amber-400", bg: "bg-amber-400/10", dot: "bg-amber-400" },
  [FacetCutAction.Remove]: { label: "REMOVE", color: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
};

function truncate(hash: string) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export default function Timeline({
  events,
  selectorNames,
}: {
  events: DiamondCutEvent[];
  selectorNames: Map<string, string>;
}) {
  if (events.length === 0) {
    return (
      <p className="text-zinc-500 text-center mt-12">
        No DiamondCut events found for this address.
      </p>
    );
  }

  return (
    <div className="relative w-full max-w-2xl">
<div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-700" />

      <div className="flex flex-col gap-6">
        {events.map((event, i) => (
          <div key={event.txHash + i} className="relative pl-10">
<div className="absolute left-[11px] top-3 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-zinc-900" />

            <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-5">
<div className="flex items-center justify-between mb-3">
                <time className="text-sm text-zinc-400">
                  {new Date(event.timestamp * 1000).toLocaleString()}
                </time>
                <a
                  href={`https://etherscan.io/tx/${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300"
                >
                  {truncate(event.txHash)}
                </a>
              </div>

<p className="text-xs text-zinc-500 mb-4">
                Block #{event.blockNumber.toLocaleString()}
              </p>

<div className="flex flex-col gap-3">
                {event.facetCuts.map((cut, j) => {
                  const style = ACTION_STYLES[cut.action];
                  return (
                    <div key={j} className={`rounded-lg p-3 ${style.bg}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        <span className={`text-xs font-bold ${style.color}`}>
                          {style.label}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {truncate(cut.facetAddress)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cut.functionSelectors.map((sel) => (
                          <span
                            key={sel}
                            className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900/60 text-zinc-300"
                            title={sel}
                          >
                            {selectorNames.get(sel) ?? sel}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
