'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, startOfWeek } from 'date-fns'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Header from "@/components/header"
import { supabase } from "@/lib/initSupabase"
import { Database } from "@/supabase/types"

type Matches = Database['public']['Tables']['matches']['Row']

const ITEMS_PER_PAGE = 10

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

const LinkButton = ({ status, id }: { status: string; id: number }) => {
  switch (status) {
    case 'C':
      return <Button disabled size="sm" className="ml-auto gap-1 w-[100px]">마감</Button>
    default:
      return (
        <Button asChild size="sm" className="ml-auto gap-1 w-[100px]">
          <Link href={`/schedule/${id}`} prefetch={false}>
            신청하기
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      )
  }
}

const WeekDateButton = ({ date, isSelected, onClick }: { date: Date; isSelected: boolean; onClick: () => void }) => (
  <Button
    variant={isSelected ? "default" : "outline"}
    className={`flex-col items-center justify-center h-16 ${isSelected ? 'bg-blue-500 text-white' : ''}`}
    onClick={onClick}
  >
    <div className="text-sm">{format(date, 'E')}</div>
    <div className="text-lg font-bold">{format(date, 'd')}</div>
  </Button>
)

export default function ScheduleListPage() {
  const [matches, setMatches] = useState<Matches[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  useEffect(() => {
    const getMatches = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMatches(selectedDate)
        setMatches(data)
      } catch (err) {
        setError('Failed to fetch matches. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    getMatches()
  }, [selectedDate])

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-2">
              <CardTitle>모임</CardTitle>
              <CardDescription>Available badminton matches.</CardDescription>
            </div>
            <Button asChild size="sm" className="gap-1">
              <Link href="/schedule/create" prefetch={false}>
                만들기
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 grid grid-cols-7 gap-1">
                {weekDates.map((date) => (
                  <WeekDateButton
                    key={date.toISOString()}
                    date={date}
                    isSelected={format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
                    onClick={() => setSelectedDate(date)}
                  />
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : matches.length === 0 ? (
              <div className="text-center text-gray-500">No matches available for this date.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">시간</TableHead>
                    <TableHead>장소</TableHead>
                    <TableHead className="w-[100px]">레벨</TableHead>
                    <TableHead className="text-right">신청</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">{match.time}</TableCell>
                      <TableCell>
                        <div className="font-medium">{match.places?.name}</div>
                        <div className="text-sm text-muted-foreground">{match.description}</div>
                      </TableCell>
                      <TableCell>{match.level}</TableCell>
                      <TableCell className="text-right">
                        <LinkButton id={match.id} status={match.max + ''} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}