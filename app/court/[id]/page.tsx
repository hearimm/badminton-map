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

type Places = Database['public']['Tables']['places']['Row'];


async function fetchWithId(id: string): Promise<Places> {
    try {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .eq('place_id', id)    // Correct

        if (error) throw error;

        console.log('Data fetched successfully:', data);
        return data[0];
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

type NaverMapOneComponentProps = {
    data: Places
}

function NaverMapOneComponent(props: NaverMapOneComponentProps) {
    const { data } = props;
    if (data?.place_id) {
        return (
            <NaverMapOne id={data.place_id + ''}></NaverMapOne>
        )
    } else {
        return
    }
}

type CourtDetailComponentProps = {
    court: Places
}
const CourtDetail = (props: CourtDetailComponentProps) => {

    const { court } = props;
    return (

        <div>
            <Card className="mt-2">

                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>{court.place_name}</CardTitle>
                        <CardDescription>{court.address} <span><a href={court.additional_info?.map_link || undefined} target="_blank" rel="noopener noreferrer" className="text-blue-500">View on Naver Map</a></span></CardDescription>

                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href={`/court/${court.place_id}/edit`} prefetch={false}>
                            Update
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <strong>Contact:</strong> {court.additional_info?.contact}
                    </div>
                    <div className="mb-4">
                        <strong>Website:</strong> <a href={court.additional_info?.club_website!} target="_blank" rel="noopener noreferrer">{court.club_website}</a>
                    </div>
                    <div className="mb-4">
                        <strong>Type:</strong> {court.place_type}
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Facilities</h2>
                        <p><strong>Courts:</strong> {court.additional_info?.courts}</p>
                        <p><strong>Flooring:</strong> {court.additional_info?.flooring}</p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Schedule & Fees</h2>
                        <p><strong>Schedule:</strong> {court.additional_info?.schedule}</p>
                        <p><strong>Fee:</strong> {court.additional_info?.fee}</p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Additional Links</h2>
                        <p><strong>{court.additional_info?.club_review1}</strong><a href={court.additional_info?.other_link1 || undefined} target="_blank" rel="noopener noreferrer"> {court.additional_info?.other_link1}</a></p>
                        <p><strong>{court.additional_info?.club_review2}</strong><a href={court.additional_info?.other_link2 || undefined} target="_blank" rel="noopener noreferrer"> {court.additional_info?.other_link2}</a></p>
                        <p><strong>{court.additional_info?.club_review3}</strong><a href={court.additional_info?.other_link3 || undefined} target="_blank" rel="noopener noreferrer"> {court.additional_info?.other_link3}</a></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
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

                <CourtDetail court={data}></CourtDetail>
            </div>

        </div>

    )
}