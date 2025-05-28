import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import UserModel from "@/model/User.model";

export async function POST(request:Request) {
    
    await dbConnect()

    const {username , code} = await request.json()

    const decodedusername = decodeURIComponent(username)

    const user = await UserModel.findOne({ username : decodedusername})

    if (!user) {
        return Response.json({
            success : false,
            message : "User not found"
        }, { status : 500} )
    }

    const isCodeValid = user.verifyCode === code
    const isCodenotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if (isCodeValid && isCodenotExpired) {
        user.isVerified = true
        await user.save()
        return Response.json({
            success : true,
            message : "Account verified successfully"
        }, { status : 200} )
    }else if(!isCodenotExpired){
         return Response.json({
            success : false,
            message : "Verification code has expired  please signup again to get a  new code"
        }, { status : 400} )
    }
    else {
        return Response.json({
            success : false,
            message : "Incorrect Verification code"
        }, { status : 400} )
    }
    
    try {
        
    } catch (error) {
        console.error("Error verifying",error)
        return Response.json({
            success : false,
            message : "Error verifying"
        }, { status : 500} )
    }

}