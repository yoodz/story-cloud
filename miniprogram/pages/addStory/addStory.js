const common = require('../../utils/common')
const dbUtil = require('../../utils/db')
const regeneratorRuntime = require("../../utils/runtime")
const db = dbUtil.getDbInstance()
const app = getApp()
let doning = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    needOauth: false,
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  viewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: [app.globalData.imagePath]
    });
  },

  onGetUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      common.saveUserInfo(e)
      this.setData({
        needOauth: false
      })
    }
  },

  doUpload: function () {
    let that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        let randomFileName = Math.random().toString(36).substr(2) + new Date().getTime()
        // 上传图片
        const cloudPath = randomFileName + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            console.log(app.globalData.imagePath)
            that.setData({
              imgUrl: app.globalData.fileID
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            console.log('complete')
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  DelImg(e) {
    wx.showModal({
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '是的',
      success: res => {
        if (res.confirm) {
          this.setData({
            imgUrl: ''
          })
        }
      }
    })
  },

  async formSubmit(e) {
    const fromId = e.detail.formId
    common.addFormId(fromId)
    if (doning) {
      return
    }
    doning = true
    let content = {
      createAt: new Date().getTime(),
      content: e.detail.value.content,
      deleted: false,
      openId: app.globalData.openId,
      avatarUrl: app.globalData.avatarUrl,
      nickName: app.globalData.nickName
    }
    if (e.detail.value.title === '' || e.detail.value.content === '' || this.data.imgUrl=== '') {
      wx.showToast({
        icon: 'none',
        title: '请先输入完成，再点击提交',
      })
      doning = false
      return
    }
    let params = {
      title: e.detail.value.title,
      content: [content],
      comment: e.detail.value.comment,
      imgUrl: this.data.imgUrl,
      view: 0,
      like: 0,
      deleted: false,
      createAt: new Date().getTime()
    }
    console.log(params)
    db.collection('story').add({
      // data 字段表示需新增的 JSON 数据
      data: params,
      success(res) {
        doning = false
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
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
  onShow: async function () {
    if (new Date().getTime() > 1564761600000) {
      this.setData({hidden: false})
    }
    let needOauth = await common.checkIsOauth()
    this.setData({
      needOauth
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