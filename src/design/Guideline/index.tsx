import { Widget } from "../widget";
import "./index.less";

export function Guideline(props: { widgets: Widget[] }) {
  return (
    <div className="fvs-guideline-box">
      {props.widgets.map((widget) => (
        <div key={widget.id} className="fvs-guideline">
          <div
            className="fvs-guideline-line fvs-guideline-line-top"
            style={{
              width: widget.position.width,
              transform: `translate(${widget.position.x}px. ${widget.position.y}px)`,
            }}
          ></div>
          <div
            className="fvs-guideline-line fvs-guideline-line-bottom"
            style={{
              width: widget.position.width,
              transform: `translate(${
                widget.position.x + widget.position.height
              }px. ${widget.position.y}px)`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}
