// pages/admin/admin.js
const dbUtil = require('../../utils/db')
const common = require('../../utils/common')
const db = dbUtil.getDbInstance()
const app = getApp()
let currentPage = 1
let pageSize = 20
let totalPage = 1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storyList: [],
    show: true
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

  checkPs: function (e) {
    if (e.detail.value.ps && e.detail.value.ps === '741741') {
      this.setData({show: false})
    } else {
      wx.reLaunch({
        url: '/pages/storyList/storyList',
      })
    }
  },

  changeStatus: function (e) {
    const articalId = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'changeStoryStatus',
      data: {
        status: e.detail.value,
        articalId
      },
      success: res => {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    currentPage = 1
    db.collection('story').where({
      deleted: false
    }).count({
      success: function (res) {
        totalPage = Math.ceil(res.total / pageSize);
        that.getList(0, [])
      }
    })
  },

  getList: function (skipPage, storyList) {
    let that = this
    db.collection('story').where({})
      .skip(skipPage * pageSize) // 跳过结果集中的前 20 条，从第 21 条开始返回
      .limit(pageSize) // 限制返回数量为 20 条
      .get({
        success(res) {
          // res.data 是包含以上定义的两条记录的数组
          res.data.some((item) => { storyList.push(item) })
          wx.hideLoading()
          console.log(storyList)
          that.setData({
            storyList,
            loading: false
          })
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
    if (++currentPage > totalPage) return
    wx.showLoading({
      title: '加载中',
    })

    currentPage = ++currentPage > totalPage ? totalPage : currentPage++
    this.getList(currentPage - 1, this.data.storyList)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})