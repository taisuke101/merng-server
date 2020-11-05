const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput }= require('../../utils/validaters');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    },
    SECRET_KEY, 
    {expiresIn: '24h'});
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
            
            if (!valid) {
                throw new UserInputError('Error', { errors })
            }

            const user = await User.findOne({ username })
            if(!user) {
                errors.general = 'ユーザーが見つかりません';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = '登録情報と一致しません！';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(
            _, 
            { 
                registerInput: { username, email, password, confirmPassword}
            }
            )  {
            // validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // TODO make sure user doesnt already exist
            const user =  await User.findOne({ username });
                if(user) {
                    throw new UserInputError('すでに存在しているユーザーです', {
                        errors: {
                            username: 'すでに存在しているユーザー名です'
                        }
                    })
                }
            // hash password  and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res)
            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}