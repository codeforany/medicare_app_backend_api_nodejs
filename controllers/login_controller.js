var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')
var multiparty = require('multiparty')
var fs = require('fs');


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
        var reqObj = req.body;

        helper.CheckParameterValid(res, reqObj, ["email", "password", "os_type", "push_token", "socket_id"], () => {

            var auth_token = helper.createRequestToken();
            db.query('UPDATE `user_detail` SET `auth_token` = ?, `modify_date` = ? WHERE `email` = ? AND `password` =? AND `user_type` = ? ;' +
                "SELECT `user_id` FROM `user_detail` WHERE `email` = ? AND `password` =? AND `user_type` = ?", [auth_token, reqObj.email, reqObj.password, 5, reqObj.email, reqObj.password, 5], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result[0].affectRows > 0) {
                        getUserDetailUserId(result[1][0].user_id, (isGet, uObj) => {
                            res.json({
                                'status': '1',
                                'payload': uObj,
                                'message': 'login successfully'
                            })
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': 'invalid email address & password'
                        })
                    }
                })

        })
    })

    app.post('/api/admin/add_city', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['city_name', 'latitude', 'longitude'], () => {

                db.query('INSERT INTO `city_detail` (`city_name`, `latitude`, `longitude`) VALUES (?,?,?)', [reqObj.city_name, reqObj.latitude, reqObj.longitude], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result) {
                        res.json({
                            'status': '1',
                            'message': 'city added successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })

            })

        }, '5')

    })

    app.post('/api/admin/city_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            db.query('SELECT `city_id`, `city_name`, `latitude`, `longitude`, `status`, `created_date` FROM `city_detail` WHERE `status` = ? ', [1], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }
                res.json({
                    'status': '1',
                    'payload': result,
                    'message': msg_success
                })
            })
        }, '5')

    })

    app.post('/api/admin/edit_city', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ["city_id", "city_name", "latitude", "longitude"], () => {

                db.query("UPDATE `city_detail` SET `city_name` = ?, `latitude` = ?, `longitude` = ?, `modify_date` = NOW() " +
                    "WHERE `city_id` = ? AND `status` != 2 ", [reqObj.city_name, reqObj.latitude, reqObj.longitude, reqObj.city_id], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res)
                            return
                        }

                        if (result.affectRows > 0) {
                            res.json({
                                'status': '1',
                                'message': "city updated successfully"
                            })
                        } else {
                            res.json({
                                'status': '0',
                                'message': msg_fail
                            })
                        }

                    })

            })
        }, '5')

    })

    app.post('/api/admin/delete_city', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ["city_id"], () => {
                db.query("UPDATE `city_detail` SET `status` = ?, `modify_date` = NOW() WHERE `city_id` = ? AND `status` != ? ", [
                    2, reqObj.city_id, 2
                ], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectRows > 0) {
                        res.json({
                            'status': '1',
                            'message': "city deleted successfully"
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': msg_fail
                        })
                    }
                })
            })

        }, '5')
    })


    app.post('/api/admin/add_issue', (req, res) => {
        var form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }

            helper.Dlog('------- parameter --------');
            helper.Dlog(reqObj);

            helper.Dlog('------- fils --------');
            helper.Dlog(files);

            checkAccessToken(req.headers, res, (uObj) => {

                helper.CheckParameterValid(res, reqObj, ['issue_name'], () => {

                    helper.CheckParameterValid(res, files, ['image'], () => {

                        var fileExtension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexof(".") + 1);

                        var fileName = "issue/" + helper.fileNameGenerate(fileExtension);
                        var saveFilePath = imagePath + fileName;

                        fs.rename(files.image[0].path, saveFilePath, (err) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }

                            db.query('INSERT INTO `category_detail`( `cat_name`, `image`) VALUES (?,?)', [reqObj.issue_name[0], fileName], (err, result) => {

                                if (err) {
                                    helper.ThrowHtmlError(err, res);
                                    return
                                }

                                if (result) {
                                    res.json({
                                        'status': '1',
                                        'message': 'add new issue successfully',
                                        'payload': {
                                            'cat_id': result.insertId,
                                            'cat_name': reqObj.issue_name[0],
                                            'image': fileName
                                        }
                                    })
                                } else {
                                    res.json({
                                        'status': '0',
                                        'message': 'new issue add fail',

                                    })
                                }

                            })


                        })

                    })

                })


            }, 5)

        })

    })

    app.post('/api/admin/issue_list', (req, res) => {
        helper.Dlog(req.body)

        checkAccessToken(req.headers, res, (uObj) => {

            db.query('SELECT `cat_id`, `cat_name`, `image`, `status`, `created_date` FROM `category_detail` WHERE `status`  != 2', [], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res)
                    return
                }

                res.json({
                    'status': '1',
                    'payload': result
                })

            })

        }, '5')

    })

    app.post('/api/admin/edit_issue', (req, res) => {
        var form = new multiparty.Form()
        form.parse(req, (err, reqObj, files) => {
            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }

            helper.Dlog('------- parameter --------');
            helper.Dlog(reqObj);

            helper.Dlog('------- fils --------');
            helper.Dlog(files);

            checkAccessToken(req.headers, res, (uObj) => {

                helper.CheckParameterValid(res, reqObj, ['cat_id', 'issue_name'], () => {

                    var fileName = ""
                    var updateSetVal = ""

                    if (files.image) {
                        var fileExtension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexof(".") + 1);

                        fileName = "issue/" + helper.fileNameGenerate(fileExtension);
                        var saveFilePath = imagePath + fileName;
                        updateSetVal = ', `image` = "' + fileName + '" ';
                        fs.rename(files.image[0].path, saveFilePath, (err) => {
                            if (err) {
                                helper.ThrowHtmlError(err);
                                return
                            }
                        })
                    }

                    db.query('UPDATE `category_detail` SET `cat_name` = ? ' + updateSetVal + ', `modify_date`= NOW() WHERE `cat_id` = ? AND `status` != ? ', [reqObj.issue_name[0], reqObj.cat_id[0], 2], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (result.affectRows > 0) {
                            res.json({
                                'status': '1',
                                'message': 'issue updated successfully',
                                'payload': {
                                    'image': fileName
                                }
                            })
                        } else {
                            res.json({
                                'status': '0',
                                'message': 'issue update fail'
                            })
                        }

                    })


                })

            }, '5')

        })

    })

    app.post('/api/admin/delete_issue', (req, res) => {

        helper.Dlog(req.body)
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {

            helper.CheckParameterValid(res, reqObj, ['cat_id'], () => {
                db.query('UPDATE `category_detail` SET `status` = ?, `modify_date` = NOW() WHERE `cat_id` = ? AND `status` != ? ', [reqObj.cat_id, 2], (err, result) => {

                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }

                    if (result.affectRows > 0) {
                        res.json({
                            'status': '1',
                            'message': 'issue deleted successfully'
                        })
                    } else {
                        res.json({
                            'status': '0',
                            'message': 'issue delete fail'
                        })
                    }

                })
            })

        }, '5')

    })

    app.post('/api/admin/add_new_ads', (req, res) => {
        var form = new multiparty.Form();

        form.parse(req, (err, reqObj, files) => {

            if (err) {
                helper.ThrowHtmlError(err, res)
                return
            }

            checkAccessToken(req.headers, res, (uObj) => {
                helper.CheckParameterValid(res, reqObj, ['start_date', 'end_date'], () => {
                    helper.checkAccessToken(res, files, ['image'], () => {


                        var fileExtension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexof(".") + 1);

                        var fileName = "ads/" + helper.fileNameGenerate(fileExtension);
                        var saveFilePath = imagePath + fileName;

                        fs.rename(files.image[0].path, saveFilePath, (err) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return
                            }


                            db.query('INSERT INTO `ads_detail`( `image`, `start_date`, `end_date`) VALUES (?,?,?)', [
                                fileName, reqObj.start_date[0], reqObj.end_date[0]
                            ], (err, result) => {
                                if (err) {
                                    helper.ThrowHtmlError(err, res);
                                    return
                                }

                                if (result) {
                                    res.json({
                                        'status': '1',
                                        'message': 'add new ads image successfully',

                                    })
                                } else {
                                    res.json({
                                        'status': '0',
                                        'message': 'new ads add fail',

                                    })
                                }

                            })

                        })

                    })

                })
            }, 5)

        })

    })

    app.post('/api/admin/ads_list', (req, res) => {

        checkAccessToken(req.headers, res, (uObj) => {
            db.query('SELECT `ad_id`, `image`, `start_date`, `end_date`, `status`, `created_date` FROM `ads_detail` WHERE `status` != ?', [2], (err, result) => {

                if (err) {
                    helper.ThrowHtmlError(err, res)
                    return;
                }

                res.json({
                    'status': '1',
                    'payload': result
                })

            })
        }, 5)
    })

    app.post('/api/admin/edit_ads', (req, res) => {
        var form = new multiparty.Form();
        form.parse(req, (err, reqObj, files) => {

            if (err) {
                helper.ThrowHtmlError(err, res);
                return
            }

            checkAccessToken(req / headers, res, (uObj) => {
                helper.CheckParameterValid(res, reqObj, ['ad_id', 'start_date', 'end_date'], () => {


                    var updateSetValue = "";
                    var fileName = "";

                    if (files.image) {
                        var fileExtension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexof(".") + 1);

                        fileName = "ads/" + helper.fileNameGenerate(fileExtension);
                        var saveFilePath = imagePath + fileName;
                        updateSetValue = ", `image` = '" + fileName + "' ";

                        fs.rename(files.image[0].path, saveFilePath, (err) => {
                            if (err) {
                                helper.ThrowHtmlError(err);
                                return
                            }
                        });

                    }

                    db.query('UPDATE `ads_detail` SET `start_date`=?,`end_date`=? ' + updateSetValue + ' ,`modify_date`=NOW() WHERE `ad_id`= ? AND `status` != ?', [reqObj.start_date[0], reqObj.end_date[0], reqObj.ad_id[0], 2], (err, result) => {

                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }


                        if (result.affectRows > 0) {
                            res.json({
                                'status': '1',
                                'payload': {
                                    'image': fileName
                                },
                                'message': 'update ads successfully'
                            })
                        } else {
                            res.json({
                                'status': '0',

                                'message': 'update ads fail'
                            })
                        }

                    })
                })
            }, 5)

        })

    })

    app.post('/api/admin/delete_ads', (req, res) => {

        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (uObj) => {
            helper.CheckParameterValid(res, reqObj, ['ad_id'], ()=> {
                db.query('UPDATE `ads_detail` SET `status` = ?, `modify_date` = NOW() WHERE `ad_id` = ? AND `status` != ? ', [
                    '2', '2'
                ] , (err, result) => {

                    if(err) {
                        helper.ThrowHtmlError(err,res);
                        return
                    }

                    if (result.affectRows > 0) {
                        res.json({
                            'status':'1',
                            'message':'ads deleted successfully'
                        })
                    }else{
                        res.json({
                            'status': '0',
                            'message': 'ads delete fail'
                        })
                    }

                } )
            })
        }, '5')

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