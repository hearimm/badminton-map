'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/initSupabase";
import { Database } from "@/supabase/types";
import NaverMap from "@/components/naver-map";

type Location = Database['public']['Tables']['locations']['Row'];


export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    console.log('use effect')

    // const fetchLocations = async () => {
    //   const { data: locations, error } = await supabase
    //     .from('locations')
    //     .select('*');
    //   if (error) console.error('Error fetching data:', error);
    //   else setLocations(locations);
    // };

    // fetchLocations();
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <p>{JSON.stringify(locations)}</p>
      <NaverMap></NaverMap>
    </div>
  );
}
