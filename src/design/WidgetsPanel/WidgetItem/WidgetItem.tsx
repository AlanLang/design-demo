import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";

import "./WidgetItem.less";

export interface EntryProps {
  text: string;
  icon?: ReactNode;
  payload: unknown;
}

export function WidgetItem(props: {
  widget: EntryProps;
  selected?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  const { widget, selected = false } = props;
  return (
    <div
      className={classNames("fb-widget-panel-item", { selected })}
      onClick={props.onClick}
    >
      <div className="item-icon">{widget.icon}</div>
      <div className="item-text">{widget.text}</div>
    </div>
  );
}
