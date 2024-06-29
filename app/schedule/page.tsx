'use client'

import Link from "next/link"
import {
  ArrowUpRight,
} from "lucide-react"
import { useEffect, useState } from "react"

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
import { Database } from "@/supabase/types";

type Matches = Database['public']['Tables']['matches']['Row'];

async function fetchMatches(): Promise<Matches[]> {
  try {
      const { data, error } = await supabase
          .from('matches')
          .select('*')

      if (error) throw error;

      console.log('Data fetched successfully:', data);
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
  }
}

export default function Schedule() {
  const [matches, setMatches] = useState<Matches[]>([]);

  useEffect(() => {
    const getMatches = async () => {
      const matchList = await fetchMatches();
      setMatches(matchList);
    };
    getMatches();
  }, []);

  type LinkButtonProps = {
    children: React.ReactNode,
    status: String
    id: Number
  }
  const LinkButton = (props: LinkButtonProps) => {
    const { status, id } = props;
    
    switch (status){
      case 'C' :
        return (<Button disabled size="sm" className="ml-auto gap-1 w-[100px]">마감</Button>)
      default : 
        return (<Button asChild size="sm" className="ml-auto gap-1 w-[100px]">
          <Link href={`/schedule/${id}`} prefetch={false}>
            신청하기
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header></Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>모임</CardTitle>
                <CardDescription>Recent transactions from your store.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/schedule/create" prefetch={false}>
                  만들기
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">시간</TableHead>
                    <TableHead>타이틀</TableHead>
                    <TableHead className="text-right">신청</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {
                  matches.map(match => (
                    <TableRow key={match.id}>
                    <TableCell>
                      <div className="font-medium">{match.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{match.place}</div>
                      <div className="text-sm text-muted-foreground">{match.description}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <LinkButton id={match.id} status={match.max+''}> </LinkButton>
                    </TableCell>
                  </TableRow>
                  ))
                }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}