import React, { useEffect, useRef } from 'react';

interface NaverMapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

declare global {
  interface Window {
    naver: any;
  }
}

const NaverMapPlaceSelect: React.FC<NaverMapProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}&submodules=geocoder`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울 중심
        zoom: 13,
      });

      window.naver.maps.Event.addListener(map, 'click', function(e: any) {
        const latlng = e.coord;
        
        window.naver.maps.Service.reverseGeocode({
          location: new window.naver.maps.LatLng(latlng.lat(), latlng.lng()),
        }, function(status: any, response: any) {
          if (status === window.naver.maps.Service.Status.ERROR) {
            return alert('Something wrong!');
          }

          const result = response.result;
          const items = result.items;
          const address = items[0].address;
          
          onLocationSelect(latlng.lat(), latlng.lng(), address);
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [onLocationSelect]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default NaverMapPlaceSelect;