import { previewImage } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Comment } from './index'
import type { CommentFollow, CommentInfo, GoodsClickParams, ImagesType, VideosType } from './index'
import { DemoBlock, DemoPage } from '../../../demo/components/DemoBlock'
import data from './data.json'

const https = (url: string) => (url.startsWith('//') ? `https:${url}` : url)

const cmt = data.Comment as {
  videos: VideosType[]
  images: ImagesType[]
  info: CommentInfo
  follow: CommentFollow
}
const follow: CommentFollow = { ...cmt.follow, images: (cmt.follow.images || []).map(https) }

const previewImages = ({ type, value }: GoodsClickParams) => {
  console.log('点击图片', type, value)
  if (type === 'video') return
  const urls = cmt.images.map((img) => https(img.bigImgUrl || img.imgUrl || ''))
  const current = https((value as ImagesType).bigImgUrl || (value as ImagesType).imgUrl || '')
  previewImage({ urls, current })
}

const block = { padding: '12px' }

const CommentDemo = () => {
  return (
    <DemoPage>
      <DemoBlock title="评论图片单行展示">
        <View style={block}>
          <Comment
            images={cmt.images}
            videos={cmt.videos}
            info={cmt.info}
            operation={['reply']}
            onClick={(info) => console.log('点击评论', info)}
            onClickImages={previewImages}
            onClickOperate={(type) => console.log('操作', type)}
            commentLabels={
              <Image
                style={{ width: '60px', height: '20px' }}
                mode="aspectFit"
                src="https://img11.360buyimg.com/imagetools/jfs/t1/211858/17/4258/12101/618e6f78Ed0edcadc/e83a673555edf59f.jpg"
              />
            }
          />
        </View>
      </DemoBlock>

      <DemoBlock title="评论图片多行展示">
        <View style={block}>
          <Comment
            type="complex"
            imagesRows="multi"
            images={cmt.images}
            videos={cmt.videos}
            info={cmt.info}
            ellipsis={6}
            onClickImages={previewImages}
            onClickOperate={(type) => console.log('操作', type)}
            commentLabels={
              <Image
                style={{ width: '50px', height: '12px' }}
                mode="aspectFit"
                src="https://storage.360buyimg.com/imgtools/78925d9440-f9e874d0-e93d-11eb-8e5c-0da9e18a13b1.png"
              />
            }
            commentShopReply={
              <View>
                <Text style={{ color: '#ff0f23' }}>京东美妆国际：</Text>
                尊敬的客户您好，非常抱歉给您带来不愉快的购物体验，关于过敏，什么成分都不存在个别性和普遍性。
              </View>
            }
          />
        </View>
      </DemoBlock>

      <DemoBlock title="追评展示">
        <View style={block}>
          <Comment
            imagesRows="multi"
            images={cmt.images}
            videos={cmt.videos}
            info={cmt.info}
            follow={follow}
            onClickImages={previewImages}
          />
        </View>
      </DemoBlock>
    </DemoPage>
  )
}

export default CommentDemo
