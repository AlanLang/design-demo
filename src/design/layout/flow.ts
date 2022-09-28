import { flatten } from "lodash-es";

import { distanceOfPoint2LineSegment } from "../utils";

import { BaseLayout, LayoutProps, NearestResult, Event } from "./base";

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
    if (info.children?.length === 0) {
      const { position } = info;
      return {
        payload: info.payload,
        parentPayload: info.payload,
        guideLines: [
          {
            x1: position.x,
            y1: position.y,
            x2: position.x + position.width,
            y2: position.y,
          },
          {
            x1: position.x + position.width,
            y1: position.y,
            x2: position.x + position.width,
            y2: position.y + position.height,
          },
          {
            x1: position.x,
            y1: position.y + position.height,
            x2: position.x + position.width,
            y2: position.y + position.height,
          },
          {
            x1: position.x,
            y1: position.y,
            x2: position.x,
            y2: position.y + position.height,
          },
        ],
      };
    }
    const line = this.generateGuideLine(e);
    if (!line) {
      return null;
    }
    if (line.p === "bottom" || line.p === "right") {
      return {
        payload: line.payload,
        parentPayload: info.payload,
        guideLines: [line],
      };
    }
    if (info.children && info.children.length > 0) {
      const index = info.children.findIndex(
        (item) => item.payload === line.payload
      );
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
          return [
            {
              payload: item.payload,
              x1: position.x,
              y1: position.y,
              x2: position.x + position.width,
              y2: position.y,
              p: "top",
            },
            {
              payload: item.payload,
              x1: position.x + position.width,
              y1: position.y,
              x2: position.x + position.width,
              y2: position.y + position.height,
              p: "right",
            },
            {
              payload: item.payload,
              x1: position.x,
              y1: position.y + position.height,
              x2: position.x + position.width,
              y2: position.y + position.height,
              p: "bottom",
            },
            {
              payload: item.payload,
              x1: position.x,
              y1: position.y,
              x2: position.x,
              y2: position.y + position.height,
              p: "left",
            },
          ];
        })
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
      lins.forEach((item) => {
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
