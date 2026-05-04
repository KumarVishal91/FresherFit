import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnalysisResult {
  atsScore: number;
  jdMatchScore: number | null;
  strengths: string[];
  weaknesses: string[];
  rewrittenBullets: { original: string; rewritten: string }[];
  actionableFeedback: string[];
  missingKeywords: string[];
}

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<AnalysisResult> {
  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer and career coach specializing in helping students and fresh graduates.

Analyze the following resume and return a JSON response with this exact structure:
{
  "atsScore": <number 0-100>,
  "jdMatchScore": <number 0-100 or null if no JD provided>,
  "strengths": [<list of 3-5 strong points>],
  "weaknesses": [<list of 3-5 weak points>],
  "rewrittenBullets": [
    {"original": "<original weak bullet>", "rewritten": "<improved version>"}
  ],
  "actionableFeedback": [<list of 4-6 specific actionable tips>],
  "missingKeywords": [<list of important missing keywords${jobDescription ? " from the job description" : ""}>]
}

RESUME TEXT:
${resumeText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : "No job description provided — analyze for general ATS compatibility."}

Rules:
- atsScore: Score based on formatting, keywords, action verbs, quantification, and ATS-friendliness
- jdMatchScore: Only if JD is provided, score keyword and skill overlap
- rewrittenBullets: Find 3-5 weak bullets (vague, passive, unquantified) and rewrite them with strong action verbs and metrics
- Be specific and student-friendly in all feedback
- Return ONLY valid JSON, no markdown, no explanation`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const cleaned = content.text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as AnalysisResult;
}
