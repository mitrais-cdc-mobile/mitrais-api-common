"use strict"

const app = require('../server/server')

/**
 * A collection of methods that can be used to support running User model's integration tests.
 */
class UserTestHelpers {
    /**
     * A helper for creating user account for testing purpose
     */
    static createTestUserAccount(userName, email, password) {
        return new Promise((resolve, reject) => {
            let user = app.models.User;
            const createRequest = { email: email, password: password, username: userName };
            user.create(createRequest,
                (err, res) => {
                    if (err) reject(err);
                    // return user id
                    const userId = res.id;
                    resolve(userId);
                });
        });
    };

    /**
     * A helper for disposing test user account.
     */
    static disposeTestUserAccount(userName) {
        let user = app.models.User;
        user.destroyAll({ 'username': userName },
            (err, obj, count) => {
                if (err) throw err;
            });
    };

    static disposeTestUserAccountById(userId) {
        let user = app.models.User;
        user.destroyAll({ 'id': userId },
            (err, obj, count) => {
                if (err) throw err;
                let accessToken = app.models.AccessToken;
                accessToken.destroyAll({ userId: userId }, (err, obj, count) => {
                    if (err) throw err;
                });
            });
    }

    /**
     * A helper for verify test user account.
     */
    static verifyTestUserAccount(userId) {
        return new Promise((resolve, reject) => {
            let user = app.models.User;
            user.findById(userId, { fields: { verificationToken: true } }, (err, instance) => {
                const verificationToken = instance.verificationToken;
                if (verificationToken) {
                    user.confirm(userId, verificationToken, '/verified', error => {
                        if (error) reject(error);
                        else resolve();
                    });
                }
            });
        });
    };

    /**
     * A helper for test user account login.
     */
    static loginTestUserAccount(userName, password) {
        return new Promise((resolve, reject) => {
            let user = app.models.User;
            const loginRequest = { password: password, username: userName };
            user.login(loginRequest,
                (err, res) => {
                    if (err) reject(err);
                    // return token
                    const token = res.id;
                    resolve(token);
                });
        });
    };
};

module.exports = UserTestHelpers;
