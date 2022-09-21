import { Widget } from "./widget";

interface Position {
  x: number;
  y: number;
}

export interface LayerProps {
  getInfoByPosition: (e: Position) => Widget | undefined;
}

export class Layout {
  private options: LayerProps;
  public constructor(options: LayerProps) {
    this.options = options;
  }

  public getWidget(e: Position) {
    return this.options.getInfoByPosition(e);
  }
}
