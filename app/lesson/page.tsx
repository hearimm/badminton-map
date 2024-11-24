'use client'
import { useState } from "react";

import Link from "next/link"
import {
  ArrowUpRight,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
import NaverMap from "@/components/naver-map-lesson";

import { Database } from "@/supabase/types";
type LessonFacility = Database['public']['Tables']['lesson_facilities']['Row'];

export default function Dashboard() {
  const [facilities, setFacilities] = useState<LessonFacility[]>([]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header></Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="hidden lg:block">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>체육시설 정보</CardTitle>
                <CardDescription>
                  공공체육시설 및 프로그램 정보
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="min-h-96 max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시설명</TableHead>
                    <TableHead>위치</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {facilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell>
                      <div className="font-medium">
                        <Badge>{facility.facility_type}</Badge> {facility.facility_name}
                      </div>
                      {facility.phone && (
                        <div className="text-sm text-muted-foreground">
                          {facility.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {facility.province_name} {facility.city_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {facility.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href={`/lesson/facility/${facility.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="xl:col-span-2 h-[500px]">
            <NaverMap onPlacesFetched={setFacilities}></NaverMap>
          </Card>
        </div>
      </main>
    </div>
  )
}
