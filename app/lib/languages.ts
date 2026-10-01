export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  speechLang: string;
  flag: string;
  welcomeGreeting: string;
  welcomeSubtext: string;
  quickReplies: {
    q1: string[];
    q2: string[];
    q3: string[];
  };
  ui: {
    tagline: string;
    readPageOutLoud: string;
    readingPage: string;
    listening: string;
    speaking: string;
    thinking: string;
    tapToSpeak: string;
    stopListening: string;
    typePlaceholder: string;
    quickAnswerLabel: string;
    questionStep: string;
    actionCardReady: string;
    sarkariSupport: string;
    noCollateral: string;
    whereToGo: string;
    whereToGoTip: string;
    documentsNeeded: string;
    documentsTip: string;
    whatToSay: string;
    listenRehearsal: string;
    practicedBadge: string;
    printButton: string;
    whatsappButton: string;
    newConsultation: string;
  };
}

export const SUPPORTED_LANGUAGES: { [code: string]: LanguageConfig } = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    speechLang: "en-IN",
    flag: "🇮🇳",
    welcomeGreeting:
      "Hello sister! I am VANI (Voice Assistant for Nari Initiatives). Accessing government support is now simple and dignity-first. Tell me, would you like to start a small business like tailoring or dairy, or do you need help with farming?",
    welcomeSubtext: "Speak or type in any language — Tanglish, English, Tamil, Telugu, Hindi...",
    quickReplies: {
      q1: ["✂️ Tailoring & Sewing", "🐄 Dairy & Livestock", "🛒 Small Shop / Cart", "🌾 Farming & Crops"],
      q2: ["👥 Yes, part of Self-Help Group (SHG)", "🙋‍♀️ No, starting on my own", "💳 Yes, I have a bank account"],
      q3: ["💰 Under ₹50,000", "💵 Up to ₹1 Lakh", "🌟 As much support as possible"]
    },
    ui: {
      tagline: "Voice Assistant for Nari Initiatives • Zero Jargon Government Schemes",
      readPageOutLoud: "🔊 Read Page Out Loud",
      readingPage: "🔊 Reading page out loud...",
      listening: "VANI is listening... please speak sister",
      speaking: "VANI is explaining...",
      thinking: "VANI is finding the best scheme...",
      tapToSpeak: "🎤 Speak with VANI (Tap to Speak)",
      stopListening: "Stop Speaking (Listening...)",
      typePlaceholder: "Type here in any language (e.g., 'Tailoring business start pananum')...",
      quickAnswerLabel: "Choose in one tap (Quick Answer):",
      questionStep: "Question",
      actionCardReady: "Your Action Card is Ready!",
      sarkariSupport: "Government of India Support",
      noCollateral: "100% Without Risking Your House (No Collateral)",
      whereToGo: "Where to Go?",
      whereToGoTip: "Visiting Monday to Friday between 11 AM and 2 PM is recommended.",
      documentsNeeded: "What Documents to Bring?",
      documentsTip: "Pack in your bag and check the box",
      whatToSay: "What to Say to the Officer (Golden Script)",
      listenRehearsal: "Listen to VANI's Voice (Practice)",
      practicedBadge: "Great! Now you can speak with confidence.",
      printButton: "Print / Save PDF",
      whatsappButton: "Share on WhatsApp",
      newConsultation: "Find Another Scheme"
    }
  },
  ta: {
    code: "ta",
    name: "Tamil (தமிழ் / Tanglish)",
    nativeName: "தமிழ்",
    speechLang: "ta-IN",
    flag: "🇮🇳",
    welcomeGreeting:
      "வணக்கம் சகோதரி! நான் VANI (மகளிர் அரசு திட்ட வழிகாட்டி). அரசு உதவிகளை பெறுவது இப்போது மிகவும் எளிது. தையல் அல்லது பால் பண்ணை போன்ற புதிய தொழில் தொடங்க விரும்புகிறீர்களா, அல்லது விவசாயத்திற்கு உதவி தேவையா?",
    welcomeSubtext: "தமிழில் அல்லது Tanglish-ல் தாராளமாக பேசுங்கள் / எழுதுங்கள்",
    quickReplies: {
      q1: ["✂️ தையல் தொழில் (Tailoring)", "🐄 பால் பண்ணை (Dairy)", "🛒 சிறு கடை (Shop)", "🌾 விவசாயம் (Farming)"],
      q2: ["👥 ஆம், மகளிர் சுய உதவிக் குழுவில் உள்ளேன்", "🙋‍♀️ இல்லை, தனியாக தொடங்குகிறேன்", "💳 என்னிடம் வங்கிக் கணக்கு உள்ளது"],
      q3: ["💰 ₹50,000 வரை", "💵 ₹1 லட்சம் வரை", "🌟 இயன்ற அளவு அதிக உதவி"]
    },
    ui: {
      tagline: "மகளிருக்கான குரல் வழிகாட்டி (VANI) • எளிய அரசு திட்டங்கள்",
      readPageOutLoud: "🔊 பக்கத்தை வாசிக்கவும்",
      readingPage: "🔊 வாசிக்கப்படுகிறது...",
      listening: "வாணி கேட்கிறார்... பேசுங்கள் சகோதரி",
      speaking: "வாணி விளக்குகிறார்...",
      thinking: "சிறந்த திட்டத்தை வாணி தேர்வு செய்கிறார்...",
      tapToSpeak: "🎤 வாணியிடம் பேசவும் (Tap to Speak)",
      stopListening: "பேசுவதை நிறுத்தவும்",
      typePlaceholder: "இங்கே எழுதுங்கள் (e.g. 'Tailoring machine vanga loan venum')...",
      quickAnswerLabel: "ஒரே தொடுதலில் தேர்வு செய்யவும்:",
      questionStep: "கேள்வி",
      actionCardReady: "உங்கள் உதவி அட்டை தயாராக உள்ளது!",
      sarkariSupport: "பாரத அரசு உதவி திட்டம்",
      noCollateral: "எந்த அடமானமும் இன்றி (No Collateral)",
      whereToGo: "எங்கு செல்ல வேண்டும்? (Where to Go)",
      whereToGoTip: "திங்கள் முதல் வெள்ளி வரை, காலை 11 மணி முதல் 2 மணி வரை செல்வது நல்லது.",
      documentsNeeded: "கொண்டு செல்ல வேண்டிய ஆவணங்கள்",
      documentsTip: "பையில் வைத்து சரிபார்க்கவும்",
      whatToSay: "அதிகாரியிடம் என்ன பேச வேண்டும்? (Golden Script)",
      listenRehearsal: "வாணியின் குரலில் கேளுங்கள் (Rehearsal)",
      practicedBadge: "அற்புதம்! இப்போது நம்பிக்கையுடன் பேசலாம்.",
      printButton: "அச்சிடுக / PDF",
      whatsappButton: "WhatsApp-ல் பகிரவும்",
      newConsultation: "புதிய திட்டம் தேடவும்"
    }
  },
  te: {
    code: "te",
    name: "Telugu (తెలుగు)",
    nativeName: "తెలుగు",
    speechLang: "te-IN",
    flag: "🇮🇳",
    welcomeGreeting:
      "నమస్కారం సోదరీ! నేను VANI (Voice Assistant for Nari Initiatives). ప్రభుత్వ సాయం పొందడం ఇప్పుడు చాలా సులభం. మీరు టైలరింగ్ లేదా డెయిరీ వంటి కొత్త పనిని ప్రారంభించాలనుకుంటున్నారా, లేదా వ్యవసాయానికి సహాయం కావాలా?",
    welcomeSubtext: "తెలుగులో లేదా Telugish లో మాట్లాడండి / టైప్ చేయండి",
    quickReplies: {
      q1: ["✂️ టైలరింగ్ / కుట్టుపని", "🐄 పాడి పరిశ్రమ / డైరీ", "🛒 చిన్న దుకాణం / బండి", "🌾 వ్యవసాయం / కూరగాయలు"],
      q2: ["👥 అవును, స్వయం సహాయక సంఘం (SHG) లో ఉన్నాను", "🙋‍♀️ లేదు, ఒంటరిగా ప్రారంభిస్తాను", "💳 బ్యాంకు ఖాతా ఉంది"],
      q3: ["💰 ₹50,000 లోపు", "💵 ₹1 లక్ష వరకు", "🌟 సాధ్యమైనంత ఎక్కువ సాయం"]
    },
    ui: {
      tagline: "మహిళల కోసం స్వర సహాయకి (VANI) • సులభమైన ప్రభుత్వ పథకాలు",
      readPageOutLoud: "🔊 పేజీని చదివి వినిపించండి",
      readingPage: "🔊 పేజీ చదువుతోంది...",
      listening: "వాణి వింటున్నారు... మాట్లాడండి సోదరీ",
      speaking: "వాణి సమాధానం ఇస్తున్నారు...",
      thinking: "వాణి సరైన పథకాన్ని ఎంచుకుంటున్నారు...",
      tapToSpeak: "🎤 వాణితో మాట్లాడండి (Tap to Speak)",
      stopListening: "మాట్లాడటం ఆపండి",
      typePlaceholder: "ఇక్కడ రాయండి (e.g. 'Tailoring machine kosam loan kaavali')...",
      quickAnswerLabel: "ఒక్క ట్యాప్‌తో ఎంచుకోండి:",
      questionStep: "ప్రశ్న",
      actionCardReady: "మీ సహాయ కార్డ్ సిద్ధంగా ఉంది!",
      sarkariSupport: "భారత ప్రభుత్వ సహాయ పథకం",
      noCollateral: "ఏ హామీ లేదా తాకట్టు లేకుండా (No Collateral)",
      whereToGo: "ఎక్కడికి వెళ్ళాలి? (Where to Go)",
      whereToGoTip: "సోమవారం నుండి శుక్రవారం వరకు ఉదయం 11 నుండి మధ్యాహ్నం 2 గంటల మధ్య వెళ్ళడం మంచిది.",
      documentsNeeded: "తీసుకెళ్లవలసిన పత్రాలు",
      documentsTip: "బ్యాగ్‌లో పెట్టుకుని టిక్ చేయండి",
      whatToSay: "అధికారితో ఏమి మాట్లాడాలి? (Golden Script)",
      listenRehearsal: "వాణి గొంతులో వినండి (Rehearsal)",
      practicedBadge: "చాలా బాగుంది! ఇప్పుడు మీరు ధైర్యంగా మాట్లాడవచ్చు.",
      printButton: "కార్డ్ ప్రింట్ / PDF",
      whatsappButton: "WhatsApp లో షేర్ చేయండి",
      newConsultation: "మరో పథకం కనుగొనండి"
    }
  },
  hi: {
    code: "hi",
    name: "Hindi (हिंदी / Hinglish)",
    nativeName: "हिंदी",
    speechLang: "hi-IN",
    flag: "🇮🇳",
    welcomeGreeting:
      "Namaste Behen! Main VANI (Voice Assistant for Nari Initiatives) hoon. Sarkari sahayata paana ab bilkul aasan hai. Mujhe bataiye, kya aap silai ya dairy jaisa naya kaam shuru karna chahti hain, ya kheti mein sahayata chahiye?",
    welcomeSubtext: "हिंदी या Hinglish में बोलें या टाइप करें",
    quickReplies: {
      q1: ["✂️ Silai / Tailoring", "🐄 Dairy / Pashupalan", "🛒 Chhoti Dukan / Thela", "🌾 Kheti / Sabzi"],
      q2: ["👥 Haan, Bachat Samooh mein hoon", "🙋‍♀️ Nahi, akele kaam shuru karungi", "💳 Haan, bank khata hai"],
      q3: ["💰 ₹50,000 ke andar", "💵 ₹1 Lakh tak", "🌟 Jitni sahayata mil sake"]
    },
    ui: {
      tagline: "Voice Assistant for Nari Initiatives (VANI) • कोई कठिन कागज़ी भाषा नहीं",
      readPageOutLoud: "🔊 पूरा पेज पढ़कर सुनाओ",
      readingPage: "🔊 पेज पढ़ा जा रहा है...",
      listening: "VANI सुन रही हैं... बोलिए behen",
      speaking: "VANI बता रही हैं...",
      thinking: "VANI सबसे अच्छी योजना सोच रही हैं...",
      tapToSpeak: "🎤 VANI से बोलकर बात करें (Tap to Speak)",
      stopListening: "बोलना बंद करें (Listening...)",
      typePlaceholder: "यहाँ लिखें (e.g. 'Silai machine ke liye loan chahiye')...",
      quickAnswerLabel: "एक टच में चुनें (Quick Answer):",
      questionStep: "सवाल",
      actionCardReady: "आपकी सहायता पर्ची तैयार है!",
      sarkariSupport: "भारत सरकार सहायता",
      noCollateral: "बिना ज़मीन या घर गिरवी रखे (No Collateral)",
      whereToGo: "कहाँ जाना है? (Where to Go)",
      whereToGoTip: "सोमवार से शुक्रवार, सुबह 11 बजे से 2 बजे के बीच जाना सबसे अच्छा रहता है।",
      documentsNeeded: "क्या साथ ले जाना है? (Documents)",
      documentsTip: "बैग में रखें और टिक करें",
      whatToSay: "अफ़सर से क्या बोलना है? (Golden Script)",
      listenRehearsal: "VANI की आवाज़ में सुनो (Rehearsal)",
      practicedBadge: "बढ़िया! अब आप बिना डरे बोल सकती हैं।",
      printButton: "पर्ची प्रिंट / PDF",
      whatsappButton: "WhatsApp पर भेजें",
      newConsultation: "नई योजना ढूंढें"
    }
  },
  bn: {
    code: "bn",
    name: "Bengali (বাংলা)",
    nativeName: "বাংলা",
    speechLang: "bn-IN",
    flag: "🇮🇳",
    welcomeGreeting:
      "নমস্কার দিদি! আমি VANI (Voice Assistant for Nari Initiatives)। সরকারি সাহায্য পাওয়া এখন খুব সহজ। আপনি কি সেলাই বা দুগ্ধ পালনের মতো কাজ শুরু করতে চান, নাকি কৃষিকাজে সাহায্য প্রয়োজন?",
    welcomeSubtext: "বাংলায় কথা বলুন বা লিখুন",
    quickReplies: {
      q1: ["✂️ সেলাইয়ের কাজ", "🐄 দুগ্ধ ও পশুপালন", "🛒 ছোট দোকান / ঠেলাগাড়ি", "🌾 কৃষিকাজ / শাকসবজি"],
      q2: ["👥 হ্যাঁ, স্বনির্ভর গোষ্ঠীর (SHG) সদস্য", "🙋‍♀️ না, একা কাজ শুরু করব", "💳 হ্যাঁ, ব্যাংক অ্যাকাউন্ট আছে"],
      q3: ["💰 ₹৫০,০০০ এর মধ্যে", "💵 ₹১ লাখ পর্যন্ত", "🌟 যত বেশি সম্ভব সাহায্য"]
    },
    ui: {
      tagline: "মহিলাদের জন্য ভয়েস সহকারী (VANI) • সহজ সরকারি প্রকল্প",
      readPageOutLoud: "🔊 সম্পূর্ণ পৃষ্ঠা পড়ে শোনান",
      readingPage: "🔊 পৃষ্ঠা পড়া হচ্ছে...",
      listening: "বাণী শুনছেন... বলুন দিদি",
      speaking: "বাণী বলছেন...",
      thinking: "বাণী সেরা প্রকল্প খুঁজছেন...",
      tapToSpeak: "🎤 বাণীর সাথে কথা বলুন (Tap to Speak)",
      stopListening: "বলা বন্ধ করুন",
      typePlaceholder: "এখানে লিখুন (e.g. 'Silai machine er jonno loan lagbe')...",
      quickAnswerLabel: "এক ক্লিকে নির্বাচন করুন:",
      questionStep: "প্রশ্ন",
      actionCardReady: "আপনার সহায়তা কার্ড তৈরি!",
      sarkariSupport: "ভারত সরকার সহায়তা প্রকল্প",
      noCollateral: "কোনো বন্ধক ছাড়া (No Collateral)",
      whereToGo: "কোথায় যেতে হবে? (Where to Go)",
      whereToGoTip: "সোমবার থেকে শুক্রবার সকাল ১১টা থেকে দুপুর ২টার মধ্যে যাওয়া ভালো।",
      documentsNeeded: "কী কী নথি সাথে নিতে হবে?",
      documentsTip: "ব্যাগে রাখুন এবং টিক দিন",
      whatToSay: "আধিকারিককে কী বলতে হবে? (Golden Script)",
      listenRehearsal: "বাণীর গলায় শুনুন (Rehearsal)",
      practicedBadge: "দারুণ! এবার আপনি আত্মবিশ্বাসের সাথে বলতে পারবেন।",
      printButton: "প্রিন্ট / PDF",
      whatsappButton: "WhatsApp এ পাঠান",
      newConsultation: "নতুন প্রকল্প খুঁজুন"
    }
  },
  mr: {
    code: "mr",
    name: "Marathi (मराठी)",
    nativeName: "मराठी",
    speechLang: "mr-IN",
    flag: "🇮🇳",
    welcomeGreeting:
      "नमस्कार ताई! मी VANI (Voice Assistant for Nari Initiatives) आहे. सरकारी मदत मिळवणे आता सोपे झाले आहे. शिलाई किंवा दुग्ध व्यवसाय सुरू करायचा आहे की शेतीकामासाठी मदत हवी आहे?",
    welcomeSubtext: "मराठीत बोला किंवा लिहा",
    quickReplies: {
      q1: ["✂️ शिलाई काम (Tailoring)", "🐄 दुग्ध व्यवसाय / पशुपालन", "🛒 लहान दुकान / गाडा", "🌾 शेतीकाम / भाजीपाला"],
      q2: ["👥 होय, मी महिला बचत गटात आहे", "🙋‍♀️ नाही, स्वतंत्रपणे सुरू करणार", "💳 होय, बँक खाते आहे"],
      q3: ["💰 ₹५०,००० पर्यंत", "💵 ₹१ लाखापर्यंत", "🌟 जास्तीत जास्त मदत"]
    },
    ui: {
      tagline: "महिलांसाठी व्हॉईस असिस्टंट (VANI) • सोप्या भाषेत सरकारी योजना",
      readPageOutLoud: "🔊 संपूर्ण पान वाचून दाखवा",
      readingPage: "🔊 पान वाचले जात आहे...",
      listening: "वाणी ऐकत आहेत... बोला ताई",
      speaking: "वाणी समजावून सांगत आहेत...",
      thinking: "वाणी सर्वोत्तम योजना शोधत आहेत...",
      tapToSpeak: "🎤 वाणींशी बोला (Tap to Speak)",
      stopListening: "बोलणे थांबवा",
      typePlaceholder: "येथे लिहा (e.g. 'Shilai machine sathi loan havay')...",
      quickAnswerLabel: "एका स्पर्शात निवडा:",
      questionStep: "प्रश्न",
      actionCardReady: "तुमचे योजना कार्ड तयार आहे!",
      sarkariSupport: "भारत सरकार सहाय्य योजना",
      noCollateral: "कोणतेही तारण न ठेवता (No Collateral)",
      whereToGo: "कुठे जायचे? (Where to Go)",
      whereToGoTip: "सोमवार ते शुक्रवार सकाळी ११ ते दुपारी २ दरम्यान जाणे योग्य राहील.",
      documentsNeeded: "कोणती कागदपत्रे सोबत हवीत?",
      documentsTip: "पिशवीत ठेवा आणि खूण करा",
      whatToSay: "अधिकाऱ्याशी काय बोलायचे? (Golden Script)",
      listenRehearsal: "वाणींच्या आवाजात ऐका (Rehearsal)",
      practicedBadge: "छान! आता तुम्ही आत्मविश्वासाने बोलू शकता.",
      printButton: "प्रिंट / PDF",
      whatsappButton: "WhatsApp वर पाठवा",
      newConsultation: "नवीन योजना शोधा"
    }
  },
  kn: {
    code: "kn",
    name: "Kannada (ಕನ್ನಡ)",
    nativeName: "ಕನ್ನಡ",
    speechLang: "kn-IN",
    flag: "🇮🇳",
    welcomeGreeting:
      "ನಮಸ್ಕಾರ ಸಹೋದರಿ! ನಾನು VANI (Voice Assistant for Nari Initiatives). ಸರ್ಕಾರಿ ಸಹಾಯ ಪಡೆಯುವುದು ಈಗ ತುಂಬಾ ಸುಲಭ. ಹೊಲಿಗೆ ಅಥವಾ ಹೈನುಗಾರಿಕೆ ಪ್ರಾರಂಭಿಸಲು ಬಯಸುವಿರಾ, ಅಥವಾ ಕೃಷಿಯಲ್ಲಿ ಸಹಾಯ ಬೇಕೇ?",
    welcomeSubtext: "ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ",
    quickReplies: {
      q1: ["✂️ ಹೊಲಿಗೆ ಕೆಲಸ (Tailoring)", "🐄 ಹೈನುಗಾರಿಕೆ / ಡೈರಿ", "🛒 ಸಣ್ಣ ಅಂಗಡಿ / ಗಾಡಿ", "🌾 ಕೃಷಿ / ತರಕಾರಿ"],
      q2: ["👥 ಹೌದು, ಸ್ವಸಹಾಯ ಸಂಘದಲ್ಲಿದ್ದೇನೆ", "🙋‍♀️ ಇಲ್ಲ, ಒಬ್ಬಂಟಿಯಾಗಿ ಪ್ರಾರಂಭಿಸುವೆ", "💳 ಹೌದು, ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆ"],
      q3: ["💰 ₹50,000 ಒಳಗೆ", "💵 ₹1 ಲಕ್ಷದವರೆಗೆ", "🌟 ಸಾಧ್ಯವಾದಷ್ಟು ಹೆಚ್ಚಿನ ಸಹಾಯ"]
    },
    ui: {
      tagline: "ಮಹಿಳೆಯರಿಗಾಗಿ ಧ್ವನಿ ಸಹಾಯಕ (VANI) • ಸರಳ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      readPageOutLoud: "🔊 ಇಡೀ ಪುಟವನ್ನು ಓದಿ ಕೇಳಿಸಿ",
      readingPage: "🔊 ಪುಟವನ್ನು ಓದಲಾಗುತ್ತಿದೆ...",
      listening: "ವಾಣಿ ಕೇಳುತ್ತಿದ್ದಾರೆ... ಮಾತನಾಡಿ",
      speaking: "ವಾಣಿ ಹೇಳುತ್ತಿದ್ದಾರೆ...",
      thinking: "ವಾಣಿ ಉತ್ತಮ ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡುತ್ತಿದ್ದಾರೆ...",
      tapToSpeak: "🎤 ವಾಣಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ (Tap to Speak)",
      stopListening: "ಮಾತನಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
      typePlaceholder: "ಇಲ್ಲಿ ಬರೆಯಿರಿ (e.g. 'Holige machine ge loan beku')...",
      quickAnswerLabel: "ಒಂದೇ ಸ್ಪರ್ಶದಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ:",
      questionStep: "ಪ್ರಶ್ನೆ",
      actionCardReady: "ನಿಮ್ಮ ಸಹಾಯ ಕಾರ್ಡ್ ಸಿದ್ಧವಾಗಿದೆ!",
      sarkariSupport: "ಭಾರತ ಸರ್ಕಾರ ಸಹಾಯ",
      noCollateral: "ಯಾವುದೇ ಅಡಮಾನವಿಲ್ಲದೆ (No Collateral)",
      whereToGo: "ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು? (Where to Go)",
      whereToGoTip: "ಸೋಮವಾರದಿಂದ ಶುಕ್ರವಾರದವರೆಗೆ ಬೆಳಗ್ಗೆ 11 ರಿಂದ ಮಧ್ಯಾಹ್ನ 2 ರ ನಡುವೆ ಹೋಗುವುದು ಒಳ್ಳೆಯದು.",
      documentsNeeded: "ತೆಗೆದುಕೊಂಡು ಹೋಗಬೇಕಾದ ದಾಖಲೆಗಳು",
      documentsTip: "ಬ್ಯಾಗ್‌ನಲ್ಲಿ ಇಟ್ಟು ಗುರುತು ಹಾಕಿ",
      whatToSay: "ಅಧಿಕಾರಿಯೊಂದಿಗೆ ಏನು ಮಾತನಾಡಬೇಕು? (Golden Script)",
      listenRehearsal: "ವಾಣಿಯ ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ (Rehearsal)",
      practicedBadge: "ಅದ್ಭುತ! ಈಗ ನೀವು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮಾತನಾಡಬಹುದು.",
      printButton: "ಪ್ರಿಂಟ್ / PDF",
      whatsappButton: "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ",
      newConsultation: "ಹೊಸ ಯೋಜನೆ ಹುಡುಕಿ"
    }
  },
  gu: {
    code: "gu",
    name: "Gujarati (ગુજરાતી)",
    nativeName: "ગુજરાતી",
    speechLang: "gu-IN",
    flag: "🇮🇳",
    welcomeGreeting:
      "નમસ્તે બહેન! હું VANI (Voice Assistant for Nari Initiatives) છું. સરકારી સહાય મેળવવી હવે ખૂબ સરળ છે. સિલાઈ અથવા ડેરી જેવો નવો વ્યવસાય શરૂ કરવો છે કે ખેતીમાં મદદ જોઈએ છે?",
    welcomeSubtext: "ગુજરાતીમાં બોલો અથવા ટાઈપ કરો",
    quickReplies: {
      q1: ["✂️ સિલાઈ કામ (Tailoring)", "🐄 ડેરી / પશુપાલન", "🛒 નાની દુકાન / લારી", "🌾 ખેતીકામ / શાકભાજી"],
      q2: ["👥 હા, મહિલા બચત જૂથ (SHG) માં છું", "🙋‍♀️ ના, એકલા શરૂ કરીશ", "💳 હા, બેંક ખાતું છે"],
      q3: ["💰 ₹૫૦,૦૦૦ સુધી", "💵 ₹૧ લાખ સુધી", "🌟 શક્ય તેટલી વધુ સહાય"]
    },
    ui: {
      tagline: "મહિલાઓ માટે વોઈસ આસિસ્ટન્ટ (VANI) • સરળ સરકારી યોજનાઓ",
      readPageOutLoud: "🔊 આખું પેજ વાંચી સંભળાવો",
      readingPage: "🔊 પેજ વાંચી રહ્યા છીએ...",
      listening: "વાણી સાંભળી રહ્યા છે... બોલો બહેન",
      speaking: "વાણી સમજાવી રહ્યા છે...",
      thinking: "વાણી શ્રેષ્ઠ યોજના શોધી રહ્યા છે...",
      tapToSpeak: "🎤 વાણી સાથે બોલીને વાત કરો",
      stopListening: "બોલવાનું બંધ કરો",
      typePlaceholder: "અહીં લખો (e.g. 'Silai machine mate loan joie che')...",
      quickAnswerLabel: "એક ટચમાં પસંદ કરો:",
      questionStep: "પ્રશ્ન",
      actionCardReady: "તમારી યોજના પર્ચી તૈયાર છે!",
      sarkariSupport: "ભારત સરકાર સહાય",
      noCollateral: "કોઈપણ ગીરો વગર (No Collateral)",
      whereToGo: "ક્યાં જવાનું છે? (Where to Go)",
      whereToGoTip: "સોમવારથી શુક્રવાર સવારે ૧૧ થી બપોરે ૨ વાગ્યા વચ્ચે જવું સારું રહેશે.",
      documentsNeeded: "સાથે શું લઈ જવાનું છે?",
      documentsTip: "થેલીમાં મૂકો અને ટીક કરો",
      whatToSay: "અધિકારીને શું કહેવું? (Golden Script)",
      listenRehearsal: "વાણીના અવાજમાં સાંભળો (Rehearsal)",
      practicedBadge: "સરસ! હવે તમે કોઈપણ ડર વગર બોલી શકો છો.",
      printButton: "પર્ચી પ્રિન્ટ / PDF",
      whatsappButton: "WhatsApp પર મોકલો",
      newConsultation: "નવી યોજના શોધો"
    }
  }
};

/**
 * Intelligent Language and Dialect Detection
 * Supports:
 * - Native scripts: Tamil, Telugu, Bengali, Gujarati, Kannada, Devanagari (Hindi/Marathi)
 * - Code-mixed romanized dialects:
 *   - Tanglish (Tamil in English alphabet)
 *   - Telugish (Telugu in English alphabet)
 *   - Hinglish (Hindi in English alphabet)
 *   - Pure English
 */
export function detectLanguageFromText(text: string): string | null {
  if (!text) return null;

  // 1. Check Native Unicode Scripts First
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta"; // Tamil script
  if (/[\u0C00-\u0C7F]/.test(text)) return "te"; // Telugu script
  if (/[\u0980-\u09FF]/.test(text)) return "bn"; // Bengali script
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu"; // Gujarati script
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn"; // Kannada script
  if (/[\u0900-\u097F]/.test(text)) {
    if (/(आहे|नाही|करायचे|ताई|बचत गट|माहिती|पाहिजे)/.test(text)) return "mr";
    return "hi";
  }

  const lower = text.toLowerCase();

  // 2. Tanglish Detection (Tamil in English script)
  // E.g.: "tailoring machine vanga loan venum", "pananum", "kadai vekka", "enna scheme iruku", "kadan thevai"
  const tanglishRegex = /\b(venum|vendam|vanga|vanganum|pananum|pannanum|kadai|enaku|unakku|iruku|iruka|kaasu|panam|thozhil|kadan|mudiyuma|nalla|epdi|eppadi|enna|solunga|machin|vanakkam|akka|thambi|seyyanum|thevai|sari|chinna|oru|illai|aama|aam)\b/;
  if (tanglishRegex.test(lower)) {
    return "ta";
  }

  // 3. Telugish Detection (Telugu in English script)
  // E.g.: "tailoring kosam loan kaavali", "cheyali", "dabbulu", "appu", "vyaaparam"
  const telugishRegex = /\b(kaavali|kavali|cheyali|cheskovali|undi|ledu|dabbulu|appu|vyaaparam|paniki|evaru|ela|cheppandi|sahayam|namaskaram|chelli|nenu|meeru|pettukovali)\b/;
  if (telugishRegex.test(lower)) {
    return "te";
  }

  // 4. Hinglish Detection (Hindi in English script)
  // E.g.: "silai machine ke liye loan chahiye", "kaam shuru karna hai", "bachat samooh"
  const hinglishRegex = /\b(chahiye|karna|karni|karein|hai|hain|hoon|hum|paise|kamai|dukaan|bachat|samooh|madad|sarkari|yojana|batao|bataiye|namaste|shuru|mujhe|mera|meri|kheti|gai|bhains|pashu|nahi|haan)\b/;
  if (hinglishRegex.test(lower)) {
    return "hi";
  }

  // 5. Marathish Detection
  const marathishRegex = /\b(havay|pahije|karaycha|ahe|nahi|tai|bhetel|sangaa|kam|dya)\b/;
  if (marathishRegex.test(lower)) {
    return "mr";
  }

  // 6. Gujaranglish Detection
  const gujaranglishRegex = /\b(joie|joie che|karvu|karvu che|chhe|kem cho|bhai|bhen|aapjo)\b/;
  if (gujaranglishRegex.test(lower)) {
    return "gu";
  }

  // 7. Kannadish Detection
  const kannadishRegex = /\b(beku|beda|madabeku|ide|illa|namaskara|sahaya|thago)\b/;
  if (kannadishRegex.test(lower)) {
    return "kn";
  }

  // 8. English
  const englishMatches = lower.match(/\b(i|we|want|to|start|need|help|money|loan|business|shop|tailor|tailoring|dairy|farming|crops|yes|no|hello|hi|please|guidance|scheme)\b/g);
  if (englishMatches && englishMatches.length >= 1) {
    return "en";
  }

  return null;
}
