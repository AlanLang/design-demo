import { merge, sortByLength } from '../line';

describe('线条处理', () => {
  test('线条数据排序', () => {
    const result = sortByLength([
      { x1: 0, y1: 0, x2: 0, y2: 10 },
      { x1: 0, y1: 0, x2: 20, y2: 0 },
    ]);
    expect(result).toEqual([
      { x1: 0, y1: 0, x2: 20, y2: 0 },
      { x1: 0, y1: 0, x2: 0, y2: 10 },
    ]);
  });

  test('线条数据合并', () => {
    const result = merge([
      { x1: 0, y1: 0, x2: 0, y2: 10 },
      { x1: 0, y1: 0, x2: 0, y2: 5 },
      { x1: 10, y1: 0, x2: 10, y2: 5 },
    ]);
    expect(result).toEqual([
      { x1: 0, y1: 0, x2: 0, y2: 10 },
      { x1: 10, y1: 0, x2: 10, y2: 5 },
    ]);
  });
});
