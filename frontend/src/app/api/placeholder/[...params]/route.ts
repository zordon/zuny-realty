import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const [width = '400', height = '300'] = params.params || []
  
  // Redirect to Picsum Photos for beautiful placeholder images
  const imageUrl = `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`
  
  return NextResponse.redirect(imageUrl)
} 