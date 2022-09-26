export interface Widget {
  payload: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  layout?: "string";
  resizable?: "horizontal" | "vertical" | "both" | "none";
  draggable?: boolean;
  selectable?: boolean;
  children?: Widget[];
}
