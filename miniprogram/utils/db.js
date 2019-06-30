const app = getApp()

function getDbInstance () {
  if (!app.globalData.hasOwnProperty('db')) {
    app.globalData.db = wx.cloud.database()
  }
  return app.globalData.db
}

module.exports = {
  getDbInstance
};