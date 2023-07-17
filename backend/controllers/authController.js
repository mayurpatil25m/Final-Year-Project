
import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'




export const register = async (req, res) => {

    // hashing password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)

    try {

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo
        })

        await newUser.save()

        res.status(200).json({ success: true, message: 'Successfully created' });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create.' });
    }
};

export const login = async (req, res) => {

    const email = req.body.email
    try {

        const user =await User.findOne({email})

        //if user does not found
        if(!user){
            return res.status(404).json({success:false, message:"User not found"})
        }

        //if user if found then check passowrd or compare the password
        const checkcorrectPassword =await  bcrypt.compare(req.body.password, user.password)

        //if password is incorrecte
        if(!checkcorrectPassword){
            return res.status(401).json({success:false,message:"Incorrect email or password"})
        }

        const {password,role, ...rest} = user._doc

        //create jwt token
        const token =jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET_KEY, {expiresIn:"15d" });

        //Set token in the browser cookies and then response to the client
        res.cookie('accessToken', token, {
            httpOnly: false,
            secure:false,
            expires:token.expiresIn
        }).status(200)
        .json({
            token , 
            data:{...rest},
            role,
    });

    } catch (err) {
         res.status(500).json({success:false,message:"Failed to login"});
    }
};

