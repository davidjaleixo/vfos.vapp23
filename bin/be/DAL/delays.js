var storage = require('./storageRequester');

module.exports = {
    getDelaysByProject: function (projectid, cb) {
        storage('GET', "/tables/delays_on_tasks/rows?filter=idprojects=" + projectid, {}, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    json = JSON.parse(response.body);
                    cb(false, json.list_of_rows);
                } else {
                    json = JSON.parse(response.body);
                    cb(false, json.message);
                }
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getById: function (delayId, cb) {
        storage('GET', "/tables/delays_on_tasks/rows?filter=iddelay=" + delayId, {}, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    json = JSON.parse(response.body);
                    cb(false, json.list_of_rows[0]);
                } else {
                    json = JSON.parse(response.body);
                    cb(false, json.message);
                }
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getDelaysByTaskId: function (taskId, cb) {
        storage('GET', "/tables/delays_on_tasks/rows?filter=idtask=" + taskId, {}, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    json = JSON.parse(response.body);
                    cb(false, json.list_of_rows);
                } else {
                    json = JSON.parse(response.body);
                    cb(false, json.message);
                }
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (description, taskid, createdby, impactlevel, impactdays, cb) {

        storage('POST', "/tables/delays/rows", [{ description: description, idtask: taskid, impactlevel, impactlevel, createdby, createdby, impactdays: impactdays }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Delay is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (delayId, cb) {
        storage('DELETE', "/tables/delays/rows?filter=iddelay=" + delayId, {}, function (error, response, body) {
            if (!error) {
                cb(false, { message: "Delay is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    update: function (delayId, status, cb) {
        storage('PATCH', "/tables/delays/rows?filter=iddelay=" + delayId, {accepted: status}, function (error, response, body) {
            if (!error) {
                cb(false, { message: "Delay is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}