
## WidgetsPanel
组件列表

```tsx
import { WidgetsPanel, DndProvider, HTML5Backend } from '@fvs/cbb';
import React from 'react';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: '300px' }}>
        <WidgetsPanel
          style={{ height: '500px', background: 'white' }}
          dropTarget="key"
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
      </div>
    </DndProvider>
  );
};
export default App;

```