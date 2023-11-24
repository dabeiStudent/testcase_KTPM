const User = require('../models/userModel');

const chai = require('chai');
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
    it('it should say hello to me', () => {
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
});