/**
 * Multi-lingual localization dictionary for NER-LEWS
 * Supports: English (en), Assamese (as), Hindi (hi), Bengali (bn), Khasi (kh)
 */

export const translations = {
  en: {
    systemTitle: 'NER-LEWS',
    systemSubtitle: 'North Eastern Region Landslide Early Warning System',
    nav: {
      dashboard: 'Dashboard',
      mapView: 'Map View',
      historical: 'Historical Data',
      resources: 'Resources',
      riskScoring: 'Risk Scoring',
      authority: 'Authority Portal',
      reportIssue: 'Report an Issue',
      alerts: 'Active Alerts'
    },
    home: {
      greetingTitle: 'Namaste! I am your NER-LEWS guide.',
      greetingSubtitle: "Here is today's landslide risk status for your region.",
      listenAudio: 'Listen to Advisory',
      playingAudio: 'Playing Voice...',
      todayRisk: "Today's Risk Status",
      metrics: 'Live Field Metrics',
      rainfall24h: '24h Rainfall',
      soilMoisture: 'Soil Moisture',
      roadStatus: 'Road Status',
      viewMap: 'View Map',
      reportAnIssue: 'Report an Issue',
      openRiskScoring: 'Open Risk Calculator'
    },
    risk: {
      low: 'Low Risk',
      moderate: 'Moderate Risk',
      high: 'High Risk',
      severe: 'Severe Risk',
      lowAdvisory: 'Conditions stable. Continue routine monitoring.',
      moderateAdvisory: 'Increased risk detected. Notify local field officers for inspection.',
      highAdvisory: 'High risk conditions. Recommend road advisory and resident alert.',
      severeAdvisory: 'Critical risk. Recommend immediate evacuation advisory and road closure.'
    },
    report: {
      submitTitle: 'Submit Citizen Field Report',
      locationDetected: 'Location Detected (GPS)',
      visualEvidence: 'Visual Evidence (Photo/Video)',
      uploadPrompt: 'Upload Photo or Capture Scene',
      uploadHint: 'Capture the slope, cracks, or water seepage clearly. Minimum 1 photo.',
      descriptionLabel: 'What are you seeing?',
      descriptionPlaceholder: 'Describe ground conditions, boulder shifts, water flow, or slope cracks...',
      submitButton: 'Submit Report to SDMA',
      receivedTitle: 'Report Received',
      receivedText: 'Thank you for contributing to community safety. Your geotagged report is now live on the Authority Dashboard.',
      staySafeBadge: 'Stay safe and clear of active slide zones.',
      returnHome: 'Return to Dashboard'
    },
    authority: {
      title: 'High-Risk Zones Overview',
      subtitle: 'Monitor critical sectors, dispatch SMS alerts, and review citizen field reports.',
      tabs: {
        overview: 'Overview',
        zones: 'Hazard Zones',
        reports: 'Citizen Reports',
        settings: 'Settings & SMS Gateway'
      },
      sendAlert: 'Send Alert',
      sendAdvisory: 'Send Advisory',
      viewDetails: 'View Details'
    }
  },
  as: {
    systemTitle: 'NER-LEWS',
    systemSubtitle: 'উত্তৰ-পূব অঞ্চল ভূমিস্খলন প্ৰাৰম্ভিক সতৰ্কবাৰ্তা ব্যৱস্থা',
    nav: {
      dashboard: 'ডেশ্বব’ৰ্ড',
      mapView: 'মানচিত্ৰ দৰ্শন',
      historical: 'ঐতিহাসিক তথ্য',
      resources: 'সম্পদসমূহ',
      riskScoring: 'বিপদৰ মাত্ৰা নিৰ্ণয়',
      authority: 'কৰ্তৃপক্ষ পৰ্টেল',
      reportIssue: 'সমস্যা প্ৰতিবেদন',
      alerts: 'সক্ৰিয় সতৰ্কবাৰ্তা'
    },
    home: {
      greetingTitle: 'নমস্কাৰ! মই আপোনাৰ NER-LEWS সহায়ক।',
      greetingSubtitle: 'আজি আপোনাৰ অঞ্চলৰ ভূমিস্খলনৰ সম্ভাৱ্য বিপদৰ স্থিতি ইয়াত দিয়া হ’ল।',
      listenAudio: 'সতৰ্কবাৰ্তা শুনক',
      playingAudio: 'পঢ়ি থকা হৈছে...',
      todayRisk: 'আজিৰ বিপদৰ স্থিতি',
      metrics: 'পথাৰৰ লাইভ পৰিসংখ্যা',
      rainfall24h: '২৪ ঘণ্টাৰ বৰষুণ',
      soilMoisture: 'মাটিৰ আৰ্দ্ৰতা',
      roadStatus: 'পথৰ স্থিতি',
      viewMap: 'মানচিত্ৰ চাওক',
      reportAnIssue: 'তথ্য জমা দিয়ক',
      openRiskScoring: 'বিপদ কেলকুলেটৰ'
    },
    risk: {
      low: 'কম বিপদ',
      moderate: 'মধ্যমীয়া বিপদ',
      high: 'উচ্চ বিপদ',
      severe: 'চৰম বিপদ',
      lowAdvisory: 'পৰিস্থিতি স্বাভাৱিক। নিয়মিত নিৰীক্ষণ অব্যাহত ৰাখক।',
      moderateAdvisory: 'বিপদ বৃদ্ধি পাইছে। স্থানীয় পথাৰ বিষয়াৰ দ্বাৰা পৰিদৰ্শনৰ নিৰ্দেশ।',
      highAdvisory: 'উচ্চ বিপদজনক অৱস্থা। পথ সতৰ্কবাৰ্তা আৰু নাগৰিকক সাৱধান কৰক।',
      severeAdvisory: 'চৰম সংকটজনক বিপদ। তাৎক্ষণিকভাৱে সুৰক্ষিত স্থানলৈ স্থানান্তৰ কৰক।'
    },
    report: {
      submitTitle: 'নাগৰিক প্ৰতিবেদন জমা দিয়ক',
      locationDetected: 'অৱস্থান চিনাক্ত হৈছে (GPS)',
      visualEvidence: 'দৃশ্যমান প্ৰমাণ (ফটো/ভিডিঅ’)',
      uploadPrompt: 'ফটো আপলোড কৰক বা দৃশ্য তুলক',
      uploadHint: 'পাহাৰীয়া ঢাল, ফাট বা পানী ওলোৱা স্পষ্টকৈ তুলি লওক।',
      descriptionLabel: 'আপুনি কি প্ৰত্যক্ষ কৰিছে?',
      descriptionPlaceholder: 'মাটিৰ স্থিতি, শিল খহি পৰা বা ফাট মেলাৰ বিৱৰণ দিয়ক...',
      submitButton: 'প্ৰতিবেদন জমা দিয়ক',
      receivedTitle: 'প্ৰতিবেদন গ্ৰহণ কৰা হৈছে',
      receivedText: 'সমাজৰ সুৰক্ষাত অৰিহণা যোগোৱাৰ বাবে ধন্যবাদ। আপোনাৰ তথ্য প্ৰশাসনলৈ প্ৰেৰণ কৰা হৈছে।',
      staySafeBadge: 'সাৱধানে থাকক আৰু বিপদজনক এলেকাৰ পৰা আঁতৰি থাকক।',
      returnHome: 'ডেশ্বব’ৰ্ডলৈ উভতি যাওক'
    },
    authority: {
      title: 'উচ্চ সংকটপূৰ্ণ অঞ্চল নিৰীক্ষণ',
      subtitle: 'বিপদজনক স্থানসমূহ পৰিদৰ্শন কৰক, এছ.এম.এছ সতৰ্কবাৰ্তা প্ৰেৰণ কৰক আৰু প্ৰতিবেদন পৰ্যালোচনা কৰক।',
      tabs: {
        overview: 'অৱলোকন',
        zones: 'বিপদ অঞ্চল',
        reports: 'নাগৰিক প্ৰতিবেদন',
        settings: 'ছেটিংছ আৰু এছ.এম.এছ'
      },
      sendAlert: 'সতৰ্কবাৰ্তা প্ৰেৰণ',
      sendAdvisory: 'পৰামৰ্শ প্ৰেৰণ',
      viewDetails: 'বিৱৰণ চাওক'
    }
  },
  hi: {
    systemTitle: 'NER-LEWS',
    systemSubtitle: 'उत्तर-पूर्वी क्षेत्र भूस्खलन पूर्व चेतावनी प्रणाली',
    nav: {
      dashboard: 'डैशबोर्ड',
      mapView: 'मानचित्र दृश्य',
      historical: 'ऐतिहासिक डेटा',
      resources: 'संसाधन',
      riskScoring: 'जोखिम स्कोरिंग',
      authority: 'प्राधिकरण पोर्टल',
      reportIssue: 'रिपोर्ट दर्ज करें',
      alerts: 'सक्रिय चेतावनियां'
    },
    home: {
      greetingTitle: 'नमस्ते! मैं आपका NER-LEWS गाइड हूं।',
      greetingSubtitle: 'आज आपके क्षेत्र के लिए भूस्खलन जोखिम की स्थिति इस प्रकार है।',
      listenAudio: 'सलाह सुनें',
      playingAudio: 'ध्वनि बज रही है...',
      todayRisk: 'आज की जोखिम स्थिति',
      metrics: 'लाइव फील्ड आंकड़े',
      rainfall24h: '24 घंटे की वर्षा',
      soilMoisture: 'मिट्टी की नमी',
      roadStatus: 'सड़क की स्थिति',
      viewMap: 'मानचित्र देखें',
      reportAnIssue: 'समस्या दर्ज करें',
      openRiskScoring: 'जोखिम कैलकुलेटर'
    },
    risk: {
      low: 'कम जोखिम',
      moderate: 'मध्यम जोखिम',
      high: 'उच्च जोखिम',
      severe: 'गंभीर जोखिम',
      lowAdvisory: 'स्थिति सामान्य है। नियमित निगरानी जारी रखें।',
      moderateAdvisory: 'जोखिम में वृद्धि। स्थानीय अधिकारियों द्वारा निरीक्षण की सिफारिश।',
      highAdvisory: 'उच्च जोखिम की स्थिति। सड़क परामर्श और नागरिक चेतावनी जारी करें।',
      severeAdvisory: 'गंभीर आपातकालीन जोखिम। तुरंत सुरक्षित स्थान पर जाएं और सड़क बंद करें।'
    },
    report: {
      submitTitle: 'नागरिक रिपोर्ट दर्ज करें',
      locationDetected: 'स्थान का पता लगा (GPS)',
      visualEvidence: 'दृश्य साक्ष्य (फोटो/वीडियो)',
      uploadPrompt: 'फोटो अपलोड करें या कैमरा खोलें',
      uploadHint: 'ढलान, दरारें या पानी का रिसाव स्पष्ट रूप से कैप्चर करें।',
      descriptionLabel: 'आप क्या देख रहे हैं?',
      descriptionPlaceholder: 'जमीन की स्थिति, पत्थरों का गिरना या दरारों का विवरण लिखें...',
      submitButton: 'रिपोर्ट जमा करें',
      receivedTitle: 'रिपोर्ट प्राप्त हुई',
      receivedText: 'सुरक्षा में योगदान देने के लिए धन्यवाद। आपकी रिपोर्ट प्राधिकरण पोर्टल पर दर्ज हो गई है।',
      staySafeBadge: 'सुरक्षित रहें और खतरे वाले क्षेत्र से दूर रहें।',
      returnHome: 'डैशबोर्ड पर लौटें'
    },
    authority: {
      title: 'उच्च जोखिम क्षेत्र अवलोकन',
      subtitle: 'महत्वपूर्ण क्षेत्रों की निगरानी करें, एसएमएस अलर्ट भेजें और नागरिक रिपोर्ट की समीक्षा करें।',
      tabs: {
        overview: 'अवलोकन',
        zones: 'जोखिम क्षेत्र',
        reports: 'नागरिक रिपोर्ट',
        settings: 'सेटिंग्स और एसएमएस'
      },
      sendAlert: 'अलर्ट भेजें',
      sendAdvisory: 'परामर्श भेजें',
      viewDetails: 'विवरण देखें'
    }
  },
  bn: {
    systemTitle: 'NER-LEWS',
    systemSubtitle: 'উত্তর-পূর্বাঞ্চল ভূমিধস প্রাথমিক সতর্কতা ব্যবস্থা',
    nav: {
      dashboard: 'ড্যাশবোর্ড',
      mapView: 'মানচিত্র',
      historical: 'ঐতিহাসিক ডেটা',
      resources: 'রিসোর্স',
      riskScoring: 'ঝুঁকি পরিমাপ',
      authority: 'কর্তৃপক্ষ পোর্টাল',
      reportIssue: 'রিপোর্ট করুন',
      alerts: 'সতর্কবার্তা'
    },
    home: {
      greetingTitle: 'নমস্কার! আমি আপনার NER-LEWS গাইড।',
      greetingSubtitle: 'আজ আপনার অঞ্চলের ভূমিধসের সম্ভাব্য ঝুঁকি নিচে দেওয়া হলো।',
      listenAudio: 'পরামর্শ শুনুন',
      playingAudio: 'পড়া হচ্ছে...',
      todayRisk: 'আজকের ঝুঁকির অবস্থা',
      metrics: 'লাইভ মেট্রিক্স',
      rainfall24h: '২৪ ঘণ্টার বৃষ্টিপাত',
      soilMoisture: 'মাটির আর্দ্রতা',
      roadStatus: 'রাস্তার অবস্থা',
      viewMap: 'মানচিত্র দেখুন',
      reportAnIssue: 'রিপোর্ট করুন',
      openRiskScoring: 'ঝুঁকি ক্যালকুলেটর'
    },
    risk: {
      low: 'স্বাভাবিক',
      moderate: 'মাঝারি ঝুঁকি',
      high: 'উচ্চ ঝুঁকি',
      severe: 'চরম বিপদ',
      lowAdvisory: 'পরিস্থিতি স্বাভাবিক। নিয়মিত নজরদারি বজায় রাখুন।',
      moderateAdvisory: 'ঝুঁকি বৃদ্ধি পেয়েছে। স্থানীয় কর্মকর্তাদের পরিদর্শনের পরামর্শ।',
      highAdvisory: 'উচ্চ ঝুঁকির অবস্থা। রাস্তা চলাচলে সতর্কতা জারি করুন।',
      severeAdvisory: 'চরম বিপজ্জনক অবস্থা। অবিলম্বে নিরাপদ স্থানে সরে যান।'
    },
    report: {
      submitTitle: 'নাগরিক রিপোর্ট জমা দিন',
      locationDetected: 'অবস্থান শনাক্ত হয়েছে (GPS)',
      visualEvidence: 'দৃশ্যমান প্রমাণ (ছবি/ভিডিও)',
      uploadPrompt: 'ছবি আপলোড করুন',
      uploadHint: 'পাহাড়ের ঢাল, ফাটল বা জলের প্রবাহ স্পষ্টভাবে ছবি তুলুন।',
      descriptionLabel: 'আপনি কি দেখতে পাচ্ছেন?',
      descriptionPlaceholder: 'মাটির অবস্থা বা ফাটলের বিশদ বর্ণনা লিখুন...',
      submitButton: 'রিপোর্ট জমা দিন',
      receivedTitle: 'রিপোর্ট জমা হয়েছে',
      receivedText: 'ধন্যবাদ। আপনার রিপোর্টটি সরাসরি প্রশাসন পোর্টালে পাঠানো হয়েছে।',
      staySafeBadge: 'নিরাপদ থাকুন এবং ঝুঁকিপূর্ণ এলাকা থেকে দূরে থাকুন।',
      returnHome: 'ড্যাশবোর্ডে ফিরুন'
    },
    authority: {
      title: 'ঝুঁকিপূর্ণ অঞ্চল পর্যবেক্ষণ',
      subtitle: 'সংকটপূর্ণ এলাকা পর্যবেক্ষণ ও তাৎক্ষণিক এসএমএস সতর্কবার্তা পাঠান।',
      tabs: {
        overview: 'সারসংক্ষেপ',
        zones: 'ঝুঁকি অঞ্চল',
        reports: 'নাগরিক রিপোর্ট',
        settings: 'সেটিংস'
      },
      sendAlert: 'সতর্কতা পাঠান',
      sendAdvisory: 'পরামর্শ পাঠান',
      viewDetails: 'বিস্তারিত দেখুন'
    }
  }
};

export function getTranslation(lang = 'en') {
  return translations[lang] || translations.en;
}
