import { notFound } from 'next/navigation';
import Header from "@/components/header";
import UpdateCourtForm from "@/components/updateCourtForm";
import { supabase } from "@/lib/initSupabase";
import { Database } from "@/supabase/types";

type Places = Database['public']['Tables']['places']['Row'];

async function fetchWithId(id: string): Promise<Places> {
    try {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .eq('id', id);

        if (error) throw error;

        return data[0];
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export default async function EditPage({ params }: { params: { id: string } }) {
    const data = await fetchWithId(params.id);
    if (!data) {
        notFound();
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <div id="mainWrap" className="mx-10">
                <h1 className="text-2xl font-bold mb-4">Edit Court {data.name}</h1>
                <UpdateCourtForm initialData={data} />
            </div>
        </div>
    );
}
