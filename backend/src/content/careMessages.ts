export interface CareMessageContent {
  weekNumber: number;
  type: 'daily' | 'weekly_audio';
  textBn: string;
  textHi?: string;
  textEn?: string;
}

/**
 * Rotating weekly care tips (PRD Section 5.13). A full deployment needs 180
 * unique daily messages reviewed by the researcher; this seed set rotates
 * one tip per study week (1-26) and is designed to be extended without
 * changing the lookup contract (`weekNumber`, `type`).
 */
export const careMessages: CareMessageContent[] = [
  { weekNumber: 1, type: 'daily', textBn: 'প্রতিদিন কমপক্ষে ১-২ ঘণ্টা ক্যাঙ্গারু কেয়ার করুন।', textEn: 'Do at least 1-2 hours of Kangaroo Care every day.' },
  { weekNumber: 1, type: 'weekly_audio', textBn: 'এই সপ্তাহের অডিও: ক্যাঙ্গারু কেয়ারের মূল বিষয়।', textEn: 'This week\'s audio: KMC basics.' },
  { weekNumber: 2, type: 'daily', textBn: 'শিশুর খাওয়ানোর সংকেত লক্ষ্য করুন - কান্নার আগেই খাওয়ান।', textEn: 'Watch for feeding cues — feed before crying starts.' },
  { weekNumber: 2, type: 'weekly_audio', textBn: 'এই সপ্তাহের অডিও: খাওয়ানোর সংকেত চেনা।', textEn: 'This week\'s audio: Recognizing feeding cues.' },
  { weekNumber: 3, type: 'daily', textBn: 'প্রতিদিন সকাল ও সন্ধ্যায় শিশুর তাপমাত্রা পরীক্ষা করুন।', textEn: 'Check your baby\'s temperature every morning and evening.' },
  { weekNumber: 3, type: 'weekly_audio', textBn: 'এই সপ্তাহের অডিও: তাপমাত্রা নিয়ন্ত্রণ কেন গুরুত্বপূর্ণ।', textEn: 'This week\'s audio: Why temperature control matters.' },
  { weekNumber: 4, type: 'daily', textBn: 'নাভির যত্ন: শুকনো ও পরিষ্কার রাখুন।', textEn: 'Cord care: keep it clean and dry.' },
  { weekNumber: 4, type: 'weekly_audio', textBn: 'এই সপ্তাহের অডিও: বিপদ চিহ্ন চেনা।', textEn: 'This week\'s audio: Recognizing danger signs.' },
  { weekNumber: 5, type: 'daily', textBn: 'শিশুর ওজন নিয়মিত পরিমাপ করুন এবং অগ্রগতি লিখে রাখুন।', textEn: 'Weigh your baby regularly and track progress.' },
  { weekNumber: 6, type: 'daily', textBn: 'টিকার সময়সূচী মেনে চলুন - জন্ম তারিখ অনুযায়ী।', textEn: 'Follow the vaccination schedule based on birth date.' },
  { weekNumber: 7, type: 'daily', textBn: 'নিজের মানসিক স্বাস্থ্যের যত্ন নিন - প্রয়োজনে সাহায্য চান।', textEn: 'Take care of your own mental health — ask for help if needed.' },
  { weekNumber: 8, type: 'daily', textBn: 'শিশুর ত্বকের যত্ন নিন, হালকা গরম পানিতে স্নান করান।', textEn: 'Take care of your baby\'s skin with gentle, lukewarm baths.' },
];

export function getTodayMessage(weekNumber: number, language: 'bn' | 'hi' | 'en'): string | null {
  const clampedWeek = Math.max(1, Math.min(weekNumber, 26));
  const message = careMessages.find((m) => m.weekNumber === clampedWeek && m.type === 'daily')
    ?? careMessages[(clampedWeek - 1) % careMessages.length];

  if (!message) return null;
  if (language === 'en' && message.textEn) return message.textEn;
  if (language === 'hi' && message.textHi) return message.textHi;
  return message.textBn;
}

export function getWeeklyAudioMessage(weekNumber: number, language: 'bn' | 'hi' | 'en'): string | null {
  const clampedWeek = Math.max(1, Math.min(weekNumber, 26));
  const message = careMessages.find((m) => m.weekNumber === clampedWeek && m.type === 'weekly_audio');
  if (!message) return null;
  if (language === 'en' && message.textEn) return message.textEn;
  if (language === 'hi' && message.textHi) return message.textHi;
  return message.textBn;
}
