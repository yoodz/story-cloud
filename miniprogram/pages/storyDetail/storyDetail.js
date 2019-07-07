// pages/storyDetail/storyDetail.js
const dbUtil = require('../../utils/db')
const common = require('../../utils/common')
const regeneratorRuntime = require("../../utils/runtime")
const db = dbUtil.getDbInstance()
const app = getApp()
let articalId = ''
let doing = false

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
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    articalId = options.id
    console.log(articalId)
    this._getData(articalId)
  },

  _getData: function (id) {
    let that = this
    const db = wx.cloud.database()
    db.collection('story').doc(id).get({
      success(res) {
        // res.data 包含该记录的数据
        let formatData = that.formateData(res.data)
        formatData.createTime = formatData.content[0].formateData.split(' ')[0]
        wx.hideLoading()
        that.setData({
          'item': formatData
        })
      }
    })
  },

  formateData: function (data) {
    let content = data.content
    for (let i in content) {
      content[i].formateData = this.formateTime(content[i].createAt)
      content[i].formateDay = this.formateTimeByDay(content[i].createAt)
    }
    return data
  },

  formateTimeByDay: function (timestamp) {
    let days = ["今天", "一天前", "两天前", "三天前", "四天前", "五天前", "六天前", "一周前"]
    let tmpeTime = new Date().getTime() - timestamp
    let index = Math.floor(tmpeTime / 1000 / 60 / 60 / 24)
    console.log(index)
    index = index > 7 ? 7 : index
    return days[index]
  },

  formateTime: function (timestamp) {
    let Y, M, D, h, m, s
    let createTime = new Date(timestamp)
    Y = createTime.getFullYear() + '-';
    M = (createTime.getMonth() + 1 < 10 ? '0' + (createTime.getMonth() + 1) : createTime.getMonth() + 1) + '-';
    D = createTime.getDate() < 10 ? '0' + createTime.getDate() + ' ' : createTime.getDate() + ' ';
    h = createTime.getHours() + ':';
    m = createTime.getMinutes() + ':';
    s = createTime.getSeconds();
    return Y + M + D + h + m + s;
  },

  formSubmit: async function (e) {
    let that = this
    if (doing || e.detail.value === '') { return }
    wx.showLoading({
      title: '加载中',
    })
    doing = true

    let content = {
      createAt: new Date().getTime(),
      content: e.detail.value,
      deleted: false,
      openId: app.globalData.openId,
      avatarUrl: app.globalData.avatarUrl,
      nickName: app.globalData.nickName
    }

    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        articalId,
        content
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        doing = false
        if (res.result.stats.updated === 1) {
          console.log(3)
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
      },
      fail: err => {
        // handle error
        doing = false
        wx.showToast({
          title: '留言失败',
          duration: 2000,
          mask: true
        })
      },
      complete: () => {
        // ...
      }
    })
  },

  onGetUserInfo: function (e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      common.saveUserInfo(e)
      this.setData({
        needOauth: false
      })
    }
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let needOauth = await common.checkIsOauth()
    this.setData({
      needOauth
    })

    wx.cloud.callFunction({
      name: 'updatePv',
      data: {
        articalId
      }
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

  }
})