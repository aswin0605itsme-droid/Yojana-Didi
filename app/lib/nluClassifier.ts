import schemeData from "@/data/scheme.json";

export interface ClassificationResult {
  optionId: string | null;
  confirmedText: string;
  isConfirmation?: boolean;
  confirmedValue?: boolean;
}

/**
 * Classifies spoken or typed input against options of a given question.
 * Uses strict keyword matching for instant, accurate classification without hallucinations.
 */
export function classifyAnswerLocally(
  questionId: string,
  userSpeech: string,
  lang: "ta" | "en" | "hi" = "ta"
): ClassificationResult {
  const text = (userSpeech || "").toLowerCase().trim();
  if (!text) return { optionId: null, confirmedText: "" };

  const question = schemeData.questions.find((q) => q.id === questionId);
  if (!question) return { optionId: null, confirmedText: "" };

  // 1. Check for Yes / No confirmation if waiting for confirmation
  const isYes = /\b(yes|yeah|yep|sure|ok|okay|aama|aam|sari|haan|ha|ஆம்|சரி|ஆமாம்)\b/.test(text);
  const isNo = /\b(no|nope|not|illai|ila|nahi|na|இல்லை|வேண்டாம்)\b/.test(text);

  if (questionId === "q_confirm") {
    if (isYes) return { optionId: "yes", confirmedText: "Yes", isConfirmation: true, confirmedValue: true };
    if (isNo) return { optionId: "no", confirmedText: "No", isConfirmation: true, confirmedValue: false };
  }

  // 2. Match against options defined in data/scheme.json
  for (const option of question.options) {
    for (const kw of option.keywords) {
      const kwLower = kw.toLowerCase();
      // Match either as word or substring in regional scripts
      if (text.includes(kwLower)) {
        const label = (option.label as any)[lang] || option.label.en;
        return {
          optionId: option.id,
          confirmedText: label
        };
      }
    }
  }

  // Check yes/no for boolean questions
  if (questionId === "q_shg" || questionId === "q_amount") {
    if (isYes) {
      const opt = question.options.find((o) => o.id === "yes");
      return {
        optionId: "yes",
        confirmedText: (opt?.label as any)[lang] || "Yes"
      };
    }
    if (isNo) {
      const opt = question.options.find((o) => o.id === "no");
      return {
        optionId: "no",
        confirmedText: (opt?.label as any)[lang] || "No"
      };
    }
  }

  return { optionId: null, confirmedText: "" };
}

/**
 * Determine the best scheme based on collected answers.
 */
export function determineSchemeFromAnswers(answers: { [key: string]: string }) {
  const work = answers["q_work"];
  const isShg = answers["q_shg"] === "yes";
  const isUnder50k = answers["q_amount"] === "yes";

  // If in SHG, Lakhpati Didi is prioritized
  if (isShg) {
    return schemeData.schemes.find((s) => s.id === "lakhpati_didi") || schemeData.schemes[0];
  }

  // Dairy work
  if (work === "dairy") {
    return schemeData.schemes.find((s) => s.id === "pashudhan_kcc") || schemeData.schemes[0];
  }

  // Street vendor or small shop with micro capital
  if (work === "vendor" && isUnder50k) {
    return schemeData.schemes.find((s) => s.id === "pm_svanidhi") || schemeData.schemes[0];
  }

  // Default to MUDRA Shishu Loan
  return schemeData.schemes.find((s) => s.id === "mudra_shishu") || schemeData.schemes[0];
}
