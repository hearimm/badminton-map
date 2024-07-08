'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { createClient } from '@/utils/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Database } from "@/supabase/types";

type Participants = Database['public']['Tables']['participants']['Row'];
type UserProfiles = Database['public']['Tables']['user_profiles']['Row'];

type ParticipantWithProfile = Participants & {
  user_profiles: Pick<UserProfiles, 'display_name' | 'avatar_url'> | null;
};

type ParticipantsCardProps = {
  matchId: number;
  initialParticipants: ParticipantWithProfile[];
  maxParticipants: number;
  userProfile: UserProfiles;
};
const ParticipantsCard: React.FC<ParticipantsCardProps> = ({ matchId, initialParticipants, maxParticipants, userProfile }) => {
  const [participants, setParticipants] = useState<ParticipantWithProfile[]>(initialParticipants);
  const [loading, setLoading] = useState(false);
  const userId = userProfile.user_id; // 현재 사용자의 user_id

  const joinMatch = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // UPSERT 사용하여 참가 상태 업데이트 또는 새 참가자 추가
      const { data, error } = await supabase
        .from('participants')
        .upsert([
          { match_id: matchId, user_id: user.id, status: 'attending' }
        ], { onConflict: ['match_id', 'user_id'] })
        .select('*, user_profiles(display_name, avatar_url)')
        .single();

      if (error) throw error;

      const participantWithProfile: ParticipantWithProfile = {
        ...data,
        user_profiles: {
          avatar_url: userProfile.avatar_url,
          display_name: userProfile.display_name
        }
      };

      setParticipants([...participants.filter(p => p.user_id !== user.id), participantWithProfile]);
    } catch (error) {
      const msg = error instanceof Error ? `Error joining match: ${error.message}` : 'Unexpected error: ';
      console.error(msg,error);
    } finally {
      setLoading(false);
    }
  };

  const cancelParticipation = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('participants')
        .update({ status: 'cancelled' })
        .eq('match_id', matchId)
        .eq('user_id', userId);

      if (error) throw error;

      setParticipants(participants.filter(p => p.user_id !== userId));
    } catch (error) {
      const msg = error instanceof Error ? `Error cancelParticipation: ${error.message}` : 'Unexpected error: ';
      console.error(msg,error);
    } finally {
      setLoading(false);
    }
  };

  const userHasJoined = participants.some(p => p.user_id === userId && p.status === 'attending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{userHasJoined ? 'Cancel Participation' : 'Join this Match'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(participants.length / maxParticipants) * 100} className="mb-2" />
          <p className="text-sm text-gray-500 mb-4">{maxParticipants - participants.length} spots left</p>
          {userHasJoined ? (
            <Button onClick={cancelParticipation} disabled={loading}>
              {loading ? 'Cancelling...' : 'Cancel Participation'}
            </Button>
          ) : (
            <Button onClick={joinMatch} disabled={loading}>
              {loading ? 'Joining...' : 'Join Match'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {participants.map((participant, index) => (
              <Avatar key={index}>
                <AvatarImage src={participant.user_profiles?.avatar_url || ''} />
                <AvatarFallback>{participant.user_profiles?.display_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantsCard;
