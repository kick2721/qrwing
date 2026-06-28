import type { QRFormData } from "@/components/QRForm";

export function buildQrOptions(data: QRFormData) {
  const size = data.config.size || 256;
  const fg = data.config.fgColor || "#000000";
  const bg = data.config.bgColor || "#ffffff";
  const dotsType = data.config.dotsType || "square";
  const cornersSquareType = data.config.cornersSquareType || "square";
  const cornersDotType = data.config.cornersDotType || "square";
  const gradientType = data.config.gradientType;
  const gradientColor1 = data.config.gradientColor1;
  const gradientColor2 = data.config.gradientColor2;

  const dotsOptions: any = { type: dotsType, color: fg };
  if (gradientType && gradientColor1 && gradientColor2) {
    dotsOptions.color = undefined;
    dotsOptions.gradient = {
      type: gradientType,
      rotation: 0,
      colorStops: [
        { offset: 0, color: gradientColor1 },
        { offset: 1, color: gradientColor2 },
      ],
    };
  }

  return {
    width: size,
    height: size,
    data: data.content,
    image: data.config.logo || undefined,
    dotsOptions,
    cornersSquareOptions: { type: cornersSquareType, color: fg },
    cornersDotOptions: { type: cornersDotType, color: fg },
    backgroundOptions: { color: bg },
    imageOptions: {
      imageSize: 0.25,
      hideBackgroundDots: true,
      crossOrigin: "anonymous",
    },
    qrOptions: { errorCorrectionLevel: "H" as const },
  };
}
