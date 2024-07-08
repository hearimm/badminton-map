import { notFound } from 'next/navigation';
import Header from "@/components/header";
import NaverMapOne from "@/components/naver-map-one";
import {
    Calendar,
    Clock,
    Info,
    MapPin,
    RefreshCw,
    Shield,
} from "lucide-react";
import { BadgeCheck, DollarSign, Users, ClipboardList } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/initSupabase";
import { Database } from "@/supabase/types";
import Chat from "@/components/chat";
import ParticipantsCard from "@/components/participants-card";
import { createClient } from '@/utils/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Matches = Database['public']['Tables']['matches']['Row'];
type Places = Database['public']['Tables']['places']['Row'];
type Participants = Database['public']['Tables']['participants']['Row'];
type UserProfiles = Database['public']['Tables']['user_profiles']['Row'];

type ParticipantWithProfile = Participants & {
  user_profiles: Pick<UserProfiles, 'display_name' | 'avatar_url'> | null;
};

type MatchWithPlace = Matches & {
  places: Pick<Places, 'place_name' | 'address'> | null;
};

async function fetchMatchDetails(id: string): Promise<MatchWithPlace> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*, places(place_name, address)')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) throw new Error('Match not found');

      return data as MatchWithPlace;
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw error;
    }
}

async function fetchParticipants(matchId: string): Promise<ParticipantWithProfile[]> {
    try {
        const { data, error } = await supabase
            .from('participants')
            .select('*, user_profiles(avatar_url, display_name)')
            .eq('match_id', matchId);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function fetchUserProfile(): Promise<UserProfiles> {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return {} as UserProfiles;

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) throw error;

        return data || {} as UserProfiles;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export default async function ScheduleDetailPage({ params }: { params: { id: string } }) {
    const match = await fetchMatchDetails(params.id);
    const participants = await fetchParticipants(params.id);
    const userProfile = await fetchUserProfile();

    if (!match) {
        notFound();
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">{match.places?.place_name || "Badminton Match"}</CardTitle>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>{match.date}</span>
                                    <Clock className="h-4 w-4 ml-4" />
                                    <span>{match.time}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video relative">
                                    <NaverMapOne id={match.place_id + ''} />
                                </div>
                                <div className="mt-4 flex items-center text-gray-600">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <span>{match.places?.address || "Location Name"}</span>
                                </div>
                            </CardContent>
                        </Card>
    
                        <Card>
                            <CardHeader>
                                <CardTitle>Match Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold flex items-center">
                                  <BadgeCheck className="h-5 w-5 mr-1 text-gray-600" />
                                  실력 수준
                                </h4>
                                <Badge variant="secondary">{match.level}</Badge>
                              </div>
                              <div>
                                <h4 className="font-semibold flex items-center">
                                  <Users className="h-5 w-5 mr-1 text-gray-600" />
                                  최대 참석인원
                                </h4>
                                <Badge variant="secondary">{match.max} 명</Badge>
                              </div>
                              <div>
                                <h4 className="font-semibold flex items-center">
                                  <DollarSign className="h-5 w-5 mr-1 text-gray-600" />
                                  요금
                                </h4>
                                <Badge variant="secondary">{match.fee || "Free"}</Badge>
                              </div>
                              <div>
                                <h4 className="font-semibold flex items-center">
                                  <ClipboardList className="h-5 w-5 mr-1 text-gray-600" />
                                  준비물
                                </h4>
                                <Badge variant="secondary">개인 라켓</Badge>
                                <Badge variant="secondary">실내용 운동화(배드민턴화, 농구화)</Badge>
                              </div>
                            </div>
                            </CardContent>
                        </Card>
    
                        <ParticipantsCard 
                            matchId={parseInt(params.id)} 
                            initialParticipants={participants} 
                            maxParticipants={match.max || 1} 
                            userProfile={userProfile}
                        />
                    </div>
    
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organizer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src="/organizer-avatar.png" />
                                        <AvatarFallback>ON</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">Organizer Name</p>
                                        <p className="text-sm text-gray-500">Contact: organizer@example.com</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
    
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start">
                                    <Info className="h-5 w-5 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold">Court Information</h4>
                                        <p className="text-sm">3 courts available, Free parking, Refreshments sold on-site</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Shield className="h-5 w-5 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold">Rules</h4>
                                        <p className="text-sm">Please follow court etiquette. Be considerate to beginners.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <RefreshCw className="h-5 w-5 mr-2 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold">Refund Policy</h4>
                                        <p className="text-sm">Full refund if cancelled 24 hours before the match.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Match Chat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Chat matchId={match.id} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
