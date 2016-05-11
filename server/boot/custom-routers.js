"use strict";

module.exports = function(server) {
    // Install /verified route that is going to be invoked when the user verified their account.
    const router = server.loopback.Router();
    router.get('/verified', (req, res)=>{
        // TODO: Move this to HTML file with appropriate style or redirect it to link that will open/focus to the mobile app
        const verifiedPage = "<h2>Your account has been verified successfully.</h2><p>Please login to our app using your username & password. </p><p>Thank you.</p>"; 
        res.send(verifiedPage);                
    });
    server.use(router);    
}