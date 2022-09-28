export function Text({ id }: { id: string }) {
  return (
    <span className="widget" id={id}>
      这是一段文字{id}
    </span>
  );
}

export function Title({ id }: { id: string }) {
  return (
    <div className="widget" id={id}>
      这是一个标题，占满整行{id}
    </div>
  );
}

export function Layout({ widget }: { widget: Widget }) {
  return (
    <div className="widget" id={widget.id} style={{ padding: 20 }}>
      <div className="widget-layout">
        {widget.children?.map((item, index) => (
          <div key={item.id} className="widget layout" id={item.id}>
            {item.children && item.children.length > 0 ? (
              <RenderWidgets widgets={item.children} />
            ) : (
              `占位块${index + 1}`
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RenderWidgets({ widgets }: { widgets: Widget[] }) {
  return (
    <>
      {widgets.map((widget, index) => {
        switch (widget.type) {
          case "text":
            return <Text key={index} id={widget.id} />;
          case "title":
            return <Title key={index} id={widget.id} />;
          case "layout":
            return <Layout key={index} widget={widget} />;
        }
      })}
    </>
  );
}

export function getInfoByPosition(p: MouseEvent | DragEvent) {
  const doms = document.getElementsByClassName("widget");
  const domIds = Array.from(doms)
    .filter((item) => {
      const rect = item.getBoundingClientRect();
      return (
        p.x > rect.left &&
        p.x < rect.right &&
        p.y > rect.top &&
        p.y < rect.bottom
      );
    })
    .map((item) => item.id);
  let targetId = domIds[0];
  domIds.forEach((id) => {
    const dom = document.getElementById(id);
    const targetDom = document.getElementById(targetId);
    if (dom && targetDom) {
      const rect = dom.getBoundingClientRect();
      const targetRect = targetDom.getBoundingClientRect();
      if (rect.width * rect.height < targetRect.width * targetRect.height) {
        targetId = id;
      }
    }
  });
  const targetDom = document.getElementById(targetId);
  if (targetDom && targetDom.classList.contains("layout")) {
    return {
      payload: targetId,
      position: targetDom.getBoundingClientRect(),
      selectable: false,
      draggable: false,
      children: Array.from(targetDom.children).map((item) => {
        return {
          payload: item.id,
          position: item.getBoundingClientRect(),
        };
      }),
    };
  }
  const parent = targetDom?.parentElement;
  if (parent) {
    return {
      payload: parent.id,
      position: parent.getBoundingClientRect(),
      children: Array.from(parent.children).map((item) => {
        return {
          payload: item.id,
          position: item.getBoundingClientRect(),
        };
      }),
    };
  }
}

export interface Widget {
  id: string;
  type: string;
  children?: Widget[];
}
