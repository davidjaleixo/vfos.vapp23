/**
 * made by david.aleixo@knowledgebiz.pt
 */

var dal = require('../DAL');


var _get = function (req, res) {
    if (req.query.id) {
        //get task by id
        dal.tasks.getById(req.query.id, function (err, answer) {
            if (!err) {
                res.status(200).send(answer);
            } else {
                res.status(500).end();
            }
        })
    } else {

        //get all tasks from project
        if (req.query.project) {
            dal.tasks.getTasksByProjectId(req.query.project, function (err, answer) {
                if (!err) {
                    res.status(200).send(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            res.status(500).send("No project is defined");
        }
    }
}

var _create = function (req, res) {
    console.log("Creating task body", req.body)
    if (req.body.name && req.body.sdate && req.body.edate && req.body.project) {
        dal.tasks.create(req.body.name, req.body.sdate, req.body.edate, true, req.body.project, req.user.id, req.body.place, function (err, answer) {
            if (!err) {
                res.status(201).json(answer);
            } else {
                res.status(500).end();
            }
        })
    } else {
        res.status(422).json({ message: "Missing required fields" })
    }
}
var _update = function (req, res) {
    console.log("UPDATING BODY", req.body);
    if (req.body.name, req.body.sdate, req.body.edate) {
        dal.tasks.update(req.body.idtask, req.body.name, req.body.sdate, req.body.edate, req.body.place, function (err, answer) {
            if (!err) {
                res.status(201).json(answer);
            } else {
                res.status(500).end();
            }
        })
    } else {
        res.status(422).json({ message: "Missing required field" })
    }
}
var _delete = function (req, res) {
    if (req.query.id) {
        dal.tasks.delete(req.query.id, function (err, answer) {
            if (!err) {
                res.status(200).send(answer);
            } else {
                res.status(500).end();
            }
        })
    } else {
        res.status(422).json({ message: "Missing required field" })
    }

}

module.exports = {
    get: _get,
    create: _create,
    delete: _delete,
    update: _update
}