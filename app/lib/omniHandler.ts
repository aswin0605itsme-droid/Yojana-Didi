export interface OmniQueryResult {
  type: "hospital" | "train" | "bus" | "website" | "location" | "scheme_work" | "general";
  title: string;
  spokenText: string;
  mapQuery?: string;
  websiteUrl?: string;
  websiteLabel?: string;
  phoneHotline?: string;
  phoneLabel?: string;
  documents?: string[];
  timingInfo?: string;
  optionId?: string | null;
  confirmedText?: string;
}

const VERIFIED_PORTALS = [
  {
    keywords: ["mudra", "shishu", "kishor", "tarun", "முத்ரா", "கடன்", "loan", "लोन"],
    name: "PM MUDRA Official Portal (mudra.org.in)",
    url: "https://www.mudra.org.in/",
    title: { ta: "பிரதமர் முத்ரா அதிகாரப்பூர்வ தளம்", hi: "पीएम मुद्रा आधिकारिक पोर्टल", en: "PM MUDRA Official Portal" }
  },
  {
    keywords: ["sewing", "தையல்", "தையல் இயந்திரம்", "machine", "सिलाई"],
    name: "Free Sewing Machine Scheme (pmvishwakarma.gov.in)",
    url: "https://pmvishwakarma.gov.in/",
    title: { ta: "இலவச தையல் இயந்திர திட்டம்", hi: "मुफ्त सिलाई मशीन योजना", en: "Free Sewing Machine Scheme" }
  },
  {
    keywords: ["svanidhi", "vendor", "thela", "street", "வியாபாரி", "ஸ்வநிதி", "கடை", "दुकान"],
    name: "PM SVANidhi Portal (pmsvanidhi.mohua.gov.in)",
    url: "https://pmsvanidhi.mohua.gov.in/",
    title: { ta: "பிஎம் ஸ்வநிதி இணையதளம்", hi: "पीएम स्वनिधि पोर्टल", en: "PM SVANidhi Official Website" }
  },
  {
    keywords: ["lakhpati", "shg", "group", "nrlm", "குழு", "மகளிர்", "சுய உதவி", "समूह"],
    name: "Lakhpati Didi / NRLM Portal (nrlm.gov.in)",
    url: "https://nrlm.gov.in/",
    title: { ta: "என்.ஆர்.எல்.எம் மகளிர் சுய உதவி தளம்", hi: "एनआरएलएम स्वयं सहायता समूह", en: "NRLM Self Help Group Portal" }
  },
  {
    keywords: ["aadhaar", "uidai", "ஆதார்", "आधार"],
    name: "UIDAI Official Aadhaar Portal (uidai.gov.in)",
    url: "https://uidai.gov.in/",
    title: { ta: "ஆதார் அதிகாரப்பூர்வ இணையதளம்", hi: "यूआईडीएआई आधार पोर्टल", en: "UIDAI Aadhaar Official Portal" }
  },
  {
    keywords: ["ration", "smart card", "tnpds", "ரேஷன்", "ரேஷன் கார்டு", "राशन"],
    name: "National Food Security Portal (nfsa.gov.in)",
    url: "https://www.tnpds.gov.in/",
    title: { ta: "ரேஷன் அட்டை அதிகாரப்பூர்வ தளம்", hi: "राशन कार्ड आधिकारिक पोर्टल", en: "Ration Card Official Portal" }
  },
  {
    keywords: ["kisan", "farmer", "agriculture", "விவசாயி", "கிசான்", "किसान"],
    name: "PM Kisan Samman Nidhi (pmkisan.gov.in)",
    url: "https://pmkisan.gov.in/",
    title: { ta: "பிஎம் கிசான் அதிகாரப்பூர்வ தளம்", hi: "पीएम किसान आधिकारिक पोर्टल", en: "PM Kisan Official Portal" }
  }
];

export function parseOmniIntent(input: string, lang: string = "ta"): OmniQueryResult {
  const text = (input || "").toLowerCase().trim();

  // 1. HOSPITAL & HEALTHCARE INTENT
  const isHospitalQuery =
    /\b(hospital|doctor|phc|clinic|ambulance|emergency|sick|treatment|medicine|ayushman|மருத்துவமனை|ஆஸ்பத்திரி|மருத்துவர்|டாக்டர்|அவசரம்|ஆம்புலன்ஸ்|சிகிச்சை|மாத்திரை|மருந்து|அரசு மருத்துவமனை|108|102|अस्पताल|डॉक्टर|दवा|इलाज|आयुष्मान)\b/i.test(
      text
    );

  if (isHospitalQuery) {
    const isTa = lang === "ta";
    const isHi = lang === "hi";

    return {
      type: "hospital",
      title: isTa ? "அரசு மருத்துவமனை & அவசர உதவி" : isHi ? "सरकारी अस्पताल और आपातकालीन सेवा" : "Government Hospital & Emergency",
      spokenText: isTa
        ? "அருகிலுள்ள அரசு மருத்துவமனை மற்றும் ஆரம்ப சுகாதார நிலைய விவரங்கள் இதோ. அவசரத்திற்கு 108 அழைக்கலாம்."
        : isHi
        ? "नज़दीकी सरकारी अस्पताल का विवरण यहाँ है। आपात स्थिति के लिए 108 पर कॉल करें।"
        : "Here are nearby government hospitals and primary health centres. For emergency call 108.",
      mapQuery: "Government General Hospital Primary Health Centre",
      websiteUrl: "https://pmjay.gov.in/",
      websiteLabel: isTa ? "ஆயுஷ்மான் பாரத் மருத்துவ தளம்" : "Ayushman Bharat National Health Portal",
      phoneHotline: "108",
      phoneLabel: isTa ? "108 ஆம்புலன்ஸ் அவசர எண்" : "108 Emergency Ambulance"
    };
  }

  // 2. TRAIN BOOKING & RAILWAY STATION INTENT
  const isTrainQuery =
    /\b(train|railway|irctc|rail|station|coach|berth|train timing|pnr|ரயில்|ரயில்வே|ரயில் நிலையம்|ஸ்டேஷன்|டிக்கெட் பதிவு|ட்ரெயின்|டிரெயின்|ரயில் நேரம்|139|ट्रेन|रेलवे|रेल|टिकट)\b/i.test(
      text
    );

  if (isTrainQuery) {
    const isTa = lang === "ta";
    const isHi = lang === "hi";

    return {
      type: "train",
      title: isTa ? "ரயில் புக்கிங் & ரயில்வே ஸ்டேஷன்" : isHi ? "ट्रेन बुकिंग और रेलवे स्टेशन" : "Train Booking & Railway Station",
      spokenText: isTa
        ? "அதிகாரப்பூர்வ ஐ.ஆர்.சி.டி.சி ரயில் புக்கிங் மற்றும் அருகிலுள்ள ரயில்வே ஸ்டேஷன் வரைபடம் இதோ. உதவிக்கு 139 அழைக்கலாம்."
        : isHi
        ? "आईआरसीटीसी ट्रेन बुकिंग और नजदीकी रेलवे स्टेशन का नक्शा यहाँ है। पूछताछ के लिए 139 पर कॉल करें।"
        : "Here is the official IRCTC train booking portal and nearby railway station map. Helpline: 139.",
      mapQuery: "Railway Station near me",
      websiteUrl: "https://www.irctc.co.in/",
      websiteLabel: "IRCTC Official Train Booking Portal",
      phoneHotline: "139",
      phoneLabel: isTa ? "139 ரயில்வே விசாரணை" : "139 Railway Enquiry Helpline"
    };
  }

  // 3. BUS STOPS & BUS TIMINGS INTENT
  const isBusQuery =
    /\b(bus|bus stand|bus stop|bus timing|local bus|tnstc|ksrtc|upsrtc|apsrtc|bus route|பேருந்து|பஸ்|பேருந்து நிலையம்|பஸ் ஸ்டாண்ட்|பேருந்து நேரம்|பஸ் டைமிங்|बस|बस स्टैंड|बस का समय)\b/i.test(
      text
    );

  if (isBusQuery) {
    const isTa = lang === "ta";
    const isHi = lang === "hi";

    return {
      type: "bus",
      title: isTa ? "பேருந்து நிலையம் & பேருந்து நேரம்" : isHi ? "बस स्टैंड और बस समय" : "Bus Stand & Bus Timings",
      spokenText: isTa
        ? "அருகிலுள்ள அரசு பேருந்து நிலையம் மற்றும் நேரடி வரைபடம் இதோ. அரசு விரைவுப் பேருந்துகளுக்கு இணையதளத்தைப் பார்க்கலாம்."
        : isHi
        ? "नज़दीकी बस स्टैंड और सीधा नक्शा यहाँ है। सरकारी बसों के समय के लिए पोर्टल लिंक देखें।"
        : "Here is the nearby government bus stand map and bus timing portal link.",
      mapQuery: "Central Bus Stand Bus Stop",
      websiteUrl: "https://www.tnstc.in/",
      websiteLabel: isTa ? "அரசு விரைவு போக்குவரத்து கழக தளம்" : "State Transport Bus Reservation Portal",
      timingInfo: isTa ? "காலை 5:00 முதல் இரவு 10:30 வரை ஒவ்வொரு 15 நிமிடங்களுக்கும் பேருந்துகள் உண்டு." : "Buses operate from 5:00 AM to 10:30 PM every 15 minutes."
    };
  }

  // 4. GOVERNMENT WEBSITE & PORTAL LINKS INTENT
  const isWebsiteQuery =
    /\b(website|portal|site|link|url|online|apply|இணையதளம்|இணைப்பு|வலைத்தளம்|தள|வெப்சைட்|पोर्टल|वेबसाइट)\b/i.test(
      text
    );

  if (isWebsiteQuery) {
    const matched = VERIFIED_PORTALS.find((p) =>
      p.keywords.some((kw) => text.includes(kw.toLowerCase()))
    );

    const portal = matched || {
      name: "myScheme Central Government Portal (myscheme.gov.in)",
      url: "https://www.myscheme.gov.in/",
      title: { ta: "அரசு திட்டங்கள் அதிகாரப்பூர்வ தளம்", hi: "सरकारी योजना आधिकारिक पोर्टल", en: "Government Schemes Portal" }
    };

    const isTa = lang === "ta";
    return {
      type: "website",
      title: (portal.title as any)[lang] || portal.title.en,
      spokenText: isTa
        ? "அதிகாரப்பூர்வ அரசு இணையதள நேரடி இணைப்பு இதோ. பொத்தானைத் தொட்டு நேரடியாகச் செல்லலாம்."
        : "Here is the official verified government portal link. Tap below to visit.",
      websiteUrl: portal.url,
      websiteLabel: portal.name
    };
  }

  // 5. LOCATION & GOOGLE MAPS INTENT
  const isLocationQuery =
    /\b(near|in|at|where|map|location|bank|branch|sbi|indian bank|csc|center|centre|collector|taluk|office|அருகில்|வங்கி|மையம்|இ-சேவை|அலுவலகம்|எங்கே|வரைபடம்|இடம்|பகுதி|நிலையம்|कहाँ|बैंक|नक्शा)\b/i.test(
      text
    );

  if (isLocationQuery) {
    let mapTarget = text;
    if (/bank|வங்கி|बैंक/i.test(text)) {
      mapTarget = "State Bank of India Indian Bank near me";
    } else if (/csc|இ-சேவை|center|केंद्र/i.test(text)) {
      mapTarget = "Common Service Center CSC e-Seva";
    } else if (/taluk|collector|office|அலுவலகம்|तहसील/i.test(text)) {
      mapTarget = "Taluk Office Government CSC";
    }

    const isTa = lang === "ta";
    return {
      type: "location",
      title: isTa ? "நேரடி வரைபடம் & வழிகாட்டுதல்" : "Live Map & Directions",
      spokenText: isTa
        ? "அருகிலுள்ள இடங்களின் நேரடி வரைபடம் இதோ. கூகிள் மேப்பில் வழியைப் பார்க்கலாம்."
        : "Here is the live map with turn-by-turn directions.",
      mapQuery: mapTarget
    };
  }

  // 6. DEFAULT GENERAL SCHEME / DOUBT QUERY
  const isTa = lang === "ta";
  return {
    type: "general",
    title: isTa ? "வாணி வழிகாட்டி" : "VANI Guide",
    spokenText: isTa
      ? "வணக்கம் சகோதரி! உங்கள் கேள்விக்குரிய அதிகாரப்பூர்வ அரசு தகவல் இதோ."
      : "Hello sister! Here is the government assistance information for your query."
  };
}
