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


function page() {

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
            
            const response =  await axios.get(`/api/check-username-unique?username=${debuncedUsername}`)
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
    <div className=''>
      
    </div>
  )
}

export default page
