export function Text({ id }: { id: string }) {
  return (
    <span className="widget" id={id}>
      这是一段文字
    </span>
  );
}

export function Title({ id }: { id: string }) {
  return (
    <div className="widget" id={id}>
      这是一个标题，占满整行
    </div>
  );
}

export function Layout({ id }: { id: string }) {
  return (
    <div className="widget" id={id}>
      <div className="widget-layout" style={{ margin: 20 }}>
        <div className="widget">占位块1</div>
        <div className="widget">占位块2</div>
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
            return <Layout key={index} id={widget.id} />;
        }
      })}
    </>
  );
}

export function getIdsPosition(p: { x: number; y: number }) {
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
  return domIds;
}

export interface Widget {
  id: string;
  type: string;
  children?: Widget[];
}
