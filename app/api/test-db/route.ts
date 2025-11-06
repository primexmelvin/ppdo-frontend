import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    
    // Test connection by listing collections
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      database: db.databaseName,
      collections: collections.map((c) => c.name),
    });
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to MongoDB",
      },
      { status: 500 }
    );
  }
}

