Component({
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
  },

  data: {
    icon: '',
    audioStatus: 1,
    audioCtx: '',
    musicClass: 'music-on'
  },

  // 页面关闭时销毁音乐
  detached() {
    this.onHide()
  },

  ready() {
    // 首先
    this.setData({
      icon: this.data.iconOn
    })
  },

  methods: {
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
    },

    // 初始化音乐
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
    },

    // 音乐开关控制
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
  }
})
