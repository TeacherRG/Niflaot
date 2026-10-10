import qrcode from 'qrcode-generator';

/** A QR code as a crisp SVG (prints sharp at any size); `M` error correction — survives a bent or dirty sheet. */
export function QrCode({ value, size, title }: { value: string; size: number; title: string }) {
  const qr = qrcode(0, 'M');
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  const m = 2; // quiet zone, in modules
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + m} ${r + m}h1v1h-1z`;
  return (
    <svg className="qr" width={size} height={size} viewBox={`0 0 ${n + 2 * m} ${n + 2 * m}`} role="img" aria-label={title} shapeRendering="crispEdges">
      <rect width="100%" height="100%" fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  );
}
