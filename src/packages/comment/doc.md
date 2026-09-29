# Comment 商品评论

### 介绍

用于评论列表中单条评论的展示: 用户信息、星级、评论内容、图片/视频、追评、底部操作与商家回复。

### 安装

```tsx
import { Comment } from 'nutui-biz-taro'
```

## 代码演示

### 评论图片单行展示

默认情况下，评论的图片/视频按单行横向滑动展示。

```tsx
import { previewImage } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { Comment } from 'nutui-biz-taro'

const App = () => (
  <Comment
    images={images}
    videos={videos}
    info={info}
    operation={['reply']}
    onClick={(info) => console.log('点击评论', info)}
    onClickImages={({ type, value }) => {
      if (type !== 'video') {
        previewImage({ urls: images.map((i) => i.imgUrl), current: value.imgUrl })
      }
    }}
    onClickOperate={(type) => console.log(type)}
    commentLabels={
      <Image style={{ width: '60px', height: '20px' }} mode="aspectFit" src="https://img11.360buyimg.com/imagetools/jfs/t1/211858/17/4258/12101/618e6f78Ed0edcadc/e83a673555edf59f.jpg" />
    }
  />
)
```

### 评论图片多行展示

`imagesRows="multi"` 时以三列九宫格展示, 最多 9 格, 超出时第 9 格展示 "共 N 张" 遮罩 (点击回调 `type` 为 `more`)。
`type="complex"` 时头部展示为昵称 + 标签, 星级与规格单独一行。

```tsx
import { Text, View } from '@tarojs/components'
import { Comment } from 'nutui-biz-taro'

const App = () => (
  <Comment
    type="complex"
    imagesRows="multi"
    images={images}
    videos={videos}
    info={info}
    ellipsis={6}
    commentShopReply={
      <View>
        <Text style={{ color: '#ff0f23' }}>京东美妆国际：</Text>
        尊敬的客户您好，非常抱歉给您带来不愉快的购物体验。
      </View>
    }
  />
)
```

### 追评展示

```tsx
<Comment imagesRows="multi" images={images} videos={videos} info={info} follow={follow} />
```

## API

### Props

| 参数             | 说明                                          | 类型             | 默认值                      |
| ---------------- | --------------------------------------------- | ---------------- | --------------------------- |
| type             | 头部样式展示类型，可选 `default` `complex`    | string           | `default`                   |
| imagesRows       | 评论图片展示行数，可选 `one` `multi`          | string           | `one`                       |
| ellipsis         | 评论内容省略行数                              | string \| number | `2`                         |
| videos           | 视频信息                                      | VideosType[]     | `[]`                        |
| images           | 图片信息                                      | ImagesType[]     | `[]`                        |
| info             | 评论详情                                      | CommentInfo      | -                           |
| follow           | 追评内容, `days > 0` 时展示                   | CommentFollow    | -                           |
| operation        | 底部按钮，可选 `reply` `like` `more`          | string[]         | `['reply', 'like', 'more']` |
| commentLabels    | 评论用户的标签                                | ReactNode        | -                           |
| commentShopReply | 评论最底部内容，一般用于展示商家回复 (组件会包一层带上边框的容器) | ReactNode        | -                           |
| className        | 根节点类名                                    | string           | -                           |
| style            | 根节点样式                                    | CSSProperties    | -                           |

### Events

| 事件名         | 说明                     | 回调参数                                                                 |
| -------------- | ------------------------ | ------------------------------------------------------------------------ |
| onClickOperate | 点击底部操作按钮         | `type`: `reply` \| `like` \| `more`；点击 `more` 弹出的 "我要投诉" 时为 `popover` |
| onClick        | 点击评论头部 / 内容 / 追评 | 传入的 `info`                                                          |
| onClickImages  | 点击图片或视频           | `{ type: 'video' \| 'img' \| 'more', index, value }`，`index` 为在 `videos` / `images` 各自数组中的下标 |

组件不内置大图预览, 可在 `onClickImages` 里调用 `Taro.previewImage`。

### VideosType

```ts
interface VideosType {
  id?: string | number // key
  mainUrl?: string // 视频封面
  videoUrl?: string // 视频链接
}
```

### ImagesType

```ts
interface ImagesType {
  id?: string | number // key
  smallImgUrl?: string // 小图，列表展示时优先使用
  bigImgUrl?: string // 大图，大图展示使用
  imgUrl?: string // 兜底图
}
```

### CommentInfo

```ts
interface CommentInfo {
  content: string // 评论详情
  nickName: string // 评论人昵称
  score: number // 星级
  avatar: string // 头像
  time: string // 评论时间
  size?: string // 购买的商品规格
  reply?: number // 回复数
  like?: number // 点赞数
}
```

### CommentFollow

```ts
interface CommentFollow {
  days: number // 购买多少天后进行追评
  content: string // 追评内容
  images?: string[] // 追评图片
}
```

## 主题定制

| 名称                                   | 默认值                   |
| -------------------------------------- | ------------------------ |
| --nb-comment-font-size                 | `$nb-font-size-s`        |
| --nb-comment-color                     | `$nb-color-title`        |
| --nb-comment-header-user-name-color    | `$nb-color-title`        |
| --nb-comment-header-time-color         | `$nb-color-text-help`    |
| --nb-comment-bottom-label-color        | `$nb-color-text-help`    |
| --nb-comment-image-size                | `80px`                   |
| --nb-comment-image-radius              | `$nb-radius-s`           |
| --nb-comment-popover-background        | `$nb-color-surface`      |
