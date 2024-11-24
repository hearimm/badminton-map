'use client'

import { useEffect, useRef } from "react"
import Script from "next/script"

interface Props {
  id: string
}

export default function NaverMapFacility({ id }: Props) {
  const mapRef = useRef<naver.maps.Map | null>(null)

  useEffect(() => {
    const [lat, lng] = id.split(',').map(Number)
    
    const initializeMap = () => {
      const location = new naver.maps.LatLng(lat, lng)
      const mapOptions = {
        center: location,
        zoom: 17,
        minZoom: 6,
        maxZoom: 21,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
      }

      const map = new naver.maps.Map('map', mapOptions)
      const marker = new naver.maps.Marker({
        position: location,
        map: map
      })
    }

    if (window.naver && window.naver.maps) {
      initializeMap()
    }
  }, [id])

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}`}
      />
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
    </>
  )
}
