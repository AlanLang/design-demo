import EventEmitter from "events";

export type $Values<T extends object> = T[keyof T];

const EVENT_KEYS = {
  CLICK: "click",
  DRAG: "drag",
  DRAGEND: "dragEnd",
};

export class Graph {
  private container: HTMLDivElement;
  private events: EventEmitter;

  private mouseDownPosition: [number, number] | null = null;

  public constructor(container: HTMLDivElement) {
    this.container = container;
    this.events = new EventEmitter();
    this.addEventListener();
  }

  public addEventListener() {
    this.container.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.container.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.container.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.container.addEventListener("mouseout", this.onMouseOut.bind(this));
  }

  public on(
    event: $Values<typeof EVENT_KEYS>,
    listener: (e: MouseEvent) => void
  ) {
    this.events.on(event, listener);
  }

  public destroy() {
    this.container.removeEventListener(
      "mousemove",
      this.onMouseMove.bind(this)
    );
    this.container.removeEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );
    this.container.removeEventListener("mouseup", this.onMouseUp.bind(this));
    this.container.removeEventListener("mouseout", this.onMouseOut.bind(this));
    this.events.removeAllListeners();
  }

  private onMouseDown = (e: MouseEvent) => {
    this.mouseDownPosition = [e.x, e.y];
  };

  private onMouseMove = (e: MouseEvent) => {
    this.events.emit(EVENT_KEYS.DRAG, e);
  };

  private onMouseUp = (e: MouseEvent) => {
    if (
      this.mouseDownPosition &&
      this.mouseDownPosition[0] === e.x &&
      this.mouseDownPosition[1] === e.y
    ) {
      this.events.emit(EVENT_KEYS.CLICK, e);
    } else {
      this.events.emit(EVENT_KEYS.DRAGEND, e);
    }
    this.mouseDownPosition = null;
  };

  private onMouseOut = () => {
    this.mouseDownPosition = null;
  };
}
