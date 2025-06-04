import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request : Request) {
    
    await dbConnect()

    const {username,content} = await request.json()

    try {
        
      const user = await UserModel.findOne({username})

      if (!username) {
        return Response.json({
            success : false,
            message : "User Not Found"
        }, {status : 404})
      }

      if (!user?.isAcceptingMessage) {
        
        return Response.json({
            success : false,
            message : "User is Not Acccepting Message"
        }, {status : 403})
      }

      const newMessage = {content , createdAt : new Date() }
      user.messages.push(newMessage as Message)
      await user.save()

      
        return Response.json({
            success : true,
            message : "Message sent successfully"
        }, {status : 404})

    } catch (error) {
        console.log("error adding message",error)
        return Response.json({
            success : false,
            message : "internal server Error" 
        }, {status : 500})
    }

}