var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')

var imagePath = "./public/img/"

module.exports.controller = (app, io, socket_list) => {

    const msg_success = "Success"
    const msg_fail = "Fail"

    app.post('/api/test', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        res.json({
            'status': '1',
            'message': msg_success,
            'payload': {
                'data': 'code for any'
            }
        })

    })

    app.post('/api/app/login', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        helper.CheckParameterValid(res, reqObj, ['user_type', 'mobile_code', 'mobile', 'os_type', `push_token`, "socket_id"], () => {

            db.query(
                'SELECT `user_id`, `status`, `user_type` FROM `user_detail` WHERE `mobile` = ? AND `mobile_code` = ? ', [
                reqObj.mobile, reqObj.mobile_code
            ], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }

                if (result.length > 0) {
                    //Sign in

                    if (result[0].status == 1) {
                        //Block User
                        res.json({
                            'status': "2",
                            "message": "Blocked By Admin, Please contact admin"
                        })
                    } else {
                        var auth_token = helper.createRequestToken();
                        db.query('UPDATE `user_detail` SET `auth_token` = ?, `modify_date` = NOW() WHERE `mobile` = ? AND `mobile_code` = ? AND `status` = 1 ', [auth_token, reqObj.mobile, reqObj.mobile_code], (err, result) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return;
                            }

                            if (result.affectRows > 0) {
                                getUserDetailUserId(result[0].user_id, (isGet, uObj) => {
                                    res.json({
                                        'status': '1',
                                        'payload': uObj
                                    })
                                })
                            }

                        })
                    }

                } else {
                    //Sign Up
                    var auth_token = helper.createRequestToken();
                    db.query('INSERT INTO `user_detail`(`mobile_code`, `mobile`, `os_type`, `push_token`, `auth_token`, `is_verify`, `user_type`, `status`) VALUES (?,?,?, ?,?,?, ?,?)', [reqObj.mobile_code, reqObj.mobile, reqObj.os_type, reqObj.push_token, auth_token, 1, reqObj.user_type, 1], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }

                        if (result) {
                            getUserDetailUserId(result.insertId, (isGet, uObj) => {
                                res.json({
                                    'status': '1',
                                    'payload': uObj
                                })
                            })
                        } else {
                            res.json({
                                'status': "0",
                                "message": msg_fail
                            })
                        }

                    })
                }

            }
            )
        })
    })

    function getUserDetailUserId(user_id, callback) {
        db.query('SELECT `user_id`, `first_name`, `middel_name`, `last_name`, `mobile_code`, `mobile`, `image`, `email`, `os_type`,  `auth_token`,  `user_type`, `status` FROM `user_detail` WHERE `user_id` = ?', [user_id], (err, result) => {

            if (err) {
                helper.ThrowHtmlError(err);
                return;
            }

            if (result.length > 0) {
                return callback(true, result[0]);
            } else {
                return callback(false, {})
            }
        })
    }


    app.post('/api/admin/login', (req, res) => {
        helper.Dlog(req.body);
        var reqObj  = req.body;

        helper.CheckParameterValid(res, reqObj, ["email", "password", "os_type", "push_token", "socket_id" ], () =>{

            var auth_token = helper.createRequestToken();
            db.query('UPDATE `user_detail` SET `auth_token` = ?, `modify_date` = ? WHERE `email` = ? AND `password` =? AND `user_type` = ? ;' +
                "SELECT `user_id` FROM `user_detail` WHERE `email` = ? AND `password` =? AND `user_type` = ?", [auth_token, reqObj.email, reqObj.password, 5, reqObj.email, reqObj.password, 5], (err, result) => {

                    if(err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if(result[0].affectRows > 0) {
                        getUserDetailUserId(result[1][0].user_id, (isGet, uObj) => {
                            res.json({
                                'status':'1',
                                'payload': uObj,
                                'message':'login successfully'
                            })
                        })
                    }else{
                        res.json({
                            'status':'0',
                            'message':'invalid email address & password'
                        })
                    }
            })

        })
    } )

}