import { Widget } from "../widget";

export type Event = MouseEvent | DragEvent;

export interface LayoutProps {
  getInfoByPosition: (e: Event) => Widget | undefined;
}

export interface NearestResult<T> {
  payload: T | null;
  parentPayload: T | null;
  guideLines: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }[];
}

export abstract class BaseLayout<T> {
  public constructor(protected options: LayoutProps) {}

  public abstract getNearest(e: Event): NearestResult<T> | null;
  /**
   * 获取当前位置的widget
   */
  public getWidget(e: Event) {
    const info = this.options.getInfoByPosition(e);
    if (!info) {
      return null;
    }
    if (info.children && info.children.length > 0) {
      return (
        info.children.find((item) => {
          const { position } = item;
          return (
            position.x <= e.x &&
            position.y <= e.y &&
            position.x + position.width >= e.x &&
            position.y + position.height >= e.y
          );
        }) ?? info
      );
    }
    return info;
  }
}

export type { Widget };
