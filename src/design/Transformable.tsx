import { useEffect, useRef, useState } from "react";

import { useDroppable } from "./Draggable";

import { EventManager } from "./eventManager";
import { Guideline, GuidelineProps } from "./Guideline";
import { Layout, NearestResult } from "./layout";

export interface TransformableProps<T> {
  dragContainerRef: React.RefObject<HTMLDivElement>;
  layout: Layout<T>;
  accept?: string | symbol;
  onHover?: (payload: T, e: MouseEvent) => void;
  onClick?: (payload: T, e: MouseEvent) => void;
  onDrag?: (payload: T, nearest: NearestResult<T>, e: MouseEvent) => void;
  onDrop?: (payload: T, nearest: NearestResult<T>, e: MouseEvent) => void;
  onDropAdd?: (
    payload: unknown,
    nearest: NearestResult<T>,
    position: {
      x: number;
      y: number;
    }
  ) => void;
}

export function Transformable<T>(props: TransformableProps<T>) {
  const { dragContainerRef, layout, accept } = props;
  const [lines, setLines] = useState<GuidelineProps["lines"]>([]);
  const [hoverRect, setHoverRect] = useState<
    GuidelineProps["hoverRect"] | null
  >(null);
  const [selectRect, setSelectRect] = useState<GuidelineProps["selectRect"]>(
    []
  );
  const mouseOver = useRef<MouseEvent | null>(null);

  useEffect(() => {
    const events = dragContainerRef.current
      ? new EventManager(dragContainerRef.current)
      : null;

    events?.on("hover", (e) => {
      setLines([]);
      const widget = layout.getWidget(e);
      const selectable = widget?.selectable ?? true;
      if (widget && selectable) {
        setHoverRect(widget.position);
        props.onHover?.(widget.payload, e);
      } else {
        setHoverRect(null);
      }
    });

    events?.on("click", (e) => {
      const widget = layout.getWidget(e);
      const selectable = widget?.selectable ?? true;
      if (widget && selectable) {
        setSelectRect([widget.position]);
        props.onClick?.(widget.payload, e);
      } else {
        setSelectRect([]);
      }
    });

    events?.on("drag", (e, start) => {
      setHoverRect(null);
      setSelectRect([]);
      const result = layout.getNearest(e);
      const widget = layout.getWidget(start);
      const selectable = widget?.draggable ?? true;
      if (result && widget && selectable) {
        setLines(result.guideLines);
        props.onDrag?.(widget.payload, result, e);
      }
    });

    events?.on("drop", (e, start) => {
      const nearest = layout.getNearest(e);
      const widget = layout.getWidget(start);
      setLines([]);
      setHoverRect(null);
      setSelectRect([]);
      if (nearest && widget) {
        props.onDrop?.(widget.payload, nearest, e);
      }
    });

    events?.on("dragover", (e) => {
      mouseOver.current = e;
    });

    return () => {
      events?.destroy();
    };
  }, [dragContainerRef, layout, props]);

  const connectDropTarget = useDroppable(
    accept || Symbol("transformable"),
    {
      onDrag(item) {
        setHoverRect(null);
        setSelectRect([]);
        if (mouseOver.current) {
          const result = layout.getNearest(mouseOver.current);
          if (result) {
            setLines(result.guideLines);
            props.onDrag?.(item, result, mouseOver.current);
          }
        }
      },
      onDrop(item: T) {
        setLines([]);
        setHoverRect(null);
        setSelectRect([]);
        if (mouseOver.current) {
          console.log(mouseOver.current);
          const result = layout.getNearest(mouseOver.current);
          if (result) {
            props.onDropAdd?.(item, result, mouseOver.current);
          }
        }
      },
    },
    [props.onDrag, props.onDropAdd]
  );

  connectDropTarget(dragContainerRef.current);

  return (
    <div className="fb-transformable">
      <Guideline lines={lines} hoverRect={hoverRect} selectRect={selectRect} />
    </div>
  );
}
