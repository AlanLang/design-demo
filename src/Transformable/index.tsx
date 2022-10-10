import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { useDroppable } from '../Draggable';
import { Guideline, GuidelineProps } from '../Guideline';

import { EventManager } from './eventManager';
import { Layout, NearestResult } from './layoutManager';

export interface TransformableAction {
  /**
   * @description  清理选中
   */
  clearSelected: () => void;
}

export interface TransformableProps<T> {
  /**
   * @description 目标画布
   */
  dragContainerRef: React.RefObject<HTMLDivElement>;
  /**
   * @description 布局类
   */
  layout: Layout<T>;
  /**
   * @description 可拖入的标签
   */
  accept?: string | symbol;
  /**
   * @description 拖拽时的光标样式
   */
  cursor?: string;
  /**
   * @description 鼠标悬浮时触发
   */
  onHover?: (payload: T, e: MouseEvent) => void;
  /**
   * @description 鼠标点击时触发
   */
  onClick?: (payload: T, actions: ClickActions, e: MouseEvent) => void;
  /**
   * @description 拖动过程中触发
   */
  onDrag?: (payload: T, nearest: NearestResult<T>, e: MouseEvent) => void;
  /**
   * @description 拖动结束时触发
   */
  onDrop?: (payload: T, nearest: NearestResult<T>, e: MouseEvent) => void;
  /**
   * @description 拖入结束时触发
   */
  onDropAdd?: (
    payload: unknown,
    nearest: NearestResult<T>,
    position: {
      x: number;
      y: number;
    },
  ) => void;
}

export interface ClickActions {
  renderToolbar: (node: ReactNode) => void;
}

const TransformableContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  user-select: none;
`;

function TransformableView<T>(props: TransformableProps<T>, ref: Ref<TransformableAction>) {
  const { dragContainerRef, layout, accept } = props;
  const [lines, setLines] = useState<GuidelineProps['lines']>([]);
  const [hoverRect, setHoverRect] = useState<GuidelineProps['hoverRect'] | null>(null);
  const [selectRect, setSelectRect] = useState<GuidelineProps['selectRect']>([]);
  const mouseOver = useRef<MouseEvent | null>(null);
  const [toolbar, setToolbar] = useState<ReactNode>(null);

  useImperativeHandle(ref, () => ({
    clearSelected: () => {
      setSelectRect([]);
    },
  }));

  useEffect(() => {
    const events = dragContainerRef.current
      ? new EventManager(dragContainerRef.current, { cursor: props.cursor })
      : null;

    events?.on('hover', (e) => {
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

    events?.on('click', (e) => {
      const widget = layout.getWidget(e);
      const selectable = widget?.selectable ?? true;
      if (widget && selectable) {
        setSelectRect([widget.position]);
        props.onClick?.(widget.payload, { renderToolbar: setToolbar }, e);
      } else {
        setSelectRect([]);
      }
    });

    events?.on('drag', (e, start) => {
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

    events?.on('drop', (e, start) => {
      const nearest = layout.getNearest(e);
      const widget = layout.getWidget(start);
      setLines([]);
      setHoverRect(null);
      setSelectRect([]);
      if (nearest && widget) {
        props.onDrop?.(widget.payload, nearest, e);
      }
    });

    events?.on('dragover', (e) => {
      mouseOver.current = e;
    });

    return () => {
      events?.destroy();
    };
  }, [dragContainerRef, layout, props]);

  const connectDropTarget = useDroppable(
    accept || Symbol('transformable'),
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
          const result = layout.getNearest(mouseOver.current);
          if (result) {
            props.onDropAdd?.(item, result, mouseOver.current);
          }
        }
      },
    },
    [props.onDrag, props.onDropAdd],
  );

  connectDropTarget(dragContainerRef.current);

  return (
    <TransformableContainer>
      <Guideline lines={lines} hoverRect={hoverRect} selectRect={selectRect} toolbar={toolbar} />
    </TransformableContainer>
  );
}

type ITransformable = <T>(
  props: TransformableProps<T> & {
    ref?: React.MutableRefObject<TransformableAction | null>;
  },
) => JSX.Element;
export const Transformable: ITransformable = forwardRef(TransformableView) as any;
