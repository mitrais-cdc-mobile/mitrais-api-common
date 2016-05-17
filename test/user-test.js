"use strict"
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiHttp);
chai.use(chaiAsPromised);

const apiAddress = 'http://localhost:3001/api';
const testHelper = require('./user-test-helpers');

const expect = chai.expect;
const request = chai.request;

const TEST_USER_NAME = 'userTest';
const TEST_USER_NAME1 = 'mitmartusername';
const TEST_USER_PASSWORD = 'username';
const TEST_USER_EMAIL = 'userTest@gmail.com';

const TEST_VERIFIED_USER_NAME = 'verifiedUserMitMart';
const TEST_VERIFIED_USER_EMAIL = 'verifiedUserMitMart@gmail.com';
const TEST_VERIFIED_USER_PASSWORD = 'verifiedUserPassword';

/**
 * Tests suite related to Sign Up's feature.
 */
describe('Sign Up', function () {
    this.timeout(20000);

    before(() => {
        testHelper.createTestUserAccount(TEST_USER_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD);    
    });

    after(() => {
        testHelper.disposeTestUserAccount(TEST_USER_NAME);
        testHelper.disposeTestUserAccount(TEST_USER_NAME1);
    });

    it('Return error when Username is Empty', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'user1@gmail.com',
                password: 'user1',
                username: ''
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
                password: 'user1',
                username: 'user1'
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
                email: 'user1@gmail.com',
                password: '',
                username: 'user1'
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
                email: 'user1',
                password: 'user1',
                username: 'user1'
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

    // it('Return error when Username is already Exist', function (done) {
    //     request(apiAddress)
    //         .post('/users')
    //         .set('Content-Type', 'application/json')
    //         .set('Accept', 'application/json')
    //         .send({
    //             email: 'userTest1@gmail.com',
    //             password: 'userTest1',
    //             username: 'userTest'
    //         })
    //         .then(res => {
    //             expect(res).to.have.status(422);
    //             done();
    //         })
    //         .catch(err => {
    //             expect(err).to.not.be.null;
    //             expect(err).to.have.status(422);
    //             done();
    //         });
    // });

    // it('Return error when Email already Exist', function (done) {
    //     request(apiAddress)
    //         .post('/users')
    //         .set('Content-Type', 'application/json')
    //         .set('Accept', 'application/json')
    //         .send({
    //             email: 'userTest@gmail.com',
    //             password: 'userTest1',
    //             username: 'userTest1'
    //         })
    //         .then(res => {
    //             expect(res).to.have.status(422);
    //             done();
    //         })
    //         .catch(err => {
    //             expect(err).to.not.be.null;
    //             expect(err).to.have.status(422);
    //             done();
    //         });
    // });

    it('Return OK when all Data is Valid', function (done) {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'mitmartvalidemail@gmail.com',
                password: 'mitmartpassword',
                username: TEST_USER_NAME1
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.email).to.equal('mitmartvalidemail@gmail.com');
                expect(res.body.username).to.equal(TEST_USER_NAME1);
                expect(res.body.id).exist;
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
describe('Access security', function(){
    let testUserId = "";

    before(() => {
        testHelper.createTestUserAccount(TEST_USER_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD)
            .then(id => {
                testUserId = id;
            })
            .catch(err => console.log(`[ERROR] - In before method. Error = ${err}`));
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
        this.timeout(10000);
        const email = 'mitraiscdcmobiledev@gmail.com';

        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                username: email,
                email: email,
                password: TEST_USER_PASSWORD
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.email).to.equal(email);
                expect(res.body.username).to.equal(email);
                expect(res.body.id).exist;
                testHelper.disposeTestUserAccount(email);
                done();
            })
            .catch(err => {
                console.log(`[DEBUG] - err of sign up = ${JSON.stringify(err)}`);
                done(err);
            });
    });

    // it("returns error when Authenticated user try to get other user records that does not belong to the user.", function (done) {
    //     this.timeout(10000);
    //     const SecondUserMail = "mitraiscdcmobildev1@gmail.com";

    //     // Do the test when 2nd test user has signed in
    //     const on2ndTestUserLoggedIn = (authToken, userId, done) => {
    //         const getByIdApiPath = `/users/${testUserId}?access_token=${authToken}`;

    //         request(apiAddress)
    //             .get(getByIdApiPath)
    //             .set('Content-Type', 'application/json')
    //             .set('Accept', 'application/json')
    //             .end((err, res) => {
    //                 expect(err).to.not.be.null;
    //                 expect(err).to.have.status(401);
    //                 testHelper.disposeTestUserAccountById(userId);
    //                 done();
    //             });
    //     };

    //     // Do sign in using 2nd test user
    //     const doSignInUsing2ndTestUser = (userId, done) => {
    //         request(apiAddress)
    //             .post('/users/login')
    //             .set('Content-Type', 'application/json')
    //             .set('Accept', 'application/json')
    //             .send({
    //                 username: SecondUserMail,
    //                 password: TEST_USER_PASSWORD
    //             })
    //             .then(res => {
    //                 const authToken = JSON.parse(res.text).id;
    //                 on2ndTestUserLoggedIn(authToken, userId, done);
    //             })
    //             .catch(err => {
    //                 console.log(`[DEBUG] - err of sign in = ${JSON.stringify(err)}`);
    //                 done(err);
    //             });
    //     };

    //     // Signup 2nd test user through REST API
    //     request(apiAddress)
    //         .post('/users')
    //         .set('Content-Type', 'application/json')
    //         .set('Accept', 'application/json')
    //         .send({
    //             username: SecondUserMail,
    //             email: SecondUserMail,
    //             password: TEST_USER_PASSWORD
    //         })
    //         .then(res => {
    //             expect(res).to.have.status(200);
    //             expect(res.body.id).exist;
    //             const userId = res.body.id;

    //             testHelper.verifyTestUserAccount(userId)
    //                 .then(() => doSignInUsing2ndTestUser(userId, done));
    //         })
    //         .catch(err => {
    //             done(err);
    //         });
    // });

    // it("returns ok when Authenticated user retrieve & updates their own User record", function (done) {
    //     this.timeout(10000);
    //     const SecondUserMail = "mitraiscdcmobildev1@gmail.com";

    //     // Do the test when 2nd test user has signed in
    //     const on2ndTestUserLoggedIn = (authToken, userId, done) => {
    //         // Get user's info test
    //         const getByIdApiPath = `/users/${userId}?access_token=${authToken}`;
    //         request(apiAddress)
    //             .get(getByIdApiPath)
    //             .set('Content-Type', 'application/json')
    //             .set('Accept', 'application/json')
    //             .end((err, res) => {
    //                 expect(err).to.be.null;
    //                 expect(res).to.have.status(200);
    //                 expect(res.body.id).exits;
    //                 expect(res.body.id).to.be.equals(userId);
    //                 // Update user's info test
    //                 const updateApiPath = `/users/${userId}`;
    //                 request(apiAddress)
    //                     .put(updateApiPath)
    //                     .set('Authorization', authToken)
    //                     .send({
    //                         "address": "11, 540 Wickham St, Fortitude Valley QLD 4006, Australia",
    //                         "phone": "+61 7 3167 7300"
    //                     })
    //                     .end((err, res) => {
    //                         expect(err).to.be.null;
    //                         expect(res).to.have.status(200);
    //                         testHelper.disposeTestUserAccountById(userId);
    //                         done();
    //                     });
    //             });
    //     };

    //     // Do sign in using 2nd test user
    //     const doSignInUsing2ndTestUser = (userId, done) => {
    //         request(apiAddress)
    //             .post('/users/login')
    //             .set('Content-Type', 'application/json')
    //             .set('Accept', 'application/json')
    //             .send({
    //                 username: SecondUserMail,
    //                 password: TEST_USER_PASSWORD
    //             })
    //             .then(res => {
    //                 const authToken = JSON.parse(res.text).id;
    //                 on2ndTestUserLoggedIn(authToken, userId, done);
    //             })
    //             .catch(err => {
    //                 console.log(`[DEBUG] - err of sign in = ${JSON.stringify(err)}`);
    //                 done(err);
    //             });
    //     };

    //     // Signup 2nd test user through REST API
    //     request(apiAddress)
    //         .post('/users')
    //         .set('Content-Type', 'application/json')
    //         .set('Accept', 'application/json')
    //         .send({
    //             username: SecondUserMail,
    //             email: SecondUserMail,
    //             password: TEST_USER_PASSWORD
    //         })
    //         .then(res => {
    //             expect(res).to.have.status(200);
    //             expect(res.body.id).exist;
    //             const userId = res.body.id;

    //             testHelper.verifyTestUserAccount(userId)
    //                 .then(() => doSignInUsing2ndTestUser(userId, done));
    //         })
    //         .catch(err => {
    //             done(err);
    //         });

    // });

    // it("returns error when Authenticated user delete their own User record", function (done) {
    //     this.timeout(10000);
    //     const SecondUserMail = "mitraiscdcmobildev1@gmail.com";

    //     // Do the test when 2nd test user has signed in
    //     const on2ndTestUserLoggedIn = (authToken, userId, done) => {
    //         // Get delete user's record test
    //         const deleteByIdApiPath = `/users/${userId}`;
    //         request(apiAddress)
    //             .delete(deleteByIdApiPath)
    //             .set('Authorization', authToken)
    //             .end((err, res) => {
    //                 expect(err).to.be.not.null;
    //                 expect(err).to.have.status(401);
    //                 testHelper.disposeTestUserAccountById(userId);
    //                 done();
    //             });
    //     };

    //     // Do sign in using 2nd test user
    //     const doSignInUsing2ndTestUser = (userId, done) => {
    //         request(apiAddress)
    //             .post('/users/login')
    //             .set('Content-Type', 'application/json')
    //             .set('Accept', 'application/json')
    //             .send({
    //                 username: SecondUserMail,
    //                 password: TEST_USER_PASSWORD
    //             })
    //             .then(res => {
    //                 const authToken = JSON.parse(res.text).id;
    //                 on2ndTestUserLoggedIn(authToken, userId, done);
    //             })
    //             .catch(err => {
    //                 console.log(`[DEBUG] - err of sign in = ${JSON.stringify(err)}`);
    //                 done(err);
    //             });
    //     };

    //     // Signup 2nd test user through REST API
    //     request(apiAddress)
    //         .post('/users')
    //         .set('Content-Type', 'application/json')
    //         .set('Accept', 'application/json')
    //         .send({
    //             username: SecondUserMail,
    //             email: SecondUserMail,
    //             password: TEST_USER_PASSWORD
    //         })
    //         .then(res => {
    //             expect(res).to.have.status(200);
    //             expect(res.body.id).exist;
    //             const userId = res.body.id;

    //             testHelper.verifyTestUserAccount(userId)
    //                 .then(() => doSignInUsing2ndTestUser(userId, done));
    //         })
    //         .catch(err => {
    //             done(err);
    //         });
    // });
});

/**
 * Tests suite related to Sign In's feature.
 */
describe('Sign In', function(){
    this.timeout(20000);
    before(() => {
        // unverified user
        testHelper.createTestUserAccount(TEST_USER_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD)
            .catch(err => console.log(`[ERROR] - In before method. Error = ${err}`));

        // verified user        
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                username: TEST_VERIFIED_USER_NAME,
                email: TEST_VERIFIED_USER_EMAIL,
                password: TEST_VERIFIED_USER_PASSWORD
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.id).exist;
                const userId = res.body.id;

                testHelper.verifyTestUserAccount(userId)
                    .catch(err => {
                        done(err);
                    });
            })
            .catch(err => {
                done(err);
            });
    });

    after(() => {
        testHelper.disposeTestUserAccount(TEST_USER_NAME);
        testHelper.disposeTestUserAccount(TEST_VERIFIED_USER_NAME);
    });

    it('Return error when using empty username and password', (done) => {
        request(apiAddress)
            .post('/users/login')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                username: '',
                password: TEST_USER_PASSWORD
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
                password: TEST_USER_PASSWORD
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
                email: TEST_USER_EMAIL,
                password: TEST_USER_PASSWORD
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
                username: TEST_USER_NAME,
                password: TEST_USER_PASSWORD
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
            .post('/users/login')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: TEST_VERIFIED_USER_EMAIL,
                password: TEST_VERIFIED_USER_PASSWORD
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.id).exist;
                expect(res.body.userId).exist;
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('Return OK when using verified user with valid username and password', (done) => {
        request(apiAddress)
            .post('/users/login')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                username: TEST_VERIFIED_USER_NAME,
                password: TEST_VERIFIED_USER_PASSWORD
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.id).exist;
                expect(res.body.userId).exist;
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
describe('Sign Out', function(){
    this.timeout(20000);
    let accessToken = '';
    before(() => {
        const doLogin = () => {
            testHelper.loginTestUserAccount(TEST_VERIFIED_USER_NAME, TEST_VERIFIED_USER_PASSWORD)
                .then(token => { accessToken = token })
                .catch(err => console.log(`[ERROR] - In before method. Error = ${err}`));
        }

        // verified user        
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                username: TEST_VERIFIED_USER_NAME,
                email: TEST_VERIFIED_USER_EMAIL,
                password: TEST_VERIFIED_USER_PASSWORD
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.id).exist;
                const userId = res.body.id;

                testHelper.verifyTestUserAccount(userId)
                    .then(() => {
                        doLogin();
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
        testHelper.disposeTestUserAccount(TEST_VERIFIED_USER_NAME);
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
            .post(`/users/logout?access_token${accessToken}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then(res => {
                expect(res).to.be.null;
                expect(res).to.have.status(200);
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});