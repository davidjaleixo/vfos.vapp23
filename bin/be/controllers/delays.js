/**
 * made by david.aleixo@knowledgebiz.pt
 */

var dal = require('../DAL');


var _get = function (req, res) {
    if (req.query.id) {
        //get delay by id
        dal.delays.getById(req.query.id, function (err, answer) {
            if (!err) {
                res.status(200).send(answer);
            } else {
                res.status(500).end();
            }
        })
    } else {

        //get all delays from task
        if (req.query.task) {
            dal.delays.getDelaysByTaskId(req.query.task, function (err, answer) {
                if (!err) {
                    res.status(200).send(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            if (req.query.project) {
                console.log("getting delays for project ", req.query.project);
                dal.delays.getDelaysByProject(req.query.project, function (err, answer) {
                    if (!err) {
                        res.status(200).send(answer);
                    } else {
                        res.status(500).end();
                    }
                })
            } else {
                res.status(500).send("No task is defined");
            }

        }
    }
}

var _create = function (req, res) {
    if (req.body.description && req.body.task && req.body.level && req.body.days) {
        dal.delays.create(req.body.description, req.body.task, req.user.id, req.body.level, req.body.days, function (err, answer) {
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
var _update = function(req,res){
    dal.delays.update(req.query.id, req.body.accept, function(err,answer){
        if (!err) {
            res.status(201).json(answer);
        } else {
            res.status(500).end();
        }
    })
}

module.exports = {
    get: _get,
    create: _create,
    update: _update
}