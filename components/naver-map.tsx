'use client'

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/initSupabase";
import { Database } from "@/supabase/types";
import Script from "next/script";

type Location = Database['public']['Tables']['locations']['Row'];


export default function NaverMap() {
  const [locations, setLocations] = useState<Location[]>([]);
  const mapRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    console.log('use effect')
    // initMap();

    // const fetchLocations = async () => {
    //   const { data: locations, error } = await supabase
    //     .from('locations')
    //     .select('*');
    //   if (error) console.error('Error fetching data:', error);
    //   else setLocations(locations);
    // };

    // fetchLocations();
  }, []);

  
  function initMap() {
    console.log('init map ! ')
    // window.alert('현재 위치를 알 수 없어 기본 위치로 지정합니다.');
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10
    });
    mapRef.current = map;
  }

  return (
    <div>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}`}
        onReady={initMap}
      />
      <div id = 'map' style = {{width : '100%', height: '500px'}}/>
    </div>
  );
}
