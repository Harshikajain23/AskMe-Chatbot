import React, { useEffect } from 'react'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import { assets } from '../assets/assets'

const Message = ({message}) => {

  useEffect(()=>{
    Prism.highlightAll()
  }, [message.content])
    return (
  <div className="w-full flex">
    {message.role === "user" ? (
      <div className="w-full flex flex-col items-end my-4 gap-2">
        
        <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#464444] border border-[#827e87]/30 rounded-md max-w-2xl">
          <p className="text-sm dark:text-white">
            {message.content}
          </p>
          <span className="text-xs text-gray-400 dark:text-[#b8b2c0]">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>

        <img
          src={assets.user_icon}
          alt=""
          className="w-8 rounded-full"
        />
      </div>
    ) : (
      <div className="w-full flex flex-col items-start my-4 gap-2">
        
        <div className="flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#464444] border border-[#827e87]/30 rounded-md">
          {message.isImage ? (
            <img
              src={message.content}
              alt=""
              className="w-full max-w-md mt-2 rounded-md"
            />
          ) : (
            <div className="text-sm dark:text-white whitespace-pre-wrap break-words">
              <Markdown>
                {String(message.content || '')}
              </Markdown>
            </div>
          )}

          <span className="text-xs text-gray-400 dark:text-[#b8b2c0]">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      </div>
    )}
  </div>
)
}

export default Message