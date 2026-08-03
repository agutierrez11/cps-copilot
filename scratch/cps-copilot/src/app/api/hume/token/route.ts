export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { fetchAccessToken } from 'hume';

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
    // Note: In production you'd use a SECRET_KEY, but for testing/MVP with Hume, 
    // the API key often acts as both, or fetchAccessToken can work with just apiKey.
    if (!apiKey) {
      throw new Error("Hume API key not found in env variables.");
    }

    const token = await fetchAccessToken({
      apiKey: String(apiKey),
      secretKey: String(process.env.HUME_SECRET_KEY || apiKey)
    });

    return NextResponse.json({ accessToken: token });
  } catch (error: any) {
    console.error("Error fetching Hume access token:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
