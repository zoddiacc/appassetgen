/**
 * Build a .ico file from pre-rendered PNG blobs.
 *
 * Modern ICO files embed PNG data directly (supported since Windows Vista and
 * by every browser), so no BMP re-encoding is needed. Layout:
 *   ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes per image) + image data.
 */
export async function buildIco(
  images: { size: number; blob: Blob }[]
): Promise<Blob> {
  const entries = await Promise.all(
    images
      .slice()
      .sort((a, b) => a.size - b.size)
      .map(async (image) => ({
        size: image.size,
        data: new Uint8Array(await image.blob.arrayBuffer()),
      }))
  );

  const count = entries.length;
  const headerSize = 6 + 16 * count;
  const totalSize = headerSize + entries.reduce((sum, e) => sum + e.data.length, 0);

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // ICONDIR: reserved (0), type (1 = icon), image count
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, count, true);

  let dataOffset = headerSize;
  entries.forEach((entry, i) => {
    const o = 6 + 16 * i;
    // Width/height bytes: 0 means 256
    bytes[o] = entry.size >= 256 ? 0 : entry.size;
    bytes[o + 1] = entry.size >= 256 ? 0 : entry.size;
    bytes[o + 2] = 0; // color palette
    bytes[o + 3] = 0; // reserved
    view.setUint16(o + 4, 1, true); // color planes
    view.setUint16(o + 6, 32, true); // bits per pixel
    view.setUint32(o + 8, entry.data.length, true);
    view.setUint32(o + 12, dataOffset, true);

    bytes.set(entry.data, dataOffset);
    dataOffset += entry.data.length;
  });

  return new Blob([buffer], { type: "image/x-icon" });
}
