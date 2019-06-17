var upload_page=require('../upload_page/upload_page.js')
var app=getApp()

Page({
  choose_Chirtmas_Hat(){
    app.globalData.hatindex=0
    wx.navigateBack({
      delta:1
    })
  },
  choose_Wizard_Hat() {
    app.globalData.hatindex = 1
    wx.navigateBack({
      delta: 1
    })
  },
  choose_Cowboy_Hat() {
    app.globalData.hatindex = 2
    wx.navigateBack({
      delta: 1
    })
  },
  choose_Magician_Hat() {
    app.globalData.hatindex = 3
    wx.navigateBack({
      delta: 1
    })
  },
  choose_Chief_Hat() {
    app.globalData.hatindex = 4
    wx.navigateBack({
      delta: 1
    })
  }
})