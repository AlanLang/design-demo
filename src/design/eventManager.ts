import EventEmitter from "events";

export type $Values<T extends object> = T[keyof T];

const EVENT_KEYS = {
  CLICK: "click",
  DRAG: "drag",
  DROP: "drop",
  HOVER: "hover",
  DRAGOVER: "dragover",
} as const;

export class EventManager {
  private container: HTMLDivElement;
  private events: EventEmitter;

  private mouseDownPosition: MouseEvent | null = null;

  public constructor(container: HTMLDivElement) {
    this.container = container;
    this.events = new EventEmitter();
    this.addEventListener();
  }

  public addEventListener() {
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("mousedown", this.onMouseDown);
    this.container.addEventListener("mouseup", this.onMouseUp);
    this.container.addEventListener("mouseleave", this.onMouseOut);
    this.container.addEventListener("dragover", this.onDragOver);
  }

  public on(
    event: $Values<typeof EVENT_KEYS>,
    listener: (e: MouseEvent, start: MouseEvent) => void
  ) {
    this.events.on(event, listener);
  }

  public destroy() {
    this.container.removeEventListener("mousemove", this.onMouseMove);
    this.container.removeEventListener("mousedown", this.onMouseDown);
    this.container.removeEventListener("mouseup", this.onMouseUp);
    this.container.removeEventListener("mouseleave", this.onMouseOut);
    this.container.removeEventListener("dragover", this.onDragOver);
    this.events.removeAllListeners();
  }

  private onMouseDown = (e: MouseEvent) => {
    this.mouseDownPosition = e;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (e.buttons > 0 && this.mouseDownPosition) {
      this.events.emit(EVENT_KEYS.DRAG, e, this.mouseDownPosition);
    } else {
      this.events.emit(EVENT_KEYS.HOVER, e);
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    if (
      this.mouseDownPosition &&
      Math.abs(this.mouseDownPosition.x - e.x) < 5 &&
      Math.abs(this.mouseDownPosition.y - e.y) < 5
    ) {
      this.events.emit(EVENT_KEYS.CLICK, e);
    } else {
      this.events.emit(EVENT_KEYS.DROP, e, this.mouseDownPosition);
    }
    this.mouseDownPosition = null;
  };

  private onMouseOut = (e: MouseEvent) => {
    this.onMouseMove(e);
    // this.mouseDownPosition = null;
  };

  private onDragOver = (e: DragEvent) => {
    this.events.emit(EVENT_KEYS.DRAGOVER, e);
  };
}
