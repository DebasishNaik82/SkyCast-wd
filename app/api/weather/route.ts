import { NextRequest, NextResponse } from 'next/server';
import { fetchWeather, reverseGeocode } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
  }

  try {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    // Fetch both weather data and human-readable location name in parallel
    const [weatherData, resolvedName] = await Promise.all([
      fetchWeather(latNum, lonNum),
      reverseGeocode(latNum, lonNum)
    ]);
    
    return NextResponse.json({
      ...weatherData,
      resolved_name: resolvedName || 'Your Location'
    });
  } catch (error) {
    console.error('API weather route error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
