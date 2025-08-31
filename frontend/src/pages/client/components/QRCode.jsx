import { QRCodeCanvas } from "qrcode.react";

export default function MyQrCode({ link }) {
  return (
    <QRCodeCanvas
      value={link}      // لینکی که می‌خوای QR بشه
      size={150}        // سایز
      bgColor="#ffffff00" // رنگ پس‌زمینه
      fgColor="#5853ED" // رنگ QR
      level="H"         // سطح اصلاح خطا (L, M, Q, H)
      includeMargin={false} // مارجین بیرونی

    />
  );
}
