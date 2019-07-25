// pages/mine/mine.js
const app = getApp()
const dbUtil = require('../../utils/db')
const common = require('../../utils/common')
const regeneratorRuntime = require("../../utils/runtime")
const db = dbUtil.getDbInstance()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    likeCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  CopyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let result = await db.collection('like').where({
      openId: app.globalData.openId,
      deleted: false
    }).count()
    let commonsCount = await db.collection('commons').where({
      openId: app.globalData.openId,
      deleted: false
    }).count()
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickName: app.globalData.nickName,
      likeCount: result.total,
      commonsCount: commonsCount.total
    })
  },

  toDetail(e) {
    let type = e.currentTarget.dataset.type
    console.log(type)
    wx.navigateTo({
      url: '/pages/startCommon/startCommon?type=' + type,
    })
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

  },
  touchStart: function (e) {
    this.setData({
      touchStart: e.timeStamp
    })
  },
  touchEnd: function (e) {
    this.setData({
      touchEnd: e.timeStamp
    })
  },
  pressTap: function () {
    var touchTime = this.data.touchEnd - this.data.touchStart;
    if (touchTime > 5000) { //自定义长按时长，单位为ms
      wx.navigateTo({
        url: '/pages/admin/admin',
      })
     }
  }
})