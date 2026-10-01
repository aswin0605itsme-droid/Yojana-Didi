export interface ActionCardDetails {
  scheme_name: string | null;
  documents_needed: string[];
  where_to_go: string;
  what_to_say: string;
  official_website?: string | null;
  map_query?: string | null;
}

export interface YojanaDidiResponse {
  spoken_response: string;
  ui_mode: "interview" | "action_card" | "info";
  action_card_details: ActionCardDetails;
  language?: string;
  website_url?: string | null;
  website_label?: string | null;
  map_query?: string | null;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
  actionCard?: ActionCardDetails | null;
  quickOptions?: string[];
  websiteUrl?: string | null;
  websiteLabel?: string | null;
  mapQuery?: string | null;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}
