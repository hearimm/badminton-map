import { notFound } from 'next/navigation'
import Header from "@/components/header"
import NaverMapOne from "@/components/naver-map-one"
import Link from "next/link"
import {
    ArrowUpRight,
} from "lucide-react"

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

type Matches = Database['public']['Tables']['matches']['Row'];


async function fetchWithId(id: string): Promise<Matches> {
    try {
        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .eq('id', id)    // Correct

        if (error) throw error;

        console.log('Data fetched successfully:', data);
        return data[0];
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

type NaverMapOneComponentProps = {
    data: Matches
}

function NaverMapOneComponent(props: NaverMapOneComponentProps) {
    const { data } = props;
    if (data?.place) {
        return (
            <NaverMapOne id={data.place}></NaverMapOne>
        )
    } else {
        return
    }
}

export default async function Page({ params }: { params: { id: string } }) {

    const data = await fetchWithId(params.id)
    if (!data) {
        notFound()
    }
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header></Header>
            <div id="mainWrap" className="mx-10">
            <Card className="xl:col-span-2 h-[300px]" x-chunk="dashboard-01-chunk-5">
                <NaverMapOneComponent data={data} />
            </Card>

            <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>매치 정보</CardTitle>
                        <CardDescription>Recent transactions from your store.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        {data.created_at}<br/>
                        {data.date}<br/>
                        {data.time}<br/>
                        {data.desc}<br/>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>매치 포인트</CardTitle>
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
                    <div>
                    Level : {data.level}<br/>
                    Max : 1 / {data.max}<br/>
                    준비물 : 라켓 / 실내전용 운동화(농구화/배드민턴화/배구화)<br/>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>참석자 정보</CardTitle>
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
                    <div>
                        참석자 정보
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>코트 정보</CardTitle>
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
                    <div>
                    코트 3면
                    무료주차
                    음료 판매
                    화장실

                        구장 특이사항
                        ■ 찾아가는 길 : 

                        ■ 주차 : 
                        ■ 흡연 : 지정된 장소에서만 흡연 가능 (흡연 구역 외에서 흡연 적발 시 이후 서비스 이용에 제재가 있을 수 있습니다.)
                        ■ 기타
                        - 상의를 탈의한 채로 건물 이동, 화장실 이용을 삼가주시기 바랍니다. (건물 내 학생 항시 상주)
                        - 화장실 : 건물 내 사용
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>진행방식</CardTitle>
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
                    <div>
                        규칙을 준수..
                        초보자를 배려해주세요..
                        번갈아가며 매치가 진행되도록 매니저가 잘 도와주세요.
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-2" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>환불정책</CardTitle>
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
                    환불기준은 .........
                </CardContent>
            </Card>
            </div>
            
        </div>

    )
}