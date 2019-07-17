const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async(event, context) => {
  if (!event.to || !event.title) {
    return
  }
  try {
    const result1 = await db.collection('formId').where({
        openId: event.to,
        deleted: false
      })
      .orderBy('createAt', 'asc')
      .get()
    const result = await cloud.openapi.templateMessage.send({
      touser: event.to, // 通过 getWXContext 获取 OPENID
      page: 'index',
      data: {
        keyword1: {
          value: event.title
        },
        keyword2: {
          value: new Date()
        }
      },
      templateId: '6RTZjHG17xoR0sEMjjICu77MM1t36jRRic9G5TqfNSE',
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