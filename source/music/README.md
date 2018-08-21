# 微信小程序有旋转动画效果的音乐组件

* [首页](https://github.com/best-xiaoqiang/note-sm)

在微信开发中，写过的一个简单的音乐播放组件，记录下。

## music

音乐播放组件。

### 属性

属性名|类型|默认值|说明
---|---|---|---
music|String| |传入的音乐资源地址
musicStyle|String|(随便写了个)|音乐组件的样式
rotate|Boolean|true|播放时是否有旋转效果
iconOn|String|(随便写了个)|音乐播放时的icon地址
iconOff|String|(随便写了个)|音乐暂停时的icon地址

#### 代码         

```javascript
  properties: {
    // 音乐路径
    music: {
      type: String,
      value: '',
      observer: function (newVal) {
        this._initMusic(newVal)
      }
    },
    // 样式
    musicStyle: {
      type: String,
      value: 'position: absolute; right: 20rpx; top: 20rpx; width: 100rpx; height: 100rpx;'
    },
    // 播放时是否有旋转效果
    rotate: {
      type: Boolean,
      value: true
    },
    // 播放时的icon路径
    iconOn: {
      type: String,
      value: '/resources/img/music-on.png' // 请填写默认的图片地址
    },
    // 暂停时的icon路径
    iconOff: {
      type: String,
      value: '/resources/img/music-off.png' // 请填写默认的图片地址
    }
  }
```

### 初始化音乐

首先，在`properties`中接收页面传来的音乐文件地址，

```javascript
music: {
  type: String,
  value: '',
  observer: function (newVal) {
    this._initMusic(newVal)
  }
}
```

这里的处理是，一旦接收到页面传来的music地址，就初始化音乐：

```javascript
_initMusic: function (newVal) {
  // 当页面传来新的music时，先销毁之前的audioCtx，否则页面会很嗨
  if (this.data.audioCtx) {
    this.data.audioCtx.destroy()
  }
  if (newVal) {
    var audioCtx = wx.createInnerAudioContext()
    this.setData({
        audioCtx: audioCtx
    })
    if (this.data.audioStatus == '1') {
        audioCtx.autoplay = true
    }
    audioCtx.loop = true
    audioCtx.src = newVal
  }
}
```

`audioStatus`用来记录音乐播放状态，在`data`中默认设置为1：

```javascript
data: {
    icon: '',
    audioStatus: 1,
    audioCtx: '',
    musicClass: 'music-on'
}
```

wxml文件里，只用一个`<image>`标签：

```html
<image class='music {{ rotate && musicClass }}'  
        style="{{ musicStyle }}"  
        src="{{ icon }}"  
        bindtap='_switch'  
        wx:if="{{ music }}"></image>
```

其中，`icon`在组件`ready()`时赋值成播放状态的icon：

```javascript
ready() {
    this.setData({
      icon: this.data.iconOn
    })
}
```

### 音乐旋转效果

音乐播放时的旋转效果，是用css动画实现的，wxss文件如下：

```css
.music {
  position: absolute;
  z-index: 99;
  -webkit-animation-iteration-count: infinite;
}
/* 旋转class */
.music-on {
  animation: music-rotate 4s linear infinite;
}
/* 旋转动画 */
@keyframes music-rotate {
  0% {
    transform: rotateZ(0deg);
  }

  100% {
    transform: rotateZ(360deg);
  }
}
```

当`rotate`为`true`时，使`musicClass` 的值为`'music-on'`，就能实现旋转了。

当然，在`musicClass`切换过程中需要用`this.setData`的方式。

爆丑图：

![](https://user-gold-cdn.xitu.io/2018/8/21/1655b75618e7e9a3?w=280&h=356&f=gif&s=557565)

### 音乐控制

#### 手动切换

手动点击时，用取反的逻辑控制音乐的播放和暂停：

```javascript
_switch: function () {
  // 如果是播放就停止   
  if (this.data.audioStatus) {
    this.setData({
      audioStatus: 0,
      icon: this.data.iconOff,
      musicClass: ''
    })
    this.data.audioCtx.pause()
  // 如果是停止就播放 
  } else {
    this.setData({
      audioStatus: 1,
      icon: this.data.iconOn,
      musicClass: 'music-on'
    })
    this.data.audioCtx.play()
  }
}
```

#### 其它情况

同时，还要对下列情况做处理：

* 分享时，进入选好友界面、音乐停止，分享回来后，音乐没有继续播放
* 从此页面跳转到下一个页面时，音乐还在继续
* 从此页面撤回到上一个页面时，音乐还在继续

解决的方法，是在组件的methods中又写了两个方法：

```javascript
// 写在组件的methods中：

// 在引用组件页面的onShow()中调用
//  否则，如果当发生分享页面行为并返回时，音乐不会自动播放
onShow: function () {
  if (this.data.music && this.data.audioStatus) {
    this.data.audioCtx.play()
  }
},

// 在引用组件页面的onHide()中调用
//  否则，在跳转到下一个页面后，音乐还在继续
onHide: function () {
  if (this.data.music && this.data.audioStatus) {
    this.data.audioCtx.pause()
  }
  this.setData({
    animationData: {}
  })
}
```

这两个方法分别在页面中的onShow和onHide中调用，调用方式就是父组件获取到子组件实例对象：

例如，给`<music>`组件加id为"music-componet"，调用时就是：

```javascript
// 写在调用页面中

onShow: function () {
    this.selectComponent('#music-component').onShow()
},

onHide: function () {
    this.selectComponent('#music-component').onHide()
}
```

最后，在组件的`detached`中也调用一下`onHide`方法：

```javascript
// 页面关闭时销毁音乐
detached() {
    this.onHide()
}
```

## 使用

你可以

* 通过阅读本文，根据自身实际情况写一个
* 或者，直接[凑合用](https://github.com/best-xiaoqiang/note-sm/tree/master/source/music)