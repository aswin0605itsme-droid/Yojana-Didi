import { ActionCardDetails, YojanaDidiResponse } from "../types";

export interface SchemeInfo {
  id: string;
  name: string;
  category: "tailoring" | "dairy" | "vending" | "shg" | "artisan" | "general";
  tagline: string;
  amount: string;
  where_to_go: string;
  documents_needed: string[];
  what_to_say: string;
  explanation: string;
}

export const SCHEMES_DATABASE: SchemeInfo[] = [
  {
    id: "mudra_shishu",
    name: "PM MUDRA Yojana (Shishu Rin)",
    category: "tailoring",
    tagline: "Apna naya chhota kaam shuru karne ke liye bina kisi girvi ke sahayata",
    amount: "₹50,000 tak",
    where_to_go: "Nearest SBI ya kisi bhi Sarkari Bank ki Shakha (Branch)",
    documents_needed: [
      "Aadhaar Card (Pehchan Patra)",
      "Bank Khate ki Passbook",
      "2 Passport Size Photo",
      "Ghar ka pata pramaan (Ration card ya Bijli bill)"
    ],
    what_to_say: "Namaste Sahab, main silai machine khareed kar kaam shuru karne ke liye Pradhan Mantri Mudra Shishu loan ka form lene aayi hoon.",
    explanation: "Yeh sarkari yojana aapko bina zameen ya ghar girvi rakhe ₹50,000 tak ki sahayata deti hai taaki aap silai ya dukan ka saman khareed sakein."
  },
  {
    id: "lakhpati_didi",
    name: "Lakhpati Didi Yojana (DAY-NRLM)",
    category: "shg",
    tagline: "Samooh (Bachat Gat) ki behno ke liye saal ki acchi aamdani ka rasta",
    amount: "₹1,00,000 se ₹5,00,000 tak samooh sahayata",
    where_to_go: "Aapke gaon ki Gram Panchayat ya Block Vikas Adhikari (BDO Office)",
    documents_needed: [
      "Aadhaar Card",
      "Samooh (SHG) Sadashyata Pustika / Passbook",
      "Bank Passbook",
      "Photo"
    ],
    what_to_say: "Didi / Sahab, hamara bachat gat accha chal raha hai, mujhe Lakhpati Didi yojana ke tahat training aur karobar badhane ki jankari chahiye.",
    explanation: "Aapke bachat samooh ke zariye sarkar aapko naya hunar sikhayegi aur kam byaaj par paise dilwayegi taaki aap har saal kam se kam ₹1 lakh kama sakein."
  },
  {
    id: "pm_svanidhi",
    name: "PM SVANidhi Yojana",
    category: "vending",
    tagline: "Chhoti dukan, thela ya fal-sabzi bechne wali behno ke liye",
    amount: "₹10,000 se ₹50,000 tak",
    where_to_go: "Nazdeeki Common Service Center (CSC / Pragya Kendra) ya Sarkari Bank",
    documents_needed: [
      "Aadhaar Card",
      "Bank Passbook",
      "Mobile number jo Aadhaar se juda ho",
      "Thela ya dukan ki photo"
    ],
    what_to_say: "Sahab, meri chhoti dukan/thele ke saman ke liye mujhe PM SVANidhi yojana ka aavedan karwana hai.",
    explanation: "Is yojana mein sarkari sahayata turant milti hai, jismein samay par wapas karne par sarkar byaaj mein chhoot bhi deti hai."
  },
  {
    id: "pashu_kisan",
    name: "Pashudhan Sahayata / Kisan Credit Card (Dairy & Pashupalan)",
    category: "dairy",
    tagline: "Gai, bhains, bakri paalne aur doodh ka kaam badhane ke liye",
    amount: "₹60,000 se ₹1,60,000 bina kisi girvi ke",
    where_to_go: "Nazdeeki Gramin Bank ya Pashu Chikitsa Kendra (Veterinary Hospital)",
    documents_needed: [
      "Aadhaar Card",
      "Bank Passbook",
      "Gaon mein rehne ka pramaan (Panchayat patra)",
      "Pashu ki jankari / photo"
    ],
    what_to_say: "Namaste Sahab, main doodh bechne ke liye bhains/gai khareedna chahti hoon, mujhe Pashudhan KCC yojana ka form chahiye.",
    explanation: "Sarkar aapko kam kharche par pashu lene aur unke daana-pani ke liye madad karti hai."
  },
  {
    id: "pm_vishwakarma",
    name: "PM Vishwakarma Yojana",
    category: "artisan",
    tagline: "Hath se saman banane wali behno (darzi, tokri bunai, mitti ke bartan)",
    amount: "₹15,000 tool khareedne ke liye + ₹1,00,000 tak ka aasan loan",
    where_to_go: "Gaon ka Common Service Center (CSC / Digital Seva)",
    documents_needed: [
      "Aadhaar Card",
      "Bank Passbook",
      "Karigar hone ka dastawez ya Panchayat se pramanit patra",
      "Ration Card"
    ],
    what_to_say: "Bhaiya, main silai-darzi ka kaam karti hoon, mujhe PM Vishwakarma yojana mein panjikaran (registration) karwana hai.",
    explanation: "Sarkar aapko naye azaar (tools) lene ke liye ₹15,000 ki seedhi sahayata aur certificate deti hai."
  }
];

/**
 * Deterministic offline simulator for hackathon demos.
 * If no GEMINI_API_KEY is configured, this provides a warm, authentic conversation.
 */
export function simulateYojanaDidiResponse(
  userText: string,
  turnCount: number
): YojanaDidiResponse {
  const text = (userText || "").toLowerCase();

  // If user says "shuru" or reset or turn 1
  if (turnCount <= 1 && (!text || text.includes("namaste") || text.includes("hello") || text.includes("hi"))) {
    return {
      spoken_response:
        "Namaste Behen! Main aapki Yojana Didi hoon. Aapko sarkari sahayata paane mein bilkul pareshan nahi hona padega. Mujhe bas itna bataiye, kya aap apna koi naya kaam shuru karna chahti hain jaise silai ya dairy, ya fir aapko kheti ke kaam mein sahayata chahiye?",
      ui_mode: "interview",
      action_card_details: {
        scheme_name: null,
        documents_needed: [],
        where_to_go: "",
        what_to_say: ""
      }
    };
  }

  // Turn 1 -> Turn 2: User answered what work they want to do
  if (turnCount === 1 || turnCount === 2) {
    if (text.includes("silai") || text.includes("tailor") || text.includes("kapde") || text.includes("machine")) {
      return {
        spoken_response:
          "Silai ka kaam bahut hi badhiya hai behen! Aap ghar baithe izzat ki aamdani bana sakti hain. Mujhe yeh batayein, kya aap yeh kaam akele apne ghar se shuru karna chahti hain ya kisi mahila bachat samooh ke sath judi hain?",
        ui_mode: "interview",
        action_card_details: {
          scheme_name: null,
          documents_needed: [],
          where_to_go: "",
          what_to_say: ""
        }
      };
    }

    if (text.includes("dairy") || text.includes("gai") || text.includes("bhains") || text.includes("doodh") || text.includes("bakri") || text.includes("pashu")) {
      return {
        spoken_response:
          "Pashupalan aur doodh ka kaam toh gaon mein sabse bharosemand aamdani deta hai! Bataiye, kya aapke paas pehle se koi bank khata hai, aur aapko nayi gai ya bhains lene ke liye kitne sahare ki zaroorat hogi?",
        ui_mode: "interview",
        action_card_details: {
          scheme_name: null,
          documents_needed: [],
          where_to_go: "",
          what_to_say: ""
        }
      };
    }

    if (text.includes("dukan") || text.includes("thela") || text.includes("fal") || text.includes("sabzi") || text.includes("kirana") || text.includes("vendor")) {
      return {
        spoken_response:
          "Apni dukan ya thela lagana bahut himmat aur mehnat ka kaam hai! Kya aapke paas apna Aadhaar card aur bank passbook uplabdh hai?",
        ui_mode: "interview",
        action_card_details: {
          scheme_name: null,
          documents_needed: [],
          where_to_go: "",
          what_to_say: ""
        }
      };
    }

    // Default turn 2 question
    return {
      spoken_response:
        "Yeh toh bahut nek soch hai! Apne pairon par khade hona sabse badi taaqat hai. Kya aapke paas bank mein khata khula hua hai, aur kya aap kisi bachat gat ya samooh se judi hain?",
      ui_mode: "interview",
      action_card_details: {
        scheme_name: null,
        documents_needed: [],
        where_to_go: "",
        what_to_say: ""
      }
    };
  }

  // Turn 3: Ask final budget or confirmation question
  if (turnCount === 3) {
    if (text.includes("samooh") || text.includes("bachat") || text.includes("shg") || text.includes("group") || text.includes("gat")) {
      return {
        spoken_response:
          "Samooh se judna toh sona chandi jaisa hai! Aakhri baat bataiye, kya aapka bachat samooh niyamit rup se baithak karta hai aur aap ₹1 lakh tak aamdani badhane ka rasta dhoondh rahi hain?",
        ui_mode: "interview",
        action_card_details: {
          scheme_name: null,
          documents_needed: [],
          where_to_go: "",
          what_to_say: ""
        }
      };
    }

    return {
      spoken_response:
        "Samajh gayi behen. Bas ek aakhri baat bataiye, kaam shuru karne ke liye aapko kitne rupaye ki zaroorat padegi? ₹50,000 ke andar ya usse thoda zyada?",
      ui_mode: "interview",
      action_card_details: {
        scheme_name: null,
        documents_needed: [],
        where_to_go: "",
        what_to_say: ""
      }
    };
  }

  // Turn 4 or higher: Progress to Action Card!
  let matchedScheme = SCHEMES_DATABASE[0]; // Mudra by default

  if (text.includes("samooh") || text.includes("shg") || text.includes("bachat") || text.includes("gat") || text.includes("group")) {
    matchedScheme = SCHEMES_DATABASE[1]; // Lakhpati Didi
  } else if (text.includes("thela") || text.includes("dukan") || text.includes("vendor") || text.includes("sabzi")) {
    matchedScheme = SCHEMES_DATABASE[2]; // SVANidhi
  } else if (text.includes("dairy") || text.includes("gai") || text.includes("bhains") || text.includes("doodh") || text.includes("pashu")) {
    matchedScheme = SCHEMES_DATABASE[3]; // Pashudhan KCC
  } else if (text.includes("darzi") || text.includes("karigar") || text.includes("vishwakarma") || text.includes("hath")) {
    matchedScheme = SCHEMES_DATABASE[4]; // Vishwakarma
  }

  return {
    spoken_response: `Mubarak ho behen! Maine aapke liye sabse aasan aur faydemand yojana dhoondh li hai - "${matchedScheme.name}". Isme aapko bina zameen ya ghar girvi rakhe sarkari sahayata milegi. Maine aapki ek Parchi (Action Card) tayyar kar di hai. Is par likha hai ki aapko kahan jana hai aur wahan afsar se kya kehna hai.`,
    ui_mode: "action_card",
    action_card_details: {
      scheme_name: matchedScheme.name,
      documents_needed: matchedScheme.documents_needed,
      where_to_go: matchedScheme.where_to_go,
      what_to_say: matchedScheme.what_to_say
    }
  };
}
