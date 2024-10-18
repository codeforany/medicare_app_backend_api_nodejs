var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')

var imagePath = "./public/img/"

module.exports.controller = (app, io, socket_list) => {

    const msg_success = "Success"
    const msg_fail =  "Fail"

    app.post('/api/test', (req, res) => {
        helper.Dlog( req.body );
        var reqObj = req.body;

        res.json({
            'status':'1',
            'message':msg_success,
            'payload': {
                'data':'code for any'
            }
        })

    } )

}