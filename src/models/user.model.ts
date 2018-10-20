import { Schema, Model, model, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password: string;
    salt: string;
    isAdmin: boolean;
    comparePassword: Function;
}

export var UserSchema: Schema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    salt: {
        type: Schema.Types.String
    },
    isAdmin: {
        type: Schema.Types.Boolean,
        default: false
    }
});

UserSchema.pre('save', function (next) {
    var self = this;
    if (self.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(self.password, salt, function (err, hash) {
                try {
                    if (err) return next(err);
                    self.password = hash;
                    self.salt = salt;
                    next();
                } catch (e) {
                    if (e) return next(e);
                }

            });
        });
    } else {
        next();
    }
});

UserSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); 
}, 'E-mail address invalid.')

UserSchema.methods.comparePassword = function (password, user, callback) {
    bcrypt.compare(password, user.password, function (err, match) {
        if (err) callback(err);
        if (match) {
            callback(null, true);
        } else {
            callback({err : true});
        }
    });
};

export const User: Model<IUser> = model<IUser>('User', UserSchema);
