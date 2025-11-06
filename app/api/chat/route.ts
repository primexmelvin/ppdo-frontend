import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Lazy initialization to avoid build-time errors when API key is missing
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const { messages, language = "english" } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = getOpenAIClient();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const languageInstruction =
      language === "filipino"
        ? "Respond in Filipino (Tagalog) language. Use formal Filipino when appropriate."
        : "Respond in English language.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for cost efficiency
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for a provincial government office document management system. Be concise, professional, and helpful. Focus on tasks related to document processing, categorization, and administrative tasks. ${languageInstruction}`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to get response from AI",
      },
      { status: 500 }
    );
  }
}
