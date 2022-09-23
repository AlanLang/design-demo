import { Widget } from "../widget";

export interface Position {
  x: number;
  y: number;
}

export interface LayoutProps {
  getInfoByPosition: (e: Position) => Widget | undefined;
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

  public abstract getNearest(e: Position): NearestResult<T> | null;
  public abstract getWidget(e: Position): Widget | null;
}

export type { Widget };
