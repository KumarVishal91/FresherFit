import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume text is too short or missing." },
        { status: 400 }
      );
    }

    const result = await analyzeResume(resumeText, jobDescription || undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume. Please try again." },
      { status: 500 }
    );
  }
}
