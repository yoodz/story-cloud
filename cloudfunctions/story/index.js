// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let { articalId, content } = event
  const wxContext = cloud.getWXContext()
  const _ = db.command
  try {
    return await db.collection('story').doc(articalId).update({
      data: {
        content: _.push(content)
      },
    })
  } catch (e) {
    console.error(e)
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}