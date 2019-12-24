import mongoose from 'mongoose' 
import { UserSchema } from '../src/ModelOfUsers';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');

chai.use(chaiHttp);

const User = mongoose.model('User', UserSchema);

var UserTest= new User({
    firstName: 'ftest', 
    lastname: 'ltest',
    username: 'testu', 
    password: '123',
    metrics:[[1577216273,29],[1577216261,19],[1577216272,9]]
    });

    describe('Tests', () => {
        before((done) => {
            mongoose.connect('mongodb://localhost:27017/gfg')
            .then(() => {
                done();
            })
        });
    
        after((done) => {
            mongoose.connection.close();
            done();
        });
    
        //TEST de la DB
        describe('Database Tests', () => {
            it('Add User', (done) => { //Test de l'ajout d'user
                User.collection.insert(UserTest).then((doc) => {
                    done();
                })
            });

    
            it('Get User', (done) => { //test d'obtention user
                User.findOne({ username: 'testu' }).then((doc) => {
                    chai.expect(doc).to.exist;
                    done();
                })
            });
    });
});

export = {};