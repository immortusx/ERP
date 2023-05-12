const { verifyToken, getToken } = require('./Jwt');
const { db } = require("../Database/dbConfig");


async function tokenCheck(req, res, next) {
    let currentToken = req.headers.token
    const isAuthId = await verifyToken(currentToken)
    if (isAuthId && isAuthId.id) {

        const url = `select CONCAT('[',GROUP_CONCAT(role_id),']') as roles_array  from  users as f inner join dealer_department_user s on s.user_id = f.id  where f.id = ${isAuthId.id}`
        console.log('url', url);
        await db.query(url, async (err, result) => {
            const tempAr = result[0].roles_array
            req.myData = {
                userId: isAuthId.id,
                dealerId: isAuthId.dealerId
            }
            if (tempAr.includes(1)) {
                req.myData.isSuperAdmin = true
            } else {
                req.myData.isSuperAdmin = false
            }
            return next()
        })
    } else {
        console.log({ isSuccess: false, result: 'auth failed' })
        return res.send({ isSuccess: false, result: 'auth failed' })
    }
}
module.exports = { tokenCheck }