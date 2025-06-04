import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificatioEmail"
import { ApiResponse } from "@/types/Apiresponse";
import { fa } from "zod/v4/locales";


export async function sendVerificationEmail (
    email : string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username , otp : verifyCode}),
    });
        return {success : true , message : "verification email send succesfully"}
        
    } catch (emailError) {
        console.error("Error sending verification email",emailError)
        return {success : false , message : "failed to send verification email"}
        
    }
}
