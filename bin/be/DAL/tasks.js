var storage = require('./storageRequester');

module.exports = {

    getById: function (taskId, cb) {
        storage('GET', "/tables/userproject_on_tasks/rows?filter=idtask=" + "'" + taskId + "'", {}, function (error, response, body) {
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
    getTasksByProjectId: function (projectId, cb) {
        storage('GET', "/tables/userproject_on_tasks/rows?filter=idprojects=" + projectId, {}, function (error, response, body) {
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
    create: function (name, startDate, endDate, open, projectId, createdBy, place, cb) {
        let now = new Date().toUTCString();

        let openStatus = now >= endDate ? false : true;
        storage('POST', "/tables/tasks/rows", [{ name: name, sdate: startDate, edate: endDate, open: openStatus, rescheduled: false, place: 0, idprojects: projectId, createdby: createdBy, place: place }], function (error, response, body) {
            if (!error) {
                cb(false, { message: "Task is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (taskId, cb) {
        storage('DELETE', "/tables/tasks/rows?filter=idtask=" + taskId, {}, function (error, response, body) {
            if (!error) {
                cb(false, { message: "Task is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    update: function (taskId, newName, newSdate, newEdate, newPlace, cb) {
        console.log("DAL:", taskId, newName, newSdate, newEdate, newPlace);
        // if(newPlace == "" || newPlace == "null"){ newPlace = null}
        if(newPlace == null){ newPlace = 'null'}
        storage('PATCH', "/tables/tasks/rows?filter=idtask=" + taskId, { name: newName, sdate: newSdate  , edate: newEdate , place: newPlace }, function (error, response, body) {
            console.log(body);
            if (!error ) {
                cb(false, { message: "Task is updated" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}