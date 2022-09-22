import { Widget, RenderWidgets } from "./widget";

export function Canvas({ widgets }: { widgets: Widget[] }) {
  return (
    <div className="widget layout" id="canvas" style={{ height: "100%" }}>
      <RenderWidgets widgets={widgets} />
    </div>
  );
}
