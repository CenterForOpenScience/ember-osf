/*jshint node:true*/
/*
    Allow testing of authenticators, using a mock endpoint that submits to the OSF and receives a cookie in return
    This can be removed once the ember app is integrated directly into the OSF
    (so that there are no same-origin issues for ember + OSF cookies)
 */
module.exports = function(app) {
    var express = require('express');
    var authendpointRouter = express.Router();

    authendpointRouter.get('/', function(req, res) {
        if (req.query.fail) {
            res.status(401).send({
                message: 'You are not authorized to access this resource'
            });
        } else {
            res.cookie('democookie', 'A great value- yours for only $9.95!',
                {
                    httpOnly: true,
                    secure: true
                });
            res.status(200).send({
                message: 'A cookie has been set!'
            });
        }
    });

    app.use('/api/authendpoint', authendpointRouter);
};
