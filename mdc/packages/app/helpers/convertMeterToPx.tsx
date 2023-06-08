export const convertMeterToPixelToUpPlayer = (
  height: number,
  width: number,
) => {
  const bottom = ((height - 11.88) * 63.125 + 124).toString();
  const right = (width * 78.943 + 15).toString();
  return { bottom, right };
};

export const convertMeterToPixelToDownPlayer = (
  height: number,
  width: number,
) => {
  const top = (height * 63.125 - 227.9254375).toString();
  const left = (width * 78.943 + 15).toString();
  return { top, left };
};

export const convertMeterToPixelReturnBounces = (
  height: number,
  width: number,
) => {
  const bottom = (height - 11.88) * 43.22;
  const right = width * 50.775 + 109;
  return { bottom, right };
};

export const calculateMetersToPixelHitPosition = (
  bottom: number,
  right: number,
) => {
  const bottomPixel = -bottom * 60 + 180;
  const rightPixel = 870 - right * 60;
  return { bottomPixel, rightPixel };
};

export const calculateMetersToPixelBounces = (
  bottom: number,
  right: number,
) => {
  return { bottom: (bottom - 11.88) * 42.08, right: right * 51.04 + 155 };
};

export const calculateMetersToPixelHitPoint = (
  bottom: number,
  right: number,
) => {
  return { bottom: bottom * 42.08 + 200, right: right * 51.04 + 155 };
};
