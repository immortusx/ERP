
const express = require('express');
const async = require('async');

const { tokenCheck } = require("../Auth/TokenCheck");
const { checkUserPermission } = require("../Auth/userPermission");

const { db } = require("../Database/dbConfig");

const router = express.Router();

router.get('/get-features', tokenCheck, checkUserPermission('roles'), async (req, res) => {
    console.log('>>>>>get-features');
    const urlNew = `SELECT * FROM features; `
    await db.query(urlNew, (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: result })
            res.send({ isSuccess: true, result: result })
        }
    })

})
router.post('/edit-role', tokenCheck, async (req, res) => {
    console.log('>>>>>edit-role');
    const { description, features, id } = req.body
    const urlNew = `UPDATE roles SET description = '${description}' where id = '${id}'`

    await db.query(urlNew, async (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            const newSqlQuery = `delete FROM role_features where role_id = '${id}'`
            db.query(newSqlQuery, (err, newSqlResult) => {
                if (err) {
                    console.log({ isSuccess: false, result: err })
                    res.send({ isSuccess: false, result: 'error' })
                } else {
                    async.forEachOf(features, (item, key, callback) => {
                        const sqlQuery = `INSERT INTO role_features(role_id, feature_id) VALUES('${id}', '${item}')`;
                        db.query(sqlQuery, (err, resultNew) => {
                            if (err) {
                                console.log({ isSuccess: true, result: err })
                                res.send({ isSuccess: true, result: 'error' })
                            }
                        })
                        callback();
                    }, (err) => {
                        if (err) {
                            console.log({ isSuccess: true, result: err })
                            res.send({ isSuccess: true, result: 'error' })
                        } else {
                            console.log({ isSuccess: true, result: 'success' })
                            res.send({ isSuccess: true, result: 'success' })
                        }
                    })
                }
            })

        }
    })
})
router.post('/add-role', tokenCheck, checkUserPermission('add-role'), async (req, res) => {
    console.log('>>>>>add-role');
    const { roleName, roleDescription, checkedFeatures } = req.body
    const urlNew = `INSERT INTO roles(role, active, description) VALUES('${roleName}', 1, '${roleDescription}'); `
    await db.query(urlNew, async (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: 'error' })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            if (result.insertId) {
                async.forEachOf(checkedFeatures, (item, key, callback) => {
                    const sqlQuery = `INSERT INTO role_features(role_id, feature_id) VALUES('${result.insertId}', '${item}')`;
                    db.query(sqlQuery, (err, resultNew) => {
                        if (err) {
                            console.log({ isSuccess: true, result: err })
                            res.send({ isSuccess: true, result: 'error' })
                        }
                    })
                    callback();
                }, (err) => {
                    if (err) {
                        console.log({ isSuccess: true, result: err })
                        res.send({ isSuccess: true, result: 'error' })
                    } else {
                        console.log({ isSuccess: true, result: 'success' })
                        res.send({ isSuccess: true, result: 'success' })
                    }
                })

            }
        }
    })
})
router.post('/get-roles-features', tokenCheck, async (req, res) => {
    console.log('>>>>>get-roles-features', req.body.roleId);


    const url = `select t.* from roles as f inner join role_features as s on s.role_id = f.id inner join features as t on t.id = s.feature_id where f.id = ${req.body.roleId} `
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})
router.get('/get-roles-to-edit', tokenCheck, async (req, res) => {
    console.log('>>>>>get-roles');

    const url = `SELECT * from roles where id != 1`
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})

module.exports = router;