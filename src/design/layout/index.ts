import { BaseLayout, LayoutProps, NearestResult, Position } from "./base";
import { FlowLayout } from "./flow";

export type { NearestResult, Widget, Position } from "./base";

export class Layout<T> extends BaseLayout<T> {
  private layouts = new Map<string, BaseLayout<T>>();
  public constructor(protected options: LayoutProps) {
    super(options);
    this.layouts.set("flow", new FlowLayout(options));
  }

  public register(name: string, layout: typeof BaseLayout<T>) {
    this.layouts.set(name, new (layout as any)(this.options)); // TODO: 研究下这边类型该怎么写
  }

  public get(name: "flow"): FlowLayout<T>;
  public get(name: string): BaseLayout<T> | undefined;
  public get(name: string) {
    return this.layouts.get(name);
  }

  public getNearest(e: Position): NearestResult<T> | null {
    const info = this.options.getInfoByPosition(e);
    if (info && info.layout && this.layouts.has(info.layout)) {
      return this.get(info.layout)!.getNearest(e);
    }
    return this.get("flow").getNearest(e);
  }
}

export { BaseLayout, FlowLayout };
