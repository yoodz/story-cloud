// pages/storyList/storyList.js
// const db = wx.cloud.database()
const dbUtil = require('../../utils/db')
const db = dbUtil.getDbInstance()
const app = getApp()
let currentPage = 1
let pageSize = 20
let totalPage = 1
let sortBy = 'like'

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
      console.log(sortBy)

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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.getList(0, [])
    db.collection('story').where({
      deleted: false
    }).count({
      success: function (res) {
        console.log(res.total)
        totalPage = Math.ceil(res.total / pageSize);
        console.log(totalPage)
      }
    })
  },

  getList: function (skipPage, storyList) {
    let that = this
    console.log(sortBy)
    db.collection('story').where({
      deleted: false
    })
      .skip(skipPage * pageSize) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(pageSize) // 限制返回数量为 10 条
      .orderBy(sortBy, 'desc')
      .get({
        success(res) {
          // res.data 是包含以上定义的两条记录的数组
          res.data.some((item) => { storyList.push(item)})
          wx.hideLoading()
          console.log(storyList)
          that.setData({
            storyList,
            loading: false
          })
        }
      })
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
    console.log(currentPage, totalPage)
    this.getList(currentPage - 1, this.data.storyList)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})