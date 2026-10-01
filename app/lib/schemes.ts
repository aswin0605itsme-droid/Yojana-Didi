import { ActionCardDetails, YojanaDidiResponse } from "../types";
import { detectLanguageFromText, SUPPORTED_LANGUAGES } from "./languages";

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

// Multilingual translations for simulator
const SIMULATOR_TRANSLATIONS: { [lang: string]: any } = {
  en: {
    t1: "Hello sister! I am your Yojana Didi. Getting government support will now be easy and simple. Tell me, would you like to start a small business like tailoring or dairy, or do you need help with farming?",
    t2_tailor: "Tailoring is such a wonderful business, sister! You can earn with dignity from home. Tell me, are you starting on your own or are you part of a women's self-help group?",
    t2_dairy: "Dairy and livestock provide dependable income! Do you already have a bank account, and how much financial help do you need to purchase cows or buffaloes?",
    t2_shop: "Running a small shop or vending cart takes real courage! Do you have your Aadhaar card and bank passbook ready?",
    t2_default: "That is a great vision! Being self-reliant is true strength. Do you currently have a savings account in a bank or belong to a self-help group?",
    t3_shg: "Being in a self-help group is fantastic! One final detail: does your group meet regularly and are you aiming to earn at least ₹1 lakh a year?",
    t3_default: "Understood, sister! Just one final question: how much money do you need to get started? Under ₹50,000 or a bit more?",
    t4_celebrate: (scheme: string) => `Congratulations, sister! I have found the ideal government support for you: "${scheme}". You will receive help without risking your house or land. I have prepared your Action Card with where to go and what to say to the officer.`,
    where_sbi: "Nearest State Bank of India (SBI) or Public Sector Bank Branch",
    where_panchayat: "Your Village Gram Panchayat or Block Development Office (BDO)",
    script_tailor: "Hello Sir, I am here to get the PM Mudra Shishu loan form to purchase a sewing machine and start my tailoring business."
  },
  ta: {
    t1: "வணக்கம் சகோதரி! நான் உங்கள் யோஜனா தீதி. அரசு உதவிகளை பெறுவது இப்போது மிகவும் எளிது. தையல் அல்லது பால் பண்ணை போன்ற புதிய தொழில் தொடங்க விரும்புகிறீர்களா, அல்லது விவசாயத்திற்கு உதவி தேவையா?",
    t2_tailor: "தையல் தொழில் மிகவும் சிறந்தது சகோதரி! வீட்டில் இருந்தே கண்ணியமாக சம்பாதிக்கலாம். நீங்கள் தனியாக தொடங்க விரும்புகிறீர்களா அல்லது மகளிர் சுய உதவிக் குழுவில் இணைந்துள்ளீர்களா?",
    t2_dairy: "பால் பண்ணை நிலையான வருமானம் தரும்! உங்களிடம் வங்கிக் கணக்கு உள்ளதா, மாடு வாங்க எவ்வளவு உதவி தேவைப்படும்?",
    t2_shop: "சிறு கடை வைப்பது சிறந்த முயற்சி! உங்களிடம் ஆதார் அட்டை மற்றும் வங்கி பாஸ்புக் உள்ளதா?",
    t2_default: "மிகவும் நல்ல முயற்சி! உங்களிடம் வங்கிக் கணக்கு உள்ளதா, அல்லது ஏதேனும் மகளிர் குழுவில் உள்ளீர்களா?",
    t3_shg: "சுய உதவிக் குழுவில் இருப்பது அருமை! உங்கள் குழு மாதம் தோறும் கூடுகிறதா, ஆண்டுக்கு ₹1 லட்சம் வருமானம் ஈட்ட விரும்புகிறீர்களா?",
    t3_default: "புரிந்தது சகோதரி! தொழில் தொடங்க உங்களுக்கு எவ்வளவு நிதி தேவை? ₹50,000-க்குள் போதுமா அல்லது அதற்கு மேலா?",
    t4_celebrate: (scheme: string) => `வாழ்த்துகள் சகோதரி! உங்களுக்கான சிறந்த திட்டம் கிடைத்துவிட்டது: "${scheme}". உங்கள் வீடு அல்லது நிலத்தை அடமானம் வைக்காமல் அரசு உதவி கிடைக்கும். உங்கள் உதவி அட்டை தயாராகிவிட்டது.`,
    where_sbi: "அருகிலுள்ள அரசு வங்கி (SBI) அல்லது பொதுத்துறை வங்கி கிளை",
    where_panchayat: "உங்கள் கிராம பஞ்சாயத்து அல்லது வட்டார வளர்ச்சி அலுவலகம் (BDO Office)",
    script_tailor: "வணக்கம் ஐயா, தையல் இயந்திரம் வாங்கி தொழில் தொடங்க பிரதமரின் முத்ரா சிசு கடன் படிவம் வேண்டும்."
  },
  te: {
    t1: "నమస్కారం సోదరీ! నేను మీ యోజనా దీదీని. ప్రభుత్వ సాయం పొందడం ఇప్పుడు చాలా సులభం. మీరు టైలరింగ్ లేదా డెయిరీ వంటి కొత్త పనిని ప్రారంభించాలనుకుంటున్నారా, లేదా వ్యవసాయానికి సహాయం కావాలా?",
    t2_tailor: "టైలరింగ్ పని చాలా మంచిది సోదరీ! మీరు ఇంట్లోనే గౌరవంగా సంపాదించవచ్చు. మీరు ఒంటరిగా ప్రారంభించాలనుకుంటున్నారా లేదా స్వయం సహాయక సంఘంలో ఉన్నారా?",
    t2_dairy: "పాడి పరిశ్రమ నమ్మకమైన ఆదాయాన్ని ఇస్తుంది! మీకు బ్యాంకు ఖాతా ఉందా, ఆవు లేదా గేదె కొనడానికి ఎంత సాయం కావాలి?",
    t2_shop: "దుకాణం లేదా బండి నడపడం గొప్ప ఆలోచన! మీ దగ్గర ఆధార్ కార్డు మరియు బ్యాంకు పాస్‌బుక్ ఉన్నాయా?",
    t2_default: "చాలా మంచి ఆలోచన! మీకు బ్యాంకు ఖాతా ఉందా, లేదా ఏదైనా మహిళా బచత్ సంఘంలో ఉన్నారా?",
    t3_shg: "సంఘంలో ఉండడం చాలా మంచిది! మీ సంఘం క్రమం తప్పకుండా సమావేశమవుతోందా మరియు ఏడాదికి ₹1 లక్ష ఆదాయం పొందాలనుకుంటున్నారా?",
    t3_default: "అర్థమైంది సోదరీ! పని ప్రారంభించడానికి మీకు ఎంత డబ్బు అవసరం? ₹50,000 లోపా లేదా అంతకంటే ఎక్కువా?",
    t4_celebrate: (scheme: string) => `అభినందనలు సోదరీ! మీ కోసం ఉత్తమమైన పథకం దొరికింది: "${scheme}". ఎలాంటి ఆస్తి లేదా ఇల్లు తాకట్టు పెట్టకుండా ప్రభుత్వ సాయం లభిస్తుంది. మీ సహాయ కార్డ్ సిద్ధంగా ఉంది.`,
    where_sbi: "సమీపంలోని ఎస్.బి.ఐ (SBI) లేదా ప్రభుత్వ బ్యాంకు శాఖ",
    where_panchayat: "మీ గ్రామ పంచాయతీ లేదా మండల అభివృద్ధి అధికారి (BDO) కార్యాలయం",
    script_tailor: "నమస్కారం సార్, కుట్టు మిషన్ కొనుగోలు చేసి పని ప్రారంభించడానికి నాకు ముద్ర శిశు లోన్ ఫారమ్ కావాలి."
  },
  bn: {
    t1: "নমস্কার দিদি! আমি আপনার যোজনা দিদি। সরকারি সাহায্য পাওয়া এখন খুব সহজ। আপনি কি সেলাই বা দুগ্ধ পালনের মতো কোনো নতুন কাজ শুরু করতে চান, নাকি কৃষিকাজে সাহায্য প্রয়োজন?",
    t2_tailor: "সেলাইয়ের কাজ দারুণ সম্মানজনক দিদি! আপনি ঘরে বসেই উপার্জন করতে পারবেন। আপনি কি একা শুরু করছেন নাকি কোনো স্বনির্ভর গোষ্ঠীর সাথে যুক্ত আছেন?",
    t2_dairy: "দুগ্ধ ও পশুপালন খুবই লাভজনক কাজ! আপনার কি ব্যাংক অ্যাকাউন্ট আছে, এবং গরু কেনার জন্য কত সাহায্যের প্রয়োজন?",
    t2_shop: "ছোট দোকান বা ঠেলাগাড়ি চালানো অনেক সাহসের কাজ! আপনার কাছে আধার কার্ড ও ব্যাংক পাসবুক আছে?",
    t2_default: "খুব সুন্দর ভাবনা! নিজের পায়ে দাঁড়ানোই আসল শক্তি। আপনার কি কোনো ব্যাংক অ্যাকাউন্ট আছে বা স্বনির্ভর গোষ্ঠীতে আছেন?",
    t3_shg: "গোষ্ঠীতে থাকা তো দারুণ ব্যাপার! আপনাদের গোষ্ঠীর বৈঠক কি নিয়মিত হয় এবং বছরে অন্তত ₹১ লাখ উপার্জনের লক্ষ্য আছে?",
    t3_default: "বুঝেছি দিদি! কাজ শুরু করতে আপনার কত টাকার প্রয়োজন হতে পারে? ₹৫০,০০০ এর মধ্যে নাকি তার বেশি?",
    t4_celebrate: (scheme: string) => `অভিনন্দন দিদি! আপনার জন্য সবচেয়ে উপযুক্ত সরকারি প্রকল্প পেয়ে গেছি: "${scheme}"। কোনো জমি বা ঘর বন্ধক না রেখেই সাহায্য পাবেন। আপনার সহায়তা কার্ড প্রস্তুত!`,
    where_sbi: "নিকটবর্তী এসবিআই (SBI) বা যেকোনো সরকারি ব্যাংক শাখা",
    where_panchayat: "আপনার গ্রামের গ্রাম পঞ্চায়েত বা বিডিও (BDO) অফিস",
    script_tailor: "নমস্কার স্যার, আমি সেলাই মেশিন কিনে কাজ শুরু করার জন্য প্রধানমন্ত্রী মুদ্রা শিশু ঋণের ফর্ম নিতে এসেছি।"
  },
  mr: {
    t1: "नमस्कार ताई! मी तुमची योजना दीदी आहे. सरकारी मदत मिळवणे आता खूप सोपे आहे. तुम्हाला शिलाई किंवा दुग्ध व्यवसायासारखा नवीन व्यवसाय सुरू करायचा आहे की शेतीकामासाठी मदत हवी आहे?",
    t2_tailor: "शिलाई काम खूपच छान आहे ताई! तुम्ही घरबसल्या सन्मानाने कमाई करू शकता. तुम्ही एकट्या सुरू करणार आहात की महिला बचत गटात आहात?",
    t2_dairy: "दुग्ध व्यवसाय आणि पशुपालन गावात खूप भरवशाची कमाई देते! तुमचे बँक खाते आहे का आणि जनावरे घेण्यासाठी किती मदतीची गरज आहे?",
    t2_shop: "स्वतःचे दुकान किंवा गाडा लावणे खूप हिमतीचे काम आहे! आधार कार्ड आणि बँक पासबुक उपलब्ध आहे का?",
    t2_default: "खूप छान विचार आहे! स्वावलंबी होणे हीच खरी ताकद आहे. तुमचे बँकेत खाते आहे का किंवा बचत गटाशी जोडलेल्या आहात का?",
    t3_shg: "बचत गटात असणे खूप फायदेशीर आहे! शेवटची गोष्ट सांगा, दरवर्षी किमान ₹१ लाख उत्पन्न वाढवण्याचा विचार आहे का?",
    t3_default: "समजले ताई! व्यवसाय सुरू करण्यासाठी किती रुपयांची गरज पडेल? ₹५०,००० च्या आत की त्यापेक्षा जास्त?",
    t4_celebrate: (scheme: string) => `अभिनंदन ताई! तुमच्यासाठी सर्वात सोपी व फायदेशीर योजना मिळाली आहे: "${scheme}". घर किंवा जमीन गहाण न ठेवता सरकारी मदत मिळेल. तुमचे योजना कार्ड तयार आहे!`,
    where_sbi: "जवळची एसबीआय (SBI) किंवा सरकारी बँकेची शाखा",
    where_panchayat: "तुमच्या गावातील ग्रामपंचायत किंवा बीडीओ (BDO) कार्यालय",
    script_tailor: "नमस्कार साहेब, शिलाई मशीन खरेदी करून व्यवसाय सुरू करण्यासाठी मला प्रधानमंत्री मुद्रा शिशु कर्ज अर्ज हवा आहे."
  },
  gu: {
    t1: "નમસ્તે બહેન! હું તમારી યોજના દીદી છું. સરકારી સહાય મેળવવી હવે ખૂબ સરળ છે. તમે સિલાઈ અથવા ડેરી જેવો નવો વ્યવસાય શરૂ કરવા માંગો છો કે ખેતીમાં મદદ જોઈએ છે?",
    t2_tailor: "સિલાઈનું કામ ખૂબ સરસ છે બહેન! તમે ઘરે બેઠા સન્માનભેર કમાણી કરી શકો છો. તમે એકલા શરૂ કરવા માંગો છો કે બચત જૂથ સાથે જોડાયેલા છો?",
    t2_dairy: "પશુપાલન અને દૂધનું કામ ગામડામાં કાયમી આવક આપે છે! શું તમારું બેંક ખાતું છે અને નવી ગાય/ભેંસ લેવા કેટલી સહાય જોઈએ?",
    t2_shop: "નાની દુકાન કે લારી લગાવવી હિંમતનું કામ છે! આધાર કાર્ડ અને બેંક પાસબુક તૈયાર છે?",
    t2_default: "ખૂબ સારો વિચાર છે! તમારું બેંક ખાતું છે કે કોઈ બચત મંડળ સાથે જોડાયેલા છો?",
    t3_shg: "જૂથમાં હોવું ઉત્તમ છે! એક છેલ્લી વાત, શું દર વર્ષે ઓછામાં ઓછી ₹1 લાખ કમાણી કરવાનું લક્ષ્ય છે?",
    t3_default: "સમજી ગઈ બહેન! કામ શરૂ કરવા કેટલા રૂપિયાની જરૂર પડશે? ₹50,000 ની અંદર કે તેથી વધુ?",
    t4_celebrate: (scheme: string) => `અભિનંદન બહેન! તમારા માટે શ્રેષ્ઠ યોજના મળી ગઈ છે: "${scheme}". કોઈ ઘર કે જમીન ગીરો મૂક્યા વગર સરકારી સહાય મળશે. તમારી પર્ચી તૈયાર છે!`,
    where_sbi: "નજીકની એસબીઆઈ (SBI) અથવા સરકારી બેંક શાખા",
    where_panchayat: "તમારી ગ્રામ પંચાયત અથવા તાલુકા વિકાસ અધિકારી (BDO) કચેરી",
    script_tailor: "નમસ્તે સાહેબ, સિલાઈ મશીન ખરીદીને કામ શરૂ કરવા માટે મને પ્રધાનમંત્રી મુદ્રા શિશુ લોનનું ફોર્મ આપો."
  },
  kn: {
    t1: "ನಮಸ್ಕಾರ ಸಹೋದರಿ! ನಾನು ನಿಮ್ಮ ಯೋಜನಾ ದೀದಿ. ಸರ್ಕಾರಿ ಸಹಾಯ ಪಡೆಯುವುದು ಈಗ ತುಂಬಾ ಸುಲಭ. ನೀವು ಹೊಲಿಗೆ ಅಥವಾ ಹೈನುಗಾರಿಕೆಯಂತಹ ಹೊಸ ಕೆಲಸವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಬಯಸುವಿರಾ, ಅಥವಾ ಕೃಷಿಯಲ್ಲಿ ಸಹಾಯ ಬೇಕೇ?",
    t2_tailor: "ಹೊಲಿಗೆ ಕೆಲಸ ತುಂಬಾ ಒಳ್ಳೆಯದು ಸಹೋದರಿ! ಮನೆಯಲ್ಲೇ ಗೌರವಯುತ ಆದಾಯ ಗಳಿಸಬಹುದು. ನೀವು ಒಬ್ಬಂಟಿಯಾಗಿ ಪ್ರಾರಂಭಿಸುವಿರಾ ಅಥವಾ ಸ್ವಸಹಾಯ ಸಂಘದಲ್ಲಿದ್ದೀರಾ?",
    t2_dairy: "ಹೈನುಗಾರಿಕೆ ನಿರಂತರ ಆದಾಯ ನೀಡುತ್ತದೆ! ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯೇ ಮತ್ತು ಹಸು ಕೊಳ್ಳಲು ಎಷ್ಟು ನೆರವು ಬೇಕು?",
    t2_shop: "ಸಣ್ಣ ಅಂಗಡಿ ಇಡುವುದು ಧೈರ್ಯದ ಕೆಲಸ! ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಸಿದ್ಧವಿದೆಯೇ?",
    t2_default: "ತುಂಬಾ ಒಳ್ಳೆಯ ಆಲೋಚನೆ! ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯೇ ಅಥವಾ ಯಾವುದಾದರೂ ಸ್ವಸಹಾಯ ಸಂಘದಲ್ಲಿದ್ದೀರಾ?",
    t3_shg: "ಸ್ವಸಹಾಯ ಸಂಘದಲ್ಲಿರುವುದು ಉತ್ತಮ! ನಿಮ್ಮ ಸಂಘ ವರ್ಷಕ್ಕೆ ಕನಿಷ್ಠ ₹1 ಲಕ್ಷ ಆದಾಯ ಹೆಚ್ಚಿಸಲು ಬಯಸುತ್ತದೆಯೇ?",
    t3_default: "ಅರ್ಥವಾಯಿತು ಸಹೋದರಿ! ಕೆಲಸ ಪ್ರಾರಂಭಿಸಲು ಎಷ್ಟು ಹಣ ಬೇಕಾಗಬಹುದು? ₹50,000 ಒಳಗೆಯೇ ಅಥವಾ ಹೆಚ್ಚಿನ ಮೊತ್ತವೇ?",
    t4_celebrate: (scheme: string) => `ಅಭಿನಂದನೆಗಳು ಸಹೋದರಿ! ನಿಮಗಾಗಿ ಅತ್ಯುತ್ತಮ ಯೋಜನೆ ಸಿಕ್ಕಿದೆ: "${scheme}". ಯಾವುದೇ ಆಸ್ತಿ ಅಡಮಾನವಿಲ್ಲದೆ ಸರ್ಕಾರಿ ನೆರವು ಸಿಗುತ್ತದೆ. ನಿಮ್ಮ ಸಹಾಯ ಕಾರ್ಡ್ ಸಿದ್ಧವಾಗಿದೆ!`,
    where_sbi: "ಹತ್ತಿರದ ಎಸ್‌ಬಿಐ (SBI) ಅಥವಾ ಸರ್ಕಾರಿ ಬ್ಯಾಂಕ್ ಶಾಖೆ",
    where_panchayat: "ನಿಮ್ಮ ಗ್ರಾಮ ಪಂಚಾಯಿತಿ ಅಥವಾ ತಾಲೂಕು ಅಭಿವೃದ್ಧಿ ಕಚೇರಿ (BDO)",
    script_tailor: "ನಮಸ್ಕಾರ ಸರ್, ಹೊಲಿಗೆ ಯಂತ್ರ ಕೊಂಡು ಕೆಲಸ ಪ್ರಾರಂಭಿಸಲು ಪ್ರಧಾನ ಮಂತ್ರಿ ಮುದ್ರಾ ಶಿಶು ಸಾಲದ ಅರ್ಜಿ ಬೇಕಾಗಿದೆ."
  }
};

/**
 * Deterministic offline simulator for hackathon demos.
 * Supports multilingual responses based on user input or selected language.
 */
export function simulateYojanaDidiResponse(
  userText: string,
  turnCount: number,
  requestedLang?: string
): YojanaDidiResponse {
  const detected = detectLanguageFromText(userText);
  const lang = requestedLang || detected || "hi";
  const tr = SIMULATOR_TRANSLATIONS[lang];
  const text = (userText || "").toLowerCase();

  // Turn 1
  if (turnCount <= 1 && (!text || text.includes("namaste") || text.includes("hello") || text.includes("hi") || text.includes("vanakkam") || text.includes("namaskaram"))) {
    const greeting = tr ? tr.t1 : SUPPORTED_LANGUAGES.hi.welcomeGreeting;
    return {
      spoken_response: greeting,
      ui_mode: "interview",
      language: lang,
      action_card_details: {
        scheme_name: null,
        documents_needed: [],
        where_to_go: "",
        what_to_say: ""
      }
    };
  }

  // Turn 2
  if (turnCount === 1 || turnCount === 2) {
    let question = "";
    if (text.includes("silai") || text.includes("tailor") || text.includes("machine") || text.includes("தையல்") || text.includes("కుట్టు") || text.includes("সেলাই") || text.includes("शिलाई") || text.includes("સિલાઈ") || text.includes("ಹೊಲಿಗೆ")) {
      question = tr ? tr.t2_tailor : "Silai ka kaam bahut hi badhiya hai behen! Aap ghar baithe izzat ki aamdani bana sakti hain. Mujhe yeh batayein, kya aap yeh kaam akele apne ghar se shuru karna chahti hain ya kisi mahila bachat samooh ke sath judi hain?";
    } else if (text.includes("dairy") || text.includes("gai") || text.includes("bhains") || text.includes("doodh") || text.includes("பால்") || text.includes("పాడి") || text.includes("দুগ্ধ") || text.includes("हೈನು")) {
      question = tr ? tr.t2_dairy : "Pashupalan aur doodh ka kaam toh gaon mein sabse bharosemand aamdani deta hai! Bataiye, kya aapke paas pehle se koi bank khata hai, aur aapko nayi gai ya bhains lene ke liye kitne sahare ki zaroorat hogi?";
    } else if (text.includes("dukan") || text.includes("thela") || text.includes("shop") || text.includes("கடை") || text.includes("దుకాణం") || text.includes("দোকান") || text.includes("દુકાન") || text.includes("ಅಂಗಡಿ")) {
      question = tr ? tr.t2_shop : "Apni dukan ya thela lagana bahut himmat aur mehnat ka kaam hai! Kya aapke paas apna Aadhaar card aur bank passbook uplabdh hai?";
    } else {
      question = tr ? tr.t2_default : "Yeh toh bahut nek soch hai! Apne pairon par khade hona sabse badi taaqat hai. Kya aapke paas bank mein khata khula hua hai, aur kya aap kisi bachat gat ya samooh se judi hain?";
    }

    return {
      spoken_response: question,
      ui_mode: "interview",
      language: lang,
      action_card_details: {
        scheme_name: null,
        documents_needed: [],
        where_to_go: "",
        what_to_say: ""
      }
    };
  }

  // Turn 3
  if (turnCount === 3) {
    let question = "";
    if (text.includes("samooh") || text.includes("bachat") || text.includes("shg") || text.includes("group") || text.includes("குழு") || text.includes("సంఘం") || text.includes("গোষ্ঠী") || text.includes("ગટ")) {
      question = tr ? tr.t3_shg : "Samooh se judna toh sona chandi jaisa hai! Aakhri baat bataiye, kya aapka bachat samooh niyamit rup se baithak karta hai aur aap ₹1 lakh tak aamdani badhane ka rasta dhoondh rahi hain?";
    } else {
      question = tr ? tr.t3_default : "Samajh gayi behen. Bas ek aakhri baat bataiye, kaam shuru karne ke liye aapko kitne rupaye ki zaroorat padegi? ₹50,000 ke andar ya usse thoda zyada?";
    }

    return {
      spoken_response: question,
      ui_mode: "interview",
      language: lang,
      action_card_details: {
        scheme_name: null,
        documents_needed: [],
        where_to_go: "",
        what_to_say: ""
      }
    };
  }

  // Turn 4 or higher: Progress to Action Card
  let matchedScheme = SCHEMES_DATABASE[0];
  if (text.includes("samooh") || text.includes("shg") || text.includes("bachat") || text.includes("group") || text.includes("குழு") || text.includes("సంఘం")) {
    matchedScheme = SCHEMES_DATABASE[1];
  } else if (text.includes("thela") || text.includes("dukan") || text.includes("vendor") || text.includes("shop") || text.includes("கடை")) {
    matchedScheme = SCHEMES_DATABASE[2];
  } else if (text.includes("dairy") || text.includes("gai") || text.includes("bhains") || text.includes("பால்") || text.includes("పాడి")) {
    matchedScheme = SCHEMES_DATABASE[3];
  } else if (text.includes("darzi") || text.includes("karigar") || text.includes("vishwakarma")) {
    matchedScheme = SCHEMES_DATABASE[4];
  }

  const celebration = tr
    ? tr.t4_celebrate(matchedScheme.name)
    : `Mubarak ho behen! Maine aapke liye sabse aasan aur faydemand yojana dhoondh li hai - "${matchedScheme.name}". Isme aapko bina zameen ya ghar girvi rakhe sarkari sahayata milegi. Maine aapki ek Parchi (Action Card) tayyar kar di hai. Is par likha hai ki aapko kahan jana hai aur wahan afsar se kya kehna hai.`;

  const whereToGo = tr && tr.where_sbi ? tr.where_sbi : matchedScheme.where_to_go;
  const whatToSay = tr && tr.script_tailor ? tr.script_tailor : matchedScheme.what_to_say;

  return {
    spoken_response: celebration,
    ui_mode: "action_card",
    language: lang,
    action_card_details: {
      scheme_name: matchedScheme.name,
      documents_needed: matchedScheme.documents_needed,
      where_to_go: whereToGo,
      what_to_say: whatToSay
    }
  };
}
