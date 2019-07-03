// pages/storyList/storyList.js
// const db = wx.cloud.database()
const dbUtil = require('../../utils/db')
const db = dbUtil.getDbInstance()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storyList: [],
    currentTab: 0,
    winWidth: 0,
    winHeight: 0
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
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
      }})
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
        let that = this
        db.collection('story').where({
          deleted: false
        })
          .get({
            success(res) {
              // res.data 是包含以上定义的两条记录的数组
              console.log(res.data)
              that.setData({
                storyList: res.data
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

      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function () {

      }
})