'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Tables } from '@/supabase/types'
import NaverMap from '@/components/naver-map'

type Facility = Tables<'lesson_facilities'>

const GeocodingAdmin: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAddress, setEditAddress] = useState('')

  useEffect(() => {
    fetchFacilitiesWithoutCoords()
  }, [])

  const fetchFacilitiesWithoutCoords = async () => {
    const { data, error } = await supabase
      .from('lesson_facilities')
      .select('*')
      .or('latitude.is.null,longitude.is.null')
    
    if (error) {
      console.error('Error fetching facilities:', error)
      return
    }
    
    setFacilities(data)
  }

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
      const data = await response.json()
      
      if (data.error) throw new Error(data.error)
      return data
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  const updateFacility = async (id: string, latitude: number, longitude: number) => {
    const { error } = await supabase
      .from('lesson_facilities')
      .update({ latitude, longitude })
      .eq('id', id)

    if (error) {
      console.error('Error updating facility:', error)
      return false
    }
    return true
  }

  const updateAddress = async (id: string, address: string) => {
    const { error } = await supabase
      .from('lesson_facilities')
      .update({ address })
      .eq('id', id)

    if (error) {
      console.error('Error updating address:', error)
      return false
    }
    return true
  }

  const handleEditClick = (facility: Facility) => {
    setEditingId(facility.id)
    setEditAddress(facility.address || '')
  }

  const handleSaveAddress = async (facility: Facility) => {
    if (!editAddress.trim()) {
      setMessage('주소를 입력해주세요.')
      return
    }

    const success = await updateAddress(facility.id, editAddress)
    if (success) {
      setMessage('주소가 업데이트되었습니다.')
      await fetchFacilitiesWithoutCoords()
      setEditingId(null)
    } else {
      setMessage('주소 업데이트에 실패했습니다.')
    }
  }

  const handleGeocodeClick = async (facility: Facility) => {
    setLoading(true)
    setMessage('')

    if (!facility.address) {
      setMessage('주소가 없습니다.')
      setLoading(false)
      return
    }

    const geocodeResult = await geocodeAddress(facility.address)
    if (geocodeResult) {
      const success = await updateFacility(
        facility.id,
        geocodeResult.latitude,
        geocodeResult.longitude
      )
      
      if (success) {
        setMessage(`Successfully updated coordinates for ${facility.facility_name}`)
        await fetchFacilitiesWithoutCoords() // Refresh the list
      } else {
        setMessage('Failed to update coordinates')
      }
    } else {
      setMessage('주소를 찾을 수 없습니다.')
    }
    
    setLoading(false)
  }

  const handlePlacesFetched = (places: any) => {
    // 필요한 처리를 여기서 수행
    console.log('Places fetched:', places)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Geocoding Admin</h1>
      
      <NaverMap 
        onPlacesFetched={handlePlacesFetched}
        // ... other props ...
      />
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('Successfully') || message.includes('업데이트되었습니다')
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {facilities.map((facility) => (
          <div key={facility.id} className="border p-4 rounded">
            <h2 className="font-bold">{facility.facility_name}</h2>
            
            <p className="text-sm text-blue-600 mb-2">
              위치 힌트: {facility.province_name} {facility.city_name}
            </p>
            
            {editingId === facility.id ? (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder={`힌트: ${facility.province_name} ${facility.city_name}`}
                />
                <div className="space-x-2">
                  <button
                    onClick={() => handleSaveAddress(facility)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600">
                  {facility.address || '주소 없음'}
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEditClick(facility)}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    주소 수정
                  </button>
                  <button
                    onClick={() => handleGeocodeClick(facility)}
                    disabled={loading || !facility.address}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : '좌표 가져오기'}
                  </button>
                </div>
              </>
            )}
            
            {facility.latitude && facility.longitude && (
              <p className="mt-2 text-sm text-gray-500">
                위도: {facility.latitude}, 경도: {facility.longitude}
              </p>
            )}
          </div>
        ))}
      </div>

      {facilities.length === 0 && (
        <p className="text-gray-600">좌표가 없는 시설이 없습니다.</p>
      )}
    </div>
  )
}

export default GeocodingAdmin 