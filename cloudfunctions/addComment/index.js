// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
console.log(12)

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.articalId)
  try {
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