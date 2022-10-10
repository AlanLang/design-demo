import Trigger from 'rc-trigger';
import React, { CSSProperties, useCallback, useRef, useState } from 'react';

import { Divider } from './Divider';
import { WidgetItem, EntryProps } from './WidgetItem/WidgetItem';
import { WidgetList } from './WidgetList/WidgetList';

import './WidgetsPanel.less';

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
  style?: CSSProperties;
}

export function WidgetsPanel({
  entry: nodes,
  widgetFetcher,
  dropTarget,
  style,
}: WidgetsPanelProps) {
  const [selected, setSelected] = useState<EntryProps | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const fetcher = useCallback(() => {
    if (!selected) {
      return Promise.resolve([]);
    }
    return widgetFetcher(selected);
  }, [selected, widgetFetcher]);

  return (
    <Trigger
      action={['click']}
      popupVisible={popupVisible}
      popup={
        selected ? (
          <WidgetList
            style={{ height: ref.current?.getBoundingClientRect().height }}
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
        points: ['tl', 'tr'],
        offset: [4, 4],
      }}
      popupMotion={{
        motionName: 'fb-widget-container-fade-in',
      }}
      popupClassName="fb-widget-list-container"
      onPopupVisibleChange={(visible) => {
        !visible && setPopupVisible(visible);
      }}
      getPopupContainer={() => {
        return ref.current!;
      }}
    >
      <div className="fb-widget-panel">
        <div className="fb-widget-list" ref={ref}></div>
        <div className="fb-widget-entry" style={style}>
          {nodes.map((widget, index) =>
            'isDivider' in widget ? (
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
            ),
          )}
        </div>
      </div>
    </Trigger>
  );
}
