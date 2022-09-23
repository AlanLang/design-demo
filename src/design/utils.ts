/**
 * 计算点到线段的最短距离
 * @param point 点信息
 * @param line 线段信息
 * @returns 最短距离
 */
export function distanceOfPoint2LineSegment(
  point: { x: number; y: number },
  line: { x1: number; y1: number; x2: number; y2: number }
): number {
  const { x1, y1, x2, y2 } = line;
  const { x, y } = point;
  const cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
  if (cross <= 0) {
    return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
  }
  const d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (cross >= d2) {
    return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
  }
  const r = cross / d2;
  const px = x1 + (x2 - x1) * r;
  const py = y1 + (y2 - y1) * r;
  return Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
}
