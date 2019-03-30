const express = require('express');
const router = express.Router();
const client = require('../../DbConnection');

var body = {};
var status = {};

//get all user
router.get('/', (req, res, next) => {
    let sql = 'SELECT a."Id", "UserName", "Password", ' +
        'p."FirstName", p."LastName", p."Email", p."Birthday", g."Name" as "Gender", ' +
        'ci."Name" as "City", co."Name" as "Country", p."Avatar" ' +
        'FROM "Account" a ' +
        'JOIN "Profile" p ON (a."Id" = p."Account_Id") ' +
        'JOIN "Gender" g ON (p."Gender" = g."Id") ' +
        'JOIN "City" ci ON (p."Address" = ci."Id") ' +
        'JOIN "Country" co ON (ci."Country_code" = co."Code") ';
    client.query(sql, (err, result) => {
        if ((result.rows == null) || err) {
            status.code = 600,
                status.message = 'Accounts are null'
        } else {
            status.code = 200,
                status.message = 'Success'
        }
        body.status = status;
        body.account = result.rows;
        res.status(status.code).send(body);
    })
});

router.post('/login', (req, res, next) => {
    login(req, res);
});


router.post("/signup", (req, res, next) => {
    insertAccount(req, res);
});

function login(req, res) {
    const query = {
        text: 'SELECT a."Id", "UserName", "Password", ' +
            'p."FirstName", p."LastName", p."Email", p."Birthday", g."Name" as "Gender", ' +
            'ci."Name" as "City", co."Name" as "Country", p."Avatar" ' +
            'FROM "Account" a ' +
            'FULL OUTER JOIN "Profile" p ON (a."Id" = p."Account_Id") ' +
            'FULL OUTER JOIN "Gender" g ON (p."Gender" = g."Id") ' +
            'FULL OUTER JOIN "City" ci ON (p."Address" = ci."Id") ' +
            'FULL OUTER JOIN "Country" co ON (ci."Country_code" = co."Code") ' +
            'WHERE a."UserName"=$1 AND a."Password"=$2',
        values: [req.body.UserName, req.body.Password],
    }

    client.query(query, (err, result) => {
        if ((result.rows[0] == null) || err) {
            status.code = 600,
                status.message = 'UserName or Password is incorrect!'
        } else {
            status.code = 200,
                status.message = 'Success'
        }
        body.status = status;
        body.account = result.rows[0];
        res.status(status.code).send(body);
    })
}

function insertAccount(req, res) {
    const query = {
        text: 'INSERT INTO "Account" ("UserName", "Password") VALUES ($1, $2) RETURNING *;',
        values: [req.body.UserName, req.body.Password],
    }
    client.query(query, (err, result) => {
        if (err) {
            console.log(err.detail);
            status.code = 603;
            status.message = err.detail;
            body.status = status;
            res.status(body.status.code).send(body);
        } else {
            insertProfile(parseInt(result.rows[0].Id), res);
        }
    });
}

function insertProfile(accountId, res) {
    query = {
        text: 'INSERT INTO "Profile" ("Account_Id") VALUES ($1) RETURNING *;',
        values: [accountId]
    }
    client.query(query, (err, result) => {
        if (err) {
            console.log(err.detail);
            status.code = 604;
            status.message = err.detail;
            body.status = status;
            res.status(body.status.code).send(body);
        } else {
            status.code = 200;
            status.message = "Success";
            body.status = status;
            body.profile = result.rows[0];
            res.status(body.status.code).send(body);
        }
    });
}
module.exports = router;