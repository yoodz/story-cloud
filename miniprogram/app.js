//app.js

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res)
        this.globalData.openId = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    this.globalData = {
    }

    wx.getSystemInfo({
      success: res => {
        this.globalData.windowWidth = res.windowWidth
        this.globalData.windowHeight = res.windowHeight
      }
    })

    wx.getUserInfo({
      success: res => {
        this.globalData.avatarUrl = res.userInfo.avatarUrl
        this.globalData.nickName = res.userInfo.nickName
      }
    })
    // wx.login({
    //   success(res) {
    //     console.log(res.code)
    //   }
    // })
  }
})
