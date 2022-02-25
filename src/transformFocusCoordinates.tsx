export function transformFocusCoordinates(
  touchX: number,
  touchY: number,
  width: number,
  height: number,
): [number, number] {
  const transformedX = (touchY / height) * width;
  const transformedY = height - (touchX / width) * height;
  return [transformedX, transformedY];
}
