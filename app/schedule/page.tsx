'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, MapPin, Users, Loader2, Calendar, Plus, Filter } from "lucide-react"
import { format, addDays, startOfWeek } from 'date-fns'

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

const DateButton = ({ date, isSelected, onClick }: { date: Date; isSelected: boolean; onClick: () => void }) => (
  <Button
    variant={isSelected ? "default" : "ghost"}
    className={`flex-col items-center justify-center h-16 ${isSelected ? 'bg-black text-white' : ''}`}
    onClick={onClick}
  >
    <div className="text-sm">{format(date, 'E')}</div>
    <div className="text-lg font-bold">{format(date, 'd')}</div>
  </Button>
)

export default function ScheduleListPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<Matches[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [filterType, setFilterType] = useState<string>('all')
  
  useEffect(() => {
    const getMatches = async () => {
      setLoading(true)
      setError(null)
      try {
        let data = await fetchMatches(selectedDate)
        if (filterType && filterType !== 'all') {
          data = data.filter(match => match.type === filterType)
        }
        setMatches(data)
      } catch (err) {
        console.error('Failed to fetch matches:', err)
        setError('Failed to fetch matches. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    getMatches()
  }, [selectedDate, filterType])

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))


// 모임 유형에 따른 이모지 매핑
const typeEmoji: { [key: string]: string } = {
  "운동/스포츠": "🏸",
  "스터디": "📚",
  "친목": "🍻",
  // 더 많은 유형을 추가할 수 있습니다
}

// 색상 생성 함수
const generateColor = (id: number) => {
  const hue = id * 137.508; // 황금각을 사용하여 고르게 분포된 색상 생성
  return `hsl(${hue % 360}, 70%, 80%)`;
}

// 매치 카드 컴포넌트
const MatchCard = ({ match }: { match: Matches }) => {
  const emoji = typeEmoji[match.type] || "🏸"
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <h1 className="text-2xl font-bold mb-4">다가오는 정기모임</h1>
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 grid grid-cols-7 gap-1">
            {weekDates.map((date) => (
              <DateButton
                key={date.toISOString()}
                date={date}
                isSelected={format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(date)}
              />
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* 필터와 생성 버튼 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <Select onValueChange={(value) => setFilterType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="모임 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="운동/스포츠">운동/스포츠</SelectItem>
                <SelectItem value="스터디">스터디</SelectItem>
                <SelectItem value="친목">친목</SelectItem>
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
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-500">해당 날짜의 모임이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
