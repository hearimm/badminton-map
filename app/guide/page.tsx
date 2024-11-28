'use client'

import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GuidePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col p-4">
        <h1 className="text-2xl font-bold mb-6">배드민턴 매치 이용 가이드</h1>

        <Tabs defaultValue="level" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="level">레벨 시스템</TabsTrigger>
            <TabsTrigger value="match">매치 참여</TabsTrigger>
            <TabsTrigger value="manner">매너/에티켓</TabsTrigger>
          </TabsList>
          
          <TabsContent value="level">
            <Card>
              <CardHeader>
                <CardTitle>레벨 시스템 안내</CardTitle>
                <CardDescription>
                  실력에 맞는 매치를 찾을 수 있도록 레벨 시스템을 운영하고 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">🏸 레벨 구분</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-medium">랠리 가능자 (1-10)</span>: 기본적인 랠리가 가능한 입문자</li>
                    <li><span className="font-medium">룰 숙지자 (11-20)</span>: 경기 규칙을 이해하고 기본기를 갖춘 단계</li>
                    <li><span className="font-medium">왕왕초심 (21-30)</span>: 기본적인 타구와 간단한 전술 구사 가능</li>
                    <li><span className="font-medium">왕초심 (31-40)</span>: 안정적인 랠리와 기본 전술 구사</li>
                    <li><span className="font-medium">초심 (41-50)</span>: 다양한 타구와 전술 구사 가능</li>
                    <li><span className="font-medium">D조 (51-60)</span>: 동호인 대회 D조 수준</li>
                    <li><span className="font-medium">C조 (61-70)</span>: 동호인 대회 C조 수준</li>
                    <li><span className="font-medium">B조 (71-80)</span>: 동호인 대회 B조 수준</li>
                    <li><span className="font-medium">A조 (81-100)</span>: 동호인 대회 A조 수준</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="match">
            <Card>
              <CardHeader>
                <CardTitle>매치 참여 방법</CardTitle>
                <CardDescription>
                  매치 참여부터 종료까지의 과정을 안내합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">📝 매치 참여 절차</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>원하는 매치 찾기 (날짜, 시간, 장소, 레벨 확인)</li>
                    <li>매치 신청 및 참가비 결제</li>
                    <li>매치 당일 시간 준수하여 참석</li>
                    <li>매너 있는 플레이</li>
                    <li>피드백 작성</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">⚠️ 주의사항</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>레벨에 맞는 매치 참여</li>
                    <li>시간 준수</li>
                    <li>기본 장비 지참 (라켓, 운동화 등)</li>
                    <li>부상 방지를 위한 준비운동</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manner">
            <Card>
              <CardHeader>
                <CardTitle>매너와 에티켓</CardTitle>
                <CardDescription>
                  즐거운 매치를 위한 기본 매너와 에티켓을 안내합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">🤝 기본 매너</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>상대방을 존중하는 태도</li>
                    <li>심판 판정 존중</li>
                    <li>경기 중 적절한 소리 크기</li>
                    <li>셔틀콕 정리 협조</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🚫 금지 행위</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>상대방 비하 발언</li>
                    <li>과도한 항의나 감정적인 리액션</li>
                    <li>고의적인 경기 지연</li>
                    <li>부적절한 언어 사용</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
} 