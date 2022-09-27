import {
  DragPreviewImage,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";

export interface DraggableProps {
  children: React.ReactNode;
  imageSource?: string;
  payload?: unknown;
  dropTarget: string | symbol;
  canDrag?: () => boolean;
}

export function Draggable(props: DraggableProps) {
  const { children, imageSource, payload, dropTarget: type, canDrag } = props;
  const [, drag, preview] = useDrag(() => ({
    type,
    item: payload,
    canDrag,
  }));

  return (
    <div className="fb-draggable" ref={drag}>
      {imageSource ? (
        <DragPreviewImage connect={preview} src={imageSource} />
      ) : null}
      {children}
    </div>
  );
}

export function useDroppable(
  accept: string | symbol,
  actions?: {
    onDrag?: (item: any, monitor: DropTargetMonitor<unknown, unknown>) => void;
    onDrop?: (item: any, monitor: DropTargetMonitor<unknown, unknown>) => void;
  },
  deps: any[] = []
) {
  const [, connectDropTarget] = useDrop(
    () => ({
      accept,
      drop: (item: unknown, monitor) => {
        actions?.onDrop?.(item, monitor);
      },
      hover: (item: unknown, monitor) => {
        actions?.onDrag?.(item, monitor);
      },
    }),
    deps
  );
  return connectDropTarget;
}
