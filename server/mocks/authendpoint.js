/*jshint node:true*/
/*
    Allow testing of authenticators, using a mock endpoint that submits to the OSF and receives a cookie in return
    This can be removed once the ember app is integrated directly into the OSF
    (so that there are no same-origin issues for ember + OSF cookies)

    For now the primary use case is so that there exists a place where authenticator can be tested for success/failure
 */

module.exports = function(app) {
    var express = require('express');
    var authendpointRouter = express.Router();

    authendpointRouter.get('/', function(req, res) {
        if (req.query.ticket === 'fail') {
            // Using a special value of "fail" for the auth ticket allows frontend to simulate authentication failure (where a cookie is not issued)
            res.status(401).send({
                message: 'You are not authorized to access this resource'
            });
        } else {
            // FIXME: Warning- do not commit your cookie value. To minimize risk, do not use this with anything other than a localhost OSF cookie!
            res.cookie('democookie', 'SAMPLE VALUE- DO NOT COMMIT TO GITHUB. CAN USE A CAPTURED COOKIE VALUE FROM LOCALHOST WITH COOKIE NAME = OSF',
                {
                    httpOnly: true,
                    // secure: true
                });
            res.status(200).send({
                message: 'A cookie has been set!'
            });
        }
    });

    app.use('/api/authendpoint', authendpointRouter);
};
