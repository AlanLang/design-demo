import Trigger from "rc-trigger";
import { useCallback, useState } from "react";

import { Divider } from "./Divider";
import { WidgetItem, EntryProps } from "./WidgetItem/WidgetItem";
import { WidgetList } from "./WidgetList/WidgetList";

import "./WidgetsPanel.less";

export interface WidgetsPanelProps {
  dropTarget: string | symbol;
  entry: (
    | EntryProps
    | {
        isDivider: true;
      }
  )[];
  widgetFetcher: (option: EntryProps) => Promise<
    {
      text: string;
      node?: React.ReactNode;
      payload: unknown;
    }[]
  >;
}

export function WidgetsPanel({
  entry: nodes,
  widgetFetcher,
  dropTarget,
}: WidgetsPanelProps) {
  const [selected, setSelected] = useState<EntryProps | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const fetcher = useCallback(() => {
    if (!selected) {
      return Promise.resolve([]);
    }
    return widgetFetcher(selected);
  }, [selected, widgetFetcher]);

  return (
    <Trigger
      action={["click"]}
      popupVisible={popupVisible}
      popup={
        selected ? (
          <WidgetList
            title={selected.text}
            widgetFetcher={fetcher}
            dropTarget={dropTarget}
            beforeAppend={() => {
              setPopupVisible(false);
            }}
          />
        ) : undefined
      }
      popupAlign={{
        points: ["tl", "tr"],
        offset: [4, 4],
      }}
      popupMotion={{
        motionName: "fb-widget-container-fade-in",
      }}
      popupClassName="fb-widget-list-container"
      onPopupVisibleChange={setPopupVisible}
    >
      <div className="fb-widget-panel">
        {nodes.map((widget, index) =>
          "isDivider" in widget ? (
            <Divider key={index} />
          ) : (
            <WidgetItem
              selected={widget === selected && popupVisible}
              key={widget.text}
              widget={widget}
              onClick={(e) => {
                setSelected(widget);
                if (popupVisible && selected !== widget) {
                  e.stopPropagation();
                } else {
                  setPopupVisible(true);
                }
              }}
            />
          )
        )}
      </div>
    </Trigger>
  );
}
