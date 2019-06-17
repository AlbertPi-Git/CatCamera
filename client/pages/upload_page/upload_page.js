  
// pages/upload_page/upload_page.js
var config=require('../../config.js')
var util=require('../../utils/util.js')
var filename = ''
var facefound='No'
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    unprocessed_img_src:'',
    processed_img_src:'',
    unprocessed:true,
    Hattype_array_show: ['Christmas Hat', 'Wizard Hat', 'Cowboy Hat', 'Magican Hat','Chief Hat'],
    Hattype_array_upload: ['Christmas_Hat', 'Wizard_Hat', 'Cowboy_Hat', 'Magician_Hat','Chief_Hat'],
    totalHatnum:5,
    index:0,
  },

  chooseHattype(){
    wx.navigateTo({
      url: '../chooseHat_page/chooseHat_page',
    })
  },
  
  chooseImage(){
    var that=this;
    wx.chooseImage({
      count:1,
      sizeType:['orignal', 'compressed'],
      sourceType:['album','camera'],
      success(res) {
        console.log(res)
        app.globalData.unprocessed_img_src=res.tempFilePaths
        that.setData({
          unprocessed_img_src:res.tempFilePaths,
          unprocessed:true
        })
        // console.log('in choose image'+app.globalData.unprocessed_img_src)
      }
    })
  },

  unprocessed_preview(){
    wx.previewImage({
      current: this.data.unprocessed_img_src[0],
      urls: [this.data.unprocessed_img_src[0]],
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
    })
  },

  processed_preview() {
    wx.previewImage({
      current: this.data.processed_img_src,
      urls: [this.data.processed_img_src],
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) { },
    })
  },

  httpRequest(){
    var that=this;
    wx.request({
      url:config.host,
      method:'get',
      header: { "content-type": 'application/json'},
      success(res){
        console.log(res)
      }

    })
  },

  checkandshowPhotos(){
    var that=this;
    util.showBusy('Uploading...')
    setTimeout(function(){
      if (facefound == "No") {
        console.log("Cat face not found")
        util.showFailed('Cat face not found!')
      }
      else {
        wx.downloadFile({
          url: config.host + '/download?filename=' + filename,
          header: { "content-type": 'application/json' },
          success(res) {
            console.log(res);
            that.setData({
              processed_img_src: res.tempFilePath,
              unprocessed: false
            })
            facefound = 'No'
            util.showSuccess('Processed!')
          }
        })
      }
    },2000)
  },

  downLoadandsavePhotos(){
    wx.downloadFile({
      url:config.host+'/download?filename='+filename,
      header: { "content-type": 'application/json' },
      success(res){
        console.log(filename)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            util.showSuccess('Photo Saved!')
          },
          fail(res) {
            console.log(res)
          },
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that=this
    setTimeout(function(){
      that.setData({
        unprocessed_img_src: app.globalData.unprocessed_img_src,
        index: app.globalData.hatindex,
      })
      if (that.data.unprocessed_img_src.length > 0 && that.data.index < that.data.totalHatnum) {
        wx.uploadFile({
          url: config.host + '/upload?hattype=' + that.data.Hattype_array_upload[that.data.index],
          filePath: that.data.unprocessed_img_src[0],
          method: 'post',
          name: 'image',
          header: { "content-type": 'multipart/form-data' },
          success(res) {
            console.log(res)
            filename = JSON.parse(res.data).filename
            facefound = JSON.parse(res.data).facefound
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    },120)
    // console.log('onshow end')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (res) {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (res) {
    console.log('unload')
    this.setData({
      unprocessed_img_src: '',
      processed_img_src:'',
      index: '',
    })
    app.globalData.unprocessed_img_src= ''
    app.globalData.hatindex=666
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