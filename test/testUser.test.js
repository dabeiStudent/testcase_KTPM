const User = require('../models/userModel');

const chai = require('chai');
const sinon = require('sinon');
const argon2 = require('argon2');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

before(() => {
    console.log("Bắt đầu kiểm thử")
})
after(() => {
    console.log('Đã kiểm xong');
})

describe('/Say Hello', () => {
    before(() => {
        console.log('Test chào mọi người');
    })
    it('Chào mọi người', () => {
        chai.request(server)
            .get('/say-hello')
            .end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('msg').eql("Hello bro");
                done();
            });
    });
})

describe('/Create New User', () => {
    beforeEach((done) => {
        User.deleteMany({})
            .then(() => done())
            .catch((error) => done(error));
    });
    it('Thiếu dữ liệu đầu vào nên báo lỗi', (done) => {
        let user = {
            email: "quangduonggay@gmail.com",
            passWord: "123",
            firstName: "Duong"
        }
        chai.request(server)
            .post('/create-user')
            .send(user)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('err').eql("Vui lòng nhập đầy đủ thông tin");
                done();
            });
    });
    it('Dữ liệu email không phù hợp nên báo lỗi', (done) => {
        let user = {
            email: "admin@gmail.com",
            passWord: "123",
            firstName: "Duong",
            lastName: "Le"
        }
        chai.request(server)
            .post('/create-user')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('err').eql("Không thể đặt email này");
                done();
            });
    })
    it('Thông tin nhập vào hợp lệ nên tạo user thành công', (done) => {
        let user = {
            email: "Quangduonggay@gmail.com",
            passWord: "123",
            firstName: "Duong",
            lastName: "Le"
        }
        chai.request(server)
            .post('/create-user')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('msg').eql("Tạo tài khoản thành công");
                done();
            });
    })
    it('2 user có chung email nên báo lỗi', (done) => {
        let user1 = {
            email: "Quangduonggay@gmail.com",
            passWord: "123",
            firstName: "Duong1",
            lastName: "Le1"
        }
        chai.request(server)
            .post('/create-user')
            .send(user1)
            .end((err, res) => {
                res.should.have.status(200);
            });
        let user2 = {
            email: "Quangduonggay@gmail.com",
            passWord: "123",
            firstName: "Duong2",
            lastName: "Le2"
        }
        chai.request(server)
            .post('/create-user')
            .send(user2)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    })
    it('Hàm argon2 trả về kết quả hash lỗi', () => {
        sinon.stub(argon2, 'hash').rejects(new Error('Hashing lỗi'));
        chai.request(server)
            .post('/create-user')
            .send({
                email: 'Quangduonggay@example.com',
                passWord: '123',
                firstName: 'Duong',
                lastName: 'Le',
            })
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.have.property('err').eql("Hashing lỗi");
            })
        argon2.hash.restore();
    });
});

