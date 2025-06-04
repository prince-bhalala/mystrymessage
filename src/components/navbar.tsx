'use client'
import { useSession ,signOut } from 'next-auth/react'
import {User} from 'next-auth'

import Link from 'next/link'
import React, { use } from 'react'
import { Button } from './ui/button'


const navbar = () => {

    const {data : session} = useSession()
    const user : User = session?.user as User

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">Mystry Message</a>
        {
            session ? (
                <>
                    <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                    <Button
                        onClick={() => signOut()}
                        className="w-full md:w-auto px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition duration-200"
                      >
                        Logout
                    </Button>

                </>
            ) : (
                <Link href='/sign-in'>
                    <Button className='w-full md:w-auto' >Login</Button>
                </Link>
            )
        }
      </div>
    </nav>
  )
}

export default navbar
