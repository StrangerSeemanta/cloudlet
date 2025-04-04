import { useState } from "react";
import { ArrowLeft, Menu, Send, MoreVertical } from "lucide-react";

interface Message {
  sender: "me" | "other";
  content: string;
  timestamp: string;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline";
}

const activeUsers: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    status: "online",
  },
  {
    id: 2,
    name: "Bob Williams",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "offline",
  },
  {
    id: 3,
    name: "Charlie Smith",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    status: "online",
  },
];

const MessagingPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "other", content: "Hey! How's it going?", timestamp: "10:30 AM" },
    {
      sender: "me",
      content: "Hi! I'm good, how about you?",
      timestamp: "10:32 AM",
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        sender: "me",
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: Active Users */}
      <div
        className={`absolute z-20 md:relative w-72 md:w-1/4 bg-white p-4 border-r transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        {/* Back Button (Mobile) */}
        <button
          className="md:hidden flex items-center space-x-2 text-gray-700 hover:text-black mb-4"
          onClick={() => setSidebarOpen(false)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Active Users */}
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Chats</h3>
        <ul className="space-y-2">
          {activeUsers.map((user) => (
            <li
              key={user.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                selectedUser?.id === user.id ? "bg-blue-100" : ""
              }`}
              onClick={() => {
                setSelectedUser(user);
                setSidebarOpen(false);
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <span
                  className={`text-xs ${
                    user.status === "online"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  {user.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Chat Header */}
        {selectedUser ? (
          <div className="bg-white p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                <span
                  className={`text-xs ${
                    selectedUser.status === "online"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  {selectedUser.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}

        {/* Chat Messages */}
        {selectedUser && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow ${
                      message.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="block text-xs text-gray-400 mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t flex items-center space-x-4">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
