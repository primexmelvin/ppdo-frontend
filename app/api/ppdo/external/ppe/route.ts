import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get HRMO API URL from environment variable
    const hrmoApiUrl = process.env.NEXT_PUBLIC_HRMO_API_URL || "http://localhost:3000";
    const apiEndpoint = `${hrmoApiUrl}/api/ppdo/external/ppe`;

    // Proxy request to external HRMO API
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache control if needed
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error proxying external API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch data from external API",
      },
      { status: 500 }
    );
  }
}

