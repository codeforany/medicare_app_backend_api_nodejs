var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')
var multiparty = require('multiparty')
var fs = require('fs');


var imagePath = "./public/img/"

module.exports.controller = (app, io, socket_list) => {
    const msg_success = "Success"
    const msg_fail = "Fail"

    app.post('/api/app/chat_user_list', (req, res) => {
        helper.Dlog(req.body);
       var reqObj =  req.body;
        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['socket_id'], () => {
                socket_list["us_" + uObj.user_id] = {
                    'socket_id': reqObj.socket_id
                }

                db.query("SELECT `ud`.`user_id`, `ud`.`first_name`, `ud`.`middel_name`, `ud`.`last_name`, (CASE WHEN `ud`.`image` != '' THEN CONCAT('" + helper.ImagePath() + "', `ud`.`image`) ELSE '' END ) AS `image`, IFNULL(`cm`.`message`, '') AS `message`, IFNULL(`cm`.`message_type`, 1) AS `message_type`, IFNULL(`cm`.`created_date`, NOW()) AS `created_date`, IFNULL(`bc`.`base_count`, 0) AS `base_count` FROM `user_detail` AS `ud` " +
                
                "INNER JOIN (" +

                'SELECT `created_date`, `message_type`, `message`, (CASE WHEN `sender_id` = ? THEN `receiver_id` ELSE `sender_id` END ) AS `user_id` FROM `chat_message_detail` WHERE `chat_id` IN ( SELECT MAX(`chat_id`) FROM `chat_message_detail` WHERE `status` < "3" AND (`sender_id` = ? OR (`receiver_id` = ? AND `status`  > -1) ) GROUP BY (CASE WHEN `sender_id` = ? THEN `receiver_id` ELSE `sender_id` END ) ) '+


                ") AS `cm` ON `cm`.`user_id` = `ud`.`user_id` " +

                "LEFT JOIN ( SELECT count(`chat_id`) AS `base_count`, `sender_id` AS `user_id` FROM `chat_message_detail` WHERE `receiver_id` = ? AND `status` = 0 GROUP BY `sender_id` ) AS `bc` ON `cm`.`user_id` = `bc`.`user_id` " +
                'WHERE `ud`.`status` = 1 ORDER BY `cm`.`created_date` DESC'
                , [

                    uObj.user_id, uObj.user_id, uObj.user_id, uObj.user_id, uObj.user_id

                ], (err, result) => {

                    if(err) {
                        helper.ThrowHtmlError(err,res);
                        return
                    }

                    helper.Dlog(result);

                    res.json({
                        'status':'1',
                        'payload': result
                    })

                } )

            } )


        })

    } )

    
    app.post('/api/app/chat_connect', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['user_id', "socket_id"], () => {
                socket_list["us_" + uObj.user_id] = {
                    'socket_id': reqObj.socket_id
                }

                db.query('SELECT `created_date` FROM `chat_date` WHERE `user_id` = ? AND `receiver_id` = ? ', [uObj.user_id, reqObj.user_id], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res)
                        return
                    }

                    var deleteTime = "2024-10-20 00:00:00"
                    if (result.length > 0) {
                        deleteTime = helper.serverMySQLDateTime(result[0].created_date, 'YYYY-MM-DD HH:mm:ss');

                    }

                    db.query("SELECT `user_id`, `first_name`, `middel_name`, `last_name`, (CASE WHEN `image` != '' THEN CONCAT('" + helper.ImagePath() + "', `image`) ELSE '' END ) AS `image`, '' AS `message`, 1 AS `message_type` FROM `user_detail` WHERE `user_id` = ? ;" +
                        "SELECT `chat_id`, `sender_id`, `receiver_id`, `message`, `message_type`, `created_date` FROM `chat_message_detail` WHERE `created_date` > ? AND ( 	(`sender_id` = ? AND `receiver_id` = ?) OR (`sender_id` = ? AND `receiver_id` = ?)) AND `status` < ", [reqObj.user_id, deleteTime, reqObj.user_id, uObj.user_id, uObj.user_id, reqObj.user_id, 3], (err, result) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res)
                                return
                            }

                            if(result[0].length > 0) {

                                db.query('UPDATE `chat_message_detail` SET `status`=?, `modify_date`=NOW() WHERE `sender_id` = ? AND `receiver_id` AND `status` = ?', [ 2 , 0 ], (err, uResult) => {
                                    if (err) {
                                        helper.ThrowHtmlError(err, res)
                                        return
                                    }

                                    if(uResult.affectRows > 0) {
                                        helper.Dlog('User base reset success')
                                    }else{
                                        helper.Dlog('User base reset fail')
                                    }

                                } )

                                res.json({
                                    'status':'1',
                                    'payload': {
                                        'user_info': result[0][0],
                                        'message_list': result[1]
                                    }
                                })


                            }else{
                                result.json({
                                    'status':'0',
                                    'message':'invalid user'
                                })
                            }


                        }
                    )
                })

            })
        })

    })

    app.post('/api/app/chat_message', (req, res) => {

        var form = new multiparty.Form();

        form.parse(req, (err, reqObj, files) => {

            checkAccessToken(req.headers, res, (uObj) => {
                helper.CheckParameterValid(res, reqObj, ['receiver_id', 'message', 'message_type', 'socket_id'], () => {

                    socket_list["us_" + uObj.user_id] = {
                        'socket_id': reqObj.socket_id
                    }

                    var createdDate = helper.serverYYYYMMDDHHmmss()
                    var message = reqObj.message[0];

                    if (reqObj.message_type[0] == "2") {
                        if (files.image) {
                            var fileExtension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexof(".") + 1);

                            var fileName = "chat/" + helper.fileNameGenerate(fileExtension);
                            var saveFilePath = imagePath + fileName;
                            message = fileName
                            fs.rename(files.image[0].path, saveFilePath, (err) => {
                                if (err) {
                                    helper.ThrowHtmlError(err);
                                    return
                                }
                            })
                        } else {
                            res.json({
                                'status': '0',
                                'message': 'missing file upload'
                            })
                            return;
                        }
                    }

                    db.query('INSERT INTO `chat_message_detail`( `sender_id`, `receiver_id`, `message`, `message_type`) VALUES (?,?,?, ?);' +
                        "SELECT `user_id`, `first_name`, `middel_name`, `last_name`, (CASE WHEN `image` != '' THEN CONCAT('" + helper.ImagePath() + "', `image`) ELSE '' END ) AS `image`, '' AS `message`, 1 AS `message_type` FROM `user_detail` WHERE `user_id` = ? ;",
                        [
                            uObj.user_id, reqObj.receiver_id[0], message, reqObj.message_type[0],
                            uObj.user_id
                        ],
                        (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res)
                                return
                            }

                            if (result[0]) {

                                var dataMessage = {
                                    'chat_id': result[0].insertId,
                                    'sender_id': uObj.user_id,
                                    'receiver_id': parseInt(reqObj.receiver_id[0]),
                                    'message_type': parseInt(reqObj.message_type[0]),
                                    'message': message,
                                    'created_date': helper.isoDate(createdDate)
                                }

                                res.json({
                                    'status': '1',
                                    'payload': dataMessage,
                                    'message': msg_success
                                })

                                var receiverSocket = socket_list['us_' + reqObj.receiver_id[0]];
                                if (receiverSocket && io.sockets.sockets.get(receiverSocket.socket_id)) {
                                    io.sockets.sockets.get(receiverSocket.socket_id).emit('chat_message', {
                                        'status': '1',
                                        'payload': [dataMessage],
                                        'user_info': result[1].length > 0 ? result[1][0] : {}
                                    })

                                    helper.Dlog('receiverSocket emit success');
                                } else {
                                    helper.Dlog('receiverSocket client not found');
                                }

                            } else {
                                res.json({
                                    'status': '0',
                                    'message': msg_fail
                                })
                            }

                        }
                    )

                })
            })

        })

    })

    app.post('/api/app/chat_clear_all_message', (req, res) => {
        helper.Dlog(req.body);
        var reqObj =  req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['receiver_id'], ()=> {

                db.query('UPDATE `chat_delete` SET `created_date` = NOW() WHERE `user_id` = ? AND `receiver_id` = ? ', [
                    uObj.user_id, reqObj.receiver_id
                ], (err,result) => {

                    if(err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if(result.affectRows > 0) {
                        res.json({
                            'status':'1',
                            'message': 'chat clear all message done'
                        })
                    }else{

                        db.query('INSERT INTO `chat_delete` (`user_id`, `receiver_id`) VALUES (?,?) ', [uObj.user_id, reqObj.receiver_id], (err, result) => {

                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }


                            if(result) {
                                res.json({
                                    'status': '1',
                                    'message': 'chat clear all message done'
                                })
                            }else{
                                res.json({
                                    'status': '0',
                                    'message': 'chat clear all message fail'
                                })
                            }

                        } )

                    }

                } )

            })
        }  )

    } )

}

function checkAccessToken(headerObj, res, callback, requireType = "") {

    helper.Dlog(headerObj);
    helper.CheckParameterValid(res, headerObj, ["access_token"], () => {

        db.query('SELECT `user_id`, `first_name`, `middel_name`, `last_name`, `mobile_code`, `mobile`, `image`, `email`, `os_type`, `auth_token`,  `user_type`, `status` FROM `user_detail` WHERE `auth_token` = ?', [headerObj.access_token], (err, result) => {

            if (err) {
                helper.ThrowHtmlError(err);
                return;
            }

            if (result.length > 0) {
                if (requireType != "") {
                    if (requireType == result[0].user_type) {
                        return callback(result[0]);
                    } else {
                        res.json({
                            'status': '0',
                            'message': 'access denied. Unauthorized user access.',
                            'code': '404'
                        })
                    }
                } else {
                    return callback(result[0]);
                }

            } else {
                res.json({
                    'status': '0',
                    'message': 'access denied. Unauthorized user access.',
                    'code': '404'
                })
            }
        })

    })


}