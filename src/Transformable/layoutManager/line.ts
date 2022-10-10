interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * 获取 矩形 的四条边的数据信息
 */
export function getRectLines(rect: {
  width: number;
  height: number;
  x: number;
  y: number;
}): [Line, Line, Line, Line] {
  return [
    {
      x1: rect.x,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y,
    },
    {
      x1: rect.x + rect.width,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
    },
    {
      x1: rect.x,
      y1: rect.y + rect.height,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
    },
    {
      x1: rect.x,
      y1: rect.y,
      x2: rect.x,
      y2: rect.y + rect.height,
    },
  ];
}

/**
 * 合并带有包含关系的线条
 */
export function merge<T extends Line>(lines: T[]) {
  const result: T[] = [];
  sortByLength(lines).forEach((line) => {
    const target = result.find((item) => {
      if (isVertical(item) && isVertical(line) && almostEqual(item.x1, line.x1)) {
        return distance(item) > distance(line);
      }
      if (isHorizontal(item) && isHorizontal(line) && almostEqual(item.y1, line.y1)) {
        return distance(item) > distance(line);
      }
      return false;
    });
    !target && result.push(line);
  });
  return result;
}

// 根据线条长度排序, 从长到短
export function sortByLength<T extends Line>(lines: T[]) {
  return lines.sort((a, b) => {
    return distance(b) - distance(a);
  });
}

function distance({ x1, x2, y1, y2 }: Line) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function isVertical(line: Line) {
  return line.x1 === line.x2;
}

function isHorizontal(line: Line) {
  return line.y1 === line.y2;
}

function almostEqual(a: number, b: number) {
  return Math.abs(a - b) < 3;
}

/**
 * 计算点到线段的最短距离
 * @param point 点信息
 * @param line 线段信息
 * @returns 最短距离
 */
export function distanceOfPoint2LineSegment(
  point: { x: number; y: number },
  line: { x1: number; y1: number; x2: number; y2: number },
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
