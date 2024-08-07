'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatMessage = {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_profiles: {
    user_id: string,
    avatar_url?: string;
    display_name?: string;
  };
};

type ChatProps = {
  matchId: number;
};

export default function Chat({ matchId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user_profiles (
            user_id,
            display_name,
            avatar_url
          )
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });
  
      console.log(matchId, data);
  
      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
    };

    fetchUser();
    fetchMessages();

    const channel = supabase
      .channel(`match-${matchId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `match_id=eq.${matchId}` },
        payload => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, supabase, router]);

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({ match_id: matchId, user_id: user.id, message: newMessage.trim() });

    if (error) console.error('Error sending message:', error);
    else setNewMessage('');
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-grow p-4">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex items-start mb-4 ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
            {msg.user_id !== user?.id && (
              <Avatar className="mr-2">
                <AvatarImage src={msg.user_profiles?.avatar_url || ''} />
                <AvatarFallback>{msg.user_profiles?.display_name || 'U'}</AvatarFallback>
              </Avatar>
            )}
            <div className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}>
              <span className="text-sm text-gray-500 mb-1">{msg.user_profiles?.display_name || 'Anonymous'}</span>
              <span className={`inline-block rounded-lg px-3 py-2 ${
                msg.user_id === user?.id ? 
                'bg-primary text-primary-foreground' 
                : 'bg-gray-200 text-gray-800'
              }`}>
                {msg.message}
              </span>
            </div>
            {msg.user_id === user?.id && (
              <Avatar className="ml-2">
                <AvatarImage src={msg.user_profiles?.avatar_url} />
                <AvatarFallback>{msg.user_profiles?.display_name || 'U'}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>
      <div className="flex p-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} className="ml-2">Send</Button>
      </div>
    </div>
  );
}
