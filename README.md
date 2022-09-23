# design-demo
[在线体验](https://design-demo-4jtxt67mb-alanlang.vercel.app/)

## 交付的内容
### Draggable
指定某个元素可以拖拽的画布中

#### 使用方式：
```tsx
<Draggable
    type={canvasKey}
    payload={{ type: "text" }}
    imageSource="https://vip2.loli.io/2022/09/21/FjvO9GAZyawgxlr.jpg"
>
    <div className="widget-item">文字</div>
</Draggable>
```
#### props 定义
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| type | `string 或 symbol` | 标识作用，用于和`useDroppable`关联|
| payload | `any` | 携带的数据|
| imageSource | `string` | 拖动时鼠标显示的图片 |

### useDroppable
用于接收拖动的元素

#### 使用方式
```tsx
const connectDropTarget = useDroppable(canvasKey, {
    onDrag(item, monitor) {

    },
    onDrop(item, monitor) {

    }
})
```

#### 接口定义
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| canvasKey | `string 或 symbol` | 和 `Draggable` 关联|

onDrag
当鼠标拖动过程中持续触发，item的内容为 `Draggable` 的 `payload`
`monitor` 为当前鼠标位置等其他信息

onDrop
当鼠标释放是触发，item的内容为 `Draggable` 的 `payload`
`monitor` 为当前鼠标位置等其他信息

### Layout
布局辅助计算层，针对不同的布局有不同的实现，只要都继承自 BaseLayout 即可，本 demo 目前只实现了流式布局的 layout 实现。
```ts
export interface Widget {
  payload: any;
  resizable?: "horizontal" | "vertical" | "both" | "none";
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  children?: Widget[];
}

export interface LayoutProps {
  getInfoByPosition: (e: Position) => Widget | undefined;
}

abstract class BaseLayout<T> {
  public constructor(protected options: LayerProps) {}

  public abstract getNearest(e: Position): NearestResult<T> | null;
  public abstract getWidget(e: Position): Widget | null;
}
```

#### 接口定义
##### getInfoByPosition

每一个 layout 的实现都必须传入这个函数，用于获取鼠标位置对应的部分组件信息，其中包括当前鼠标位置所在的容器组件以及所有子组件。
* payload 组件携带的信息，用于和实际组件实例关联
* resizable 当前组件十分运行拖拽改变大小
* position 当前组件的位置信息
* children 当前组件的子组件数据

layout 提供的所有方法，都是基于这个函数的返回值进行计算的。

##### getNearest
获取鼠标位置最近的组件信息，返回值为 `NearestResult`
```ts
export interface NearestResult<T> {
  payload: T | null;
  parentPayload: T | null;
  guideLines: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }[];
}
```
* payload 当前鼠标位置最近的组件信息，新拖入的组件会插入到这个组件后面，如果没有则为 null
* parentPayload 当前鼠标位置最近的组件的父组件信息，新拖入的组件会插入到这个组件的子组件中，如果没有则为 null
* guideLines 辅助线信息，数组中的每一项都是一条辅助线的信息，用于显示在鼠标位置附近的辅助线

##### gwtWidget
获取鼠标位置对应的组件信息，返回值为 `Widget`，如果没有则为 null

### Graph
画布组件，用于提供画布的基础事件

#### 接口定义
##### on hover
当鼠标在画布中移动时触发（未拖动时），返回值为当前鼠标位置信息。

##### on click
当鼠标在画布中点击时触发，返回值为当前鼠标位置信息。

##### on drag
当鼠标在画布中拖动时触发，返回值为当前鼠标位置信息。

#### on drop
当鼠标在画布中释放时触发，返回值为当前鼠标位置信息。

#### GuideLine
辅助线组件，用于绘制一些辅助线。

#### 参数定义
##### lines
辅助线，不管是流式布局的插入指导线，还是绝对布局的对齐辅助线都是通过这个参数传入的。

##### hoverRect
悬浮线框，一般会在组件被悬浮时显示一个虚线框，这个参数就是用于控制这个虚线框的位置。

##### selectRect
选中线框，一般会在组件被选中时显示一个实线框，这个参数就是用于控制这个实线框的位置。