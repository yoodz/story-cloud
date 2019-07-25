// pages/storyList/storyList.js
// const db = wx.cloud.database()
const dbUtil = require('../../utils/db')
const db = dbUtil.getDbInstance()
const app = getApp()
let currentPage = 1
let pageSize = 20
let totalPage = 1
let sortBy = 'like'
let likes = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storyList: [],
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    loading: true
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      wx.showLoading({
        title: '加载中',
      })
      currentPage = 1
      if (e.target.dataset.current === "1") {
        sortBy = 'createAt'
      } else {
        sortBy = 'like'
      }

      this.getList(0, [])
      that.setData({
        currentTab: e.target.dataset.current
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
  },

  onReady: function () {

  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/storyDetail/storyDetail?id=' + id,
    })
  },

  formateToArray: function (likes) {
    let result = []
    likes.forEach((item) => {
      result.push(item.articalId)
    })
    return result
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let that = this
    await wx.cloud.callFunction({
      name: 'getAllLike',
      success: res => {
        likes = that.formateToArray(res.result.data)
      }})
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
    db.collection('story').where({
      deleted: false
    })
      .skip(skipPage * pageSize) // 跳过结果集中的前 20 条，从第 21 条开始返回
      .limit(pageSize) // 限制返回数量为 20 条
      .orderBy(sortBy, 'desc')
      .get({
        success(res) {
          // res.data 是包含以上定义的两条记录的数组
          res.data.some((item) => { storyList.push(item) })
          wx.hideLoading()
          storyList = that.formateData(storyList)
          that.setData({
            storyList,
            loading: false
          })
        }
      })
  },

  formateData: function (storyList) {
    storyList.forEach((item)=> {
      if (likes.indexOf(item._id) !== -1) {
        item.isLike = true
      } else {
        item.isLike = false
      }
    })
    return storyList
  },

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
    wx.showLoading({
      title: '加载中',
    })
    this.getList(0, [])
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