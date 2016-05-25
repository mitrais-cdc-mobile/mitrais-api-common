"use strict"
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiHttp);
chai.use(chaiAsPromised);

const apiAddress = 'http://localhost:3000/api';
const userTestHelper = require('./user-test-helpers');
const merchantTestHelper = require('./merchant-test-helpers');

const expect = chai.expect;
const request = chai.request;

describe('MERCHANT TEST CASES', function () {
    /**
     * Tests suite related to create merchant's feature.
     */
    describe('Create Merchant', function () {
        this.timeout(20000);

        const TEST_CREATE_MERCHANT_USER_NAME = 'create_merchant_username';
        const TEST_CREATE_MERCHANT_USER_EMAIL = 'create_merchant_useremail@gmail.com';
        const TEST_CREATE_MERCHANT_USER_PASSWORD = 'create_merchant_userpassword';
        const TEST_CREATE_MERCHANT_ACCOUNT_TYPE = 'Merchant';

        const TEST_CREATE_CUSTOMER_USER_NAME = 'create_customer_username';
        const TEST_CREATE_CUSTOMER_USER_EMAIL = 'create_customer_useremail@gmail.com';
        const TEST_CREATE_CUSTOMER_USER_PASSWORD = 'create_customer_userpassword';
        const TEST_CREATE_CUSTOMER_ACCOUNT_TYPE = 'Customer';

        const TEST_CREATE_MERCHANT_NAME = 'create_merchant_name';
        const TEST_CREATE_MERCHANT_EMAIL = 'create_merchant_email@gmail.com';
        const TEST_CREATE_MERCHANT_TYPE = 'create_merchant_type';
        const TEST_CREATE_MERCHANT_DELIVERY_METHOD = 'create_merchant_delivery_method';

        let merchantUserId = '';
        let accessToken = '';
        let customerAccessToken = '';

        before((done) => {
            // create customer type account
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_CREATE_CUSTOMER_USER_EMAIL,
                    password: TEST_CREATE_CUSTOMER_USER_PASSWORD,
                    username: TEST_CREATE_CUSTOMER_USER_NAME,
                    accountType: TEST_CREATE_CUSTOMER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;

                    userTestHelper.verifyTestUserAccount(res.body.id)
                        .then(() => {
                            userTestHelper.loginTestUserAccount(
                                TEST_CREATE_CUSTOMER_USER_NAME, TEST_CREATE_CUSTOMER_USER_PASSWORD).then(token => {
                                    customerAccessToken = token;
                                }).catch(err => {
                                    console.log(err);
                                });
                        });
                })
                .catch(err => {
                    done(err);
                });

            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_CREATE_MERCHANT_USER_EMAIL,
                    password: TEST_CREATE_MERCHANT_USER_PASSWORD,
                    username: TEST_CREATE_MERCHANT_USER_NAME,
                    accountType: TEST_CREATE_MERCHANT_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    merchantUserId = res.body.id;

                    userTestHelper.verifyTestUserAccount(merchantUserId)
                        .then(() => {
                            userTestHelper.loginTestUserAccount(
                                TEST_CREATE_MERCHANT_USER_NAME, TEST_CREATE_MERCHANT_USER_PASSWORD).then(token => {
                                    accessToken = token;
                                    done();
                                }).catch(err => {
                                    done(err);
                                });
                        });
                })
                .catch(err => {
                    done(err);
                });
        });

        after(() => {
            userTestHelper.disposeTestUserAccount(TEST_CREATE_MERCHANT_USER_NAME);
            userTestHelper.disposeTestUserAccount(TEST_CREATE_CUSTOMER_USER_NAME);
            userTestHelper.disposeRoleMappingById(merchantUserId);
            merchantTestHelper.disposeTestMerchantAccountByName(TEST_CREATE_MERCHANT_NAME);
        });

        it('Return error when name is Empty', (done) => {
            request(apiAddress)
                .post(`/Merchants?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: '',
                    email: TEST_CREATE_MERCHANT_EMAIL,
                    merchantType: TEST_CREATE_MERCHANT_TYPE,
                    deliveryMethod: TEST_CREATE_MERCHANT_DELIVERY_METHOD
                })
                .then(res => {
                    expect(res).to.have.status(422);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(422);
                    done();
                });
        });

        it('Return error when email is Empty', (done) => {
            request(apiAddress)
                .post(`/Merchants?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: TEST_CREATE_MERCHANT_NAME,
                    email: '',
                    merchantType: TEST_CREATE_MERCHANT_TYPE,
                    deliveryMethod: TEST_CREATE_MERCHANT_DELIVERY_METHOD
                })
                .then(res => {
                    expect(res).to.have.status(422);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(422);
                    done();
                });
        });

        it('Return error when merchant type is Empty', (done) => {
            request(apiAddress)
                .post(`/Merchants?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: TEST_CREATE_MERCHANT_NAME,
                    email: TEST_CREATE_MERCHANT_EMAIL,
                    merchantType: '',
                    deliveryMethod: TEST_CREATE_MERCHANT_DELIVERY_METHOD
                })
                .then(res => {
                    expect(res).to.have.status(422);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(422);
                    done();
                });
        });

        it('Return error when delivery method is Empty', (done) => {
            request(apiAddress)
                .post(`/Merchants?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: TEST_CREATE_MERCHANT_NAME,
                    email: TEST_CREATE_MERCHANT_EMAIL,
                    merchantType: TEST_CREATE_MERCHANT_TYPE,
                    deliveryMethod: ''
                })
                .then(res => {
                    expect(res).to.have.status(422);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(422);
                    done();
                });
        });

        it('Return error when email with invalid format', (done) => {
            request(apiAddress)
                .post(`/Merchants?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: TEST_CREATE_MERCHANT_NAME,
                    email: 'aaa',
                    merchantType: TEST_CREATE_MERCHANT_TYPE,
                    deliveryMethod: TEST_CREATE_MERCHANT_DELIVERY_METHOD
                })
                .then(res => {
                    expect(res).to.have.status(422);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(422);
                    done();
                });
        });

        it('Return ok when using valid input', (done) => {
            request(apiAddress)
                .post(`/Merchants?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: TEST_CREATE_MERCHANT_NAME,
                    email: TEST_CREATE_MERCHANT_EMAIL,
                    merchantType: TEST_CREATE_MERCHANT_TYPE,
                    deliveryMethod: TEST_CREATE_MERCHANT_DELIVERY_METHOD,
                    userId: merchantUserId
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    done();
                })
                .catch(err => {
                    console.log(err);
                    done(err);
                });
        });

        it('Return error when using customer account type', (done) => {
            request(apiAddress)
                .post(`/Merchants?access_token=${customerAccessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: "customer",
                    email: "customer",
                    merchantType: "merchantType",
                    deliveryMethod: "deliveryMethod",
                    userId: "123"
                })
                .then(res => {
                    expect(res).to.have.status(401);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(401);
                    done();
                });
        });
    });

    /**
     * Tests suite related to update merchant's feature.
     */
    describe('Update Merchant', function () {
        this.timeout(30000);

        const TEST_UPDATE_MERCHANT_USER_NAME = 'update_merchant_username';
        const TEST_UPDATE_MERCHANT_USER_EMAIL = 'update_merchant_useremail@gmail.com';
        const TEST_UPDATE_MERCHANT_USER_PASSWORD = 'update_merchant_userpassword';
        const TEST_UPDATE_MERCHANT_ACCOUNT_TYPE = 'Merchant';

        const TEST_UPDATE_MERCHANT_USER_NAME2 = 'update_merchant_username2';
        const TEST_UPDATE_MERCHANT_USER_EMAIL2 = 'update_merchant_useremail2@gmail.com';
        const TEST_UPDATE_MERCHANT_USER_PASSWORD2 = 'update_merchant_userpassword';
        const TEST_UPDATE_MERCHANT_ACCOUNT_TYPE2 = 'Merchant';

        const TEST_UPDATE_CUSTOMER_USER_NAME = 'update_customer_username';
        const TEST_UPDATE_CUSTOMER_USER_EMAIL = 'update_customer_useremail@gmail.com';
        const TEST_UPDATE_CUSTOMER_USER_PASSWORD = 'update_customer_userpassword';
        const TEST_UPDATE_CUSTOMER_ACCOUNT_TYPE = 'Customer';

        const TEST_UPDATE_MERCHANT_NAME = 'update_merchant_name';
        const TEST_UPDATE_MERCHANT_EMAIL = 'update_merchant_email@gmail.com';
        const TEST_UPDATE_MERCHANT_TYPE = 'update_merchant_type';
        const TEST_UPDATE_MERCHANT_DELIVERY_METHOD = 'update_merchant_delivery_method';

        let merchantUserId = '';
        let accessToken = '';
        let merchantId = '';
        let customerAccessToken = '';

        before((done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_UPDATE_CUSTOMER_USER_EMAIL,
                    password: TEST_UPDATE_CUSTOMER_USER_PASSWORD,
                    username: TEST_UPDATE_CUSTOMER_USER_NAME,
                    accountType: TEST_UPDATE_CUSTOMER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    userTestHelper.verifyTestUserAccount(res.body.id)
                        .then(() => {
                    userTestHelper.loginTestUserAccount(
                        TEST_UPDATE_CUSTOMER_USER_NAME, TEST_UPDATE_CUSTOMER_USER_PASSWORD).then(token => {
                            customerAccessToken = token;
                        }).catch(err => {
                            console.log(err);
                        });
                    });
                })
                .catch(err => {
                    console.log(err);
                });

            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_UPDATE_MERCHANT_USER_EMAIL,
                    password: TEST_UPDATE_MERCHANT_USER_PASSWORD,
                    username: TEST_UPDATE_MERCHANT_USER_NAME,
                    accountType: TEST_UPDATE_MERCHANT_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    merchantUserId = res.body.id;

                    userTestHelper.verifyTestUserAccount(merchantUserId)
                        .then(() => {
                            userTestHelper.loginTestUserAccount(
                                TEST_UPDATE_MERCHANT_USER_NAME, TEST_UPDATE_MERCHANT_USER_PASSWORD).then(token => {
                                    accessToken = token;
                                    merchantTestHelper.createTestMerchantAccount(
                                        TEST_UPDATE_MERCHANT_NAME,
                                        TEST_UPDATE_MERCHANT_EMAIL,
                                        TEST_UPDATE_MERCHANT_TYPE,
                                        merchantUserId,
                                        TEST_UPDATE_MERCHANT_DELIVERY_METHOD
                                    ).then(id => {
                                        merchantId = id;
                                        done();
                                    }).catch(err => {
                                        done(err);
                                    });
                                }).catch(err => {
                                    done(err);
                                });
                        });
                })
                .catch(err => {
                    done(err);
                });
        });

        after(() => {
            userTestHelper.disposeTestUserAccount(TEST_UPDATE_MERCHANT_USER_NAME);
            userTestHelper.disposeTestUserAccount(TEST_UPDATE_MERCHANT_USER_NAME2);
            userTestHelper.disposeTestUserAccount(TEST_UPDATE_CUSTOMER_USER_NAME);
            userTestHelper.disposeRoleMappingById(merchantUserId);
            merchantTestHelper.disposeTestMerchantAccountByName(TEST_UPDATE_MERCHANT_NAME);
        });

        it('Return error when updating with empty name', (done) => {
            request(apiAddress)
                .put(`/Merchants/${merchantId}?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: '',
                    email: TEST_UPDATE_MERCHANT_EMAIL,
                    merchantType: TEST_UPDATE_MERCHANT_TYPE,
                    deliveryMethod: TEST_UPDATE_MERCHANT_DELIVERY_METHOD,
                    userId: merchantUserId
                })
                .then(res => {
                    expect(res).to.have.status(422);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(422);
                    done();
                });
        });

        it('Return ok when updating with valid data', (done) => {
            request(apiAddress)
                .put(`/Merchants/${merchantId}?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: TEST_UPDATE_MERCHANT_NAME,
                    email: "MERCHANT_EMAIL@GMAIL.COM",
                    merchantType: TEST_UPDATE_MERCHANT_TYPE,
                    deliveryMethod: TEST_UPDATE_MERCHANT_DELIVERY_METHOD,
                    userId: merchantUserId
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.email).to.equal("MERCHANT_EMAIL@GMAIL.COM");
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it('Return error when trying to update another data', (done) => {
            // Do the test when 2nd test user has signed in
            const on2ndTestUserLoggedIn = (authToken, done) => {
                request(apiAddress)
                    .put(`/Merchants/${merchantId}?access_token=${authToken}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        name: "TEST",
                        email: "TEST123@TEST.COM",
                        merchantType: TEST_UPDATE_MERCHANT_TYPE,
                        deliveryMethod: TEST_UPDATE_MERCHANT_DELIVERY_METHOD,
                        userId: merchantUserId
                    })
                    .then(res => {
                        expect(res).to.have.status(401);
                        done();
                    })
                    .catch(err => {
                        expect(err).to.not.be.null;
                        expect(err).to.have.status(401);
                        done();
                    });
            };

            // Do sign in using 2nd test user
            const doSignInUsing2ndTestUser = (userId, done) => {
                request(apiAddress)
                    .post('/users/login')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        username: TEST_UPDATE_MERCHANT_USER_NAME2,
                        password: TEST_UPDATE_MERCHANT_USER_PASSWORD2
                    })
                    .then(res => {
                        const authToken = JSON.parse(res.text).id;
                        on2ndTestUserLoggedIn(authToken, userId, done);
                    })
                    .catch(err => {
                        console.log(`[DEBUG] - err of sign in = ${JSON.stringify(err)}`);
                        done(err);
                    });
            };

            // Signup 2nd test user through REST API
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_UPDATE_MERCHANT_USER_EMAIL2,
                    password: TEST_UPDATE_MERCHANT_USER_PASSWORD2,
                    username: TEST_UPDATE_MERCHANT_USER_NAME2,
                    accountType: TEST_UPDATE_MERCHANT_ACCOUNT_TYPE2
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    const userId = res.body.id;

                    userTestHelper.verifyTestUserAccount(userId)
                        .then(() => doSignInUsing2ndTestUser(userId, done));
                })
                .catch(err => {
                    done(err);
                });
        });

        it('Return error when updating with customer account', (done) => {
            request(apiAddress)
                .put(`/Merchants/${merchantId}?access_token=${customerAccessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    name: TEST_UPDATE_MERCHANT_NAME,
                    email: "MERCHANT_EMAIL@GMAIL.COM",
                    merchantType: TEST_UPDATE_MERCHANT_TYPE,
                    deliveryMethod: TEST_UPDATE_MERCHANT_DELIVERY_METHOD,
                    userId: merchantUserId
                })
                .then(res => {
                    expect(res).to.have.status(401);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(401);
                    done();
                });
        });
    });

    /**
     * Tests suite related to get merchant's feature.
     */
    describe('Get Merchant', function () {
        this.timeout(50000);

        const TEST_GET_MERCHANT_USER_NAME = 'get_merchant_username';
        const TEST_GET_MERCHANT_USER_EMAIL = 'get_merchant_useremail@gmail.com';
        const TEST_GET_MERCHANT_USER_PASSWORD = 'get_merchant_userpassword';
        const TEST_GET_MERCHANT_ACCOUNT_TYPE = 'Merchant';

        const TEST_GET_MERCHANT_NAME = 'get_merchant_name';
        const TEST_GET_MERCHANT_EMAIL = 'get_merchant_email@gmail.com';
        const TEST_GET_MERCHANT_TYPE = 'get_merchant_type';
        const TEST_GET_MERCHANT_DELIVERY_METHOD = 'get_merchant_delivery_method';

        let merchantUserId = '';
        let accessToken = '';
        let merchantId = '';

        before((done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_GET_MERCHANT_USER_EMAIL,
                    password: TEST_GET_MERCHANT_USER_PASSWORD,
                    username: TEST_GET_MERCHANT_USER_NAME,
                    accountType: TEST_GET_MERCHANT_USER_PASSWORD
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    merchantUserId = res.body.id;
                    userTestHelper.verifyTestUserAccount(merchantUserId)
                        .then(() => {
                            userTestHelper.loginTestUserAccount(
                                TEST_GET_MERCHANT_USER_NAME, TEST_GET_MERCHANT_USER_PASSWORD).then(token => {
                                    accessToken = token;
                                    merchantTestHelper.createTestMerchantAccount(
                                        TEST_GET_MERCHANT_NAME,
                                        TEST_GET_MERCHANT_EMAIL,
                                        TEST_GET_MERCHANT_TYPE,
                                        merchantUserId,
                                        TEST_GET_MERCHANT_DELIVERY_METHOD
                                    ).then(id => {
                                        merchantId = id;
                                        done();
                                    }).catch(err => {
                                        console.log(`[DEBUG] - err of sign in = ${JSON.stringify(err)}`);
                                        done(err);
                                    });
                                }).catch(err => {
                                    console.log(`[DEBUG] - err of sign in = ${JSON.stringify(err)}`);
                                    done(err);
                                });
                        }).catch(err => {
                            console.log(`[DEBUG] - err of sign in = ${JSON.stringify(err)}`);
                            done(err);
                        });
                })
                .catch(err => {
                    done(err);
                });
        });

        after(() => {
            userTestHelper.disposeTestUserAccount(TEST_GET_MERCHANT_USER_NAME);
            userTestHelper.disposeRoleMappingById(merchantUserId);
            merchantTestHelper.disposeTestMerchantAccountByName(TEST_GET_MERCHANT_NAME);
        });

        it('Return error unauthorized when trying to get other merchant with valid id', (done) => {
            request(apiAddress)
                .get(`/Merchants/abc?access_token=${accessToken}`)
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res).to.have.status(401);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(401);
                    done();
                });
        });

        it('Return ok when getting data with valid id', (done) => {
            request(apiAddress)
                .get(`/Merchants/${merchantId}?access_token=${accessToken}`)
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.email).to.equal(TEST_GET_MERCHANT_EMAIL);
                    done();
                })
                .catch(err => {
                    console.log(`[DEBUG] - getting data with valid id = ${JSON.stringify(err)}`);
                    done(err);
                });
        });
    });
});