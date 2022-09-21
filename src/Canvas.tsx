import { Widget, RenderWidgets } from "./widget";

export function Canvas({ widgets }: { widgets: Widget[] }) {
  return (
    <div>
      <RenderWidgets widgets={widgets} />
    </div>
  );
}
