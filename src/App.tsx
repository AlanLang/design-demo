import * as React from "react";

import "./App.css";
import { Canvas } from "./Canvas";
import { Draggable } from "./design";
import { useDroppable } from "./design/Draggable";
import { Guideline } from "./design/Guideline";
import { getIdsPosition, Widget } from "./widget";

const canvasKey = Symbol("canvas");

function uuid() {
  return `${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
}

export function App() {
  const [widgets, setWidgets] = React.useState<Widget[]>([
    { id: uuid(), type: "title" },
  ]);

  React.useEffect(() => {
    // const layer = new Layout({
    //   getInfoByPosition: (p) => {
    //     const ids = getIdsPosition(p);
    //     return {
    //       ids,
    //       position: p,
    //     };
    //   },
    // });
  }, [widgets]);

  const connectDropTarget = useDroppable(
    canvasKey,
    {
      onDrag(item, monitor) {
        const position = monitor.getClientOffset();
        position && console.log(getIdsPosition(position));
      },
      onDrop(item: { type: string }) {
        // console.log(item, monitor);
        setWidgets([...widgets, { type: item.type, id: uuid() }]);
      },
    },
    [widgets]
  );

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
          widgets={[
            { id: "123", position: { x: 10, y: 10, width: 10, height: 10 } },
          ]}
        />
      </div>
    </div>
  );
}
