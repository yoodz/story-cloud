const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async(event, context) => {
  if (!event.to || !event.title) {
    return
  }
  const now = new Date();
  const sevenDaysBeforeNow = now - 7 * 24 * 60 * 60 * 1000;
  try {
    const result1 = await db.collection('formId').where({
        openId: event.to,
        deleted: false,
        createAt: _.gt(sevenDaysBeforeNow)
      })
      .orderBy('createAt', 'asc')
      .get()
    if (result1.data.length < 1) {return}
    const result = await cloud.openapi.templateMessage.send({
      touser: event.to, // 通过 getWXContext 获取 OPENID
      page: 'pages/storyDetail/storyDetail?id=' + event.id,
      data: {
        keyword1: {
          value: event.title
        },
        keyword2: {
          value: event.nickName
        },
        keyword3: {
          value: '刚刚'
        }
      },
      templateId: '6RTZjHG17xoR0sEMjjICu98kJLFwac0SzgBdHJ5nRbw',
      formId: result1.data[0].formId,
      emphasisKeyword: 'keyword1.DATA'
    })
    const result2 = await db.collection('formId').where({
        formId: result1.data[0].formId
      })
      .update({
        data: {
          deleted: true
        }
      })
    Promise.all([result1, result, result2])
  } catch (err) {
    throw err
  }
}