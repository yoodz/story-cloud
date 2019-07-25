// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const Max_limit = 100
  const countResult = await db.collection('like').where({deleted: false}).count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / Max_limit)

  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('like').where({ deleted: false }).skip(i * Max_limit).limit(Max_limit).get()
    tasks.push(promise)
  }

  return ((await Promise.all(tasks)).reduce((acc, cur) => {
    data: acc.data.concat(cur.data)
  }))
}