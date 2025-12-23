import OpenAI from "openai";
import { PORTKEY_GATEWAY_URL, createHeaders } from "portkey-ai";

export function getOpenAIClient(): OpenAI {
  const openAIKey = process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return _createOpenAIClient({ openAIKey });
}

type createOpenAIClientArgs = {
  openAIKey: string;
};

// Private function to create the openai client - Do not touch this function
function _createOpenAIClient({ openAIKey }: createOpenAIClientArgs): OpenAI {
  return new OpenAI({
    apiKey: "xx",
    baseURL: PORTKEY_GATEWAY_URL,
    defaultHeaders: createHeaders({
      apiKey: openAIKey,
    }),
  });
}

export async function summarizeArticle(article: {
  title: string;
  description: string | null;
  content: string | null;
  source: string;
  url: string;
}): Promise<{ summary: string; violation: string }> {
  const client = getOpenAIClient();

  const articleText = `
Title: ${article.title}
Source: ${article.source}
Description: ${article.description || "N/A"}
Content: ${article.content || "N/A"}
URL: ${article.url}
  `.trim();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a news analyst. Given a news article, provide:
1. A concise 3-sentence summary of the article
2. A 1-sentence description of any legal violation, regulatory issue, or misconduct mentioned in the article

Respond in JSON format:
{
  "summary": "<3 sentences summarizing the article>",
  "violation": "<1 sentence describing the violation mentioned, or 'No specific violation identified' if none>"
}`,
      },
      {
        role: "user",
        content: articleText,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
}
