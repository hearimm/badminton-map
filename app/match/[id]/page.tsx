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
                                <CardDescription>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{match.date}</span>
                                        <Clock className="h-4 w-4 ml-4" />
                                        <span>{match.time}</span>
                                    </div>
                                </CardDescription>
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
                                <Progress value={(participantsCount / match.max || 1) * 100} className="mb-2" />
                                <p className="text-sm text-gray-500 mb-4">{match.max || 1 - participantsCount} spots left</p>
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
                    </div>
                </div>
            </main>
        </div>
    )
}

// import { notFound } from 'next/navigation'
// import Header from "@/components/header"
// import NaverMapOne from "@/components/naver-map-one"
// import Link from "next/link"
// import {
//     ArrowUpRight,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import { supabase } from "@/lib/initSupabase"
// import { Database } from "@/supabase/types";

// type Matches = Database['public']['Tables']['matches']['Row'];


// async function fetchWithId(id: string): Promise<Matches> {
//     try {
//         const { data, error } = await supabase
//             .from('matches')
//             .select('*')
//             .eq('id', id)    // Correct

//         if (error) throw error;

//         console.log('Data fetched successfully:', data);
//         return data[0];
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// }

// type NaverMapOneComponentProps = {
//     data: Matches
// }

// function NaverMapOneComponent(props: NaverMapOneComponentProps) {
//     const { data } = props;
//     if (data?.place_id) {
//         return (
//             <NaverMapOne id={data.place_id + ''}></NaverMapOne>
//         )
//     } else {
//         return
//     }
// }

// export default async function ScheduleDetailPage({ params }: { params: { id: string } }) {

//     const data = await fetchWithId(params.id)
//     if (!data) {
//         notFound()
//     }
//     return (
//         <div className="flex min-h-screen w-full flex-col">
//             <Header></Header>
//             <div id="mainWrap" className="mx-10">
//             <Card className="xl:col-span-2 h-[300px]" x-chunk="dashboard-01-chunk-5">
//                 <NaverMapOneComponent data={data} />
//             </Card>

//             <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
//                 <CardHeader className="flex flex-row items-center">
//                     <div className="grid gap-2">
//                         <CardTitle>매치 정보</CardTitle>
//                         <CardDescription>Recent transactions from your store.</CardDescription>
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <div>
//                         {data.created_at}<br/>
//                         {data.date}<br/>
//                         {data.time}<br/>
//                         {data.description}<br/>
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
//                 <CardHeader className="flex flex-row items-center">
//                     <div className="grid gap-2">
//                         <CardTitle>매치 포인트</CardTitle>
//                         <CardDescription>Recent transactions from your store.</CardDescription>
//                     </div>
//                     <Button asChild size="sm" className="ml-auto gap-1">
//                         <Link href="/match/create" prefetch={false}>
//                             만들기
//                             <ArrowUpRight className="h-4 w-4" />
//                         </Link>
//                     </Button>
//                 </CardHeader>
//                 <CardContent>
//                     <div>
//                     Level : {data.level}<br/>
//                     Max : 1 / {data.max}<br/>
//                     준비물 : 라켓 / 실내전용 운동화(농구화/배드민턴화/배구화)<br/>
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
//                 <CardHeader className="flex flex-row items-center">
//                     <div className="grid gap-2">
//                         <CardTitle>참석자 정보</CardTitle>
//                         <CardDescription>Recent transactions from your store.</CardDescription>
//                     </div>
//                     <Button asChild size="sm" className="ml-auto gap-1">
//                         <Link href="/match/create" prefetch={false}>
//                             만들기
//                             <ArrowUpRight className="h-4 w-4" />
//                         </Link>
//                     </Button>
//                 </CardHeader>
//                 <CardContent>
//                     <div>
//                         참석자 정보
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
//                 <CardHeader className="flex flex-row items-center">
//                     <div className="grid gap-2">
//                         <CardTitle>코트 정보</CardTitle>
//                         <CardDescription>Recent transactions from your store.</CardDescription>
//                     </div>
//                     <Button asChild size="sm" className="ml-auto gap-1">
//                         <Link href="/match/create" prefetch={false}>
//                             만들기
//                             <ArrowUpRight className="h-4 w-4" />
//                         </Link>
//                     </Button>
//                 </CardHeader>
//                 <CardContent>
//                     <div>
//                     코트 3면
//                     무료주차
//                     음료 판매
//                     화장실

//                         구장 특이사항
//                         ■ 찾아가는 길 : 

//                         ■ 주차 : 
//                         ■ 흡연 : 지정된 장소에서만 흡연 가능 (흡연 구역 외에서 흡연 적발 시 이후 서비스 이용에 제재가 있을 수 있습니다.)
//                         ■ 기타
//                         - 상의를 탈의한 채로 건물 이동, 화장실 이용을 삼가주시기 바랍니다. (건물 내 학생 항시 상주)
//                         - 화장실 : 건물 내 사용
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
//                 <CardHeader className="flex flex-row items-center">
//                     <div className="grid gap-2">
//                         <CardTitle>진행방식</CardTitle>
//                         <CardDescription>Recent transactions from your store.</CardDescription>
//                     </div>
//                     <Button asChild size="sm" className="ml-auto gap-1">
//                         <Link href="/match/create" prefetch={false}>
//                             만들기
//                             <ArrowUpRight className="h-4 w-4" />
//                         </Link>
//                     </Button>
//                 </CardHeader>
//                 <CardContent>
//                     <div>
//                         규칙을 준수..
//                         초보자를 배려해주세요..
//                         번갈아가며 매치가 진행되도록 매니저가 잘 도와주세요.
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
//                 <CardHeader className="flex flex-row items-center">
//                     <div className="grid gap-2">
//                         <CardTitle>환불정책</CardTitle>
//                         <CardDescription>Recent transactions from your store.</CardDescription>
//                     </div>
//                     <Button asChild size="sm" className="ml-auto gap-1">
//                         <Link href="/match/create" prefetch={false}>
//                             만들기
//                             <ArrowUpRight className="h-4 w-4" />
//                         </Link>
//                     </Button>
//                 </CardHeader>
//                 <CardContent>
//                     환불기준은 .........
//                 </CardContent>
//             </Card>
//             </div>
            
//         </div>

//     )
// }