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
