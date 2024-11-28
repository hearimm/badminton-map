'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/initSupabase"
import { Database } from "@/supabase/types"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import NaverMapFacility from "@/components/naver-map-facility"
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
import { ArrowUpRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

type LessonFacility = Database['public']['Tables']['lesson_facilities']['Row']
type LessonProgram = Database['public']['Tables']['lesson_programs']['Row']

export default function FacilityDetail({
  params,
}: {
  params: { id: string }
}) {
  const [facility, setFacility] = useState<LessonFacility | null>(null)
  const [programs, setPrograms] = useState<LessonProgram[]>([])

  useEffect(() => {
    async function fetchFacilityAndPrograms() {
      const { data: facilityData } = await supabase
        .from('lesson_facilities')
        .select('*')
        .eq('id', params.id)
        .single()

      if (facilityData) {
        setFacility(facilityData)
      }

      const { data: programsData } = await supabase
        .from('lesson_programs')
        .select('*')
        .eq('facility_id', params.id)
        .eq('is_active', true)

      if (programsData) {
        setPrograms(programsData)
      }
    }

    fetchFacilityAndPrograms()
  }, [params.id])

  if (!facility) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8">
          {/* Map Card */}
          {facility.latitude && facility.longitude && (
            <Card className="xl:col-span-2 h-[300px]">
              <NaverMapFacility id={`${facility.latitude},${facility.longitude}`} />
            </Card>
          )}

          {/* Facility Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Badge>{facility.facility_type}</Badge>
                  <CardTitle>{facility.facility_name}</CardTitle>
                </div>
                <CardDescription>
                  {facility.address}
                  {facility.phone && <span className="ml-2">| {facility.phone}</span>}
                </CardDescription>
              </div>
              <div className="ml-auto flex gap-2">
                {facility.place_id && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/court/${facility.place_id}`}>
                      <MapPin className="h-4 w-4 mr-2" />
                      코트 정보
                    </Link>
                  </Button>
                )}
                {facility.homepage_url && (
                  <Button asChild size="sm">
                    <a href={facility.homepage_url} target="_blank" rel="noopener noreferrer">
                      홈페이지
                      <ArrowUpRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Programs List Card */}
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
        </div>
      </main>
    </div>
  )
}