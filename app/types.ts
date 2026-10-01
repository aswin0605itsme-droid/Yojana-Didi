export interface ActionCardDetails {
  scheme_name: string | null;
  documents_needed: string[];
  where_to_go: string;
  what_to_say: string;
}

export interface YojanaDidiResponse {
  spoken_response: string;
  ui_mode: "interview" | "action_card";
  action_card_details: ActionCardDetails;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
  actionCard?: ActionCardDetails | null;
  quickOptions?: string[];
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}
