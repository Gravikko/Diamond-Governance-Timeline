const cache = new Map<string, string>();

async function resolveFromOpenChain(
  selector: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.openchain.xyz/signature-database/v1/lookup?function=${selector}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.result?.function?.[selector];
    if (results && results.length > 0) return results[0].name;
  } catch {}
  return null;
}

async function resolveFrom4byte(
  selector: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.4byte.directory/api/v1/signatures/?hex_signature=${selector}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0)
      return data.results[0].text_signature;
  } catch {}
  return null;
}

export async function resolveSelector(
  selector: string
): Promise<string> {
  const cached = cache.get(selector);
  if (cached) return cached;

  let name = await resolveFromOpenChain(selector);
  if (!name) name = await resolveFrom4byte(selector);

  const result = name ?? selector;
  cache.set(selector, result);
  return result;
}

export async function resolveSelectors(
  selectors: string[]
): Promise<Map<string, string>> {
  const unique = [...new Set(selectors)];
  const result = new Map<string, string>();
  const BATCH_SIZE = 10;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const resolved = await Promise.all(batch.map(resolveSelector));
    batch.forEach((sel, idx) => result.set(sel, resolved[idx]));
  }

  return result;
}
