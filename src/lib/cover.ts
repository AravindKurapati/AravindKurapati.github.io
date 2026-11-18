// Book cover for the Now page, looked up at build time from Open Library (no API key).
// Returns null on any failure so a missing cover never breaks the build.
export async function bookCover(title: string): Promise<string | null> {
  try {
    const q = new URLSearchParams({ title, limit: '1', fields: 'cover_i' });
    const res = await fetch(`https://openlibrary.org/search.json?${q}`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const id = (await res.json()).docs?.[0]?.cover_i;
    if (!id) return null;
    // Many covers 302 to archive.org; hand Astro the final URL so its size probe stays on an allowed host.
    const img = await fetch(`https://covers.openlibrary.org/b/id/${id}-L.jpg`, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    return img.ok ? img.url : null;
  } catch {
    return null;
  }
}
