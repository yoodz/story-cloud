const app = getApp()
const dbUtil = require('../../utils/db')
const db = dbUtil.getDbInstance()
let currentPage = 1
let pageSize = 20
let totalPage = 1
let dbName = 'like'
let likes = []

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let type = options.type
    dbName = type === 'start' ? 'like' : 'commons'
    console.log(dbName)
    let that = this
    db.collection(dbName).where({
      openId: app.globalData.openId
    }).count({
      success: function(res) {
        totalPage = Math.ceil(res.total / pageSize);
        that._getData(dbName, 0, [])
      }
    })

  },

  _getData: async function(dbName, skipPage, storyList) {
    let that = this
    db.collection(dbName).where({
        openId: app.globalData.openId,
        deleted: false
      })
      .skip(skipPage * pageSize) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(pageSize) // 限制返回数量为 10 条
      .orderBy('createAt', 'desc')
      .get({
        success: async function(res) {
          // res.data 是包含以上定义的两条记录的数组
          res.data.some((item) => {
            storyList.push(item)
          })
          wx.hideLoading()
          that.formateData(storyList)
        }
      })
  },

  formateLike: function (storyList) {
    storyList.forEach((item) => {
      console.log(item)
      console.log(likes)
      if (likes.indexOf(item._id) !== -1) {
        item.isLike = true
      } else {
        item.isLike = false
      }
    })
    console.log(storyList)
    return storyList
  },

  formateData: async function(storyList) {
    let that = this
    const tasks = []
    for (const item of storyList) {
      let promise = db.collection('story').doc(item.articalId).get()
      tasks.push(promise)
    }
    Promise.all(tasks).then(function (values) {
      let result = []
      for (const item of values) {
        if (likes.indexOf(item.data._id) !== -1) {
          item.data.isLike = true
        } else {
          item.data.isLike = false
        }
        result.push(item.data)
      }
      that.setData({
        storyList: result,
        loading: false
      })
    })
  },

  formateDate: function(data) {
    let content = data.content
    for (let i in content) {
      content[i].formateData = this.formateTime(content[i].createAt)
      content[i].formateDay = this.formateTimeByDay(content[i].createAt)
    }
    return data
  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/storyDetail/storyDetail?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  onShow: async function() {
    let that = this
    await wx.cloud.callFunction({
      name: 'getAllLike',
      success: res => {
        likes = that.formateToArray(res.result.data)
      }
    })
    that._getData(dbName, 0, [])
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
    if (++currentPage > totalPage) return
    wx.showLoading({
      title: '加载中',
    })

    currentPage = ++currentPage > totalPage ? totalPage : currentPage++
      console.log(currentPage, totalPage)
    this.getList(dbName, currentPage - 1, this.data.storyList)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})