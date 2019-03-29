const express = require('express');
const router = express.Router();
const client = require('../../DbConnection');

var body = {};
var status = {};

//handeling the get request
router.get('/', (req, res, next) => {
    let sql = 'SELECT * FROM public."Account"';
    client.query(sql, (err, result) => {
        if (result.rows == null) {
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
    const query = {
        text: 'SELECT * FROM public."Account" WHERE "UserName"=$1 AND "Password"=$2;',
        values: [req.body.UserName, req.body.Password],
      }
    console.log(query);
    
    client.query(query, (err, result) => {
        if (result.rows[0] == null) {
            status.code = 600,
            status.message = 'Accounts are null'
        } else {
            status.code = 200,
            status.message = 'Success'
        }
        body.status = status;
        body.account = result.rows[0];
        res.status(status.code).send(body);
    })
});

// router.put('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'Handling PUT request to /products'
//     });
// });

// router.get('/:productId', (req, res, next) => {
//     var id = req.params.productId
//     if (id === 'special') {
//         res.status(200).json({
//             message: 'You discovered the special ID'
//         });
//     } else {
//         res.status(200).json({
//             message: 'You passed an ID'
//         });
//     }
// });

module.exports = router;