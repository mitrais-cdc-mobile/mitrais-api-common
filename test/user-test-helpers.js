"use strict"

const app = require('../server/server')

/**
 * A collection of methods that can be used to support running User model's integration tests.
 */
class UserTestHelpers {
    /**
     * A helper for creating user account for testing purpose
     */
    static createTestUserAccount(userName, email, password, accountType) {
        return new Promise((resolve, reject) => {
            let user = app.models.User;
            const createRequest = { email: email, password: password, username: userName, accountType: accountType };
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

    static createTestMerchantAccount(userId) {
        return new Promise((resolve, reject) => {
            let merchant = app.models.Merchant;
            const createRequest = { 
                userId: userId,
                name: 'merchant',
                email: 'abc@gmail.com',
                merchantType: 'merchantType',
                deliveryMethod: 'deliveryMethod'
             };
            merchant.create(createRequest,
                (err, res) => {
                    if (err) reject(err);

                    const merchantId = res.id;
                    resolve(merchantId);
                });
        });
    };

    /**
     * dispose test merchant account by id
     */
    static disposeTestMerchantAccountById(id) {
        let Merchant = app.models.Merchant;

        Merchant.destroyAll({ 'id': id },
            (err, obj, count) => {
                if (err) throw err;
            });
    }
    
    /**
     * dispose role mapping by id
     */
    static disposeRoleMappingById(id) {
        let RoleMapping = app.models.RoleMapping;

        RoleMapping.destroyAll({ 'principalId': id },
            (err, obj, count) => {
                if (err) throw err;
            });
    }
};

module.exports = UserTestHelpers;
