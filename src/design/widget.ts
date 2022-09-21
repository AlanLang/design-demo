export interface Widget {
  id: string;
  resizable?: "horizontal" | "vertical" | "both" | "none";
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  children?: Widget[];
}
