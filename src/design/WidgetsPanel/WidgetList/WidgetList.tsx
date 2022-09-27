import { useEffect, useState } from "react";

import { Draggable } from "../../Draggable";
import "./WidgetList.less";

export interface WithFetchResult {
  loading: boolean;
}

export interface WidgetItemProps {
  text: string;
  payload: unknown;
  node?: React.ReactNode | string;
}

export interface WidgetListProps {
  title: string;
  widgetFetcher: () => Promise<WidgetItemProps[]>;
  dropTarget: string | symbol;
  beforeAppend?: () => void;
}

const WidgetItem = ({
  widget,
  dropTarget,
  beforeAppend,
}: {
  widget: WidgetItemProps;
  dropTarget: string | symbol;
  beforeAppend?: () => void;
}) => {
  return (
    <div className="fb-widget-item">
      <Draggable
        dropTarget={dropTarget}
        payload={widget.payload}
        imageSource={typeof widget.node === "string" ? widget.node : void 0}
        canDrag={() => {
          beforeAppend?.();
          return true;
        }}
      >
        <div className="fb-widget-item-image">
          {typeof widget.node === "string" ? (
            <img src={widget.node} style={{ width: 88 }} />
          ) : (
            widget.node
          )}
        </div>
        <div className="fb-widget-item-text">{widget.text}</div>
      </Draggable>
    </div>
  );
};

export function WidgetList({
  title,
  widgetFetcher,
  dropTarget,
  beforeAppend,
}: WidgetListProps) {
  const [widgets, setWidgets] = useState<WidgetItemProps[]>();
  useEffect(() => {
    widgetFetcher().then((item) => {
      setWidgets(item);
    });
  }, [widgetFetcher]);

  return (
    <div className="fb-widget-list-panel">
      <div className="widget-list-title">{title}</div>
      <div className="widget-list-content">
        {(widgets || []).map((widget) => (
          <WidgetItem
            key={widget.text}
            widget={widget}
            dropTarget={dropTarget}
            beforeAppend={beforeAppend}
          />
        ))}
      </div>
    </div>
  );
}
