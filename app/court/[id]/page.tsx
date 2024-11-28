import { notFound } from 'next/navigation'
import Header from "@/components/header"
import NaverMapOne from "@/components/naver-map-one"
import Link from "next/link"
import { ArrowUpRight, Users, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/lib/initSupabase"
import { Database } from "@/supabase/types";
import { startOfDay, endOfDay, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

type Places = Database['public']['Tables']['places']['Row'];
type LessonProgram = Database['public']['Tables']['lesson_programs']['Row'];
type Matches = Database['public']['Tables']['matches']['Row'];

type MatchWithParticipants = Matches & {
    participants_count: number;
};

async function fetchWithId(id: string): Promise<{
    place: Places, 
    programs: LessonProgram[],
    matches: MatchWithParticipants[]
}> {
    try {
        const [placeResult, programsResult, matchesResult] = await Promise.all([
            supabase
                .from('places')
                .select('*')
                .eq('place_id', id)
                .single(),
            supabase
                .from('lesson_facilities')
                .select(`
                    *,
                    programs:lesson_programs(*)
                `)
                .eq('place_id', id),
            supabase
                .from('matches')
                .select(`
                    *,
                    participants:participants(count).filter(status.eq.attending)
                `)
                .eq('place_id', parseInt(id))
                .gte('start_time', new Date().toISOString())
                .order('start_time', { ascending: true })
                .limit(5)
        ]);

        if (placeResult.error) throw placeResult.error;
        if (programsResult.error) throw programsResult.error;
        if (matchesResult.error) throw matchesResult.error;

        console.log('Matches result:', matchesResult.data);

        // 프로그램 데이터 평탄화
        const programs = programsResult.data?.reduce((acc: LessonProgram[], facility) => {
            if (facility.programs) {
                return [...acc, ...facility.programs.filter((program: LessonProgram) => program.is_active)];
            }
            return acc;
        }, []) || [];

        // 매치 데이터 처리
        const matches = matchesResult.data.map(match => ({
            ...match,
            participants_count: match.participants[0]?.count || 0
        }));

        return {
            place: placeResult.data,
            programs,
            matches
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

type NaverMapOneComponentProps = {
    data: Places
}

function NaverMapOneComponent(props: NaverMapOneComponentProps) {
    const { data } = props;
    if (data?.place_id) {
        return (
            <NaverMapOne id={data.place_id + ''}></NaverMapOne>
        )
    } else {
        return
    }
}

type CourtDetailComponentProps = {
    court: Places;
    programs: LessonProgram[];
    matches: MatchWithParticipants[];
}

const CourtDetail = (props: CourtDetailComponentProps) => {
    const { court, programs, matches } = props;
    
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Badge>{court.place_type}</Badge>
                            <CardTitle>{court.place_name}</CardTitle>
                        </div>
                        <CardDescription>
                            {court.address}
                            {court.additional_info?.map_link && (
                                <a 
                                    href={court.additional_info.map_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline ml-2"
                                >
                                    네이버 지도에서 보기
                                </a>
                            )}
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href={`/court/${court.place_id}/edit`} prefetch={false}>
                            수정하기
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-4">기본 정보</h2>
                            <dl className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="font-medium text-gray-500">연락처</dt>
                                    <dd>{court.additional_info?.contact || "-"}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-500">웹사이트</dt>
                                    <dd>
                                        {court.additional_info?.club_website ? (
                                            <a 
                                                href={court.additional_info.club_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                바로가기
                                            </a>
                                        ) : "-"}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">시설 정보</h2>
                            <dl className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="font-medium text-gray-500">코트 수</dt>
                                    <dd>{court.additional_info?.courts || "-"}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-500">바닥 재질</dt>
                                    <dd>{court.additional_info?.flooring || "-"}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-500">기타 시설</dt>
                                    <dd>{court.additional_info?.others || "-"}</dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">이용 정보</h2>
                            <dl className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="font-medium text-gray-500">운영 시간</dt>
                                    <dd className="whitespace-pre-line">{court.additional_info?.schedule || "-"}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-500">이용 요금</dt>
                                    <dd className="whitespace-pre-line">{court.additional_info?.fee || "-"}</dd>
                                </div>
                            </dl>
                        </div>

                        {(court.additional_info?.club_review1 || court.additional_info?.club_review2 || court.additional_info?.club_review3) && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">추가 정보</h2>
                                <div className="space-y-2">
                                    {court.additional_info?.club_review1 && (
                                        <div className="flex items-start gap-2">
                                            <span className="font-medium text-gray-500">•</span>
                                            <p>{court.additional_info.club_review1}</p>
                                            {court.additional_info?.other_link1 && (
                                                <a 
                                                    href={court.additional_info.other_link1}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline ml-2"
                                                >
                                                    자세히 보기
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {court.additional_info?.club_review2 && (
                                        <div className="flex items-start gap-2">
                                            <span className="font-medium text-gray-500">•</span>
                                            <p>{court.additional_info.club_review2}</p>
                                            {court.additional_info?.other_link2 && (
                                                <a 
                                                    href={court.additional_info.other_link2}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline ml-2"
                                                >
                                                    자세히 보기
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {court.additional_info?.club_review3 && (
                                        <div className="flex items-start gap-2">
                                            <span className="font-medium text-gray-500">•</span>
                                            <p>{court.additional_info.club_review3}</p>
                                            {court.additional_info?.other_link3 && (
                                                <a 
                                                    href={court.additional_info.other_link3}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline ml-2"
                                                >
                                                    자세히 보기
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming matches card */}
            <Card>
                <CardHeader>
                    <CardTitle>다가올 매치</CardTitle>
                    <CardDescription>이 코트에서 진행될 예정인 매치입니다</CardDescription>
                </CardHeader>
                <CardContent>
                    {matches.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {matches.map((match) => (
                                <Link key={match.id} href={`/match/${match.id}`}>
                                    <Card className="hover:bg-accent transition-colors">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Badge>
                                                        {format(new Date(match.start_time), 'MM/dd')}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {format(new Date(match.start_time), 'HH:mm')} ~ {format(new Date(match.end_time), 'HH:mm')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        <span className="text-sm">
                                                            {match.participants_count}/{match.max}명
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {match.min_level}-{match.max_level}레벨
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
                            <div className="text-6xl">🏸</div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-800">아직 예정된 매치가 없어요!</h3>
                                <p className="text-gray-600 max-w-md">
                                    이 코트에서 새로운 매치를 만들어보세요.
                                    원하는 시간에 나만의 매치를 시작할 수 있습니다.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                                    <Link href={`/match/create?place_id=${court.place_id}`}>
                                        <Plus className="h-5 w-5 mr-2" />
                                        새로운 매치 만들기
                                    </Link>
                                </Button>
                                <div className="flex gap-4">
                                    <Button asChild variant="outline">
                                        <Link href="/guide">
                                            📖 이용 가이드
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/match">
                                            🔍 다른 매치 보기
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Programs list card */}
            {programs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>프로그램 목록</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>프로그램명</TableHead>
                                    <TableHead>기간</TableHead>
                                    <TableHead>수업시간</TableHead>
                                    <TableHead>대상</TableHead>
                                    <TableHead>가격</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programs.map((program) => (
                                    <TableRow key={program.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                <Badge variant="outline">{program.program_type}</Badge>
                                                {' '}{program.program_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {new Date(program.start_date).toLocaleDateString()} ~{' '}
                                                {new Date(program.end_date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {program.weekdays}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{program.time_slot}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{program.target_audience}</div>
                                            <div className="text-sm text-muted-foreground">
                                                정원 {program.capacity}명
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {program.price.toLocaleString()}원
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {program.price_type}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default async function Page({ params }: { params: { id: string } }) {
    const { place: data, programs, matches } = await fetchWithId(params.id)
    if (!data) {
        notFound()
    }
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:gap-8">
                    <Card className="xl:col-span-2 h-[300px]">
                        <NaverMapOneComponent data={data} />
                    </Card>
                    <CourtDetail court={data} programs={programs} matches={matches} />
                </div>
            </main>
        </div>
    )
}