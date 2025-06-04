'use client'

import React, { useState } from 'react'
import { ApiResponse } from '@/types/ApiResponsa'
import { useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { messageSchema } from '@/Schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const UserMessagePage = () => {
  const params = useParams<{ username: string }>()
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(true)
  const [userMessage, setUserMessage] = useState('')

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: params.username,
        content: data.content
      })

      toast.success(response.data.message)

      if (response.data.message === 'User Not Found') {
        setUserMessage(response.data.message)
        toast.error(response.data.message)
      } else if (response.data.message === 'User is Not Acccepting Message') {
        setIsAcceptingMessage(false)
        setUserMessage(response.data.message)
        toast.error(response.data.message)
      } else {
        form.reset()
        setUserMessage(response.data.message)
        setIsAcceptingMessage(true)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 text-center">
      <h1 className="text-3xl font-bold mb-2">Public Profile Link</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Send Anonymous Message to <span className="font-semibold">{params.username}</span>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Write your anonymous message here"
                    {...field}
                  />
                </FormControl>
                {!userMessage && (
                  <p
                    className={`text-sm mt-2 ${
                      isAcceptingMessage ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {userMessage}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button type="submit" className="w-full sm:w-auto">
              Send It
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UserMessagePage
