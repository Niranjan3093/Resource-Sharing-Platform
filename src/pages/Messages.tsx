
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwnMessage: boolean;
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey, I'm interested in borrowing your drill for a project this weekend!",
      sender: "John Doe",
      timestamp: new Date(Date.now() - 3600000 * 3),
      isOwnMessage: false,
    },
    {
      id: "2",
      text: "Sure, it's available! When do you want to pick it up?",
      sender: "You",
      timestamp: new Date(Date.now() - 3600000 * 2),
      isOwnMessage: true,
    },
    {
      id: "3",
      text: "Would Saturday morning work for you?",
      sender: "John Doe",
      timestamp: new Date(Date.now() - 3600000),
      isOwnMessage: false,
    },
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState("John Doe");
  
  // Mock chat list
  const chatList = [
    { id: "chat1", name: "John Doe", lastMessage: "Would Saturday morning work for you?", avatar: "", unread: 2 },
    { id: "chat2", name: "Sarah Miller", lastMessage: "Thanks for sharing your bike yesterday!", avatar: "", unread: 0 },
    { id: "chat3", name: "Mike Johnson", lastMessage: "Can I borrow your lawn mower next week?", avatar: "", unread: 1 },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "You",
      timestamp: new Date(),
      isOwnMessage: true,
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto mt-24 mb-12">
      <div className="flex flex-col md:flex-row bg-background rounded-xl border shadow-sm overflow-hidden h-[calc(100vh-12rem)]">
        {/* Chat list sidebar */}
        <div className="w-full md:w-1/3 border-r">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-14rem)]">
            <div className="divide-y">
              {chatList.map((chat) => (
                <div 
                  key={chat.id}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-accent transition-colors ${activeChat === chat.name ? 'bg-accent' : ''}`}
                  onClick={() => setActiveChat(chat.name)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {chat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      {chat.unread > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Active chat */}
        <div className="flex flex-col w-full md:w-2/3">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {activeChat.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="font-semibold">{activeChat}</h2>
          </div>
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isOwnMessage 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-accent rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className={`text-xs ${message.isOwnMessage ? 'text-primary-foreground/80' : 'text-muted-foreground'} block text-right mt-1`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Message input */}
          <div className="p-4 border-t flex gap-2">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
