import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import appwriteInboxServicConfig from '../appwrite/chatServis'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import getProfilesByCache from "../utils/getProfilesThroughache";
import { ArrowLeft, User2 } from "lucide-react";
import { Button } from "../component";

export default function ChatPage() {
  const navigate = useNavigate()
  const { resiverid } = useParams()
  const { register, handleSubmit, reset } = useForm();
  const senderid = useSelector((state) => state.auth.userData?.$id)
  const [messages, setmessages] = useState([])
  const [senderProfile, setsenderProfile] = useState(null)
  const messagesEndRef = useRef(null);
  const messagesFromStor = useSelector((state) => state.inbox.userChats)

  //write and send message
  const onSubmit = async (data) => {
    if (data?.message && senderid && resiverid) {
      const tempSenderMessage = {
        senderid,
        resiverid,
        message: data.message,
      }
      setmessages((prev) => [...prev, tempSenderMessage])
      reset();
      await appwriteInboxServicConfig.writeChat({ senderid, resiverid, message: data.message })
    } else {
      console.log("message && senderid && resiverid somthing is meesing");
    }
  };

  useEffect(() => {
    // setTimeout(() => {
    messages.forEach(async (msg) => {
      if (!msg.seen && msg.$id) {
        try {
          await appwriteInboxServicConfig.updateSeen(msg.$id);
          // Optionally update local state so you don't re-mark same message
          setmessages((prev) => prev.map(m => m.$id === msg.$id ? { ...m, seen: true } : m));
        } catch (err) {
          console.error('Failed to mark message seen', err);
        }
      }
    })
    // }, 2000);
  }, [messages]);

  useEffect(() => {
    getProfilesByCache(resiverid)
      .then((profile) => setsenderProfile(profile))
    const filterdData = messagesFromStor.filter((res) => (res.senderid === senderid && res.resiverid === resiverid) || (res.senderid === resiverid && res.resiverid === senderid))
    setmessages(filterdData)
  }, [messagesFromStor])

  //go to the bottom of the sms list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return senderid && (
    <div className="w-full rounded-lg mx-auto h-dvh flex flex-col bg-body-0 text-text-color-600 shadow-md animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-body-0 shadow animate-slideIn">
        <button onClick={() => navigate(-1)}><ArrowLeft /></button>
        {senderProfile?.profilePic ? <img
          src={senderProfile?.profilePic}
          alt="Receiver"
          className="w-10 h-10 rounded-full object-cover"
        /> : <User2 className="w-10 h-10 rounded-full flex items-center object-cover" />}
        <span className="font-semibold text-text-color-400">{senderProfile?.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-2 px-2 sm:px-4">
        {messages?.map((msg, Index) => (
          (msg.senderid === resiverid || msg.senderid === senderid) ? <div
            key={Index}
            className={`flex ${msg.senderid === senderid ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`inline-block max-w-[75%] px-4 py-2 rounded-full shadow text-sm sm:text-base animate-fadeInUp ${msg.senderid === senderid
                ? "bg-body-700 text-white rounded-tr-none"
                : "bg-body-0 text-text-color-500 border border-body-300 rounded-tl-none"
                }`}
            >
              {msg.message}
            </div>
          </div> : null
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 p-2 sm:p-4 bg-body-0 pb-2.5 sm:mb-0 shadow mt-2 animate-slideIn"
      >
        <input
          type="text"
          {...register("message", { required: true })}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-body-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inputbox-active text-sm sm:text-base"
        />
        <Button
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
}