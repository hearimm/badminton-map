import { NextResponse } from 'next/server'

const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NCP_CLIENT_ID
const NAVER_CLIENT_SECRET = process.env.NEXT_PUBLIC_NCP_CLIENT_SECRET

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID!,
          'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET!,
        },
      }
    )

    const data = await response.json()

    if (!data.addresses || data.addresses.length === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    const { x, y } = data.addresses[0]
    
    return NextResponse.json({
      latitude: parseFloat(y),
      longitude: parseFloat(x)
    })
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 })
  }
} 