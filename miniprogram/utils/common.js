const dbUtil = require('./db')
const app = getApp()

function randomString () {
  return Math.random().toString(36).substr(2) + new Date().getTime()
}

function checkIsOauth () {
  return new Promise((resolve) => {
    wx.getSetting({
      success: res => {
        resolve(!res.authSetting['scope.userInfo'])
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

async function saveUserInfo (e) {
  const db = dbUtil.getDbInstance()
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

  if (e.detail.userInfo) {
    let userFromDb = await db.collection('user').where({}).get()
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
  saveUserInfo
}