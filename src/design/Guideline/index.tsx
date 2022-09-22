import "./index.less";

export interface GuidelineProps {
  lines: { x1: number; y1: number; x2: number; y2: number }[];
  hoverRect?: { x: number; y: number; width: number; height: number } | null;
  selectRect?: { x: number; y: number; width: number; height: number }[];
}

export function Guideline(props: GuidelineProps) {
  const { lines, hoverRect, selectRect = [] } = props;
  return (
    <div className="fvs-guideline-box">
      {lines.map((line, index) => (
        <div
          style={{
            top: line.y1,
            left: line.x1,
            width: Math.max(Math.abs(line.x2 - line.x1), 2),
            height: Math.max(Math.abs(line.y2 - line.y1), 2),
          }}
          key={index}
          className="fvs-guideline-line"
        ></div>
      ))}
      {hoverRect ? (
        <div
          className="fvs-guideline-hover"
          style={{
            top: hoverRect.y,
            left: hoverRect.x,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        ></div>
      ) : null}
      {selectRect.map((rect, index) => (
        <div
          key={index}
          className="fvs-guideline-selected"
          style={{
            top: rect.y,
            left: rect.x,
            width: rect.width,
            height: rect.height,
          }}
        ></div>
      ))}
    </div>
  );
}
