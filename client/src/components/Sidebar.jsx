import React from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { useState } from 'react'

const Sidebar = ({}) => {

  const {chats, setSelectedChat, theme, setTheme, user} = useAppContext()
  const [search, setSearch] = useState('')

  return (
    <div className='flex flex-col h-screen w-1/6 p-5 dark:bg-gradient-to-b
  from-[#1F1F1F]/70
  to-[#0F0F0F]/90 border-r border-[#3F3F46]/40 backdrop-blur-3xl  transition-all duration-500 max-md:absolute left-0 z-1'>
      {/* Logo */}
      <img src = {theme === 'dark' ? assets.logo_full_dark : assets.logo_full} alt="" className='mt-[0] w-full max-w-80'/>
    </div>
  )
}

export default Sidebar