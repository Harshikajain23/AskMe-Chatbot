import React from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { useState } from 'react'
import moment from 'moment'
import ChatBox from './ChatBox'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({isMenuOpen, setIsMenuOpen}) => {

  const {chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, setChats, fetchUsersChats,token, setToken} = useAppContext()
  const [search, setSearch] = useState('')

  const logout = ()=> {
   
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')
    
  }

  const handleNewChat = () => {
  setSelectedChat({ messages: [] })  // empty chat
  navigate('/')
  setIsMenuOpen(false) 

}

const deleteChat = async (e, chatId) => {
  try {
    e.stopPropagation()
    const confirm = window.confirm('Are you sure you want to delete this chat?')

    if(!confirm)
      return

    const {data} = await axios.post('/api/chat/delete', {chatId}, {
      headers: {Authorization : `Bearer ${token}`}
    })

    if(data.success){
      setChats( prev => prev.filter(chat => chat._id !== chatId))
      await fetchUsersChats()
      toast.success(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}


  return (
    <div
  className={`flex flex-col h-screen w-1/6 p-5
  dark:bg-gradient-to-b from-[#1F1F1F]/70 to-[#0F0F0F]/90
  border-r border-[#3F3F46]/40 backdrop-blur-3xl
  transition-transform duration-500 left-0 top-0 z-50 fixed
  ${isMenuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
  `}
> 
      <div className='flex flex-col'>
      {/* Logo */}
      <img src = {theme === 'dark' ? assets.logo_full_dark : assets.logo_full} alt="" className=' w-full max-w-80'/>

      {/* New Chat Button */}

      <button onClick={createNewChat} className='flex justify-center items-center w-full py-2 mt-1 text-white bg-gradient-to-r from-[#424849] to-[#bac2ce] text-sm rounded-md cursor-pointer' >
        <span className='mr-2 text-xl'> + </span> New Chat
      </button>

      {/* Search Conversations */}

      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>

      <img src={assets.search_icon} className='w-4 not-dark:invert' alt=""/>
      <input onChange={(e)=> setSearch(e.target.value)} value={search} type='text' placeholder='Search conversations' className='text-xs placeholder:text-gray-400 outline-none'/>
      </div>

      </div>

      
      {/* Recent Chats */}
      {chats.length> 0 && <p className='mt-4 text-sm'>Recent Chats</p>}
      <div className='flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 mt-3 text-sm space-y-3'>
        {
          chats.filter((chat)=> chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat)=> <div onClick={()=> {navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }} key={chat._id} className='p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md curosr-pointer flex justify-between group'> 
          <div>
            <p className='truncate w-full'>
              {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32): chat.name}
            </p>

            <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>
              {moment(chat.updatedAt).fromNow()}
            </p>
          </div>
          <img onClick={e=> (deleteChat(e, chat._id), {loading: 'deleting...'})} src={assets.bin_icon} className='hidden group-hover:block w-4 cursor-pointer not-dark:invert' alt=""/>

            </div>)

        
          
        }

        
      </div>
        {/* Community Images */}
        <div className='flex flex-col'>
        <div onClick={() => {
    setIsMenuOpen(false)
    setTimeout(() => navigate('/community'), 200)
  }} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scal-103 transition-all'>
          <img src={assets.gallery_icon} className='w-4.5 not-dark:invert' alt="" />
          <div className='flex flex-col text-sm'>
            <p> Community Images</p>
          </div>
        </div>

        {/* Credit Purchase Option */}
         <div onClick={() => {
    setIsMenuOpen(false)
    setTimeout(() => navigate('/credits'), 200)
  }} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scal-103 transition-all'>
          <img src={assets.diamond_icon} className='w-4.5 dark:invert' alt="" />
          <div className='flex flex-col text-sm'>
            <p> Credits : {user?.credits}</p>
            <p className='text-xs text-gray-400'>Purchase credits to use AskMe chatbot</p>
          </div>
        </div>

         {/* Dark Mode Toggle */}
        <div className='flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md'>
          <div className='flex items-center gap-2 text-sm'>
            <img src={assets.theme_icon} className='w-4 not-dark:invert' alt="" />
            <p> Dark Mode</p>
          </div>
          <label className='relative inline-flex cursor-pointer'> 
            <input onChange={()=> setTheme(theme === 'dark' ? 'light' : 'dark')} type='checkbox' className='sr-only peer' checked={theme === 'dark'}/> 

            <div className='w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-gray-600 transition-all'>

            </div>

            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4 z-1'></span>
          </label>
        </div> 

        {/* User Account */}
        <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group'>
          <img src={assets.user_icon} className='w-7 rounded-full' alt="" />
          <p className='flex-1 text-sm dark:text-primary truncate'> {user ? user.name : 'Login your account'}</p>
          {user && <img onClick={logout} src={assets.logout_icon} className='h-5 cursor-pointer hidden not-dark:invert group-hover:block'/>}
          </div>

          <img onClick={()=> setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' alt=""/>
        </div>
        </div>
   
  )
}

export default Sidebar