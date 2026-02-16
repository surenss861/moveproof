/** Compute SHA-256 hash of ArrayBuffer, return hex string */
export async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Build canonical manifest and compute pack hash (async) */
export async function computePackHash(
  photos: Array<{ evidenceId: string; sha256: string }>
): Promise<string> {
  const manifest = {
    version: 1,
    items: photos.map((p) => ({ id: p.evidenceId, sha256: p.sha256 })),
  };
  const canonical = JSON.stringify(manifest);
  const buf = new TextEncoder().encode(canonical);
  return sha256Hex(buf.buffer);
}
