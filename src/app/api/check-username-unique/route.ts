import {z} from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/Schemas/signUpSchema";

const UsernameSchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request) {

    await dbConnect()

    try {
        
        const {searchParams} = new URL(request.url)
        const queryParam = { username : searchParams.get("username") }

        // validation with zod

        const result  = UsernameSchema.safeParse(queryParam)
        console.log(result) // remove 
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success : false,
                message : "invalid query parameter"
            } , { status : 400 })
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({ username , isVerified : true})
        if (existingVerifiedUser) {
            return Response.json({
                success : false,
                meassage : " Username is already Taken"
            } , {status : 400})
        }

         return Response.json({
                success : true,
                meassage : " Username is Unique"
            } , {status : 200})

    } catch (error) {
        console.error("Error during cheking Username",error)
        return Response.json({
            success : false,
            message : "Error cheking Username"
        }, { status : 500} )
    }
}