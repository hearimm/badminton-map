'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client';

type JoinMatchButtonProps = {
  matchId: number;
};

const JoinMatchButton: React.FC<JoinMatchButtonProps> = ({ matchId }) => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const joinMatch = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('participants')
        .insert([{ match_id: matchId, user_id: user.id }]);

      if (error) throw error;
      console.log('Joined match successfully');
    } catch (error) {
      console.error('Error joining match:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={joinMatch} disabled={loading}>
      {loading ? 'Joining...' : 'Join Match'}
    </Button>
  );
};

export default JoinMatchButton;
