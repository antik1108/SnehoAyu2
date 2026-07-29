# Article Writing Guide — SnehoAyu Learning Hub

## Introduction

This guide is for the Bengali content author writing articles for **SnehoAyu**, a preterm
baby care app for mothers and families of low-birth-weight and premature infants in India.
Articles appear in the app's **Learning Hub** and are rendered with a Markdown processor
(`ReactMarkdown`). That means the structure you write in Markdown — headings, bullet lists,
bold text, blockquotes — becomes real visual hierarchy on the screen. Plain prose paragraphs
render as a wall of text. This guide shows you exactly what to write, with examples drawn
directly from the app's existing articles.

The target reader is a Bengali-speaking mother or family caregiver. Articles should be warm,
clear, and medically accurate. All clinical content must be approved by Dr. P. Ponnarasi
before publication.

---

## Markdown Basics

| Syntax | Name | What it produces |
|--------|------|-----------------|
| `## ` | Section heading | A bold, larger heading that breaks the article into named sections |
| `**bold**` | Bold text | Emphasised inline text — use for numbers, thresholds, and key terms |
| `- ` | Bullet list item | A visual list — one item per line, each starting with `- ` |
| `> ` | Warning callout | A highlighted block for urgent or danger-sign instructions |

---

## Section Headings (`##`)

Use a `##` heading to start each new logical section or topic. Think of it like a chapter
title. Every time the subject shifts — from one symptom category to another, from what to do
to what to watch for — start a new heading.

**When to use:** Any group of related sentences that belongs under a named topic. If you
would write a label like "Signs of a good latch:" as inline prose, make it a `##` heading
instead.

**Bengali example** (from `latching-basics`):

```
## ভালো লেচের লক্ষণ

- শিশুর মুখ বড় করে খোলা আছে
- স্তনবৃন্তের উপরে নিচের চেয়ে বেশি অ্যারিওলা দেখা যাচ্ছে
- থুতনি স্তন স্পর্শ করছে
- ধীর, গভীর চোষা এবং গেলার শব্দ শোনা যাচ্ছে
```

**Bengali example** (from `danger-signs-overview`):

```
## এখনই হাসপাতালে যান

## শীঘ্রই ডাক্তার দেখান (একই দিনে)
```

**Rule of thumb:** If the article has more than three paragraphs, it almost certainly needs
section headings.

---

## Bold Terms (`**...**`)

Wrap a word or phrase in double asterisks to make it bold. Use bold for:

- Clinical thresholds and numeric targets (temperatures, weights, frequencies)
- Key medical terms the reader must notice
- Short phrases that summarise the most important action

**When to use:** Sparingly — only the most important terms in a section. Do not bold entire
sentences.

**Bengali example** (from `tracking-growth`):

```
প্রথম ৭ দিন সামান্য ওজন কমা সম্পূর্ণ স্বাভাবিক — জন্মের ওজনের **৫ থেকে ১০%** পর্যন্ত।
**১৪ দিনের** মধ্যে শিশুর জন্মের ওজন ফিরে আসা উচিত।
```

**Bengali example** (from `kmc-benefits`):

```
- **শর্ট KMC:** প্রতিদিন প্রায় ৪ ঘণ্টা
- **এক্সটেন্ডেড KMC:** ৫ থেকে ৮ ঘণ্টা
- **লং KMC:** ৯ থেকে ১২ ঘণ্টা
- **কন্টিনিউয়াস KMC:** প্রতিদিন ১২ ঘণ্টার বেশি
```

**Bengali example** (from `infection-prevention`):

```
সাবান ও পানি দিয়ে সবসময় হাত ধুন — এটি **সংক্রমণ প্রতিরোধের সবচেয়ে কার্যকর উপায়**।
```

---

## Bullet Lists (`- `)

Use a bullet list whenever you have three or more parallel items — signs, steps, rules, or
options. Each item starts with `- ` (hyphen then space) on its own line. Do not chain items
together with commas in a sentence.

**When to use:** Enumerated signs, sequential steps where order matters less than
completeness, and grouped options. If you catch yourself writing "…এবং …এবং …এবং", that is
almost always a bullet list.

**Bengali example** (from `feeding-cues`):

```
## প্রাথমিক ক্ষুধার লক্ষণ

- চোখ খোলা এবং সজাগ ভাব
- মাথা ঘোরানো এবং রুটিং (মুখ নিয়ে এদিক-ওদিক তাকানো)
- হাত মুখে দেওয়া
- ঠোঁট চাটা বা চুষতে চাওয়া
- মুখ খুলে জিহ্বা বের করা
```

**Bengali example** (from `expressed-milk`):

```
## শিশু পর্যাপ্ত দুধ পাচ্ছে কি না

- ২৪ ঘণ্টায় অন্তত ৬ বার প্রস্রাব করছে
- খাওয়ার সময় গেলার শব্দ শোনা যাচ্ছে
- খাওয়ার পর স্তন নরম অনুভব হচ্ছে
- শিশু খাওয়ার পর তৃপ্ত মনে হচ্ছে
- প্রথম সপ্তাহের পর ওজন ধীরে ধীরে বাড়ছে
```

**Rule:** If the list has exactly two items, a sentence is fine. Three or more — use bullets.

---

## Warning Callouts (`> `)

Prefix each line with `> ` to create a highlighted blockquote callout. Use this exclusively
for danger signs and urgent instructions — content where a delay in action could harm the
baby.

**When to use:** Any instruction that begins with "এখনই…", "অবিলম্বে…", or "যদি এই লক্ষণ
দেখা দেয়…". Also use it for the single most important caution at the end of a section
(e.g., mastitis warning, missed vaccine instruction).

**Bengali example** (from `danger-signs-overview`):

```
> এখনই চিকিৎসা নিন — নিকটতম হাসপাতালে যান বা এখনই আপনার ASHA/ANM কর্মীকে ডাকুন — যদি
> শিশু নিচের যেকোনো লক্ষণ দেখায়:
> - খাওয়া বন্ধ করে দিয়েছে এবং ছুঁলে ঠান্ডা লাগছে
> - শ্বাসের হার মিনিটে ৩০-এর কম বা ৬০-এর বেশি
> - গোঁঙানি, বুক দেবে যাওয়া বা নাকের ছিদ্র ফুলছে
> - ঠোঁট, জিহ্বা বা ত্বক নীলাভ
```

**Bengali example** (from `cord-care`):

```
> নিচের কোনো লক্ষণ দেখলে এখনই চিকিৎসকের কাছে যান:
> - পুঁজ বের হচ্ছে
> - দুর্গন্ধ আসছে
> - নাভির গোড়ায় লালভাব বা ফোলা
```

**Bengali example** (from `breastfeeding-problems`):

```
> সংক্রমণের লক্ষণে সতর্ক থাকুন: ক্রমবর্ধমান ব্যথা, লালভাব, ফোলা বা জ্বর। এগুলো দেখা
> দিলে এখনই ডাক্তার দেখান — এটি ম্যাস্টাইটিস হতে পারে।
```

**Rule:** Do not use `>` for general advice or tips — only for genuine danger or urgency.
Overusing callouts makes real danger signs less visible.

---

## Full Example Article

The following excerpt combines all four patterns. It is drawn from the `danger-signs-overview`
article as reformatted for the app.

```markdown
শিশুর বিপদচিহ্ন জানা তার জীবন বাঁচাতে পারে।

## এখনই হাসপাতালে যান

> এখনই চিকিৎসা নিন — নিকটতম হাসপাতালে যান বা এখনই আপনার ASHA/ANM কর্মীকে ডাকুন —
> যদি শিশু নিচের যেকোনো লক্ষণ দেখায়:
> - খাওয়া বন্ধ করে দিয়েছে এবং ছুঁলে ঠান্ডা লাগছে
> - শ্বাসের হার মিনিটে **৩০-এর কম বা ৬০-এর বেশি**
> - গোঁঙানি, বুক দেবে যাওয়া বা নাকের ছিদ্র ফুলছে
> - ঠোঁট, জিহ্বা বা ত্বক নীলাভ
> - জ্বর বা ঠান্ডা (বগলের তাপমাত্রা **৩৭°C-এর বেশি বা ৩৬°C-এর কম**)
> - নাভির চারপাশে লালভাব, ফোলা, পুঁজ বা দুর্গন্ধ
> - যেকোনো খিঁচুনি বা কনভালশন
> - শরীর নেতিয়ে পড়েছে বা ঝুলে যাচ্ছে
> - শিশু নিষ্ক্রিয় এবং জাগানো খুব কঠিন

## শীঘ্রই ডাক্তার দেখান (একই দিনে)

- চোখের পাতা লাল বা ফোলা, পুঁজ বের হচ্ছে
- ত্বক বা চোখ হলুদ (জন্ডিস)
- অতিরিক্ত ঘুমন্ত, জাগানো খুব কঠিন, খাওয়া মিস হচ্ছে
- ক্রমাগত পাতলা পায়খানা

এই অ্যাপের বিপদচিহ্ন চেকারটি যেকোনো সময় ব্যবহার করুন। সন্দেহ হলেই চেক করুন।
```

Notice how the article uses:
- A plain introductory sentence (no heading needed for a single opener)
- `##` headings to separate the two urgency categories
- `>` callout for the immediate-action block
- `- ` bullets inside the callout for the individual signs
- `**bold**` for the specific numeric thresholds

---

## What to Avoid

**Walls of prose.** A paragraph that lists six danger signs as one long sentence is hard to
scan in an emergency. Break it into bullets.

```
✗  শিশুর শ্বাস কম বা বেশি হলে, ঠোঁট নীল হলে, খিঁচুনি হলে বা শরীর ঠান্ডা হলে এখনই হাসপাতালে যান।

✓  > এখনই হাসপাতালে যান যদি:
   > - শ্বাসের হার মিনিটে ৩০-এর কম বা ৬০-এর বেশি
   > - ঠোঁট বা ত্বক নীলাভ
   > - যেকোনো খিঁচুনি
   > - শরীর ঠান্ডা অনুভব হচ্ছে
```

**Inline section labels.** Writing "লক্ষণ:" as part of a paragraph hides the structure.
Promote it to a `##` heading.

```
✗  ভালো লেচের লক্ষণ: শিশুর মুখ বড় করে খোলা, থুতনি স্তন স্পর্শ করছে এবং গেলার শব্দ শোনা যাচ্ছে।

✓  ## ভালো লেচের লক্ষণ

   - শিশুর মুখ বড় করে খোলা
   - থুতনি স্তন স্পর্শ করছে
   - গেলার শব্দ শোনা যাচ্ছে
```

**Comma-separated lists.** Commas make items easy to miss. Use bullets.

```
✗  KMC-এর জন্য শিশুকে নরম টুপি, মোজা এবং সামনে খোলা ছোট জামা পরান এবং উভয় স্তনের মাঝে উল্লম্বভাবে রাখুন।

✓  - শিশুকে নরম টুপি পরান
   - মোজা পরান
   - সামনে খোলা ছোট জামা পরান
   - উভয় স্তনের মাঝে উল্লম্বভাবে রাখুন
```

**Nesting too deep.** The app styles one level of bullets cleanly. Avoid sub-bullets
(`  - ` nested under `- `) — they render inconsistently and clutter the screen on mobile.
If you feel the urge to nest, use a new `##` heading instead.

**Overusing bold.** Bold every third phrase and nothing stands out. Reserve it for the two
or three most important numbers or terms per section.

**Using `>` for tips.** The warning callout style signals danger. Using it for general
advice (e.g., "মনে রাখুন, KMC ভালো") trains the reader to ignore it. Save it for genuine
urgency.

---

*This guide is maintained alongside the app codebase. If you have questions about formatting
a specific article, contact the development team or refer to the reformatted examples in
`frontend/src/content/learningHubContent.ts`.*
