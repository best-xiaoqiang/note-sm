const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picArr: [
        '../../resources/img/1.jpg',
        '../../resources/img/2.jpg',
        '../../resources/img/3.jpg',
        '../../resources/img/4.jpg',
    ],
    viewPic: {
        url: '',
        w: 0,
        h: 0
    },
    canvasShow:false,
    windowW: 375,
    windowH: 993
  },

  goThere: function(){
    wx.openLocation({
        latitude: 0,
        longitude: 0,
    })
  },

  makeCall: function(){
    wx.makePhoneCall({
        phoneNumber: '15633398231',
    })
  },

  closeCanvas: function(){
    this.setData({
      canvasShow: false
    })
  },

  previewImage: function(e){
      var url = e.currentTarget.dataset.url
      wx.getImageInfo({
          src: url,
          success:(res)=>{
            var viewPic = {
                url: url,
                wh: res.height/res.width,
            }       
            this.setData({
                viewPic: viewPic
            })
            var w = this.data.windowW
            var h = this.data.windowW * this.data.viewPic.wh
            var top = this.data.windowH / 2 - (h)/2
            wx.navigateTo({
              url: `/pages/detail/detail?url=${url}&wh=${this.data.viewPic.wh}`
            })
          }
      })
  },

  initSys:function(){
    wx.getSystemInfo({
      success: (res) =>{
        this.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initSys()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})