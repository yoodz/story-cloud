//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    imgUrl: 'http://tmp/wx0824cd9111deab65.o6zAJsxfaSqzTAfSIrCXqYJKIEOM.74y7DI0R4Uygedb8c2da32095792c113b42d433991c0.jpg'
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onShow () {
    // db.collection('story').doc('12016acd5cb495ff00466bd829dcb52d').get({
    //   success(res) {
    //     // res.data 包含该记录的数据
    //     console.log(res.data)
    //   }
    // })

    db.collection('story').where({
      _openid: 'oJFoN0dlcxSeQ6QSQrocLL13TVtU',
      done: false
    })
    .get({
      success(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
      }
    })
  },

  create () {
    db.collection('story').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        description: 'learn cloud database',
        due: new Date('2018-09-01'),
        tags: [
          'cloud',
          'database'
        ],
        // 为待办事项添加一个地理位置（113°E，23°N）
        location: new db.Geo.Point(113, 23),
        done: false
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    wx.cloud.callFunction({
      name: 'story',
      data: {
        articalId: articalId,
        content: content
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        doing = false
        if (res.result.stats.updated === 1) {
          that.setData({
            addContent: ''
          })
          wx.showToast({
            title: '留言成功',
            duration: 2000,
            mask: true
          })
          that._getData(articalId)
        }
      },
      fail: err => {
        console.error('[云函数] [story] 调用失败', err)
      }
    })
    return
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
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
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            console.log(that)
            that.setData({
              imgUrl: app.globalData.imagePath
            })
            // wx.navigateTo({
            //   url: '../storageConsole/storageConsole'
            // })
            console.log('success')

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

})
