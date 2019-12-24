require('custom-env').env(process.env.APP_ENV); //?
import mongoose from 'mongoose' //mongoose va nous permettre de faire des tests sur mongodb
import { UserSchema } from '../src/ModelOfUsers';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');
let should = chai.should();

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
        
//probleme avec les metrics dc ca rate 
        describe('API Tests', () => {
            let userLog;
            let user = {
                firstName: 'ftest', 
                lastname: '',
                username: 'testu', 
                password: '123',
                metrics:[[1577216273,29],[1577216261,19],[1577216272,9]]
            }
           it('addMetrics', (done) => {
                chai.request(server)
                    .post('/addMetric')
                    .set([1577216273,29])
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.userId.should.be.eq(user.metrics);
                        done();
                    })
            
         
               it('Access Metrics data', (done) => {
                  chai.request(server)
                      .get('/profile/metrics')
                      .set([1577216273,29])
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.body[0].userId.should.be.eq(user.metrics);
                          done();
                      })
                  }); 
                
            });

});
    export = {};