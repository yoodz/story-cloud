// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    if (!event.self) {
      const result = await db.collection('commons').where({
        openId: wxContext.OPENID,
        articalId: event.articalId
      }).get()
      if (result.data.length === 0) {
        await db.collection('commons').add({
          data: {
            articalId: event.articalId,
            deleted: false,
            openId: wxContext.OPENID
          }
        })
      }
    }
    return await db.collection('story').doc(event.articalId)
      .update({
        data: {
          content: _.push(event.content)
        },
      })
  } catch (e) {
    console.error(e)
  }
}