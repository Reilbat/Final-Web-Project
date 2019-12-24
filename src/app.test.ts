require('custom-env').env(process.env.APP_ENV); //?
import mongoose from 'mongoose' //mongoose va nous permettre de faire des tests sur mongodb
import { UserSchema } from '../src/lib/ModelOfUsers';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/server');
let should = chai.should();

chai.use(chaiHttp);

const User = mongoose.model('User', UserSchema);
var UserTest= new User({
        firstName: "adaFs",
        lastname: "adaLs",
        username: "adaUser",
        password: "adaPass"
    });

    describe('Tests', () => {
        before((done) => {
            mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true})
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
                User.create(UserTest).then((doc) => {
                    done();
                })
            });
    
            it('Get User', (done) => { //test d'obtention user
                User.findOne({ username: 'adaUser' }).then((doc) => {
                    chai.expect(doc).to.exist;
                    done();
                })
            });
        });

    });
    export = {};