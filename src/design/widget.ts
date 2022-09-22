export interface Widget {
  payload: any;
  resizable?: "horizontal" | "vertical" | "both" | "none";
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  children?: Widget[];
}
