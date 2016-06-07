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
            // Ember HTTP mocks appear to use a different module system; how can we get config params?
            // FIXME: Warning- do not commit your cookie value. To minimize risk, do not use this with anything other than a localhost OSF cookie!
            res.cookie('democookie', 'Proof that something was set; use an OSF cookie to test actual sending of credentials',
                {
                    httpOnly: true,
                    //secure: true
                });
            res.status(200).send({
                message: 'A cookie has been set!'
            });
        }
    });

    app.use('/api/authendpoint', authendpointRouter);
};
