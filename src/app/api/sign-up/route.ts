import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request : Request){
    await dbConnect()
    try {
        console.log("complete")

        let body;
        try {
            body  = await request.json()
            console.log("body",body)
        } catch (error) {
            return Response.json({
                success : false,
                message : "Invalid JSON fromat"
            } , { status : 500 })
        }

        const {username,email,password} = body
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username , 
            isVerified : true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success : false,
                message : "Username is allready taken"
            } , { status : 400 })
        }

        const existingUserByEmail  = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                success : false,
                message : "User already exist with this email"
            } , { status : 400 })
            }
            else {
                const hasedPassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode ; 
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hasedPassword = await bcrypt.hash(password , 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

           const newUser =  new UserModel({
                    username ,
                    email ,
                    password : hasedPassword,
                    verifyCode ,
                    verifyCodeExpiry : expiryDate ,
                    isVerified : false ,
                    isAcceptingMessage : true,
                    messages : []
            })

            await newUser.save()

        }

        // send verifcation email

        const emaileResponse = await sendVerificationEmail(
            email ,
            username,
            verifyCode
        )

        if (!emaileResponse.success) {
            return Response.json({
                success : false,
                message : emaileResponse.message
            } , { status : 500 })
        }

        return Response.json({
                success : true,
                message : "User registerd successfully. Please verify your email"
            } , { status : 200 })

    } catch (error) {

        console.error("Error Registring user",error)
        return Response.json({
            success : false,
            message : "Error registring user"
        },
        {
            status : 500
        })
    }
}