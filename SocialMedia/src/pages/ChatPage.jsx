import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import appwriteInboxServicConfig from '../appwrite/chatServis'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Query } from "appwrite";
import getProfilesByCache from "../utils/getProfilesThroughache";
import { ArrowLeft } from "lucide-react";
import { Button } from "../component";

export default function ChatPage() {
  const navigate = useNavigate()
  const { resiverid } = useParams()
  const { register, handleSubmit, reset } = useForm();
  const senderid = useSelector((state) => state.auth.userData?.$id)
  const [messages, setMessages] = useState([]);
  const [senderProfile, setsenderProfile] = useState(null)
  const messagesEndRef = useRef(null);

  //write and send message
  const onSubmit = async (data) => {
    if (data?.message && senderid && resiverid) {
      const tempSenderMessage = {
        senderid,
        resiverid,
        message: data.message,
        // $permissions: [`update("user:${senderid}")`, `delete("user:${senderid}")`]
      }
      setMessages((prev) => [...prev, tempSenderMessage])
      reset();

      await appwriteInboxServicConfig.writeChat({ senderid, resiverid, message: data.message })
      getMessages()
    } else {
      console.log("message && senderid && resiverid somthing is meesing");
    }
  };

  //resive message and set to setMessages
  async function getMessages() {
    if (senderid && resiverid) {
      await getProfilesByCache(resiverid)
        .then((profileData) => setsenderProfile(profileData))

      const queries = [
        Query.equal("senderid", [senderid, resiverid]),
        Query.equal("resiverid", [resiverid, senderid]),
      ]
      await appwriteInboxServicConfig.getChats(queries)
        .then((e) => setMessages(e.documents))
        .catch((error) => console.log(error))
    }
  }
  useMemo(() => getMessages(), [resiverid])

  //go to the bottom of the sms list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return senderid && (
    <div className="w-full rounded-lg mx-auto h-svh flex flex-col bg-bground-200 text-fground-200 shadow-md animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-white shadow animate-slideIn">
        <button onClick={() => navigate(-1)}><ArrowLeft /></button>
        <img
          src={senderProfile?.profilePic}
          alt="Receiver"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-gray-800">{senderProfile?.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-2 px-2 sm:px-4">
        {messages?.map((msg, Index) => (
          <div
            key={Index}
            className={`flex ${msg.senderid === senderid ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`inline-block max-w-[75%] px-4 py-2 rounded-full shadow text-sm sm:text-base animate-fadeInUp ${msg.senderid === senderid
                ? "bg-fground-100 text-white rounded-tr-none"
                : "bg-white text-gray-900 border border-gray-300 rounded-tl-none"
                }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 p-2 sm:p-4 bg-white mb-1.5 sm:mb-0 shadow mt-2 animate-slideIn"
      >
        <input
          type="text"
          {...register("message", { required: true })}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        />
        <Button
          type="submit"
          // className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          Send
        </Button>
      </form>
    </div>
  );
}