export interface Widget {
  /**
   * @description 组件携带的数据信息
   */
  payload: any;
  /**
   * @description 组件相对于屏幕的绝对位置
   */
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /**
   * @description 是否是当前鼠标下需要操作的组件
   */
  isTarget: boolean;
  /**
   * @description 组件的布局方式
   */
  layout?: string;
  /**
   * @description 是否可以调整大小
   */
  resizable?: 'horizontal' | 'vertical' | 'both' | 'none';
  /**
   * @description 是否可以被拖拽
   */
  draggable?: boolean;
  /**
   * @description 是否可以被选中
   */
  selectable?: boolean;
  /**
   * @description 子组件列表
   */
  children?: Widget[];
}

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
    if (info.isTarget) {
      return info;
    }
    if (info.children && info.children.length > 0) {
      return info.children.find((item) => {
        return item.isTarget === true;
      });
    }
    return info;
  }
}
