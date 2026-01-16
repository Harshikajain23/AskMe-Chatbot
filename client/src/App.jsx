import React from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import ChatBox from './components/ChatBox'

import { Community } from './pages/Community'
import Credits from './pages/Credits'


const App = () => {
  return (
    <>
    <div className='dark:bg-gradient-to-b from-[#6B7280] to-[#1F2937] dark:text-white'>
       <div className='flex h-screen w-screen'> 
        <Sidebar />
        
               <div className="flex-1 h-full">
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
        
       

      </div>
    </div>
     
    </>
  )
}

export default App