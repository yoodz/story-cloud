// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let inc = 1
  try {
    if (event.like) {
      inc = 1
    } else {
      inc = -1
    }
    await db.collection('story').doc(event.articalId)
      .update({
        data: {
          like: _.inc(inc)
        },
      })

    const result = await db.collection('like').where({
      openId: wxContext.OPENID,
      articalId: event.articalId
    }).get()
    if (result.data.length === 0) {
      await db.collection('like').add({
        data: {
          articalId: event.articalId,
          deleted: false,
          openId: wxContext.OPENID,
          createAt: new Date().getTime()
        }
      })
    } else {
      await db.collection('like').doc(result.data[0]._id)
        .update({
          data: {
            deleted: event.like ? false : true
          }
        })
    }
    return result
  } catch (e) {
    console.error(e)
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    result: result
  }
}