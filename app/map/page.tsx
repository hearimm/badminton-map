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
import NaverMap from "@/components/naver-map";

import { Database } from "@/supabase/types";
type Places = Database['public']['Tables']['places']['Row'];

export default function Dashboard() {
  const [places, setPlaces] = useState<Places[]>([]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header></Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="hidden lg:block"
             x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Infomation</CardTitle>
                <CardDescription>
                  체육관 정보
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
                    <TableHead>체육관</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {places.map((club) => (
                  <TableRow key={club.place_id}>
                    <TableCell>
                    <div className="font-medium">
                      <Badge>{club.place_type}</Badge>{club.place_name}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {club.additional_info?.schedule} <br/>
                      {club.additional_info?.club_name}
                    </div>
                    
                    </TableCell>
                    <TableCell>
                    <Button asChild size="sm" className="ml-auto gap-1">
                      <Link href={`/court/${club.place_id}`}>
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
          <Card className="xl:col-span-2 h-[500px]" x-chunk="dashboard-01-chunk-5">
            <NaverMap onPlacesFetched={setPlaces}></NaverMap>
          </Card>
        </div>
      </main>
    </div>
  )
}
