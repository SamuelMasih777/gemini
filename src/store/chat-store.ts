import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  image?: string;
  chatroomId: string;
}

export interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface ChatState {
  chatrooms: Chatroom[];
  messages: Record<string, Message[]>;
  currentChatroomId: string | null;
  isTyping: boolean;
  searchQuery: string;
  currentPage: Record<string, number>;
  messagesPerPage: number;
  addChatroom: (title: string) => string;
  deleteChatroom: (id: string) => void;
  setCurrentChatroom: (id: string | null) => void;
  addMessage: (chatroomId: string, content: string, image?: string) => void;
  addAiMessage: (chatroomId: string, content: string) => void;
  setTyping: (typing: boolean) => void;
  setSearchQuery: (query: string) => void;
  getFilteredChatrooms: () => Chatroom[];
  setPage: (chatroomId: string, page: number) => void;
  getPaginatedMessages: (chatroomId: string) => Message[];
  getTotalPages: (chatroomId: string) => number;
  getCurrentPage: (chatroomId: string) => number;
  loadMoreMessages: (chatroomId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      messages: {},
      currentChatroomId: null,
      isTyping: false,
      searchQuery: '',
      currentPage: {},
      messagesPerPage: 20,
      
      addChatroom: (title: string) => {
        const newChatroom: Chatroom = {
          id: `chatroom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
          messages: { ...state.messages, [newChatroom.id]: [] }
        }));
        return newChatroom.id;
      },
      
      deleteChatroom: (id: string) => {
        set((state) => {
          const newMessages = { ...state.messages };
          delete newMessages[id];
          return {
            chatrooms: state.chatrooms.filter(room => room.id !== id),
            messages: newMessages,
            currentChatroomId: state.currentChatroomId === id ? null : state.currentChatroomId
          };
        });
      },
      
      setCurrentChatroom: (id: string | null) => {
        set({ currentChatroomId: id });
      },
      
      addMessage: (chatroomId: string, content: string, image?: string) => {
        const message: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content,
          sender: 'user',
          timestamp: new Date().toISOString(),
          image,
          chatroomId,
        };
        
        set((state) => {
          const updatedMessages = [...(state.messages[chatroomId] || []), message];
          const totalPages = Math.ceil(updatedMessages.length / state.messagesPerPage);
          
          return {
            messages: {
              ...state.messages,
              [chatroomId]: updatedMessages
            },
            chatrooms: state.chatrooms.map(room => 
              room.id === chatroomId 
                ? { ...room, lastMessage: image ? '📷 Image' : content, lastMessageAt: message.timestamp }
                : room
            ),
            currentPage: {
              ...state.currentPage,
              [chatroomId]: totalPages // Auto-navigate to last page
            }
          };
        });
      },
      
      addAiMessage: (chatroomId: string, content: string) => {
        const message: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          chatroomId,
        };
        
        set((state) => {
          const updatedMessages = [...(state.messages[chatroomId] || []), message];
          const totalPages = Math.ceil(updatedMessages.length / state.messagesPerPage);
          
          return {
            messages: {
              ...state.messages,
              [chatroomId]: updatedMessages
            },
            chatrooms: state.chatrooms.map(room => 
              room.id === chatroomId 
                ? { ...room, lastMessage: content, lastMessageAt: message.timestamp }
                : room
            ),
            currentPage: {
              ...state.currentPage,
              [chatroomId]: totalPages // Auto-navigate to last page
            }
          };
        });
      },
      
      setTyping: (typing: boolean) => set({ isTyping: typing }),
      
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      
      getFilteredChatrooms: () => {
        const { chatrooms, searchQuery } = get();
        if (!searchQuery.trim()) return chatrooms;
        return chatrooms.filter(room => 
          room.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      },
      
      setPage: (chatroomId: string, page: number) => {
        set((state) => ({
          currentPage: {
            ...state.currentPage,
            [chatroomId]: page
          }
        }));
      },
      
      getPaginatedMessages: (chatroomId: string) => {
        const state = get();
        const allMessages = state.messages[chatroomId] || [];
        const currentPage = state.currentPage[chatroomId] || 1;
        const startIndex = (currentPage - 1) * state.messagesPerPage;
        const endIndex = startIndex + state.messagesPerPage;
        
        return allMessages.slice(startIndex, endIndex);
      },
      
      getTotalPages: (chatroomId: string) => {
        const state = get();
        const allMessages = state.messages[chatroomId] || [];
        return Math.max(1, Math.ceil(allMessages.length / state.messagesPerPage));
      },
      
      getCurrentPage: (chatroomId: string) => {
        const state = get();
        return state.currentPage[chatroomId] || 1;
      },
      
      loadMoreMessages: (chatroomId: string) => {
        const dummyMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
          id: `dummy_${Date.now()}_${i}`,
          content: `This is an older message #${i + 1}`,
          sender: Math.random() > 0.5 ? 'user' : 'ai',
          timestamp: new Date(Date.now() - (i + 1) * 60000).toISOString(),
          chatroomId,
        }));
        
        set((state) => ({
          messages: {
            ...state.messages,
            [chatroomId]: [...dummyMessages, ...(state.messages[chatroomId] || [])]
          }
        }));
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);
