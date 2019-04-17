// pages/storyList/storyList.js
const db = wx.cloud.database()

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
  // formSubmit (e) {
  //   console.log(e)
  //   let params = {
  //     title: e.detail.value.title,
  //     content: e.detail.value.content,
  //     comment: e.detail.value.comment
  //   }
  //   db.collection('story').add({
  //     // data 字段表示需新增的 JSON 数据
  //     data: params,
  //     success(res) {
  //       // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
  //       console.log(res)
  //     }
  //   })

  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that =  this
    db.collection('story').where({})
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