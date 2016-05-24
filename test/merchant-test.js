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

/**
 * Tests suite related to create merchant's feature.
 */
describe('Create Merchant', function () {
    this.timeout(20000);

    const TEST_CREATE_MERCHANT_USER_NAME = 'create_merchant_username';
    const TEST_CREATE_MERCHANT_USER_EMAIL = 'create_merchant_useremail@gmail.com';
    const TEST_CREATE_MERCHANT_USER_PASSWORD = 'create_merchant_userpassword';
    const TEST_CREATE_MERCHANT_ACCOUNT_TYPE = 'Merchant';

    const TEST_CREATE_MERCHANT_NAME = 'create_merchant_name';
    const TEST_CREATE_MERCHANT_EMAIL = 'create_merchant_email@gmail.com';
    const TEST_CREATE_MERCHANT_TYPE = 'create_merchant_type';
    const TEST_CREATE_MERCHANT_DELIVERY_METHOD = 'create_merchant_delivery_method';

    let merchantUserId = '';
    let accessToken = '';

    before((done) => {
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
                            });;
                    });
            })
            .catch(err => {
                done(err);
            });
    });

    after(() => {
        userTestHelper.disposeTestUserAccount(TEST_CREATE_MERCHANT_USER_NAME);
        userTestHelper.disposeRoleMappingById(merchantUserId);
        merchantTestHelper.disposeTestMerchantAccountByName(TEST_CREATE_MERCHANT_NAME);
    });

    it('Return error when name is Empty', (done) => {
        request(apiAddress)
            .post(`/Merchants?access_token=${accessToken}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                nama: '',
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
                nama: TEST_CREATE_MERCHANT_NAME,
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
                nama: TEST_CREATE_MERCHANT_NAME,
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
                nama: TEST_CREATE_MERCHANT_NAME,
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
                nama: TEST_CREATE_MERCHANT_NAME,
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
                nama: TEST_CREATE_MERCHANT_NAME,
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
});