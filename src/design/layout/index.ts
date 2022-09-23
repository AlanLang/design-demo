import { BaseLayout, LayoutProps } from "./base";
import { FlowLayout } from "./flow";

export type { NearestResult, Widget } from "./base";

export class LayoutFactory<T> {
  private layouts = new Map<string, BaseLayout<T>>();
  public constructor(private options: LayoutProps) {
    this.layouts.set("flow", new FlowLayout(options));
  }

  public register(name: string, layout: BaseLayout<T>) {
    this.layouts.set(name, layout);
  }

  public get(name: "flow"): FlowLayout<T>;
  public get(name: string): BaseLayout<T> | undefined;
  public get(name: string) {
    return this.layouts.get(name);
  }
}

export { BaseLayout as Layout };
