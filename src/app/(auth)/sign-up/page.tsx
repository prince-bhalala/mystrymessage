'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z  from "zod" 
import Link from 'next/link'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/Schemas/signUpSchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponsa'
import { Form, FormField, FormItem, FormLabel, FormMessage  } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {Loader2} from 'lucide-react'


export default function Signup() {

    const [username,setUsername] = useState('')
    const [usernameMessage,setUsernameMessage] = useState('')
    const [isChakingUsername,setIsChakingUsername] = useState(false)
    const [isSubmiting,setIsSubmiting] = useState(false)
    const router = useRouter()
    const debuncedUsername =  useDebounceValue(username , 300)

    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver : zodResolver(signUpSchema),
      defaultValues : {
        username : '',
        email : '',
        password : ''
      }
    })

    useEffect( () => {

      const checkUsernameunique = async () => {
        
        if (debuncedUsername) {
          setIsChakingUsername(true)
          setUsernameMessage('')

          try {
            
            const response =  await axios.get(`/api/check-username-unique?username
              =${debuncedUsername}`)
            setUsernameMessage(response.data.message)


          } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            setUsernameMessage(
              axiosError.response?.data.message ?? "Error cheking username"
            )
          }finally{
            setIsChakingUsername(false)
          }

        }

      }
      checkUsernameunique()
    

    },[debuncedUsername])

    const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
      setIsSubmiting(true)
      try {
        const response = await axios.post('/api/sign-up',data)
        toast(response.data.message)
        router.replace(`/verify/${username}`)
        setIsSubmiting(false)
      } catch (error) {
        console.error("Error in sign up of user",error)
         const axiosError = error as AxiosError<ApiResponse>
         let errormessage = axiosError.response?.data.message
         toast(errormessage)
         setIsSubmiting(false)       
      }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isChakingUsername && <Loader2 className="animate-spin" />}
                  {!isChakingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted  text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmiting}>
              {isSubmiting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}