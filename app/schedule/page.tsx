'use client'

import { useEffect, useState, FC } from "react"
import Link from "next/link"
import { MapPin, Users, Loader2, Calendar, Plus, Filter } from "lucide-react"
import { format } from 'date-fns'

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

type Matches = Database['public']['Tables']['matches']['Row'] & {
  places: { name: string } | null
}

async function fetchMatches(date: Date): Promise<Matches[]> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*, places(name)')
      .eq('date', format(date, 'yyyy-MM-dd'))
      .order('time', { ascending: true })

    if (error) throw error

    return data as Matches[]
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
  match: Matches;
}

const MatchCard: FC<MatchCardProps> = ({ match }) => {
  const typeEmoji = { "운동/스포츠": "🏸", "스터디": "📚", "친목": "🍻" }
  const emoji = typeEmoji[match.type] || "🏸"
  const generateColor = (id: number) => `hsl(${(id * 137.508) % 360}, 70%, 80%)`
  const backgroundColor = generateColor(match.id)

  return (
    <Link key={match.id} href={`/schedule/${match.id}`} passHref>
      <Card className="overflow-hidden mt-4">
        <CardContent className="p-0">
          <div 
            className="h-40 flex items-center justify-center text-4xl"
            style={{ backgroundColor }}
          >
            {emoji}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{match.description || '모임 제목'}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{match.places?.name || '장소 미정'}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{match.time}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{match.current_participants || 0}명 참석중({match.max}명)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

const ScheduleListPage: FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredMatches, setFilteredMatches] = useState<Matches[]>([])
  const [matches, setMatches] = useState<Matches[]>([])

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [levelFitler, setLevelFitler] = useState<string>('all')
  
  useEffect(() => {
    const getMatches = async () => {
      setLoading(true)
      setError(null)
      try {
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
  }, [levelFitler, matches])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <h1 className="text-2xl font-bold mb-4">다가오는 정기모임</h1>
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
                <SelectItem value="all">누구나</SelectItem>
                {levelRanges.map(o => 
                  <SelectItem key={o.minLevel} value={o.minLevel+''}>{o.name}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link href="/schedule/create">
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
          <div className="text-center text-red-500">{error}</div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center text-gray-500">해당 날짜의 모임이 없습니다.</div>
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

export default ScheduleListPage;
