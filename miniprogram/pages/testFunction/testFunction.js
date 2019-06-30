// pages/testFunction/testFunction.js
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const db = wx.cloud.database()
    // db.collection('test').add({
    //   data: {
    //     count: 1
    //   },
    //   success: res => {
    //     // 在返回结果中会包含新创建的记录的 _id
    //     wx.showToast({
    //       title: '新增记录成功',
    //     })
    //     console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    //   }
    // }
    // )
    //6dfb26295d18cc8a03dfb3ea0eae78fd

    // db.collection('test').doc('6dfb26295d18cc8a03dfb3ea0eae78fd').update({
    //   data: {
    //     count: 5
    //   },
    //   success: res => {
    //     wx.showToast({
    //       title: '更新记录成功',
    //     })
    //   },
    //   fail: err => {
    //     icon: 'none',
    //       console.error('[数据库] [更新记录] 失败：', err)
    //   }
    // })

    db.collection('story').doc('9c4488c75cd50c590f32ff0d3d94fcb3').update({
      data: {
        like: 3
      },
      success: res => {
          wx.showToast({
            title: '留言成功',
            duration: 2000,
            mask: true
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