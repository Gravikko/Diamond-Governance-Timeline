# Diamond Governance Timeline

> "Time Machine" for EIP-2535 Diamond Proxy smart contracts.
> Visualizes upgrade history and links on-chain changes to governance decisions.

## Project Overview

Frontend-first tool: user inputs a Diamond contract address -> gets an interactive upgrade timeline showing every `DiamondCut` event, what changed, who triggered it, and which governance proposal authorized it.

## Core Problem

- Etherscan shows only current state of upgradeable contracts
- `DiamondCut` events are disconnected from governance proposals (Snapshot, Tally)
- Hard to audit which facets were recently swapped

## Key Features (MVP)

1. **Visual History** — chronological feed of all `DiamondCut` events since deployment
2. **Change Diffing** — shows functions/facets Added, Replaced, or Removed per upgrade
3. **Governance Attribution** — correlates upgrade timestamps with DAO proposals (Snapshot, Tally)
4. **Actor Identification** — shows who triggered the upgrade (Multisig, Timelock, EOA)

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **Blockchain:** viem (preferred) / ethers.js
- **Data Sources:**
  - Etherscan API — `DiamondCut` event logs
  - 4byte.directory / OpenChain — resolve function selectors to names
  - Snapshot GraphQL API — governance proposals
- **Standard:** EIP-2535 (Diamond Proxy)

## Architecture (Serverless / Client-Side)

```
User Input (address)
  -> Query RPC/Etherscan for DiamondCut events
  -> Decode event logs, extract 4-byte function selectors
  -> Resolve selectors via 4byte.directory / OpenChain
  -> Query Snapshot API for proposals in matching time windows
  -> Render interactive timeline UI
```

## EIP-2535 Essentials

- **Diamond** — the proxy contract that delegates calls
- **Facet** — implementation contract containing functions
- **DiamondCut** — the upgrade operation; emits `DiamondCut(FacetCut[] _diamondCut, address _init, bytes _calldata)`
- **FacetCut struct:** `{ facetAddress, action (Add/Replace/Remove), functionSelectors[] }`
- **Function selector** — first 4 bytes of keccak256 of function signature

## Key APIs

- **Etherscan:** `module=logs&action=getLogs&topic0=<DiamondCut_topic>`
- **4byte.directory:** `https://www.4byte.directory/api/v1/signatures/?hex_signature=0x...`
- **Snapshot GraphQL:** `https://hub.snapshot.org/graphql` — query proposals by space + timeframe
- **OpenChain:** `https://api.openchain.xyz/signature-database/v1/lookup?function=0x...`

## Project Conventions

- Language: TypeScript (strict mode)
- Formatting: Prettier defaults
- Components: functional React components with hooks
- State management: React state / context (no Redux unless needed)
- Naming: camelCase for variables/functions, PascalCase for components/types
- Commits: conventional commits (feat:, fix:, chore:, etc.)
