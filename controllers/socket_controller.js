var helper = require('./../helpers/helpers')
var db = require('./../helpers/db_helpers')

module.exports.controller = (app, io, socket_list) => {

    const msg_success = "success"
    const msg_fail = "fail"

    io.on('connection', (client) => {

        client.on('UpdateSocket', (data) => {
            helper.Dlog('UpdateSocket: ', data);
            var jsonObj = JSON.parse(data);

            helper.CheckParameterValidSocket(client, "UpdateSocket",  jsonObj, ["user_id"], () => {

                socket_list['us_'+jsonObj.user_id] = {
                    'socket_id': client.id
                };

                helper.Dlog(socket_list);

                client.emit('UpdateSocket', {
                    'status':'1',
                    'message':msg_success
                })

            } )

        })

    } )
}