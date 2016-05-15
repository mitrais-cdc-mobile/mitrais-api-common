"use strict"
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiHttp);
chai.use(chaiAsPromised);

const apiAddress = 'http://localhost/api';
const testHelper = require('./user-test-helpers');

const expect = chai.expect;
const request = chai.request;

const TEST_USER_NAME = 'userTest';
const TEST_USER_NAME1 = 'user1';
const TEST_USER_PASSWORD = 'username';
const TEST_USER_EMAIL = 'userTest@gmail.com';


/**
 * Tests suite related to Sign Up's feature.
 */
describe('Sign Up', () => {
    before(() => {
        process.env.MITMART_SIGNUP_AUTOVERIFICATION = true;
        testHelper.createTestUserAccount(TEST_USER_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD);
    });

    after(() => {
        testHelper.disposeTestUserAccount(TEST_USER_NAME);
        testHelper.disposeTestUserAccount(TEST_USER_NAME1);
        process.env.MITMART_SIGNUP_AUTOVERIFICATION = false;
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

    it('Return error when Username is already Exist', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'userTest1@gmail.com',
                password: 'userTest1',
                username: 'userTest'
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

    it('Return error when Email already Exist', (done) => {
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'userTest@gmail.com',
                password: 'userTest1',
                username: 'userTest1'
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
        this.timeout(10000);
        request(apiAddress)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                email: 'user1@gmail.com',
                password: 'user1',
                username: 'user1'
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.email).to.equal('user1@gmail.com');
                expect(res.body.username).to.equal('user1');
                expect(res.body.id).exist;
                done();
            })
            .catch(err => {
                console.log(`[ERROR] - err =${JSON.stringify(err)}`);
                done(err);
            });
    });
});

/**
 * Tests suite related to access security
 */
describe('Access security', () => {
    let testUserId = "";

    before(() => {
        process.env.MITMART_SIGNUP_AUTOVERIFICATION = true;
        testHelper.createTestUserAccount(TEST_USER_NAME, TEST_USER_EMAIL, TEST_USER_PASSWORD)
            .then(id => { testUserId = id; })
            .catch(err => console.log(`[ERROR] - In before method. Error = ${err}`));
    });

    after(() => {
        testHelper.disposeTestUserAccount(TEST_USER_NAME);
        process.env.MITMART_SIGNUP_AUTOVERIFICATION = false;
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
                done(err);
            });
    });

    it("returns error when Authenticated user try to get other user records that does not belong to the user.", function (done) {
        this.timeout(10000);
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
                password: TEST_USER_PASSWORD
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
        // done();
    });

    it("returns ok when Authenticated user retrieve & updates their own User record", function(done) {
        this.timeout(10000);
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
                    // Update user's info test
                    const updateApiPath = `/users/${userId}`;
                    request(apiAddress)
                        .put(updateApiPath)
                        .set('Authorization', authToken)
                        .send({ "address": "11, 540 Wickham St, Fortitude Valley QLD 4006, Australia",
                                "phone": "+61 7 3167 7300" })
                        .end((err, res)=>{
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
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
                password: TEST_USER_PASSWORD
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

    it("returns error when Authenticated user delete their own User record", function(done) {
        this.timeout(10000);
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
                password: TEST_USER_PASSWORD
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