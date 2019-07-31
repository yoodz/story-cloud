const dbUtil = require('./db')
const app = getApp()
const regeneratorRuntime = require("./runtime")
const db = dbUtil.getDbInstance()

function randomString() {
  return Math.random().toString(36).substr(2) + new Date().getTime()
}

function checkIsOauth() {
  return new Promise((resolve) => {
    wx.getSetting({
      success: res => {
        resolve(!res.authSetting['scope.userInfo'])
      }
    })
  })
}

async function getOpenId() {
  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res)
        resolve(app.globalData.openId)
        app.globalData.openId = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  })
}

function getUserInfo() {
  return new Promise((resolve) => {
    if (!wx.getStorageSync('userInfo')) {
      wx.getUserInfo({
        success: res => {
          wx.setStorage({
            key: 'userInfo',
            data: res.userInfo,
          })
          resolve(res.userInfo)
        }
      })
    } else {
      resolve(wx.getStorageSync('userInfo'))
    }
  })
}

function addFormId(fromId) {
  db.collection('formId').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      formId: fromId,
      createAt: new Date().getTime(),
      openId: app.globalData.openId,
      deleted: false
    }
  })
}

async function saveUserInfo(e) {
  console.log(e.detail.userInfo)
  let userInfo = e.detail.userInfo
  let that = this
  let userData = {
    avatarUrl: userInfo.avatarUrl,
    gender: userInfo.gender,
    nickName: userInfo.nickName,
    province: userInfo.province,
    country: userInfo.country
  }

  wx.setStorage({
    key: 'userInfo',
    data: userData
  })

  app.globalData.avatarUrl = userData.avatarUrl
  app.globalData.nickName = userData.nickName

  if (e.detail.userInfo) {
    let userFromDb = await db.collection('user').where({ _openid: app.globalData.openId }).get()
    console.log(userFromDb.data.length)
    if (userFromDb.data.length === 0) {
      db.collection('user').add({
        data: userData,
        success(res) {
          return res
        }
      })
    } else {
      db.collection('user').doc(userFromDb.data[0]._id).update({
        data: userData,
        success(res) {
          return res
        }
      })
    }
  }
}

module.exports = {
  randomString,
  checkIsOauth,
  getUserInfo,
  saveUserInfo,
  addFormId,
  getOpenId
};