'use client'

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/initSupabase";
import { Database } from "@/supabase/types";
import Script from "next/script";

type BadmintonClub = Database['public']['Tables']['badminton_clubs']['Row'];


interface NaverMapOneProps {
  id: string
}

export default function NaverMapOne({ id }: NaverMapOneProps) {
  const [badmintonClub, setBadmintonClubs] = useState<BadmintonClub[]>([]);
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
  const mapRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    console.log('use effect')
  }, []);

  async function fetchWithId(id: string) {
    try {
      const { data, error } = await supabase
        .from('badminton_clubs')
        .select('*')
        .eq('id', id)    // Correct

      if (error) throw error;

      console.log('Data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }


  function updateMarkers(map: naver.maps.Map, bounds: naver.maps.Bounds) {
    console.log('update markers')
    fetchWithId(id).then(data => {
      if (!data) return
      markers.forEach(marker => marker.setMap(null));
      const newMarkers = data.map(location => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(location.latitude!, location.longitude!),
          title: location.name || '',
          map: map
        })

        map.panTo(marker.getPosition())

        var contentString = [
          '<div class="iw_inner">',
          `   <h3>${location.name}</h3>`,
          `   <p>${location.address}<br />`,
          '   </p>',
          '</div>'
        ].join('');
        var infowindow = new naver.maps.InfoWindow({
          content: contentString
        });
        naver.maps.Event.addListener(marker, "click", function (e) {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.open(map, marker);
          }
        });
        return marker;
      });



      setMarkers(newMarkers);
    });
  }

function initMap() {
    console.log('init map ! ')
    // window.alert('현재 위치를 알 수 없어 기본 위치로 지정합니다.');
    const map = new naver.maps.Map('map', {
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.RIGHT_CENTER,
      },
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 13
    });

    updateMarkers(map, map.getBounds())

    mapRef.current = map;
  }

  return (
    <div className="size-full">
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}`}
        onReady={initMap}
      />
      <div id='map' className="size-full" />
    </div>
  );
}
