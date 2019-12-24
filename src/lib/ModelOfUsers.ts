import mongoose from 'mongoose';
const bcrypt = require('bcrypt'); //alogirthme de chiffrement pr mdp
const SALT_WORK_FACTOR = 10;


const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
{ collection: 'myuusers' }
);

UserSchema.pre('save', function(this: any, next) {
    this.password = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
    next();
});

UserSchema.methods.comparePassword = function(testPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(testPassword, this.password).then((equal) => {
            if (equal) {
                resolve(true);
            } else {
                reject(false);
            }
        }).catch((err) => {
            reject(err);
        });
    });
};
