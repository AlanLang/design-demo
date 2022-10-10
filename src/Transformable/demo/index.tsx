import {
  Draggable,
  Layout,
  NearestResult,
  Transformable,
  WidgetsPanel,
  DndProvider,
  HTML5Backend,
  TransformableAction,
} from '@fvs/cbb';
import { cloneDeep, flatten } from 'lodash-es';
import * as React from 'react';

import { getInfoByPosition, RenderWidgets, Widget } from './widget';

import './index.css';

const canvasKey = Symbol('canvas');

function uuid() {
  return `${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
}

export function getNewWidget(type: string) {
  if (type === 'layout') {
    return {
      id: uuid(),
      type,
      children: [
        { id: uuid(), type: 'layout' },
        { id: uuid(), type: 'layout' },
      ],
    };
  }
  return { type: type, id: uuid() };
}

export function Canvas({ widgets }: { widgets: Widget[] }) {
  return (
    <div className="widget layout" id="canvas" style={{ height: '100%' }}>
      <RenderWidgets widgets={widgets} />
    </div>
  );
}

function Toolbar({ title }: { title: string }) {
  return <div className="toolbar">{title}</div>;
}

function App() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [widgets, setWidgets] = React.useState<Widget[]>([{ id: uuid(), type: 'title' }]);
  const transformableRef = React.useRef<TransformableAction | null>(null);
  const layout = React.useMemo(() => {
    const lay = new Layout<string>({
      getInfoByPosition: (e) => {
        return getInfoByPosition(e);
      },
    });
    return lay;
  }, []);

  const createWidgets = React.useCallback(
    (w: any, nearest: NearestResult<string>) => {
      const item = w;
      if (nearest.parentPayload === 'canvas') {
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
          (w) => w && w.id === nearest.parentPayload,
        );
        if (w) {
          if (w.type === 'layout' && item.type === 'layout') {
            alert('抱歉，布局里面不能再拖入布局');
            return;
          }
          !w.children && (w.children = []);
          const index =
            nearest.payload === null ? -1 : w.children.findIndex((w) => w.id === nearest.payload);
          w.children.splice(index + 1, 0, getNewWidget(item.type));
        }
        setWidgets(array);
      }
    },
    [widgets],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <input
          type="button"
          value="清除选中"
          onClick={() => {
            transformableRef.current?.clearSelected();
          }}
        ></input>
      </div>
      <div className="design">
        <div className="widget-list">
          <WidgetsPanel
            style={{ height: '400px', background: 'white' }}
            dropTarget={canvasKey}
            entry={[
              { text: '控件', payload: 'controller' },
              { text: '布局', payload: 'layout' },
            ]}
            widgetFetcher={(entry) => {
              if (entry.payload === 'layout') {
                return Promise.resolve([{ text: '布局', payload: { type: 'layout' } }]);
              }
              return Promise.resolve([
                {
                  text: '文字',
                  payload: { type: 'text' },
                  node: (
                    <img
                      style={{ width: 88 }}
                      src="https://vip2.loli.io/2022/09/27/QcPxD8LpX9fRCJa.png"
                    ></img>
                  ),
                },
                {
                  text: '标题',
                  payload: { type: 'title' },
                  node: 'https://vip2.loli.io/2022/09/27/QcPxD8LpX9fRCJa.png',
                },
              ]);
            }}
          />
          <Draggable
            dropTarget={canvasKey}
            payload={{ type: 'text' }}
            imageSource="https://vip2.loli.io/2022/09/21/FjvO9GAZyawgxlr.jpg"
          >
            <div className="widget-item">文字</div>
          </Draggable>
          <Draggable dropTarget={canvasKey} payload={{ type: 'title' }}>
            <div className="widget-item">标题</div>
          </Draggable>
          <Draggable dropTarget={canvasKey} payload={{ type: 'layout' }}>
            <div className="widget-item">布局</div>
          </Draggable>
        </div>
        <div ref={ref} id="canvas-container" className="canvas-container">
          <Transformable
            ref={transformableRef}
            dragContainerRef={ref}
            accept={canvasKey}
            layout={layout}
            onDropAdd={createWidgets}
            cursor={`url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>"), auto`}
            onClick={(_, actions) => {
              actions.renderToolbar(<Toolbar title="组件名称" />);
            }}
            onDrop={(payload, nearest) => {
              console.log(payload, nearest);
              if (nearest) {
                if (payload === nearest.payload) {
                  return;
                }
                // 如果是往画布上拖入
                if (nearest.parentPayload === 'canvas') {
                  const targetWidget = widgets.find((w) => w.id === payload);
                  // 如果被拖动的组件在最外层画布上
                  if (targetWidget) {
                    const array = [...widgets.filter((w) => w.id !== payload)];
                    const index =
                      nearest.payload === null
                        ? -1
                        : array.findIndex((w) => w.id === nearest.payload);
                    array.splice(index + 1, 0, targetWidget);
                    setWidgets(array);
                  } else {
                    const array = cloneDeep(widgets);
                    const parent = flatten(array.map((item) => item.children)).find(
                      (w) => w && w.children?.some((c) => c.id === payload),
                    );
                    const w = parent?.children?.find((w) => w.id === payload);
                    parent?.children &&
                      (parent.children = parent.children.filter((w) => w.id !== payload));
                    const index =
                      nearest.payload === null
                        ? -1
                        : array.findIndex((w) => w.id === nearest.payload);
                    w && array.splice(index + 1, 0, w);
                    setWidgets(array);
                  }
                } else {
                  const array = cloneDeep(widgets);
                  const w = flatten(array.map((item) => item.children)).find(
                    (w) => w && w.id === nearest.parentPayload,
                  );
                  const targetWidget = array.find((w) => w.id === payload);
                  if (!w) {
                    return;
                  }
                  // 如果是从画布中拖
                  if (targetWidget) {
                    if (w.type === 'layout' && targetWidget.type === 'layout') {
                      alert('抱歉，布局里面不能再拖入布局');
                      return;
                    }
                    !w.children && (w.children = []);
                    const index =
                      nearest.payload === null
                        ? -1
                        : w.children.findIndex((w) => w.id === nearest.payload);
                    w.children.splice(index + 1, 0, targetWidget);

                    setWidgets(array.filter((w) => w.id !== payload));
                  } else {
                    // 从布局中拖入布局中
                    const parent = flatten(array.map((item) => item.children)).find(
                      (w) => w && w.children?.some((c) => c.id === payload),
                    );
                    const thisWidget = parent?.children?.find((w) => w.id === payload); // 被拖动的组件
                    w.children ?? (w.children = []);
                    if (thisWidget && parent?.children && w.children) {
                      const index =
                        nearest.payload === null
                          ? -1
                          : w.children.findIndex((w) => w.id === nearest.payload);
                      w.children.splice(index + 1, 0, thisWidget);
                      parent?.children &&
                        (parent.children = parent.children.filter((w) => w.id !== payload));
                    }
                    setWidgets(array);
                  }
                }
              }
            }}
          />
          <Canvas widgets={widgets} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
