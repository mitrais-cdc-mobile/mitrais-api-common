"use strict";

module.exports = function (server) {
    // Install /verified route that is going to be invoked when the user verified their account.
    const router = server.loopback.Router();
    router.get('/verified', (req, res) => {
        // TODO: Move this to HTML file with appropriate style or redirect it to link that will open/focus to the mobile app
        const verifiedPage = "<h2>Your account has been verified successfully.</h2><p>Please login to our app using your username & password. </p><p>Thank you.</p>";
        res.send(verifiedPage);
    });

    //send an email with instructions to reset an existing user's password
    router.post('/request-password-reset', function (req, res, next) {
        User.resetPassword({
            email: req.body.email
        }, function (err) {
            if (err) return res.status(401).send(err);
            res.render('response', {
                title: 'Password reset requested',
                content: 'Check your email for further instructions',
                redirectTo: '/',
            });
        });
    });

    //show password reset form
    router.get('/reset-password', function (req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);
        res.render('password-reset', {
            accessToken: req.accessToken.id
        });
    });

    server.use(router);
}