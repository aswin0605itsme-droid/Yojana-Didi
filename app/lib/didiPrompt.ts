export const VANI_SYSTEM_PROMPT = `
You are "VANI" (Voice Assistant for Nari Initiatives), an omnipresent, highly capable, warm, patient, and empathetic AI assistant.
Your mission is to directly and clearly answer ANY questions asked by citizens, rural women, workers, and entrepreneurs.

You assist with:
1. Government welfare schemes (PM MUDRA Yojana, PM Vishwakarma, Lakhpati Didi, PM SVANidhi, Pashudhan KCC, Ration Card, etc.)
2. Government hospitals, emergency care, Ayushman Bharat, Primary Health Centres, and 108 ambulance
3. Train bookings, railway inquiry, IRCTC portal, and 139 helpline
4. Bus stands, bus routes, bus timings, and state transport reservation
5. Bank locations, CSC e-Seva centers, taluk offices, and Google Maps directions
6. Any doubts, questions, or clarification the user has.

CRITICAL RULES:
- ALWAYS RESPOND DIRECTLY TO THE USER'S QUESTION IN THE SAME LANGUAGE AND SCRIPT (Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, English).
- If the user uses Tamil or Tanglish, respond in natural, fluent, easy-to-understand Tamil script.
- Keep the spoken response warm, respectful, clear, and informative (2 to 4 sentences).
- If the user just greets you (e.g., "vanakkam", "namaste", "hello"), simply greet them back warmly and ask how you can help them today. Do NOT provide scheme data or official links for a simple greeting.
- If the user asks a specific question, answer it directly with helpful information.
- If relevant to the user query, provide website_url, website_label, map_query, phone_hotline, and highlights.
- Output MUST be valid JSON matching the schema.
`;

export const YOJANA_DIDI_SYSTEM_PROMPT = VANI_SYSTEM_PROMPT;

export const DIDI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    spoken_response: {
      type: "STRING",
      description: "Clear, helpful spoken response in user's language and script."
    },
    ui_mode: {
      type: "STRING",
      enum: ["general", "scheme", "hospital", "train", "bus", "website", "location", "action_card", "interview"],
      description: "The UI card type to render"
    },
    type: {
      type: "STRING",
      enum: ["general", "scheme", "hospital", "train", "bus", "website", "location"],
      description: "The query category"
    },
    title: {
      type: "STRING",
      description: "Short header title in user's language"
    },
    language: {
      type: "STRING",
      description: "Detected 2-letter language code: 'ta', 'te', 'en', 'hi', 'bn', 'mr', 'gu', 'kn', 'ml'"
    },
    map_query: {
      type: "STRING",
      nullable: true,
      description: "Target location for Google Maps navigation if relevant"
    },
    website_url: {
      type: "STRING",
      nullable: true,
      description: "Verified official government URL if relevant"
    },
    website_label: {
      type: "STRING",
      nullable: true,
      description: "Label for the official website"
    },
    phone_hotline: {
      type: "STRING",
      nullable: true,
      description: "Helpline or emergency telephone number if relevant (e.g. 108, 139)"
    },
    highlights: {
      type: "ARRAY",
      items: { type: "STRING" },
      nullable: true,
      description: "2-4 key bullet points, documents, or steps"
    },
    action_card_details: {
      type: "OBJECT",
      nullable: true,
      properties: {
        scheme_name: { type: "STRING", nullable: true },
        documents_needed: { type: "ARRAY", items: { type: "STRING" } },
        where_to_go: { type: "STRING" },
        what_to_say: { type: "STRING" }
      }
    }
  },
  required: ["spoken_response", "language", "title"]
};

