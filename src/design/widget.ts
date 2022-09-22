export interface Widget {
  payload: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  children?: Widget[];
}
