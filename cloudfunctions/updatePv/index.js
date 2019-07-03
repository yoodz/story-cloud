// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('story').doc(event.articalId).update({
      data: {
        view: _.inc(1)
      }
    })
  } catch (e) {
    console.error(e)
  }
}