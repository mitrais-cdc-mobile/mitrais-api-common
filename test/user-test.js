"use strict"
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const request = chai.request;
const apiAddress = 'http://localhost/api';

const app = require('../server/server')

chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe('Sign Up', () => {
    before(() => {
        let user = app.models.User;
        user.create({ email: 'userTest@gmail.com', password: 'userTest', username: 'userTest' },
            (err, res) => {
                if (err) throw err;
            })
    });

    after(() => {
        let user = app.models.User;
        user.destroyAll({ 'username': 'user1' },
            (err, obj, count) => {
                if (err) throw err;
            });

        user.destroyAll({ 'username': 'userTest' },
            (err, obj, count) => {
                if (err) throw err;
            });
    });

    it('Empty Username Return Error', (done) => {
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

    it('Empty Email Return Error', (done) => {
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

    it('Empty Password Return Error', (done) => {
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

    it('Invalid Email Format Return Error', (done) => {
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

    it('Username Already Exist Return Error', (done) => {
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

    it('Email Already Exist Return Error', (done) => {
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

    it('Valid Email Format Success', (done) => {
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
                done(err);
            });
    });
});