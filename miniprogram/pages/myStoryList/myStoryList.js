const app = getApp()
const dbUtil = require('../../utils/db')
const db = dbUtil.getDbInstance()
let currentPage = 1
let pageSize = 20
let totalPage = 1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/storyDetail/storyDetail?id=' + id,
    })
  },
  
  createStory: function () {
    wx.redirectTo({
      url: '/pages/addStory/addStory',
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
  onShow: function () {
    let that = this
    db.collection('story').where({
      deleted: false,
      '_openid': app.globalData.openId
    }).count({
      success: function (res) {
        console.log(app.globalData.openId)
        console.log(res.total)
        totalPage = Math.ceil(res.total / pageSize);
        console.log(totalPage)
        that.getList(0, [])
      }
    })
  },

  getList: function (skipPage, storyList) {
    let that = this
    db.collection('story').where({
      deleted: false,
      '_openid': app.globalData.openId
    })
      .skip(skipPage * pageSize) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(pageSize) // 限制返回数量为 10 条
      .orderBy('createAt', 'desc')
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
    console.log(currentPage, totalPage)
    this.getList(currentPage - 1, this.data.storyList)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})