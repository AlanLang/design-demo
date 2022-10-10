import classNames from 'classnames';
import React, { ReactNode, useMemo, useRef } from 'react';
import './index.less';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
export interface GuidelineProps {
  lines: Line[];
  hoverRect?: Rect | null;
  selectRect?: Rect[];
  toolbar?: ReactNode;
}

function usePrivateRects(rects?: Rect[] | null, container?: HTMLElement | null) {
  return useMemo(() => {
    if (!container || !rects) {
      return [];
    }
    const { x, y } = container.getBoundingClientRect();
    return rects.map((rect) => {
      return {
        width: rect.width,
        height: rect.height,
        x: rect.x - x,
        y: rect.y - y,
      };
    });
  }, [container, rects]);
}

function usePrivateRect(rect?: Rect | null, container?: HTMLElement | null) {
  const result = useMemo(() => {
    if (!container || !rect) {
      return null;
    }
    const { x, y } = container.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      x: rect.x - x,
      y: rect.y - y,
    };
  }, [container, rect]);
  return result;
}

function usePrivateLines(lines?: Line[] | null, container?: HTMLElement | null) {
  return useMemo(() => {
    if (!container || !lines) {
      return [];
    }
    const { x, y } = container.getBoundingClientRect();
    return lines?.map((line) => {
      return {
        x1: line.x1 - x,
        y1: line.y1 - y,
        x2: line.x2 - x,
        y2: line.y2 - y,
      };
    });
  }, [container, lines]);
}

export function Guideline(props: GuidelineProps) {
  const { toolbar } = props;
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const selectRect = usePrivateRects(props.selectRect, ref.current);
  const hoverRect = usePrivateRect(props.hoverRect, ref.current);
  const lines = usePrivateLines(props.lines, ref.current);

  const toolbarOutView = useMemo(() => {
    const height = toolbarRef.current?.getBoundingClientRect().height;
    if (selectRect.length !== 1 || !height || !toolbar) {
      return false;
    }
    const selectRectTop = selectRect[0].y;
    return selectRectTop < height;
  }, [toolbarRef, selectRect, toolbar]);

  return (
    <div className="fb-guideline-box" ref={ref}>
      {lines.map((line, index) => (
        <div
          style={{
            top: line.y1,
            left: line.x1,
            width: Math.max(Math.abs(line.x2 - line.x1), 2),
            height: Math.max(Math.abs(line.y2 - line.y1), 2),
          }}
          key={index}
          className="fb-guideline-line"
        ></div>
      ))}
      {hoverRect ? (
        <div
          className="fb-guideline-hover"
          style={{
            top: hoverRect.y,
            left: hoverRect.x,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        ></div>
      ) : null}
      {selectRect.map((rect, index) => (
        <div
          key={index}
          className="fb-guideline-selected"
          style={{
            top: rect.y,
            left: rect.x,
            width: rect.width,
            height: rect.height,
          }}
        >
          <div
            className={classNames('fb-guideline-toolbar', { 'toolbar-top-left': !toolbarOutView })}
            ref={toolbarRef}
          >
            {toolbar}
          </div>
        </div>
      ))}
    </div>
  );
}
