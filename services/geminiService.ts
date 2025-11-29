import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AnalysisResult, Skill } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSkillGap = async (
  targetRole: string,
  currentSkills: Skill[],
  additionalContext: string
): Promise<AnalysisResult> => {
  
  const model = "gemini-2.5-flash";

  const skillListString = currentSkills
    .map((s) => `- ${s.name} (${s.level})`)
    .join("\n");

  const prompt = `
    You are a career coach and job market analyst engine.
    
    Target Role: ${targetRole}
    
    User's Current Skills:
    ${skillListString}
    
    Additional Context:
    ${additionalContext}

    Task:
    1. Analyze the current job market requirements for the Target Role.
    2. Compare the user's current skills against these requirements.
    3. Identify critical skill gaps.
    4. Create a structured learning path to bridge these gaps.
    5. Estimate a match score (0-100).
    
    Output the result in strict JSON format matching the schema provided.
    Ensure "topSkillsRequired" includes both technical and soft skills relevant to the role.
    "marketSummary" should be a concise paragraph about the current state of this role in the industry.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobTitle: { type: Type.STRING },
            matchScore: { type: Type.INTEGER },
            marketSummary: { type: Type.STRING },
            topSkillsRequired: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  frequency: { type: Type.NUMBER, description: "Importance score 1-100" },
                },
              },
            },
            gaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skillName: { type: Type.STRING },
                  userLevel: { type: Type.STRING },
                  marketRequirement: { type: Type.STRING },
                  importance: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
                  gapDescription: { type: Type.STRING },
                },
              },
            },
            learningPath: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  topic: { type: Type.STRING },
                  description: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ["Course", "Project", "Documentation", "Video"] },
                        provider: { type: Type.STRING },
                        estimatedDuration: { type: Type.STRING },
                        description: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
            },
          },
          required: ["jobTitle", "matchScore", "marketSummary", "topSkillsRequired", "gaps", "learningPath"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

export const createChatSession = (analysisResult: AnalysisResult): Chat => {
  const gapsSummary = analysisResult.gaps.map(g => `${g.skillName} (${g.importance})`).join(', ');
  const learningSteps = analysisResult.learningPath.map(s => `${s.stepNumber}. ${s.topic}`).join('\n');

  const systemInstruction = `
    You are an expert Career Coach and Technical Mentor named "Compass".
    The user has just completed a skill gap analysis for the target role: "${analysisResult.jobTitle}".
    
    Analysis Context:
    - Match Score: ${analysisResult.matchScore}%
    - Market Summary: ${analysisResult.marketSummary}
    - Critical Gaps Identified: ${gapsSummary}
    - Suggested Learning Path Steps:
    ${learningSteps}

    Your goals:
    1. Help the user understand their results and why certain gaps are critical.
    2. Provide specific advice, study tips, or explanations for technical concepts related to their gaps.
    3. Keep the user motivated and confident.
    4. Be concise, friendly, and professional.
    
    If the user asks for more resources, you can suggest specific books, websites, or project ideas that align with their learning path.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    }
  });
};