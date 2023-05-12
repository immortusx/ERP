
const { verifyToken, getToken } = require('./Jwt');
const { db } = require("../Database/dbConfig");

function checkUserPermission(role) {
  return async (req, res, next) => {
    const userId = req.myData.userId
    const dealerId = req.myData.dealerId
    let url = '';
    if (req.myData.isSuperAdmin) {
      url = `SELECT page, index_no, feature  FROM features`; 
    } else {
      url = `SELECT DISTINCT  t.page, t.index_no, t.feature  FROM dealer_department_user f inner join role_features as s on s.role_id = f.role_id inner join features as t on s.feature_id = t.id  where user_id = ${userId} and dealer_id = ${dealerId}`
    }
    let tempAr = [];
    await db.query(url, (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: 'error' });
        return res.send({ isSuccess: false, result: 'error' })
      } else if (result && result.length > 0) {
        result.forEach((i) => {
          tempAr.push(i.feature)
        })
        if (tempAr.includes(role)) {
          next()
        } else {
          console.log({ isSuccess: false, result: 'user have not permissions to access' });
          return res.send({ isSuccess: false, result: 'user have not permissions to access' })
        }
      }
    })
  }
}
module.exports = { checkUserPermission }