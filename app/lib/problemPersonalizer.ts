export interface PersonalizedQuestionOption {
  id: string;
  label: { en: string; ta: string };
  icon: string;
  keywords: string[];
}

export interface PersonalizedQuestion {
  id: string;
  speech: { en: string; ta: string };
  title: { en: string; ta: string };
  options: PersonalizedQuestionOption[];
}

export interface PersonalizedConsultation {
  category: "tailoring" | "dairy" | "vendor" | "shg" | "artisan" | "general";
  problemSummary: string;
  acknowledgment: { en: string; ta: string };
  questions: PersonalizedQuestion[]; // Strictly 3 questions with big icons!
}

/**
 * Analyzes the user's real spoken/typed problem and generates 3 personalized questions
 * with large pictorial icons, plus an empathetic acknowledgment (<= 12 words).
 * Runs with 0ms latency for instantaneous response.
 */
export function analyzeUserProblem(
  userProblem: string,
  lang: "ta" | "en" = "en"
): PersonalizedConsultation {
  const text = (userProblem || "").toLowerCase().trim();

  // 1. Dairy / Cows / Buffaloes / Livestock
  if (
    /\b(cow|cows|buffalo|buffaloes|milk|dairy|cattle|goat|goats|sheep|pashu|farm|livestock|shed|மாடு|பால்|பண்ணை|கால்நடை|ஆடு)\b/i.test(
      text
    )
  ) {
    return {
      category: "dairy",
      problemSummary: "Dairy & Livestock Support",
      acknowledgment: {
        en: "I understand sister. Let us find your cattle and dairy support.",
        ta: "கால்நடை மற்றும் பால் பண்ணை திட்ட உதவி இதோ."
      },
      questions: [
        {
          id: "q1_dairy_type",
          title: { en: "What animals do you need support for?", ta: "எந்த கால்நடைகளுக்கு உதவி தேவை?" },
          speech: {
            en: "What animals do you need support for?",
            ta: "எந்த கால்நடைகளுக்கு அரசு உதவி தேவை?"
          },
          options: [
            {
              id: "cows",
              label: { en: "Cows or Buffaloes", ta: "பசு அல்லது எருமை" },
              icon: "cow",
              keywords: ["cow", "buffalo", "milk", "பசு", "எருமை", "பால்"]
            },
            {
              id: "goats",
              label: { en: "Goats or Poultry", ta: "ஆடு அல்லது கோழி" },
              icon: "paw",
              keywords: ["goat", "sheep", "poultry", "chicken", "ஆடு", "கோழி"]
            }
          ]
        },
        {
          id: "q2_dairy_amount",
          title: { en: "Do you need money to buy cattle or animal feed?", ta: "கால்நடை வாங்கவா அல்லது தீவனம் வாங்கவா?" },
          speech: {
            en: "Do you need money to buy cattle or animal feed?",
            ta: "கால்நடை வாங்கவா அல்லது தீவனம் வாங்க உதவி தேவையா?"
          },
          options: [
            {
              id: "buy_cattle",
              label: { en: "Buy Cattle (Above ₹50,000)", ta: "கால்நடை வாங்க (₹50,000+)" },
              icon: "banknote",
              keywords: ["buy", "purchase", "above", "50000", "வாங்க", "அதிகம்"]
            },
            {
              id: "feed_kcc",
              label: { en: "Animal Feed & Care (Under ₹50,000)", ta: "தீவனம் & பராமரிப்பு (₹50,000-க்குள்)" },
              icon: "coins",
              keywords: ["feed", "care", "small", "under", "தீவனம்", "குறைவு"]
            }
          ]
        },
        {
          id: "q3_dairy_group",
          title: { en: "Are you in a self-help group or applying through bank?", ta: "சுய உதவிக் குழுவா அல்லது நேரடி வங்கியா?" },
          speech: {
            en: "Are you in a self help group or direct bank?",
            ta: "சுய உதவிக் குழுவா அல்லது நேரடி வங்கியா?"
          },
          options: [
            {
              id: "group",
              label: { en: "Women's Self-Help Group", ta: "மகளிர் சுய உதவிக் குழு" },
              icon: "users",
              keywords: ["group", "shg", "samooh", "குழு", "மகளிர்"]
            },
            {
              id: "direct_bank",
              label: { en: "Direct Bank (On My Own)", ta: "நேரடி வங்கி (தனியாக)" },
              icon: "bank",
              keywords: ["bank", "own", "alone", "நேரடி", "தனியாக"]
            }
          ]
        }
      ]
    };
  }

  // 2. Street Vendor / Small Stall / Cart / Daily Trading
  if (
    /\b(vendor|street|cart|thela|stall|shop|vegetable|fruit|flowers|tea|snacks|10000|வண்டி|கடை|வியாபாரம்|தள்ளுவண்டி|காய்கறி|பூ)\b/i.test(
      text
    )
  ) {
    return {
      category: "vendor",
      problemSummary: "Street Vendor & Small Stall Capital",
      acknowledgment: {
        en: "I hear you sister. Let us get your vendor working capital.",
        ta: "சிறு வியாபாரிகளுக்கு அரசு தரும் உடனடி மூலதன உதவி இதோ."
      },
      questions: [
        {
          id: "q1_vendor_capital",
          title: { en: "How much starting money do you need?", ta: "எவ்வளவு தொடக்க முதலீடு தேவை?" },
          speech: {
            en: "How much starting money do you need?",
            ta: "எவ்வளவு தொடக்க முதலீடு தேவை?"
          },
          options: [
            {
              id: "instant_10k",
              label: { en: "₹10,000 Instant (PM SVANidhi)", ta: "₹10,000 உடனடி உதவி (ஸ்வநிதி)" },
              icon: "coins",
              keywords: ["10000", "ten", "instant", "small", "பத்தாயிரம்", "உடனடி"]
            },
            {
              id: "higher_capital",
              label: { en: "₹20,000 to ₹50,000 Capital", ta: "₹20,000 முதல் ₹50,000 வரை" },
              icon: "banknote",
              keywords: ["20000", "50000", "higher", "more", "அதிகம்", "இருபதாயிரம்"]
            }
          ]
        },
        {
          id: "q2_vendor_setup",
          title: { en: "Do you sell with a mobile cart or stationary stall?", ta: "தள்ளுவண்டியா அல்லது நிரந்தர கடையா?" },
          speech: {
            en: "Do you sell with a cart or stationary stall?",
            ta: "தள்ளுவண்டியா அல்லது நிரந்தர கடையா?"
          },
          options: [
            {
              id: "cart",
              label: { en: "Push Cart or Mobile Selling", ta: "தள்ளுவண்டி / நடமாடும் வியாபாரம்" },
              icon: "cart",
              keywords: ["cart", "mobile", "push", "தள்ளுவண்டி", "நடமாடும்"]
            },
            {
              id: "stall",
              label: { en: "Roadside Stall or Small Shop", ta: "சாலையோர கடை / பெட்டிக்கடை" },
              icon: "store",
              keywords: ["stall", "shop", "table", "road", "கடை", "பெட்டி"]
            }
          ]
        },
        {
          id: "q3_vendor_phone",
          title: { en: "Do you have a mobile phone linked to your bank?", ta: "வங்கிக் கணக்குடன் இணைந்த போன் உள்ளதா?" },
          speech: {
            en: "Do you have a mobile phone linked to bank?",
            ta: "வங்கிக் கணக்குடன் இணைந்த போன் உள்ளதா?"
          },
          options: [
            {
              id: "phone_yes",
              label: { en: "Yes, Phone Linked", ta: "ஆம், போன் எண் இணைக்கப்பட்டுள்ளது" },
              icon: "phone",
              keywords: ["yes", "phone", "mobile", "ஆம்", "போன்"]
            },
            {
              id: "phone_no",
              label: { en: "No, Paper Passbook Only", ta: "இல்லை, பாஸ்புக் மட்டுமே உள்ளது" },
              icon: "file",
              keywords: ["no", "passbook", "paper", "இல்லை", "பாஸ்புக்"]
            }
          ]
        }
      ]
    };
  }

  // 3. Self-Help Group (SHG) / Women's Collective / Lakhpati Didi
  if (
    /\b(shg|samooh|group|sangam|sangham|lakhpati|collective|குழு|மகளிர்|சுய உதவி|சங்கமம்)\b/i.test(
      text
    )
  ) {
    return {
      category: "shg",
      problemSummary: "Self-Help Group (SHG) Enterprise",
      acknowledgment: {
        en: "I hear you sister. Let us get your women group support.",
        ta: "மகளிர் சுய உதவிக் குழுவினருக்கான தொழில் வாய்ப்பு இதோ."
      },
      questions: [
        {
          id: "q1_shg_tenure",
          title: { en: "Has your women's group been active for six months?", ta: "உங்கள் மகளிர் குழு ஆறு மாதமாக உள்ளதா?" },
          speech: {
            en: "Has your women group been active six months?",
            ta: "உங்கள் மகளிர் குழு ஆறு மாதமாக உள்ளதா?"
          },
          options: [
            {
              id: "active_6m",
              label: { en: "Yes, Active Over 6 Months", ta: "ஆம், 6 மாதங்களுக்கு மேல்" },
              icon: "users",
              keywords: ["yes", "6", "six", "months", "active", "ஆம்", "ஆறு மாதம்"]
            },
            {
              id: "new_group",
              label: { en: "New Group or Forming Now", ta: "புதிய குழு / இப்போது தொடங்குகிறோம்" },
              icon: "sparkles",
              keywords: ["new", "fresh", "forming", "புதிய", "இப்போது"]
            }
          ]
        },
        {
          id: "q2_shg_type",
          title: { en: "Do you want enterprise training or direct loan?", ta: "தொழில் பயிற்சியா அல்லது நேரடி கடனா?" },
          speech: {
            en: "Do you want enterprise training or direct loan?",
            ta: "தொழில் பயிற்சியா அல்லது நேரடி கடனா?"
          },
          options: [
            {
              id: "training_lakhpati",
              label: { en: "Business Training & Guidance (Lakhpati Didi)", ta: "தொழில் பயிற்சி (லக்பதி தீதி)" },
              icon: "graduation",
              keywords: ["training", "guidance", "lakhpati", "பயிற்சி", "வழிகாட்டல்"]
            },
            {
              id: "direct_loan",
              label: { en: "Direct Group Loan for Capital", ta: "குழுவிற்கான நேரடி கடன்" },
              icon: "coins",
              keywords: ["loan", "credit", "money", "கடன்", "பணம்"]
            }
          ]
        },
        {
          id: "q3_shg_target",
          title: { en: "What is your yearly income goal for each member?", ta: "ஒவ்வொரு உறுப்பினரின் ஆண்டு வருமான இலக்கு?" },
          speech: {
            en: "What is your yearly income goal per member?",
            ta: "உறுப்பினரின் ஆண்டு வருமான இலக்கு என்ன?"
          },
          options: [
            {
              id: "one_lakh",
              label: { en: "₹1 Lakh Annual Income (Lakhpati)", ta: "ஆண்டுக்கு ₹1 லட்சம் வருமானம்" },
              icon: "award",
              keywords: ["1", "lakh", "annual", "year", "ஒரு லட்சம்", "ஆண்டு"]
            },
            {
              id: "monthly_income",
              label: { en: "Regular Monthly Supplementary Income", ta: "மாதாந்திர கூடுதல் வருமானம்" },
              icon: "banknote",
              keywords: ["monthly", "regular", "மாதாந்திர", "கூடுதல்"]
            }
          ]
        }
      ]
    };
  }

  // 4. Tailoring & Stitching Work (Default for sewing, garments, machine, silai)
  if (
    /\b(tailor|tailoring|sew|sewing|stitch|stitching|silai|machine|dress|clothes|garments|cloth|தையல்|தையற்கலை|தைக்க|ஆடை)\b/i.test(
      text
    ) ||
    text.length === 0
  ) {
    return {
      category: "tailoring",
      problemSummary: "Tailoring & Sewing Machine Support",
      acknowledgment: {
        en: "I hear you sister. Let us find the right tailoring scheme.",
        ta: "தையல் தொழில் தொடங்க சிறந்த அரசு உதவியைக் கண்டுபிடிப்போம்."
      },
      questions: [
        {
          id: "q1_tailor_amount",
          title: { en: "How much money do you need to start tailoring?", ta: "தையல் தொழில் தொடங்க எவ்வளவு தொகை தேவை?" },
          speech: {
            en: "Do you need under fifty thousand rupees or more?",
            ta: "ஐம்பதாயிரம் ரூபாய்க்குள் போதுமா அல்லது அதிகமா?"
          },
          options: [
            {
              id: "under_50k",
              label: { en: "Under ₹50,000 (MUDRA Shishu)", ta: "₹50,000-க்குள் (முத்ரா சிசு கடன்)" },
              icon: "coins",
              keywords: ["under", "50000", "less", "small", "குறைவு", "ஐம்பதாயிரம்"]
            },
            {
              id: "above_50k",
              label: { en: "Above ₹50,000 for Expansion", ta: "₹50,000-க்கு மேல் (பெரிய அளவில்)" },
              icon: "banknote",
              keywords: ["above", "more", "higher", "lakh", "அதிகம்", "லட்சம்"]
            }
          ]
        },
        {
          id: "q2_tailor_location",
          title: { en: "Will you stitch from home or open a tailoring shop?", ta: "வீட்டிலிருந்து தைப்பீர்களா அல்லது கடையா?" },
          speech: {
            en: "Will you stitch from home or in a shop?",
            ta: "வீட்டிலிருந்து தைப்பீர்களா அல்லது கடையா?"
          },
          options: [
            {
              id: "home",
              label: { en: "Work From Home", ta: "வீட்டிலிருந்தே தைக்கிறேன்" },
              icon: "home",
              keywords: ["home", "house", "வீடு", "வீட்டிலிருந்து"]
            },
            {
              id: "shop",
              label: { en: "Tailoring Shop in Market", ta: "சந்தையில் தையல் கடை" },
              icon: "store",
              keywords: ["shop", "market", "store", "கடை", "சந்தை"]
            }
          ]
        },
        {
          id: "q3_tailor_group",
          title: { en: "Are you a member of any women's self-help group?", ta: "மகளிர் சுய உதவிக் குழுவில் உள்ளீர்களா?" },
          speech: {
            en: "Are you in a women self help group?",
            ta: "நீங்கள் மகளிர் சுய உதவிக் குழுவில் உள்ளீர்களா?"
          },
          options: [
            {
              id: "group_yes",
              label: { en: "Yes, in Women's Group (SHG)", ta: "ஆம், மகளிர் குழுவில் உள்ளேன்" },
              icon: "users",
              keywords: ["yes", "group", "shg", "ஆம்", "குழு"]
            },
            {
              id: "group_no",
              label: { en: "No, Starting on My Own", ta: "இல்லை, தனியாக தொடங்குகிறேன்" },
              icon: "user",
              keywords: ["no", "alone", "own", "இல்லை", "தனியாக"]
            }
          ]
        }
      ]
    };
  }

  // 5. General Family & Livelihood Struggle (Any other problem spoken)
  return {
    category: "general",
    problemSummary: "Livelihood & Financial Support",
    acknowledgment: {
      en: "I hear you sister. Let us find your best government scheme.",
      ta: "நான் உதவுகிறேன் சகோதரி. சிறந்த அரசு திட்டத்தைக் காண்போம்."
    },
    questions: [
      {
        id: "q1_general_skill",
        title: { en: "What work would you feel most confident doing?", ta: "நீங்கள் என்ன வேலை செய்ய விரும்புகிறீர்கள்?" },
        speech: {
          en: "What work would you feel most confident doing?",
          ta: "நீங்கள் என்ன வேலை செய்ய விரும்புகிறீர்கள்?"
        },
        options: [
          {
            id: "tailoring",
            label: { en: "Tailoring & Sewing", ta: "தையல் தொழில்" },
            icon: "scissors",
            keywords: ["tailoring", "tailor", "sewing", "தையல்"]
          },
          {
            id: "dairy",
            label: { en: "Dairy & Livestock", ta: "பால் பண்ணை & கால்நடை" },
            icon: "cow",
            keywords: ["dairy", "cow", "milk", "பால்", "மாடு"]
          },
          {
            id: "vendor",
            label: { en: "Small Shop or Cart", ta: "சிறு கடை / தள்ளுவண்டி" },
            icon: "cart",
            keywords: ["shop", "vendor", "cart", "கடை", "தள்ளுவண்டி"]
          }
        ]
      },
      {
        id: "q2_general_group",
        title: { en: "Are you in a women's self-help group?", ta: "மகளிர் சுய உதவிக் குழுவில் உள்ளீர்களா?" },
        speech: {
          en: "Are you in a women self help group?",
          ta: "மகளிர் சுய உதவிக் குழுவில் உள்ளீர்களா?"
        },
        options: [
          {
            id: "group_yes",
            label: { en: "Yes, in Women's SHG", ta: "ஆம், மகளிர் குழுவில் உள்ளேன்" },
            icon: "users",
            keywords: ["yes", "group", "shg", "ஆம்", "குழு"]
          },
          {
            id: "group_no",
            label: { en: "No, Starting on My Own", ta: "இல்லை, தனியாக உள்ளேன்" },
            icon: "user",
            keywords: ["no", "alone", "own", "இல்லை", "தனியாக"]
          }
        ]
      },
      {
        id: "q3_general_amount",
        title: { en: "Do you need under fifty thousand rupees to start?", ta: "ஐம்பதாயிரம் ரூபாய்க்குள் உதவி போதுமா?" },
        speech: {
          en: "Do you need under fifty thousand rupees to start?",
          ta: "தொழில் தொடங்க ஐம்பதாயிரம் ரூபாய்க்குள் போதுமா?"
        },
        options: [
          {
            id: "under_50k",
            label: { en: "Yes, Under ₹50,000", ta: "ஆம், ₹50,000-க்குள்" },
            icon: "coins",
            keywords: ["yes", "under", "50000", "ஆம்", "குறைவு"]
          },
          {
            id: "above_50k",
            label: { en: "No, Above ₹50,000", ta: "இல்லை, அதற்கு மேல்" },
            icon: "banknote",
            keywords: ["no", "above", "more", "இல்லை", "அதிகம்"]
          }
        ]
      }
    ]
  };
}

/**
 * Maps the 3 personalized question answers to the best government scheme.
 */
import schemeData from "@/data/scheme.json";

export function determinePersonalizedScheme(
  category: "tailoring" | "dairy" | "vendor" | "shg" | "artisan" | "general",
  answers: { [key: string]: string }
) {
  // 1. Dairy
  if (category === "dairy") {
    return schemeData.schemes.find((s) => s.id === "pashudhan_kcc") || schemeData.schemes[0];
  }

  // 2. Vendor
  if (category === "vendor") {
    return schemeData.schemes.find((s) => s.id === "pm_svanidhi") || schemeData.schemes[0];
  }

  // 3. SHG
  if (category === "shg") {
    return schemeData.schemes.find((s) => s.id === "lakhpati_didi") || schemeData.schemes[0];
  }

  // 4. Tailoring
  if (category === "tailoring") {
    if (answers["q3_tailor_group"] === "group_yes") {
      return schemeData.schemes.find((s) => s.id === "lakhpati_didi") || schemeData.schemes[0];
    }
    return schemeData.schemes.find((s) => s.id === "mudra_shishu") || schemeData.schemes[0];
  }

  // 5. General
  const generalSkill = answers["q1_general_skill"];
  const isShg = answers["q2_general_group"] === "group_yes";
  if (isShg) {
    return schemeData.schemes.find((s) => s.id === "lakhpati_didi") || schemeData.schemes[0];
  }
  if (generalSkill === "dairy") {
    return schemeData.schemes.find((s) => s.id === "pashudhan_kcc") || schemeData.schemes[0];
  }
  if (generalSkill === "vendor") {
    return schemeData.schemes.find((s) => s.id === "pm_svanidhi") || schemeData.schemes[0];
  }
  return schemeData.schemes.find((s) => s.id === "mudra_shishu") || schemeData.schemes[0];
}
