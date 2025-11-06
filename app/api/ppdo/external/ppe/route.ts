import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get HRMO API URL from environment variable
    const hrmoApiUrl = process.env.NEXT_PUBLIC_HRMO_API_URL;

    if (!hrmoApiUrl) {
      throw new Error(
        "NEXT_PUBLIC_HRMO_API_URL environment variable is not set. Please configure it in your .env.local file."
      );
    }

    // Remove trailing slash if present
    const baseUrl = hrmoApiUrl.replace(/\/$/, "");
    const apiEndpoint = `${baseUrl}/api/ppdo/external/ppe`;

    console.log("Attempting to fetch from:", apiEndpoint);

    // Proxy request to external HRMO API
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Add cache control if needed
      cache: "no-store",
    });

    console.log("Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "No error details available");
      console.error("External API error response:", errorText);
      throw new Error(
        `External API error: ${response.status} ${response.statusText}. ${errorText}`
      );
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
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch data from external API",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
