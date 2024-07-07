import { notFound } from 'next/navigation'
import Header from "@/components/header"
import NaverMapOne from "@/components/naver-map-one"
import Link from "next/link"
import {
    ArrowUpRight,
    Calendar,
    Clock,
    Users,
    MapPin,
    Info,
    DollarSign,
    Shield,
    RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/initSupabase"
import { Database } from "@/supabase/types";
import Chat from "@/components/chat"

type Matches = Database['public']['Tables']['matches']['Row'];
type Places = Database['public']['Tables']['places']['Row'];
type Participants = Database['public']['Tables']['participants']['Row'];

// 조인된 결과를 위한 새로운 타입 정의
type MatchWithPlace = Matches & {
  places: Pick<Places, 'place_name'> | null;
};

async function fetchMatchDetails(id: string): Promise<MatchWithPlace> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*, places(place_name)')
        .eq('id', id)
        .single();  // 단일 결과를 반환하도록 수정
  
      if (error) throw error;
  
      if (!data) throw new Error('Match not found');
  
      return data as MatchWithPlace;
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw error;
    }
  }

async function fetchParticipants(matchId: string): Promise<Participants[]> {
    // Fetch participants data from Supabase
    // Return an array of participants
    try {
        const { data, error } = await supabase
            .from('participants')
            .select('*')
            .eq('match_id', matchId)    // Correct

        if (error) throw error;

        console.log('Data fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export default async function ScheduleDetailPage({ params }: { params: { id: string } }) {
    
    const match = await fetchMatchDetails(params.id)
    const participants = await fetchParticipants(params.id)
    const participantsCount = participants?.length || 0;
    console.log(participants)
    if (!match) {
        notFound()
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">{match.description || "Badminton Match"}</CardTitle>

                                <div className="flex items-center space-x-2">
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
                                <div className="mt-4 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <span>{match.places?.place_name || "Location Name"}</span>
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
                                        <h4 className="font-semibold">Skill Level</h4>
                                        <Badge variant="secondary">{match.level}</Badge>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Participants</h4>
                                        <p>{participantsCount} / {match.max}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Fee</h4>
                                        <p>{match.fee || "Free"}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Equipment</h4>
                                        <p>Racket, Indoor shoes</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
    
                        <Card>
                            <CardHeader>
                                <CardTitle>Participants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {participants?.map((participant, index) => (
                                        <Avatar key={index}>
                                            <AvatarImage src={participant.avatar} />
                                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
    
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Join this Match</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Progress value={(participantsCount / (match.max || 1)) * 100} className="mb-2" />
                                <p className="text-sm text-gray-500 mb-4">{match.max - participantsCount} spots left</p>
                                <Button className="w-full">Join Match</Button>
                            </CardContent>
                        </Card>
    
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
    )
}