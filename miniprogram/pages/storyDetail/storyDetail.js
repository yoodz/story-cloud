// pages/storyDetail/storyDetail.js
const dbUtil = require('../../utils/db')
const common = require('../../utils/common')
const regeneratorRuntime = require("../../utils/runtime")
const db = dbUtil.getDbInstance()
const app = getApp()
let articalId = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    addContent: '',
    needOauth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    articalId = options.id
    this._getData(articalId)
  },

  _getData: function(id) {
    let that = this
    db.collection('story').doc(id).get({
      success(res) {
        // res.data 包含该记录的数据
        let formatData = that.formateData(res.data)
        wx.hideLoading()
        that.setData({
          'item': formatData
        })
      }
    })
  },

  formateData: function(data) {
    let content = data.content
    for (let i in content) {
      content[i].formateData = this.formateTime(content[i].createAt)
    }
    return data
  },

  formateTime: function(timestamp) {
    let Y, M, D, h, m, s
    let createTime = new Date(timestamp)
    Y = createTime.getFullYear() + '-';
    M = (createTime.getMonth() + 1 < 10 ? '0' + (createTime.getMonth() + 1) : createTime.getMonth() + 1) + '-';
    D = createTime.getDate() + ' ';
    h = createTime.getHours() + ':';
    m = createTime.getMinutes() + ':';
    s = createTime.getSeconds();
    return Y + M + D + h + m + s;
  },

  formSubmit: async function(e) {
    let that = this
    console.log(e.detail.value)
    console.log(articalId)

    let userInfoStory = await common.getUserInfo()
    let content = {
      createAt: new Date().getTime(),
      content: e.detail.value,
      deleted: false,
      openId: app.globalData.openId,
      avatarUrl: userInfoStory.avatarUrl,
      nickName: userInfoStory.nickName
    }
    const _ = db.command
    db.collection('story').doc(articalId).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        content: _.push(content)
      },
      success(res) {
        console.log(res)
        if (res.stats.updated === 1) {
          that.setData({
            addContent: ''
          })
          wx.showToast({
            title: '留言成功',
            duration: 2000,
            mask: true
          })
          that._getData(articalId)
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    common.saveUserInfo(e)
    this.setData({
      needOauth: false
    })
  },

  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {
    let needOauth = await common.checkIsOauth()
    this.setData({
      needOauth
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})