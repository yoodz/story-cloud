// pages/addStory/addStory.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formSubmit(e) {
    console.log(e)
    let content = {
      createAt: new Date().getTime(),
      content: e.detail.value.content
    }
    let params = {
      title: e.detail.value.title,
      content: [content],
      comment: e.detail.value.comment
    }
    console.log(params)
    db.collection('story').add({
      // data 字段表示需新增的 JSON 数据
      data: params,
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        let id = res._id
        wx.redirectTo({
          url: '/pages/storyDetail/storyDetail?id=' + id,
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