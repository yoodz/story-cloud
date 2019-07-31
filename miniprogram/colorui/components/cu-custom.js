const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true,
    showModal: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      console.log(getCurrentPages())
      const pageInfo = getCurrentPages()
      if (pageInfo[0].route === "pages/storyDetail/storyDetail") {
        wx.reLaunch({
          url: '/pages/storyList/storyList',
        })
      } else if (pageInfo.length === 2 && pageInfo[1].route === "pages/startCommon/startCommon") {
        wx.reLaunch({
          url: '/pages/mine/mine',
        })
      } else {
        wx.navigateBack({
          delta: 1
        });
      }

    },
    toHome() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})