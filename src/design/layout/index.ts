import { BaseLayout, LayoutProps } from "./base";
import { FlowLayout } from "./flow";

export type { NearestResult, Widget, Position } from "./base";

export class LayoutFactory<T> {
  private layouts = new Map<string, BaseLayout<T>>();
  public constructor(private options: LayoutProps) {
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
}

export { BaseLayout as Layout };
