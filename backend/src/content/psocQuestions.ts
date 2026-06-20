import type { KnowledgeLanguage } from './knowledgeQuestions.js';

export const PSOC_MAX_SCORE = 102;
export type PsocQuestionId =
  | 'q1' | 'q2' | 'q3' | 'q4' | 'q5'
  | 'q6' | 'q7' | 'q8' | 'q9' | 'q10'
  | 'q11' | 'q12' | 'q13' | 'q14' | 'q15'
  | 'q16' | 'q17';
export type PsocResponseValue = 1 | 2 | 3 | 4 | 5 | 6;
export type PsocScoringDirection = 'direct' | 'reverse';
export type PsocContentStatus = 'approved' | 'approval_required' | 'draft_from_prd_summary';

export interface PsocQuestion {
  id: PsocQuestionId;
  order: number;
  text: Partial<Record<KnowledgeLanguage, string>>;
  scoringDirection: PsocScoringDirection;
  subscale: 'efficacy' | 'satisfaction';
  contentStatus: PsocContentStatus;
}

/**
 * Parenting Sense of Competence (PSOC) Scale — 17 items (PRD Tool V).
 * Bengali/Hindi text are working translations pending final researcher
 * validation; English wording and item order/scoring match the PRD exactly.
 */
export const psocQuestions: PsocQuestion[] = [
  { id: 'q1', order: 1, text: { en: 'Problems of child care are easy once you understand your child', bn: 'একবার আপনি আপনার সন্তানকে বুঝে গেলে শিশু পরিচর্যার সমস্যাগুলি সহজ হয়ে যায়', hi: 'एक बार जब आप अपने बच्चे को समझ जाते हैं तो बच्चे की देखभाल की समस्याएँ आसान हो जाती हैं' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'approved' },
  { id: 'q2', order: 2, text: { en: 'Frustrated now while child is at this age', bn: 'সন্তান এই বয়সে থাকায় আমি এখন হতাশ বোধ করি', hi: 'बच्चा इस उम्र में है, इसलिए अभी मैं निराश महसूस करता/करती हूँ' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q3', order: 3, text: { en: 'Go to bed same as wake up - not accomplished much', bn: 'যেমন ঘুম থেকে উঠি তেমনই ঘুমাতে যাই - তেমন কিছু করতে পারিনি', hi: 'जैसे जागता/जागती हूँ वैसे ही सोने चला जाता/जाती हूँ - ज़्यादा कुछ हासिल नहीं कर पाया/पाई' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q4', order: 4, text: { en: "Feel like I'm being manipulated when I should be in control", bn: 'নিয়ন্ত্রণে থাকা উচিত হলেও মনে হয় আমাকে নিয়ন্ত্রণ করা হচ্ছে', hi: 'जब मुझे नियंत्रण में होना चाहिए तब लगता है कि मुझे नियंत्रित किया जा रहा है' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q5', order: 5, text: { en: 'My mother was better prepared than I am', bn: 'আমার মা আমার চেয়ে বেশি প্রস্তুত ছিলেন', hi: 'मेरी माँ मुझसे बेहतर तैयार थीं' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q6', order: 6, text: { en: 'I would be a fine model for a new mother', bn: 'আমি একজন নতুন মায়ের জন্য একটি ভালো উদাহরণ হতে পারি', hi: 'मैं एक नई माँ के लिए एक अच्छा उदाहरण बन सकता/सकती हूँ' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'approved' },
  { id: 'q7', order: 7, text: { en: 'Being a parent is manageable, problems easily solved', bn: 'অভিভাবক হওয়া সামলানো যায়, সমস্যাগুলি সহজেই সমাধান করা যায়', hi: 'माता-पिता बनना संभाला जा सकता है, समस्याएँ आसानी से हल हो जाती हैं' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'approved' },
  { id: 'q8', order: 8, text: { en: "Difficult not knowing if you're doing a good or bad job", bn: 'আমি ভালো নাকি খারাপ করছি তা না জানা কঠিন', hi: 'यह न जान पाना मुश्किल है कि मैं अच्छा कर रहा/रही हूँ या बुरा' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q9', order: 9, text: { en: "Sometimes I feel I'm not getting anything done", bn: 'কখনও কখনও মনে হয় আমি কিছুই করতে পারছি না', hi: 'कभी-कभी मुझे लगता है कि मैं कुछ भी पूरा नहीं कर पा रहा/रही हूँ' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q10', order: 10, text: { en: 'I meet my personal expectations for caring for my child', bn: 'আমি আমার সন্তানের যত্নের জন্য নিজের প্রত্যাশা পূরণ করি', hi: 'मैं अपने बच्चे की देखभाल के लिए अपनी व्यक्तिगत अपेक्षाओं को पूरा करता/करती हूँ' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'approved' },
  { id: 'q11', order: 11, text: { en: 'If anyone can find the answer for my child, I am the one', bn: 'আমার সন্তানের জন্য কেউ যদি উত্তর খুঁজে পায়, সেটা আমি', hi: 'अगर कोई मेरे बच्चे के लिए जवाब ढूँढ सकता है, तो वह मैं ही हूँ' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'approved' },
  { id: 'q12', order: 12, text: { en: 'My talents and interests are in other areas, not parenting', bn: 'আমার দক্ষতা ও আগ্রহ অন্য ক্ষেত্রে, সন্তান পালনে নয়', hi: 'मेरी प्रतिभा और रुचियाँ अन्य क्षेत्रों में हैं, पालन-पोषण में नहीं' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q13', order: 13, text: { en: 'I feel thoroughly familiar with this role', bn: 'আমি এই ভূমিকার সাথে পুরোপুরি পরিচিত বোধ করি', hi: 'मैं इस भूमिका से पूरी तरह परिचित महसूस करता/करती हूँ' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'approved' },
  { id: 'q14', order: 14, text: { en: "If parenting were more interesting, I'd be more motivated", bn: 'সন্তান পালন আরও আকর্ষণীয় হলে আমি আরও উৎসাহিত হতাম', hi: 'अगर पालन-पोषण ज़्यादा दिलचस्प होता, तो मैं ज़्यादा प्रेरित होता/होती' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q15', order: 15, text: { en: 'I have all the skills necessary to be a good mother', bn: 'একজন ভালো মা হওয়ার জন্য প্রয়োজনীয় সব দক্ষতা আমার আছে', hi: 'एक अच्छी माँ बनने के लिए ज़रूरी सभी कौशल मुझमें हैं' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'approved' },
  { id: 'q16', order: 16, text: { en: 'Being a parent makes me tense and anxious', bn: 'অভিভাবক হওয়া আমাকে উদ্বিগ্ন ও চিন্তিত করে তোলে', hi: 'माता-पिता बनना मुझे तनावग्रस्त और चिंतित कर देता है' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'approved' },
  { id: 'q17', order: 17, text: { en: 'Being a good mother is a reward in itself', bn: 'একজন ভালো মা হওয়াটাই নিজে একটা পুরস্কার', hi: 'एक अच्छी माँ होना अपने आप में एक पुरस्कार है' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'approved' },
];

export const psocScale: Array<{
  value: PsocResponseValue;
  label: Record<KnowledgeLanguage, string>;
}> = [
  { value: 1, label: { en: 'Strongly Disagree', bn: 'একেবারেই একমত নই', hi: 'बिल्कुल सहमत नहीं' } },
  { value: 2, label: { en: 'Disagree', bn: 'একমত নই', hi: 'सहमत नहीं' } },
  { value: 3, label: { en: 'Slightly Disagree', bn: 'কিছুটা একমত নই', hi: 'कुछ हद तक सहमत नहीं' } },
  { value: 4, label: { en: 'Slightly Agree', bn: 'কিছুটা একমত', hi: 'कुछ हद तक सहमत' } },
  { value: 5, label: { en: 'Agree', bn: 'একমত', hi: 'सहमत' } },
  { value: 6, label: { en: 'Strongly Agree', bn: 'সম্পূর্ণ একমত', hi: 'पूरी तरह सहमत' } },
];

export function isPsocContentReady(): boolean {
  return psocQuestions.every((question) => (
    question.contentStatus === 'approved'
    && question.text.en
    && question.text.bn
    && question.text.hi
  ));
}
