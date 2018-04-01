// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowW: 0,
    windowH: 0
  },

  initCanvas: function(url, wh){
    var w = this.data.windowW
    var h = this.data.windowW * wh
    var top = this.data.windowH / 2 - (h) / 2
    const ctx = wx.createCanvasContext('onecanvas')
    ctx.drawImage(url, 0, top, w, h)
    ctx.draw()  
  },

  initSys: function(){
    var windowW = wx.getSystemInfoSync().windowWidth
    var windowH = wx.getSystemInfoSync().windowHeight
    this.setData({
      windowW: windowW,
      windowH: windowH
    })
  },

  backHome: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({url, wh}) {
    this.initSys()
    this.initCanvas(url, wh)
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