var express = require('express');
var router = express.Router();
var ctl = require('./controllers');


//API ROUTES

//authentication
router.route('/register').post(ctl.auth.register);
router.route('/login').post(ctl.auth.login);

//projects
router.route('/projects').get(ctl.projects.get);
router.route('/projects').post(ctl.projects.create);
router.route('/projects').patch(ctl.projects.update);
router.route('/projects').delete(ctl.projects.delete);

//pars
// router.route('/pars').get(ctl.pars.get);
// router.route('/pars').post(ctl.pars.create);
// router.route('/pars').delete(ctl.pars.delete);

// //parslinks
// router.route('/parslinks').get(ctl.parslinks.get);
// router.route('/parslinks').post(ctl.parslinks.create);
// router.route('/parslinks').delete(ctl.parslinks.delete);

// //materials
// router.route('/materials').get(ctl.materials.get);
// router.route('/materials').post(ctl.materials.create);
// router.route('/materials').patch(ctl.materials.update);
// router.route('/materials').delete(ctl.materials.delete);

// //materials links
// router.route('/materialslinks').get(ctl.materialslinks.get);
// router.route('/materialslinks').post(ctl.materialslinks.create);
// router.route('/materialslinks').delete(ctl.materialslinks.delete);

// //items
// router.route('/items').get(ctl.items.get);
// router.route('/items').post(ctl.items.create);
// router.route('/items').patch(ctl.items.update);
// router.route('/items').delete(ctl.items.delete);

// //rmes
// router.route('/rmes').get(ctl.rmes.get);
// router.route('/rmes').post(ctl.rmes.create);
// router.route('/rmes').patch(ctl.rmes.update);
// router.route('/rmes').delete(ctl.rmes.delete);

// //received
// router.route('/receiveds').get(ctl.received.get);
// router.route('/receiveds').delete(ctl.received.delete);
// router.route('/receiveds').post(ctl.received.create);

//materialsreceived
// router.route('/materialsreceived').get(ctl.materialsreceived.get);

//users
router.route('/users').get(ctl.users.get);
router.route('/users').post(ctl.users.create);
router.route('/users').delete(ctl.users.delete);

//accounts
router.route('/accounts').get(ctl.accounts.get);

//notifications
router.route('/notifications').get(ctl.notification.get);
router.route('/notifications').patch(ctl.notification.update);
router.route('/notifications').post(ctl.notification.harmonizeRequest, ctl.notification.create);
router.route('/notifications').delete(ctl.notification.delete);


//tasks
router.route('/tasks').get(ctl.tasks.get);
router.route('/tasks').post(ctl.tasks.create);
router.route('/tasks').delete(ctl.tasks.delete);

//delays
router.route('/delays').get(ctl.delays.get);
router.route('/delays').post(ctl.delays.create);

module.exports = router;