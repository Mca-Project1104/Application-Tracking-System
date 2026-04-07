import React, { useState, useRef, useEffect } from "react";

const ChatSystem = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "John Doe",
      position: "Frontend Developer",
      lastMessage:
        "Thank you for the opportunity! I look forward to hearing from you.",
      time: "2:30 PM",
      unread: 2,
      avatar: "https://picsum.photos/seed/user1/40/40.jpg",
      online: true,
    },
    {
      id: 2,
      name: "Alice Smith",
      position: "UI/UX Designer",
      lastMessage: "I have attached my portfolio for your review.",
      time: "1:15 PM",
      unread: 0,
      avatar: "https://picsum.photos/seed/user2/40/40.jpg",
      online: true,
    },
    {
      id: 3,
      name: "Robert Johnson",
      position: "Backend Developer",
      lastMessage:
        "Is there a specific time you'd like to schedule the interview?",
      time: "Yesterday",
      unread: 1,
      avatar: "https://picsum.photos/seed/user3/40/40.jpg",
      online: false,
    },
    {
      id: 4,
      name: "Emily Davis",
      position: "Product Manager",
      lastMessage: "I appreciate the detailed feedback on my application.",
      time: "Yesterday",
      unread: 0,
      avatar: "https://picsum.photos/seed/user4/40/40.jpg",
      online: false,
    },
    {
      id: 5,
      name: "Michael Wilson",
      position: "Frontend Developer",
      lastMessage: "I'm available for an interview next week.",
      time: "2 days ago",
      unread: 0,
      avatar: "https://picsum.photos/seed/user5/40/40.jpg",
      online: false,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0],
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "recruiter",
      content:
        "Hi John, thank you for your interest in the Frontend Developer position. I'd like to schedule an interview with you.",
      time: "10:00 AM",
      date: "Today",
    },
    {
      id: 2,
      sender: "candidate",
      content:
        "Hi! I'm excited about this opportunity. When would be a good time for the interview?",
      time: "10:15 AM",
      date: "Today",
    },
    {
      id: 3,
      sender: "recruiter",
      content: "How about this Thursday at 2 PM? We can do a video call.",
      time: "10:30 AM",
      date: "Today",
    },
    {
      id: 4,
      sender: "candidate",
      content:
        "That works perfectly for me. I'll prepare some examples of my work to share.",
      time: "10:45 AM",
      date: "Today",
    },
    {
      id: 5,
      sender: "recruiter",
      content:
        "Great! I'll send you a calendar invite with the video call link. Looking forward to speaking with you.",
      time: "11:00 AM",
      date: "Today",
    },
    {
      id: 6,
      sender: "candidate",
      content:
        "Thank you for the opportunity! I look forward to hearing from you.",
      time: "2:30 PM",
      date: "Today",
    },
  ]);

  const messagesEndRef = useRef(null);
  const [showConversationList, setShowConversationList] = useState(true);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "recruiter",
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        date: "Today",
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      // Update the last message in the conversation
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: message,
                time: new Date.toLocaleTimeString(),
              }
            : conv,
        ),
      );
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Mark as read
    setConversations(
      conversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv,
      ),
    );
    // On mobile, switch to chat view
    if (window.innerWidth < 768) {
      setShowConversationList(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBackToList = () => {
    setShowConversationList(true);
  };

  return (
    <div className="bg-white  w-auto dark:bg-gray-900 mt-4 p-4  shadow-lg rounded-lg overflow-hidden h-[calc(100vh-3rem)]">
      <div className="flex h-full">
        {/* Conversations List - Hidden on mobile when chat is open */}
        <div
          className={`${showConversationList ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 border-r border-gray-200 dark:border-gray-700`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="mt-2 relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                  selectedConversation.id === conversation.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="relative shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={conversation.avatar}
                    alt={conversation.name}
                  />
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-900"></span>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.name}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conversation.position}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area - Hidden on mobile when conversation list is shown */}
        <div
          className={`${!showConversationList ? "flex" : "hidden"} md:flex flex-col flex-1`}
        >
          {/* Chat Header */}
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {/* Back button on mobile */}
              <button
                onClick={handleBackToList}
                className="md:hidden mr-3 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>

              <div className="relative shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                />
                {selectedConversation.online && (
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-900"></span>
                )}
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {selectedConversation.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedConversation.position}
                </p>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </button>
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </button>
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((msg, index) => {
              const showDate =
                index === 0 || messages[index - 1].date !== msg.date;
              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center ">
                      <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                        {msg.date}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${msg.sender === "recruiter" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "recruiter"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "recruiter"
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <button
                type="button"
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mx-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              <button
                type="submit"
                className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
