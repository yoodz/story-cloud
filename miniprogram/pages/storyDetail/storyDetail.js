// pages/storyDetail/storyDetail.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(options.id)
    let that = this
    db.collection('story').doc(options.id).get({
      success(res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        let formatData = that.formateData(res.data)
        console.log(formatData)
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
    }
    return data
  },

  formateTime: function (timestamp ) {
    let Y, M, D, h, m, s
    let createTime = new Date(timestamp)
    console.log(createTime.getFullYear())
    Y = createTime.getFullYear() + '-';
    console.log(Y)
    M = (createTime.getMonth() + 1 < 10 ? '0' + (createTime.getMonth() + 1) : createTime.getMonth() + 1) + '-';
    D = createTime.getDate() + ' ';
    h = createTime.getHours() + ':';
    m = createTime.getMinutes() + ':';
    s = createTime.getSeconds();
    console.log(Y + M + D + h + m + s);
    return Y + M + D + h + m + s;
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