import { cloneDeep, flatten } from "lodash-es";
import * as React from "react";

import { Canvas } from "./Canvas";
import { Draggable } from "./design";
import { useDroppable } from "./design/Draggable";
import { Graph } from "./design/graph";
import { Guideline } from "./design/Guideline";
import { Layout, NearestResult } from "./design/layout";
import { getInfoByPosition, Widget } from "./widget";
import "./App.css";

const canvasKey = Symbol("canvas");

function uuid() {
  return `${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getNewWidget(type: string) {
  if (type === "layout") {
    return {
      id: uuid(),
      type,
      children: [
        { id: uuid(), type: "layout" },
        { id: uuid(), type: "layout" },
      ],
    };
  }
  return { type: type, id: uuid() };
}

export function App() {
  const layout = React.useRef<Layout<string> | null>(null);

  const [nearest, setNearest] = React.useState<NearestResult<string> | null>(
    null
  );

  const [hoverRect, setHoverRect] = React.useState<Rect | null>(null);
  const [selectRect, setSelectRect] = React.useState<Rect[]>([]);

  const [widgets, setWidgets] = React.useState<Widget[]>([
    { id: uuid(), type: "title" },
  ]);

  const connectDropTarget = useDroppable(
    canvasKey,
    {
      onDrag(item, monitor) {
        const position = monitor.getClientOffset();
        if (position) {
          const result = layout.current?.getNearest(position);
          if (result) {
            setNearest(result);
            setSelectRect([]);
          }
        }
      },
      onDrop(item: { type: string }) {
        if (nearest) {
          if (nearest.parentPayload === "canvas") {
            if (nearest.payload === null) {
              setWidgets([getNewWidget(item.type), ...widgets]);
            } else {
              const index = widgets.findIndex((w) => w.id === nearest.payload);
              const array = [...widgets];
              array.splice(index + 1, 0, getNewWidget(item.type));
              setWidgets(array);
            }
          } else {
            const array = cloneDeep(widgets);
            const w = flatten(array.map((item) => item.children)).find(
              (w) => w && w.id === nearest.parentPayload
            );
            if (w) {
              if (w.type === "layout" && item.type === "layout") {
                alert("抱歉，布局里面不能再拖入布局");
                return;
              }
              !w.children && (w.children = []);
              const index =
                nearest.payload === null
                  ? -1
                  : w.children.findIndex((w) => w.id === nearest.payload);
              w.children.splice(index + 1, 0, getNewWidget(item.type));
            }
            console.log(array);
            setWidgets(array);
          }
        }
        setNearest(null);
      },
    },
    [widgets, nearest]
  );

  React.useEffect(() => {
    layout.current = new Layout({
      getInfoByPosition: (p) => {
        return getInfoByPosition(p);
      },
    });
  }, [widgets]);

  React.useEffect(() => {
    const graph = new Graph(
      document.getElementById("canvas") as HTMLDivElement
    );
    graph.on("hover", (e) => {
      const widget = layout.current?.getWidget(e);
      if (widget) {
        setHoverRect(widget.position);
      } else {
        setHoverRect(null);
      }
      setNearest(null);
    });
    graph.on("click", (e) => {
      const widget = layout.current?.getWidget(e);
      if (widget) {
        setSelectRect([widget.position]);
      } else {
        setSelectRect([]);
      }
    });
    graph.on("drag", (e) => {
      const result = layout.current?.getNearest(e);
      if (result) {
        setNearest(result);
      }
    });
    graph.on("dragEnd", (e, start) => {
      const nearest = layout.current?.getNearest(e);
      if (nearest) {
        console.log("dragEnd");
        if (nearest.parentPayload === "canvas") {
          const widget = layout.current?.getWidget(start);
          if (widget) {
            const array = [...widgets.filter((w) => w.id !== widget.payload)];
            const index =
              nearest.payload === null
                ? -1
                : array.findIndex((w) => w.id === nearest.payload);
            array.splice(
              index + 1,
              0,
              widgets.find((w) => w.id === widget.payload)!
            );
            setWidgets(array);
            setSelectRect([]);
            setHoverRect(null);
          }
        }
      }
      setNearest(null);
    });
    return () => {
      graph.destroy();
    };
  }, [widgets]);

  return (
    <div className="design">
      <div className="widget-list">
        <Draggable
          type={canvasKey}
          payload={{ type: "text" }}
          imageSource="https://vip2.loli.io/2022/09/21/FjvO9GAZyawgxlr.jpg"
        >
          <div className="widget-item">文字</div>
        </Draggable>
        <Draggable type={canvasKey} payload={{ type: "title" }}>
          <div className="widget-item">标题</div>
        </Draggable>
        <Draggable type={canvasKey} payload={{ type: "layout" }}>
          <div className="widget-item">布局</div>
        </Draggable>
      </div>
      <div ref={connectDropTarget} className="canvas-container">
        <Canvas widgets={widgets} />
        <Guideline
          lines={nearest ? nearest.guideLines : []}
          hoverRect={hoverRect}
          selectRect={selectRect}
        />
      </div>
    </div>
  );
}
