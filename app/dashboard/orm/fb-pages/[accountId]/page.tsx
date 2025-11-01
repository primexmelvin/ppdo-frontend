"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import { useAccentColor } from "../../../contexts/AccentColorContext";
import { useBreadcrumb } from "../../../contexts/BreadcrumbContext";
import { mockAccounts, FBAccount } from "../data";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantPic: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

// Mock conversations data
const generateMockConversations = (accountId: string): Conversation[] => {
  const participants = [
    { id: "user-1", name: "Juan Dela Cruz", pic: "JD" },
    { id: "user-2", name: "Maria Santos", pic: "MS" },
    { id: "user-3", name: "Carlos Mendoza", pic: "CM" },
    { id: "user-4", name: "Ana Garcia", pic: "AG" },
    { id: "user-5", name: "Pedro Martinez", pic: "PM" },
  ];

  return participants.map((participant, index) => {
    const messages: Message[] = [
      {
        id: `msg-${index}-1`,
        text: `Hello! I need help with ${
          index === 0
            ? "my application"
            : index === 1
            ? "document verification"
            : "a service request"
        }.`,
        senderId: participant.id,
        senderName: participant.name,
        timestamp: new Date(Date.now() - 3600000 * (index + 1)),
        isRead: index < 2,
      },
      {
        id: `msg-${index}-2`,
        text: "How can I assist you today?",
        senderId: accountId,
        senderName: "Page",
        timestamp: new Date(Date.now() - 3600000 * index),
        isRead: true,
      },
      {
        id: `msg-${index}-3`,
        text:
          index === 0
            ? "I submitted my application last week. Can you check its status?"
            : index === 1
            ? "I need to verify some documents. What should I bring?"
            : "I want to request for a public service. Where do I start?",
        senderId: participant.id,
        senderName: participant.name,
        timestamp: new Date(Date.now() - 1800000 * index),
        isRead: index < 1,
      },
    ];

    return {
      id: `conv-${accountId}-${participant.id}`,
      participantId: participant.id,
      participantName: participant.name,
      participantPic: participant.pic,
      lastMessage: messages[messages.length - 1].text,
      lastMessageTime: messages[messages.length - 1].timestamp,
      unreadCount: index < 2 ? index + 1 : 0,
      isOnline: index % 2 === 0,
      messages,
    };
  });
};

export default function AccountMessengerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showConversationList, setShowConversationList] = useState(true);
  const router = useRouter();
  const params = useParams();
  const accountId = params.accountId as string;
  const { accentColorValue } = useAccentColor();
  const { setCustomBreadcrumbs } = useBreadcrumb();

  // Find account by ID
  const account = mockAccounts.find((acc) => acc.id === accountId);

  // Generate conversations - must be called before conditional returns
  const generatedConversations = useMemo(() => {
    if (!account) return [];
    return generateMockConversations(account.id);
  }, [account]);

  // Load conversations when account is found
  useEffect(() => {
    if (account) {
      setConversations(generatedConversations);
    }
  }, [account, generatedConversations]);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  // Set breadcrumbs
  useEffect(() => {
    if (account) {
      setCustomBreadcrumbs([
        { label: "Home", href: "/dashboard" },
        { label: "ORM", href: "/dashboard/orm/fb-pages" },
        { label: "FB Pages", href: "/dashboard/orm/fb-pages" },
        { label: account.name },
      ]);
    }

    return () => {
      setCustomBreadcrumbs(null);
    };
  }, [account, setCustomBreadcrumbs]);

  if (!isAuthenticated) {
    return null;
  }

  if (!account) {
    notFound();
  }

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time for display
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours < 1) {
      return minutes < 1 ? "Just now" : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation || !account) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: messageInput.trim(),
      senderId: account.id,
      senderName: account.name,
      timestamp: new Date(),
      isRead: false,
    };

    // Update conversation with new message
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            lastMessage: newMessage.text,
            lastMessageTime: newMessage.timestamp,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    // Update selected conversation
    setSelectedConversation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        lastMessage: newMessage.text,
        lastMessageTime: newMessage.timestamp,
        messages: [...prev.messages, newMessage],
      };
    });

    setMessageInput("");
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <img
            src={account.profilePic}
            alt={account.name}
            className="w-12 h-12 rounded-full object-cover shrink-0 border-2"
            style={{ borderColor: accentColorValue }}
          />
          <div>
            <h1
              className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              {account.name}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Messenger
            </p>
          </div>
        </div>
      </div>

      {/* Messenger Interface */}
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-280px)] min-h-[600px]">
        {/* Conversation List Sidebar */}
        <div
          className={`
            ${showConversationList ? "flex" : "hidden"} lg:flex
            flex-col
            w-full lg:w-80
            bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800
            overflow-hidden
          `}
        >
          {/* Conversation List Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Conversations
              </h2>
              <button
                onClick={() => setShowConversationList(false)}
                className="lg:hidden p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 text-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    setShowConversationList(false);
                  }}
                  className={`
                    p-4 border-b border-zinc-200 dark:border-zinc-800 cursor-pointer
                    transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50
                    ${
                      selectedConversation?.id === conv.id
                        ? "bg-zinc-50 dark:bg-zinc-900/50"
                        : ""
                    }
                  `}
                  style={
                    selectedConversation?.id === conv.id
                      ? { backgroundColor: `${accentColorValue}08` }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={`https://i.pravatar.cc/150?name=${encodeURIComponent(
                          conv.participantName
                        )}`}
                        alt={conv.participantName}
                        className="w-12 h-12 rounded-full object-cover border-2"
                        style={{ borderColor: accentColorValue }}
                      />
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {conv.participantName}
                        </h3>
                        <span className="text-xs text-zinc-500 dark:text-zinc-500 shrink-0 ml-2">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium text-white shrink-0 ml-2"
                            style={{ backgroundColor: accentColorValue }}
                          >
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No conversations found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowConversationList(true)}
                    className="lg:hidden p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                  <div className="relative">
                    <img
                      src={`https://i.pravatar.cc/150?name=${encodeURIComponent(
                        selectedConversation.participantName
                      )}`}
                      alt={selectedConversation.participantName}
                      className="w-10 h-10 rounded-full object-cover border-2"
                      style={{ borderColor: accentColorValue }}
                    />
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedConversation.participantName}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                      {selectedConversation.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => {
                  const isFromAccount = message.senderId === account.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isFromAccount ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] sm:max-w-[60%] ${
                          isFromAccount ? "order-2" : "order-1"
                        }`}
                      >
                        <div className="flex items-end gap-2">
                          {!isFromAccount && (
                            <img
                              src={`https://i.pravatar.cc/150?name=${encodeURIComponent(
                                selectedConversation.participantName
                              )}`}
                              alt={selectedConversation.participantName}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border-2"
                              style={{ borderColor: accentColorValue }}
                            />
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isFromAccount
                                ? "rounded-br-sm"
                                : "rounded-bl-sm bg-zinc-700 dark:bg-zinc-800"
                            }`}
                            style={
                              isFromAccount
                                ? {
                                    backgroundColor: accentColorValue,
                                    color: "white",
                                  }
                                : {
                                    color: "white",
                                  }
                            }
                          >
                            <p className="text-sm whitespace-pre-wrap break-words text-white">
                              {message.text}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isFromAccount
                                  ? "text-white/70"
                                  : "text-white/70"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {isFromAccount && (
                            <img
                              src={account.profilePic}
                              alt={account.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border-2"
                              style={{ borderColor: accentColorValue }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 resize-none focus:outline-none focus:ring-2 max-h-32 transition-colors"
                      style={{
                        borderColor: messageInput
                          ? accentColorValue
                          : "rgb(209 213 219)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = accentColorValue;
                        e.currentTarget.style.setProperty(
                          "--tw-ring-color",
                          accentColorValue
                        );
                      }}
                      onBlur={(e) => {
                        if (!messageInput) {
                          e.currentTarget.style.borderColor = "";
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2.5 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg shrink-0"
                    style={{
                      backgroundColor: accentColorValue,
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-zinc-400 dark:text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
