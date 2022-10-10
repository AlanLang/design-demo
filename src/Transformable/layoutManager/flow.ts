import { flatten } from 'lodash-es';

import { BaseLayout, LayoutProps, NearestResult, Event } from './base';
import { getRectLines, merge, distanceOfPoint2LineSegment } from './line';

const POSITIONS = ['top', 'right', 'bottom', 'left'] as const;

export class FlowLayout<T> extends BaseLayout<T> {
  public constructor(options: LayoutProps) {
    super(options);
  }

  /**
   * 获取即将拖入的信息
   */
  public getNearest(e: Event): NearestResult<T> | null {
    const info = this.options.getInfoByPosition(e);
    if (!info) {
      return null;
    }
    // 如果是空容器
    if (info.children?.length === 0) {
      const { position } = info;
      return {
        payload: info.payload,
        parentPayload: info.payload,
        guideLines: getRectLines(position),
      };
    }
    const line = this.generateGuideLine(e);
    if (!line) {
      return null;
    }
    if (line.p === 'bottom' || line.p === 'right') {
      return {
        payload: line.payload,
        parentPayload: info.payload,
        guideLines: [line],
      };
    }
    if (info.children && info.children.length > 0) {
      const index = info.children.findIndex((item) => item.payload === line.payload);
      if (index > 0) {
        return {
          payload: info.children[index - 1].payload,
          parentPayload: info.payload,
          guideLines: [line],
        };
      }
      return {
        payload: null,
        parentPayload: info.payload,
        guideLines: [line],
      };
    }
    return {
      payload: null,
      parentPayload: info.payload,
      guideLines: [line],
    };
  }

  public generateGuideLine(e: Event) {
    const info = this.options.getInfoByPosition(e);
    if (!info) {
      return null;
    }
    if (info.children && info.children.length > 0) {
      const lins = flatten(
        info.children.map((item) => {
          const { position } = item;
          const lines = getRectLines(position);
          return lines.map((line, index) => {
            return {
              ...line,
              payload: item.payload,
              p: POSITIONS[index],
            };
          });
        }),
      );
      const target: {
        distance: number;
        line: {
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          payload: any;
          p: string;
        } | null;
      } = {
        distance: Number.MAX_VALUE,
        line: null,
      };
      merge(lins).forEach((item) => {
        const distance = distanceOfPoint2LineSegment(e, item);
        if (distance < target.distance) {
          target.distance = distance;
          target.line = item;
        }
      });
      return target.line;
    }
    return null;
  }
}
