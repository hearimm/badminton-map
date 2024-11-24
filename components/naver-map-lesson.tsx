'use client'

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/initSupabase";
import { Database } from "@/supabase/types";
import Script from "next/script";

type LessonFacility = Database['public']['Tables']['lesson_facilities']['Row'];

interface NaverMapLessonProps {
  onPlacesFetched: (facilities: LessonFacility[]) => void;
}

export default function NaverMapLesson({ onPlacesFetched }: NaverMapLessonProps) {
  const [facilities, setFacilities] = useState<LessonFacility[]>([]);
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
  const mapRef = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    console.log('use effect')
  }, []);

  async function fetchWithinBounds(bounds: naver.maps.Bounds): Promise<LessonFacility[]> {
    try {
      const { data, error } = await supabase
        .from('lesson_facilities')
        .select('*')
        .gte('latitude', bounds.minY())
        .lte('latitude', bounds.maxY())
        .gte('longitude', bounds.minX())
        .lte('longitude', bounds.maxX());

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  function updateMarkers(map: naver.maps.Map, bounds: naver.maps.Bounds) {
    fetchWithinBounds(bounds).then(data => {
      if (!data) return;
      markers.forEach(marker => marker.setMap(null));
      const newMarkers = data.map(facility => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(facility.latitude!, facility.longitude!),
          title: facility.facility_name || '',
          map: map
        });

        var contentString = [
          '<div class="iw_inner">',
          `   <h3>${facility.facility_name}</h3>`,
          `   <p>${facility.address}<br />`,
          facility.phone ? `   <span>${facility.phone}</span><br />` : '',
          `   <span>${facility.facility_type}</span>`,
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

      onPlacesFetched(data);
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

    naver.maps.Event.addListener(map, 'zoom_changed', () => updateMarkers(map, map.getBounds()));
    naver.maps.Event.addListener(map, 'dragend', () => updateMarkers(map, map.getBounds()));

    mapRef.current = map;
    updateMarkers(map, map.getBounds());
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
