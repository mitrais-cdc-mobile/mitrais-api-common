"use strict"
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiHttp);
chai.use(chaiAsPromised);

const apiAddress = 'http://localhost:3000/api';
const testHelper = require('./user-test-helpers');

const expect = chai.expect;
const request = chai.request;

const TEST_USER_NAME = 'userTest';
const TEST_USER_PASSWORD = 'username';
const TEST_USER_EMAIL = 'userTest@gmail.com';
const TEST_USER_ACCOUNT_TYPE = 'Customer';

describe('User test', function () {
    /**
     * Tests suite related to Sign Up's feature.
     */
    describe('Sign Up', function () {
        this.timeout(20000);

        const TEST_SIGNUP_USER_NAME = 'signup_username';
        const TEST_SIGNUP_USER_EMAIL = 'signup_useremail@gmail.com';
        const TEST_SIGNUP_USER_PASSWORD = 'signup_userpassword';
        const TEST_SIGNUP_USER_ACCOUNT_TYPE = 'Customer';

        const TEST_SIGNUP_USER_NAME2 = 'signup_username2';
        const TEST_SIGNUP_USER_EMAIL2 = 'signup_useremail2@gmail.com';
        const TEST_SIGNUP_USER_PASSWORD2 = 'signup_userpassword2';
        const TEST_SIGNUP_USER_ACCOUNT_TYPE2 = 'Merchant';

        let merchantUserId = '';
        before(() => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_SIGNUP_USER_EMAIL,
                    password: TEST_SIGNUP_USER_PASSWORD,
                    username: TEST_SIGNUP_USER_NAME,
                    accountType: TEST_SIGNUP_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                })
                .catch(err => {
                });
        });

        after(() => {
            testHelper.disposeTestUserAccount(TEST_SIGNUP_USER_NAME);
            testHelper.disposeTestUserAccount(TEST_SIGNUP_USER_NAME2);
            testHelper.disposeRoleMappingById(merchantUserId);
        });

        it('Return error when Username is Empty', (done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_SIGNUP_USER_EMAIL,
                    password: TEST_SIGNUP_USER_PASSWORD,
                    username: '',
                    accountType: TEST_SIGNUP_USER_ACCOUNT_TYPE
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

        it('Return error when Email is Empty', (done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: '',
                    password: TEST_SIGNUP_USER_PASSWORD,
                    username: TEST_SIGNUP_USER_NAME,
                    accountType: TEST_SIGNUP_USER_ACCOUNT_TYPE
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

        it('Return error when Password is Empty', (done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_SIGNUP_USER_EMAIL,
                    password: '',
                    username: TEST_SIGNUP_USER_NAME,
                    accountType: TEST_SIGNUP_USER_ACCOUNT_TYPE
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

        it('Return error when Account Type is Empty', (done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_SIGNUP_USER_EMAIL,
                    password: TEST_SIGNUP_USER_PASSWORD,
                    username: TEST_SIGNUP_USER_NAME,
                    accountType: ''
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

        it('Return error when Email Format is Invalid', (done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: 'USERNAME',
                    password: TEST_SIGNUP_USER_PASSWORD,
                    username: TEST_SIGNUP_USER_NAME,
                    accountType: TEST_SIGNUP_USER_ACCOUNT_TYPE
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

        it('Return error when Username is already Exist', function (done) {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: "USEREMAIL@GMAIL.COM",
                    password: TEST_SIGNUP_USER_PASSWORD,
                    username: TEST_SIGNUP_USER_NAME,
                    accountType: TEST_SIGNUP_USER_ACCOUNT_TYPE
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

        it('Return error when Email already Exist', function (done) {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_SIGNUP_USER_EMAIL,
                    password: TEST_SIGNUP_USER_PASSWORD,
                    username: 'USERNAME',
                    accountType: TEST_SIGNUP_USER_ACCOUNT_TYPE
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

        it('Return OK when all Data is Valid', function (done) {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_SIGNUP_USER_EMAIL2,
                    password: TEST_SIGNUP_USER_PASSWORD2,
                    username: TEST_SIGNUP_USER_NAME2,
                    accountType: TEST_SIGNUP_USER_ACCOUNT_TYPE2
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.email).to.equal(TEST_SIGNUP_USER_EMAIL2);
                    expect(res.body.username).to.equal(TEST_SIGNUP_USER_NAME2);
                    expect(res.body.id).exist;
                    expect(res.body.accountType).to.equal(TEST_SIGNUP_USER_ACCOUNT_TYPE2);
                    merchantUserId = res.body.id;
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    /**
     * Tests suite related to access security
     */
    describe('Access security', function () {
        let testUserId = "";

        before((done) => {
            this.timeout(20000);
            testHelper.createTestUserAccount(TEST_USER_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD, TEST_USER_ACCOUNT_TYPE)
                .then(id => {
                    testUserId = id;
                    done();
                })
                .catch(err => {
                    console.log(`[ERROR] - In before method. Error = ${err}`)
                    done();
                });
        });

        after(() => {
            testHelper.disposeTestUserAccount(TEST_USER_NAME);
        });

        it("returns error when Unauthenticated user try to get all user records.", (done) => {
            request(apiAddress)
                .get('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it("returns error when unauthenticated user try to update existing user record.", (done) => {
            request(apiAddress)
                .put('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_USER_NAME,
                    address: 'test',
                    phone: 'test'
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

        it("returns error when unauthenticated user try to delete existing user record.", (done) => {
            request(apiAddress)
                .delete(`/users/${TEST_USER_NAME}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send()
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

        it("returns ok when unauthenticated user do sign up", function (done) {
            this.timeout(20000);
            const email = 'mitraiscdcmobiledev@gmail.com';

            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: email,
                    email: email,
                    password: TEST_USER_PASSWORD,
                    accountType: TEST_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.email).to.equal(email);
                    expect(res.body.username).to.equal(email);
                    expect(res.body.id).exist;
                    expect(res.body.accountType).to.equal(TEST_USER_ACCOUNT_TYPE);
                    testHelper.disposeTestUserAccount(email);
                    done();
                })
                .catch(err => {
                    console.log(`[DEBUG] - err of sign up = ${JSON.stringify(err)}`);
                    done(err);
                });
        });

        it("returns error when Authenticated user try to get other user records that does not belong to the user.", function (done) {
            this.timeout(20000);
            const SecondUserMail = "mitraiscdcmobildev1@gmail.com";

            // Do the test when 2nd test user has signed in
            const on2ndTestUserLoggedIn = (authToken, userId, done) => {
                const getByIdApiPath = `/users/${testUserId}?access_token=${authToken}`;

                request(apiAddress)
                    .get(getByIdApiPath)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        expect(err).to.not.be.null;
                        expect(err).to.have.status(401);
                        testHelper.disposeTestUserAccountById(userId);
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
                        username: SecondUserMail,
                        password: TEST_USER_PASSWORD
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
                    username: SecondUserMail,
                    email: SecondUserMail,
                    password: TEST_USER_PASSWORD,
                    accountType: TEST_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    const userId = res.body.id;

                    testHelper.verifyTestUserAccount(userId)
                        .then(() => doSignInUsing2ndTestUser(userId, done));
                })
                .catch(err => {
                    done(err);
                });
        });

        it("returns ok when Authenticated user retrieve & updates their own User record", function (done) {
            this.timeout(20000);
            const SecondUserMail = "mitraiscdcmobildev1@gmail.com";

            // Do the test when 2nd test user has signed in
            const on2ndTestUserLoggedIn = (authToken, userId, done) => {
                // Get user's info test
                const getByIdApiPath = `/users/${userId}?access_token=${authToken}`;
                request(apiAddress)
                    .get(getByIdApiPath)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.id).exits;
                        expect(res.body.id).to.be.equals(userId);
                        console.log("on2ndTestUserLoggedIn " + res.body.id);
                        // Update user's info test
                        const updateApiPath = `/users/${userId}`;
                        request(apiAddress)
                            .put(updateApiPath)
                            .set('Authorization', authToken)
                            .send({
                                "address": "11, 540 Wickham St, Fortitude Valley QLD 4006, Australia",
                                "phone": "+61 7 3167 7300"
                            })
                            .end((err, res) => {
                                expect(err).to.be.null;
                                expect(res).to.have.status(200);
                                console.log("on2ndTestUserLoggedIn updateApiPath err= " + err);
                                testHelper.disposeTestUserAccountById(userId);
                                done();
                            });
                    });
            };

            // Do sign in using 2nd test user
            const doSignInUsing2ndTestUser = (userId, done) => {
                request(apiAddress)
                    .post('/users/login')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        username: SecondUserMail,
                        password: TEST_USER_PASSWORD
                    })
                    .then(res => {
                        const authToken = JSON.parse(res.text).id;
                        console.log("doSignInUsing2ndTestUser" + userId);
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
                    username: SecondUserMail,
                    email: SecondUserMail,
                    password: TEST_USER_PASSWORD,
                    accountType: TEST_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    const userId = res.body.id;
                    console.log("userId" + userId);

                    testHelper.verifyTestUserAccount(userId)
                        .then(() => doSignInUsing2ndTestUser(userId, done));
                })
                .catch(err => {
                    console.log("err" + err);
                    done(err);
                });

        });

        it("returns error when Authenticated user delete their own User record", function (done) {
            this.timeout(20000);
            const SecondUserMail = "mitraiscdcmobildev1@gmail.com";

            // Do the test when 2nd test user has signed in
            const on2ndTestUserLoggedIn = (authToken, userId, done) => {
                // Get delete user's record test
                const deleteByIdApiPath = `/users/${userId}`;
                request(apiAddress)
                    .delete(deleteByIdApiPath)
                    .set('Authorization', authToken)
                    .end((err, res) => {
                        expect(err).to.be.not.null;
                        expect(err).to.have.status(401);
                        testHelper.disposeTestUserAccountById(userId);
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
                        username: SecondUserMail,
                        password: TEST_USER_PASSWORD
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
                    username: SecondUserMail,
                    email: SecondUserMail,
                    password: TEST_USER_PASSWORD,
                    accountType: TEST_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    const userId = res.body.id;

                    testHelper.verifyTestUserAccount(userId)
                        .then(() => doSignInUsing2ndTestUser(userId, done));
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    /**
     * Tests suite related to Sign In's feature.
     */
    describe('Sign In', function () {
        const TEST_SIGNIN_USER_NAME = 'signin_username';
        const TEST_SIGNIN_USER_EMAIL = 'signin_useremail@gmail.com';
        const TEST_SIGNIN_USER_PASSWORD = 'signin_userpassword';
        const TEST_SIGNIN_USER_ACCOUNT_TYPE = 'Customer';

        const TEST_SIGNIN_VERIFIED_USER_NAME = 'signin_verified_username';
        const TEST_SIGNIN_VERIFIED_USER_EMAIL = 'signin_verified_useremail@gmail.com';
        const TEST_SIGNIN_VERIFIED_USER_PASSWORD = 'signin_verified_userpassword';
        const TEST_SIGNIN_VERIFIED_USER_ACCOUNT_TYPE = 'Customer';

        // merchant type with no data
        const TEST_SIGNIN_MERCHANT_VERIFIED_USER_NAME = 'signin_merchant_verified_username';
        const TEST_SIGNIN_MERCHANT_VERIFIED_USER_EMAIL = 'signin_merchant_verified_useremail@gmail.com';
        const TEST_SIGNIN_MERCHANT_VERIFIED_USER_PASSWORD = 'signin_merchant_verified_userpassword';
        const TEST_SIGNIN_MERCHANT_VERIFIED_USER_ACCOUNT_TYPE = 'Merchant';

        // merchant type with data
        const TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_NAME = 'signin_merchant_data_verified_username';
        const TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_EMAIL = 'signin_merchant_data_verified_useremail@gmail.com';
        const TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_PASSWORD = 'signin_merchant_data_verified_userpassword';
        const TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_ACCOUNT_TYPE = 'Merchant';

        let merchantId = '';
        let merchantVerifiedUserId = '';
        let merchantDataVerifiedUserId = '';

        this.timeout(30000);
        before((done) => {
            // unverified user
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_SIGNIN_USER_EMAIL,
                    password: TEST_SIGNIN_USER_PASSWORD,
                    username: TEST_SIGNIN_USER_NAME,
                    accountType: TEST_SIGNIN_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                })
                .catch(err => {
                    console.log(`[ERROR] - In before method. Error = ${err}`);
                });

            // verified user merchant with no data 
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_SIGNIN_MERCHANT_VERIFIED_USER_NAME,
                    email: TEST_SIGNIN_MERCHANT_VERIFIED_USER_EMAIL,
                    password: TEST_SIGNIN_MERCHANT_VERIFIED_USER_PASSWORD,
                    accountType: TEST_SIGNIN_MERCHANT_VERIFIED_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    merchantVerifiedUserId = res.body.id;
                    testHelper.verifyTestUserAccount(merchantVerifiedUserId)
                        .then(() => {
                        })
                        .catch(err => {
                            console.log(`[ERROR] - In before method. Error = ${err}`);
                        });
                })
                .catch(err => {
                    console.log(`[ERROR] - In before method. Error = ${err}`);
                });

            // verified user merchant with data 
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_NAME,
                    email: TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_EMAIL,
                    password: TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_PASSWORD,
                    accountType: TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    merchantDataVerifiedUserId = res.body.id;

                    testHelper.verifyTestUserAccount(merchantDataVerifiedUserId)
                        .then(() => {
                            testHelper.createTestMerchantAccount(merchantDataVerifiedUserId)
                                .then(id => {
                                    merchantId = id;
                                    done();
                                }).catch(err => {
                                    console.log(`[ERROR] - In before method. Error = ${err}`);
                                    done(err);
                                });
                        })
                        .catch(err => {
                            console.log(`[ERROR] - In before method. Error = ${err}`);
                            done(err);
                        });
                })
                .catch(err => {
                    console.log(`[ERROR] - In before method. Error = ${err}`);
                    done(err);
                });
        });

        after(() => {
            testHelper.disposeTestUserAccount(TEST_SIGNIN_USER_NAME);
            testHelper.disposeTestUserAccount(TEST_SIGNIN_MERCHANT_VERIFIED_USER_NAME);
            testHelper.disposeTestUserAccount(TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_NAME);
            testHelper.disposeRoleMappingById(merchantVerifiedUserId);
            testHelper.disposeRoleMappingById(merchantDataVerifiedUserId);
            testHelper.disposeTestMerchantAccountById(merchantId);
        });

        it('Return error when using empty username and password', (done) => {
            request(apiAddress)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: '',
                    password: TEST_SIGNIN_USER_PASSWORD
                })
                .then(res => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(400);
                    done();
                });
        });

        it('Return error when using empty email and password', (done) => {
            request(apiAddress)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: '',
                    password: TEST_SIGNIN_USER_PASSWORD
                })
                .then(res => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(400);
                    done();
                });
        });

        it('Return Error when using unverified user with valid email and password', function (done) {
            request(apiAddress)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    email: TEST_SIGNIN_USER_EMAIL,
                    password: TEST_SIGNIN_USER_PASSWORD
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

        it('Return Error when using unverified user with valid username and password', function (done) {
            request(apiAddress)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_SIGNIN_USER_NAME,
                    password: TEST_SIGNIN_USER_PASSWORD
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

        it('Return OK when using verified user with valid email and password', (done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_SIGNIN_VERIFIED_USER_NAME,
                    email: TEST_SIGNIN_VERIFIED_USER_EMAIL,
                    password: TEST_SIGNIN_VERIFIED_USER_PASSWORD,
                    accountType: TEST_SIGNIN_VERIFIED_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    const userId = res.body.id;

                    testHelper.verifyTestUserAccount(userId)
                        .then(() => {

                            // login
                            request(apiAddress)
                                .post('/users/login')
                                .set('Content-Type', 'application/json')
                                .set('Accept', 'application/json')
                                .send({
                                    email: TEST_SIGNIN_VERIFIED_USER_EMAIL,
                                    password: TEST_SIGNIN_VERIFIED_USER_PASSWORD
                                })
                                .then(res => {
                                    expect(res).to.have.status(200);
                                    expect(res.body.id).exist;
                                    expect(res.body.userId).exist;
                                    testHelper.disposeTestUserAccount(TEST_SIGNIN_VERIFIED_USER_NAME);
                                    done();
                                })
                                .catch(err => {
                                    console.log(`[ERROR] - In before method. Error = ${err}`);
                                    done(err);
                                });
                        })
                        .catch(err => {
                            console.log(`[ERROR] - In before method. Error = ${err}`);
                            done(err);
                        });
                })
                .catch(err => {
                    console.log(`[ERROR] - In before method. Error = ${err}`);
                    done(err);
                });
        });

        it('Return OK when using verified user with valid username and password', (done) => {
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_SIGNIN_VERIFIED_USER_NAME,
                    email: TEST_SIGNIN_VERIFIED_USER_EMAIL,
                    password: TEST_SIGNIN_VERIFIED_USER_PASSWORD,
                    accountType: TEST_SIGNIN_VERIFIED_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    const userId = res.body.id;

                    testHelper.verifyTestUserAccount(userId)
                        .then(() => {

                            // login
                            request(apiAddress)
                                .post('/users/login')
                                .set('Content-Type', 'application/json')
                                .set('Accept', 'application/json')
                                .send({
                                    username: TEST_SIGNIN_VERIFIED_USER_NAME,
                                    password: TEST_SIGNIN_VERIFIED_USER_PASSWORD
                                })
                                .then(res => {
                                    expect(res).to.have.status(200);
                                    expect(res.body.id).exist;
                                    expect(res.body.userId).exist;
                                    testHelper.disposeTestUserAccount(TEST_SIGNIN_VERIFIED_USER_NAME);
                                    done();
                                })
                                .catch(err => {
                                    console.log(`[ERROR] - In before method. Error = ${err}`);
                                    done(err);
                                });
                        })
                        .catch(err => {
                            console.log(`[ERROR] - In before method. Error = ${err}`);
                            done(err);
                        });
                })
                .catch(err => {
                    console.log(`[ERROR] - In before method. Error = ${err}`);
                    done(err);
                });
        });

        it('Return OK when using verified user merchant with no merchant data and using valid username and password', (done) => {
            request(apiAddress)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_SIGNIN_MERCHANT_VERIFIED_USER_NAME,
                    password: TEST_SIGNIN_MERCHANT_VERIFIED_USER_PASSWORD
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    expect(res.body.userId).exist;

                    // expect wizard completed = false
                    expect(res.body.isWizardCompleted).to.equal(false);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it('Return OK when using verified user merchant with merchant data and using valid username and password', (done) => {
            request(apiAddress)
                .post('/users/login')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_NAME,
                    password: TEST_SIGNIN_MERCHANT_DATA_VERIFIED_USER_PASSWORD
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    expect(res.body.userId).exist;

                    // expect wizard completed = true
                    expect(res.body.isWizardCompleted).to.equal(true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    /**
     * Tests suite related to Sign Out's feature.
     */
    describe('Sign Out', function () {
        this.timeout(20000);

        const TEST_SIGNOUT_VERIFIED_USER_NAME = 'signout_verified_username';
        const TEST_SIGNOUT_VERIFIED_USER_EMAIL = 'signout_verified_useremail@gmail.com';
        const TEST_SIGNOUT_VERIFIED_USER_PASSWORD = 'signout_verified_userpassword';
        const TEST_SIGNOUT_VERIFIED_USER_ACCOUNT_TYPE = 'Customer';

        let accessToken = '';

        before((done) => {
            const doLogin = (done) => {
                testHelper.loginTestUserAccount(TEST_SIGNOUT_VERIFIED_USER_NAME, TEST_SIGNOUT_VERIFIED_USER_PASSWORD)
                    .then(token => {
                        accessToken = token;
                        done();
                    })
                    .catch(err => {
                        console.log(`[ERROR] - In before method. Error = ${err}`)
                        done(err);
                    });
            }

            // verified user        
            request(apiAddress)
                .post('/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    username: TEST_SIGNOUT_VERIFIED_USER_NAME,
                    email: TEST_SIGNOUT_VERIFIED_USER_EMAIL,
                    password: TEST_SIGNOUT_VERIFIED_USER_PASSWORD,
                    accountType: TEST_SIGNOUT_VERIFIED_USER_ACCOUNT_TYPE
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).exist;
                    const userId = res.body.id;

                    testHelper.verifyTestUserAccount(userId)
                        .then(() => {
                            doLogin(done);
                        })
                        .catch(err => {
                            done(err);
                        });
                })
                .catch(err => {
                    done(err);
                });
        });

        after(() => {
            testHelper.disposeTestUserAccount(TEST_SIGNOUT_VERIFIED_USER_NAME);
        });


        it("Return error if user doesn't supply access token", function (done) {
            request(apiAddress)
                .post('/users/logout')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res).to.have.status(500);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(500);
                    done();
                });
        });

        it("Return error if user supply invalid access token", function (done) {
            request(apiAddress)
                .post('/users/logout?access_token=abcdef')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res).to.have.status(500);
                    done();
                })
                .catch(err => {
                    expect(err).to.not.be.null;
                    expect(err).to.have.status(500);
                    done();
                });
        });

        it("Return Ok if user supply valid access token", (done) => {
            request(apiAddress)
                .post(`/users/logout?access_token=${accessToken}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res).to.not.be.null;
                    expect(res).to.have.status(204);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});