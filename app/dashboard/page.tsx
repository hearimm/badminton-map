'use client'

import { useEffect, useState, FC } from "react"
import Link from "next/link"
import { MapPin, Users, Loader2, Calendar, Plus, Filter } from "lucide-react"
import { startOfDay, endOfDay, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Header from "@/components/header"
import { supabase } from "@/lib/initSupabase"
import { Database } from "@/supabase/types"

import WeekNavigation from "@/components/weekNavigation"
import { getSession } from "@/app/login/actions";

type Matches = Database['public']['Tables']['matches']['Row']
type Places = Database['public']['Tables']['places']['Row']
type Participants = Database['public']['Tables']['participants']['Row']

// 조인된 결과를 위한 새로운 타입 정의
type MatchWithPlace = Matches & {
  places: Pick<Places, 'place_name' | 'address'> | null;
  participants: Array<Participants & { count: number }>;
  local_start_time: string;
  local_end_time: string;
  participants_count: number;
};

async function fetchMatches(date: Date): Promise<MatchWithPlace[]> {
  // 현재 세션에서 사용자 정보 가져오기
  const { session } = await getSession();
  // const session = data.session;

  if (!session) {
    throw new Error('No active session. User must be logged in.');
  }

  const userId = session.user.id;

  try {
    const startOfDayUTC = startOfDay(date);
    const endOfDayUTC = endOfDay(date);

    console.log(startOfDayUTC)
    const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      places(place_name, address),
      participants!inner(id, user_id, status),
      attending_count:participants(count).filter(status.eq.attending)
    `)
    .eq('participants.user_id', userId)
    .eq('participants.status', 'attending')
    .gte('start_time', startOfDayUTC.toISOString())
    .lt('start_time', endOfDayUTC.toISOString())
    .order('start_time', { ascending: true });

    if (error) throw error

    // Convert UTC times to local timezone for display
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formattedData: MatchWithPlace[] = data.map((match: MatchWithPlace) => ({
      ...match,
      local_start_time: format(toZonedTime(new Date(match.start_time || ""), timeZone), 'yyyy-MM-dd HH:mm:ss'),
      local_end_time: format(toZonedTime(new Date(match.end_time || ""), timeZone), 'yyyy-MM-dd HH:mm:ss'),
      participants_count: match.participants[0].count,
    }));

    console.log(formattedData);

    return formattedData as MatchWithPlace[];
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

const levelRanges = [
  { name: "랠리 가능자", minLevel: 1, maxLevel: 10 },
  { name: "룰 숙지자", minLevel: 11, maxLevel: 20 },
  { name: "왕왕초심", minLevel: 21, maxLevel: 30 },
  { name: "왕초심", minLevel: 31, maxLevel: 40 },
  { name: "초심", minLevel: 41, maxLevel: 50 },
  { name: "D조", minLevel: 51, maxLevel: 60 },
  { name: "C조", minLevel: 61, maxLevel: 70 },
  { name: "B조", minLevel: 71, maxLevel: 80 },
  { name: "A조", minLevel: 81, maxLevel: 100 },
]

interface MatchCardProps {
  match: MatchWithPlace;
}

const MatchCard: FC<MatchCardProps> = ({ match }) => {
  const typeEmoji = { "운동/스포츠": "🏸", "스터디": "📚", "친목": "🍻" }
  const emoji = "🏸"
  const generateColor = (id: number) => `hsl(${(id * 137.508) % 360}, 70%, 80%)`
  const backgroundColor = generateColor(match.id)
  const match_name = match.places?.place_name || '장소 미정'
  return (
    <Link key={match.id} href={`/match/${match.id}`} passHref>
      <Card className="overflow-hidden mt-4">
        <CardContent className="p-0">
          <div 
            className="h-40 flex items-center justify-center text-4xl"
            style={{ backgroundColor }}
          >
            {emoji}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{match_name || '모임 제목'}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <div>{match.places?.address || '' }</div>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{`${format(match.local_start_time, "MM-dd HH:mm")} ~ ${format(match.local_end_time, "HH:mm")}`}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{match.participants_count || 0}명 참석중({match.max}명)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

const MatchListPage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredMatches, setFilteredMatches] = useState<MatchWithPlace[]>([])
  const [matches, setMatches] = useState<MatchWithPlace[]>([])

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [levelFitler, setLevelFitler] = useState<string>('all')
  
  useEffect(() => {
    // 세션 체크를 먼저 수행
    const checkSession = async () => {
      try {
        const { session } = await getSession();
        if (!session) {
          router.push('/login?redirect=/dashboard');
          return;
        }
      } catch (err) {
        router.push('/login?redirect=/dashboard');
        return;
      }
    };
    
    checkSession();
  }, []);

  useEffect(() => {
    const getMatches = async () => {
      setLoading(true)
      setError(null)
      try {
        const { session } = await getSession();
        if (!session) {
          return; // 세션이 없으면 데이터를 가져오지 않음
        }
        
        const data = await fetchMatches(selectedDate)
        let filteredMatchesData = data;
        setMatches(data);

        if (levelFitler && levelFitler !== 'all') {
          const intLevelFitler = parseInt(levelFitler)
          filteredMatchesData = data.filter(match =>  match.min_level <= intLevelFitler && match.max_level >= intLevelFitler)
        }
        setFilteredMatches(filteredMatchesData);

      } catch (err) {
        console.error('Failed to fetch matches:', err)
        if (err instanceof Error && err.message === 'No active session. User must be logged in.') {
          router.push('/login?redirect=/dashboard');
          return;
        }
        setError('Failed to fetch matches. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    getMatches()
  }, [selectedDate])

  useEffect(() => {
    const getFilteredMatches = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = matches;
        let filteredMatchesData = data;
  
        if (levelFitler && levelFitler !== 'all') {
          const intLevelFitler = parseInt(levelFitler)
          filteredMatchesData = data.filter(match => match.min_level <= intLevelFitler && match.max_level >= intLevelFitler)
        }
        setFilteredMatches(filteredMatchesData);
      } catch (err) {
        console.error('Failed to fetch matches:', err)
        setError('Failed to fetch matches. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    getFilteredMatches()
  }, [levelFitler])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <h1 className="text-2xl font-bold mb-4">Upcoming Match</h1>
        {/**<
          WeekNavigation selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> 
          */}
        <WeekNavigation 
        selectedDate={selectedDate} 
        setSelectedDate={(date) => {
          setSelectedDate(date);
          // 여기서 필요한 경우 matches를 다시 불러오는 로직을 추가할 수 있습니다.
        }} 
      />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <Select onValueChange={(value) => setLevelFitler(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="레벨 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">레벨 선택</SelectItem>
                {levelRanges.map(o => 
                  <SelectItem key={o.minLevel} value={o.minLevel+''}>{o.name}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link href="/match/create">
              <Plus className="h-4 w-4 mr-2" />
              모임 만들기
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
            <div className="text-6xl">😥</div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">일시적인 오류가 발생했어요</h3>
              <p className="text-gray-600 max-w-md">
                매치 정보를 불러오는 중에 문제가 발생했습니다.
                잠시 후 다시 시도해 주세요.
              </p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()} 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
              >
                🔄 새로고침
              </Button>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <Link href="/guide">
                    📖 이용 가이드
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="mailto:support@example.com">
                    💌 문의하기
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
            <div className="text-6xl">🏸</div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">아직 참여 중인 매치가 없어요!</h3>
              <p className="text-gray-600 max-w-md">
                새로운 배드민턴 친구들과 함께 즐거운 시간을 보내보세요.
                실력과 지역에 맞는 다양한 매치들이 여러분을 기다리고 있습니다.
              </p>
            </div>
            <div className="space-y-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/match/create">
                  <Plus className="h-5 w-5 mr-2" />
                  새로운 매치 만들기
                </Link>
              </Button>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <Link href="/match">
                    🔍 매치 찾아보기
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/guide">
                    📖 이용 가이드
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MatchListPage;