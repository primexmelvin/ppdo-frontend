import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

/**
 * GET /api/offices
 * Fetch all offices from MongoDB
 */
export async function GET() {
  try {
    const db = await getDb();
    const officesCollection = db.collection("offices");

    const offices = await officesCollection.find({}).toArray();

    return NextResponse.json({
      success: true,
      data: offices,
      count: offices.length,
    });
  } catch (error: any) {
    console.error("Error fetching offices:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch offices",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/offices
 * Create a new office in MongoDB
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, description } = body;

    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and code are required",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    const officesCollection = db.collection("offices");

    // Check if office with same code exists
    const existing = await officesCollection.findOne({ code });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Office with this code already exists",
        },
        { status: 409 }
      );
    }

    const newOffice = {
      name,
      code,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await officesCollection.insertOne(newOffice);

    return NextResponse.json(
      {
        success: true,
        data: { _id: result.insertedId, ...newOffice },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating office:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create office",
      },
      { status: 500 }
    );
  }
}

