"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
  loading,
}: {
  onSearch: (address: string) => void;
  loading: boolean;
}) {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) onSearch(address.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="0x... Diamond contract address"
        className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono text-sm"
      />
      <button
        type="submit"
        disabled={loading || !address.trim()}
        className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Loading..." : "Scan"}
      </button>
    </form>
  );
}
