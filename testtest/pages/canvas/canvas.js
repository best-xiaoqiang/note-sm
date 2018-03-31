// pages/canvas/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    w: 350,
    h: 350,
    x: 0,
    y: 0,
    hidden: true,
    ctx: {},
    uintArr: []
  },

  initCanvas: function(){
    var ctx = wx.createCanvasContext('myCanvas')
    // ctx.setFillStyle('red')
    // ctx.fillRect(10, 10, 150, 75)
    // ctx.draw()
    this.setData({
        ctx: ctx
    })
    
    // 画图区
    var ctx = this.data.ctx
    ctx.arc(100, 100, 50, 0, 2*Math.PI)
    ctx.setFillStyle('#EEE')
    ctx.fill()
  },

  start: function (e) {
      this.setData({
          hidden: false,
          x: e.touches[0].x,
          y: e.touches[0].y
      })
  },
  move: function (e) {
      this.setData({
          x: e.touches[0].x,
          y: e.touches[0].y
      })
  },
  end: function (e) {
      this.setData({
          hidden: true
      })
  },

  saveImage: function(){
    wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: this.data.w,
        height: this.data.h,
        canvasId: 'myCanvas',
        success: function (res) {
            var canvasImage = res.tempFilePath
            console.log(canvasImage)
            // wx.previewImage({
            //     urls: [canvasImage],
            // })
            wx.saveImageToPhotosAlbum({
                filePath: canvasImage,
            })
        } 
    }, this)
  },

  putImageData: function(){
      var data = new Uint8ClampedArray(this.data.uintArr)
      console.log('data:', data)
    var that = this
      wx.canvasPutImageData({
          canvasId: 'myCanvas',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          data: data,
          success(res) {
              console.log(res)
           },
           fail(res){
                console.log('fail:', res)
           }
      })
  },

  getImageData: function(){
      wx.canvasGetImageData({
          canvasId: 'myCanvas',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          success:(res) => {
              console.log(res)
              console.log(res.data) // true
              var uintArr = []
              var len = res.data.length
              for(var i=0; i<len; i++){
                uintArr[i] = res.data[i] ? res.data[i] : 100
              }
              this.setData({
                  uintArr: uintArr
              })
              console.log('uintArr:', this.data.uintArr)
          },
          fail(res){
            console.log('fail:', res)
          }
      })
  },

  setFontSize: function(){
        var ctx = this.data.ctx
        ctx.setFillStyle('green')
        
      ctx.setFontSize(20)
      ctx.fillText('20', 20, 20)
      ctx.setFontSize(30)
      ctx.fillText('30', 40, 40)
      ctx.setFontSize(40)
      ctx.fillText('40', 60, 60)
      ctx.setTextAlign('right')
      ctx.setFontSize(50)
      ctx.fillText('50', 90, 90)
      ctx.closePath()
        ctx.draw({
            reserve: true
        })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCanvas()
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