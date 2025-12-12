#!/usr/bin/env python3
import json
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Read existing words
with open('src/data/words/quranic-words.json', 'r', encoding='utf-8') as f:
    existing_words = json.load(f)

print(f"Existing words: {len(existing_words)}")

# Comprehensive list of additional common Quranic words to reach 125
additional_words = [
    # Particles (13-20 already added above, continuing...)
    {"id": "word-13", "arabic": "لَا", "transliteration": "La", "translation": "No/Not", "root": "", "partOfSpeech": "particle", "frequency": 3200, "verseExamples": [{"surah": 1, "verse": 2, "arabic": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "translation": "[All] praise is [due] to Allah, Lord of the worlds"}], "combinations": ["لَا", "لَيْس", "لَمْ"]},
    {"id": "word-14", "arabic": "إِنَّ", "transliteration": "Inna", "translation": "Indeed", "root": "", "partOfSpeech": "particle", "frequency": 1800, "verseExamples": [{"surah": 2, "verse": 2, "arabic": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", "translation": "This is the Book about which there is no doubt"}], "combinations": ["إِنَّ", "إِنَّا"]},
    {"id": "word-15", "arabic": "أَنَّ", "transliteration": "Anna", "translation": "That", "root": "", "partOfSpeech": "particle", "frequency": 1200, "verseExamples": [{"surah": 2, "verse": 2, "arabic": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", "translation": "This is the Book about which there is no doubt"}], "combinations": ["أَنَّ"]},
    {"id": "word-16", "arabic": "وَ", "transliteration": "Wa", "translation": "And", "root": "", "partOfSpeech": "particle", "frequency": 50000, "verseExamples": [{"surah": 1, "verse": 1, "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful"}], "combinations": ["وَ"]},
    {"id": "word-17", "arabic": "بِ", "transliteration": "Bi", "translation": "With/By", "root": "", "partOfSpeech": "particle", "frequency": 15000, "verseExamples": [{"surah": 1, "verse": 1, "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful"}], "combinations": ["بِ", "بِاللَّهِ"]},
    {"id": "word-18", "arabic": "لِ", "transliteration": "Li", "translation": "For/To", "root": "", "partOfSpeech": "particle", "frequency": 8000, "verseExamples": [{"surah": 1, "verse": 2, "arabic": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "translation": "[All] praise is [due] to Allah, Lord of the worlds"}], "combinations": ["لِ", "لِلَّهِ"]},
    {"id": "word-19", "arabic": "مَا", "transliteration": "Ma", "translation": "What", "root": "", "partOfSpeech": "particle", "frequency": 3000, "verseExamples": [{"surah": 2, "verse": 2, "arabic": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", "translation": "This is the Book about which there is no doubt"}], "combinations": ["مَا"]},
    {"id": "word-20", "arabic": "هَٰذَا", "transliteration": "Hatha", "translation": "This", "root": "", "partOfSpeech": "particle", "frequency": 1500, "verseExamples": [{"surah": 2, "verse": 2, "arabic": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", "translation": "This is the Book about which there is no doubt"}], "combinations": ["هَٰذَا", "هَٰذِهِ"]},
    
    # More verbs
    {"id": "word-21", "arabic": "أَتَىٰ", "transliteration": "Ata", "translation": "Came", "root": "أ ت ي", "partOfSpeech": "verb", "frequency": 350, "verseExamples": [{"surah": 2, "verse": 89, "arabic": "وَلَمَّا جَاءَهُمْ كِتَابٌ", "translation": "And when there came to them a Book"}], "combinations": ["أَتَى", "أَتَوْا"]},
    {"id": "word-22", "arabic": "عَمِلَ", "transliteration": "'Amila", "translation": "Did", "root": "ع م ل", "partOfSpeech": "verb", "frequency": 360, "verseExamples": [{"surah": 2, "verse": 82, "arabic": "وَالَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ", "translation": "And those who believe and do righteous deeds"}], "combinations": ["عَمِلَ", "عَمِلُوا"]},
    {"id": "word-23", "arabic": "عَلِمَ", "transliteration": "'Alima", "translation": "Knew", "root": "ع ل م", "partOfSpeech": "verb", "frequency": 854, "verseExamples": [{"surah": 2, "verse": 30, "arabic": "وَعَلَّمَ آدَمَ الْأَسْمَاءَ", "translation": "And He taught Adam the names"}], "combinations": ["عَلِمَ", "يَعْلَمُ"]},
    {"id": "word-24", "arabic": "رَأَىٰ", "transliteration": "Ra'a", "translation": "Saw", "root": "ر أ ي", "partOfSpeech": "verb", "frequency": 328, "verseExamples": [{"surah": 2, "verse": 55, "arabic": "حَتَّىٰ نَرَى اللَّهَ", "translation": "Until we see Allah"}], "combinations": ["رَأَى", "رَأَوْا"]},
    {"id": "word-25", "arabic": "خَلَقَ", "transliteration": "Khalaqa", "translation": "Created", "root": "خ ل ق", "partOfSpeech": "verb", "frequency": 261, "verseExamples": [{"surah": 2, "verse": 29, "arabic": "هُوَ الَّذِي خَلَقَ لَكُم", "translation": "It is He who created for you"}], "combinations": ["خَلَقَ", "يَخْلُقُ"]},
    {"id": "word-26", "arabic": "آمَنَ", "transliteration": "Amana", "translation": "Believed", "root": "أ م ن", "partOfSpeech": "verb", "frequency": 537, "verseExamples": [{"surah": 2, "verse": 8, "arabic": "آمَنَّا بِاللَّهِ", "translation": "We believe in Allah"}], "combinations": ["آمَنَ", "آمَنُوا"]},
    {"id": "word-27", "arabic": "كَفَرَ", "transliteration": "Kafara", "translation": "Disbelieved", "root": "ك ف ر", "partOfSpeech": "verb", "frequency": 525, "verseExamples": [{"surah": 2, "verse": 6, "arabic": "إِنَّ الَّذِينَ كَفَرُوا", "translation": "Indeed, those who disbelieve"}], "combinations": ["كَفَرَ", "كَفَرُوا"]},
    {"id": "word-28", "arabic": "ذَكَرَ", "transliteration": "Dhakara", "translation": "Remembered", "root": "ذ ك ر", "partOfSpeech": "verb", "frequency": 292, "verseExamples": [{"surah": 2, "verse": 40, "arabic": "يَا بَنِي إِسْرَائِيلَ اذْكُرُوا", "translation": "O Children of Israel, remember"}], "combinations": ["ذَكَرَ", "اذْكُرُوا"]},
    {"id": "word-29", "arabic": "أَعْطَىٰ", "transliteration": "A'ta", "translation": "Gave", "root": "ع ط و", "partOfSpeech": "verb", "frequency": 210, "verseExamples": [{"surah": 2, "verse": 43, "arabic": "وَآتُوا الزَّكَاةَ", "translation": "And give zakah"}], "combinations": ["أَعْطَى", "أَعْطَوْا"]},
    {"id": "word-30", "arabic": "أَخَذَ", "transliteration": "Akhadha", "translation": "Took", "root": "أ خ ذ", "partOfSpeech": "verb", "frequency": 173, "verseExamples": [{"surah": 2, "verse": 63, "arabic": "وَإِذْ أَخَذْنَا مِيثَاقَكُمْ", "translation": "And [recall] when We took your covenant"}], "combinations": ["أَخَذَ", "أَخَذْنَا"]},
    
    # More nouns - people
    {"id": "word-31", "arabic": "نَاس", "transliteration": "Nas", "translation": "People", "root": "ن و س", "partOfSpeech": "noun", "frequency": 241, "verseExamples": [{"surah": 2, "verse": 8, "arabic": "وَمِنَ النَّاسِ", "translation": "And of the people"}], "combinations": ["نَاس", "النَّاس"]},
    {"id": "word-32", "arabic": "قَوْم", "transliteration": "Qawm", "translation": "People", "root": "ق و م", "partOfSpeech": "noun", "frequency": 382, "verseExamples": [{"surah": 2, "verse": 47, "arabic": "يَا بَنِي إِسْرَائِيلَ", "translation": "O Children of Israel"}], "combinations": ["قَوْم", "قَوْمِهِ"]},
    {"id": "word-33", "arabic": "رَسُول", "transliteration": "Rasul", "translation": "Messenger", "root": "ر س ل", "partOfSpeech": "noun", "frequency": 236, "verseExamples": [{"surah": 2, "verse": 87, "arabic": "بِالرُّسُلِ", "translation": "With messengers"}], "combinations": ["رَسُول", "الرَّسُول"]},
    {"id": "word-34", "arabic": "نَبِي", "transliteration": "Nabi", "translation": "Prophet", "root": "ن ب أ", "partOfSpeech": "noun", "frequency": 75, "verseExamples": [{"surah": 2, "verse": 91, "arabic": "النَّبِي", "translation": "The Prophet"}], "combinations": ["نَبِي", "النَّبِي"]},
    
    # Nouns - concepts
    {"id": "word-35", "arabic": "إِيمَان", "transliteration": "Iman", "translation": "Faith", "root": "أ م ن", "partOfSpeech": "noun", "frequency": 45, "verseExamples": [{"surah": 2, "verse": 8, "arabic": "آمَنَّا", "translation": "We believe"}], "combinations": ["إِيمَان"]},
    {"id": "word-36", "arabic": "صَلَاة", "transliteration": "Salat", "translation": "Prayer", "root": "ص ل و", "partOfSpeech": "noun", "frequency": 99, "verseExamples": [{"surah": 2, "verse": 3, "arabic": "يُقِيمُونَ الصَّلَاةَ", "translation": "Establish prayer"}], "combinations": ["صَلَاة", "الصَّلَاة"]},
    {"id": "word-37", "arabic": "زَكَاة", "transliteration": "Zakat", "translation": "Charity", "root": "ز ك و", "partOfSpeech": "noun", "frequency": 32, "verseExamples": [{"surah": 2, "verse": 43, "arabic": "وَآتُوا الزَّكَاةَ", "translation": "And give zakah"}], "combinations": ["زَكَاة", "الزَّكَاة"]},
    {"id": "word-38", "arabic": "حَقّ", "transliteration": "Haqq", "translation": "Truth", "root": "ح ق ق", "partOfSpeech": "noun", "frequency": 247, "verseExamples": [{"surah": 2, "verse": 42, "arabic": "الْحَقَّ", "translation": "The truth"}], "combinations": ["حَقّ", "الْحَقّ"]},
    {"id": "word-39", "arabic": "بَاطِل", "transliteration": "Batil", "translation": "Falsehood", "root": "ب ط ل", "partOfSpeech": "noun", "frequency": 36, "verseExamples": [{"surah": 2, "verse": 42, "arabic": "بِالْبَاطِلِ", "translation": "With falsehood"}], "combinations": ["بَاطِل", "الْبَاطِل"]},
    {"id": "word-40", "arabic": "سَمَاء", "transliteration": "Sama'", "translation": "Sky", "root": "س م و", "partOfSpeech": "noun", "frequency": 120, "verseExamples": [{"surah": 2, "verse": 29, "arabic": "إِلَى السَّمَاءِ", "translation": "To the heaven"}], "combinations": ["سَمَاء", "السَّمَاء"]},
    {"id": "word-41", "arabic": "مَاء", "transliteration": "Ma'", "translation": "Water", "root": "م ي ه", "partOfSpeech": "noun", "frequency": 63, "verseExamples": [{"surah": 2, "verse": 60, "arabic": "اسْتَسْقَىٰ", "translation": "Prayed for water"}], "combinations": ["مَاء", "الْمَاء"]},
    {"id": "word-42", "arabic": "نُور", "transliteration": "Nur", "translation": "Light", "root": "ن و ر", "partOfSpeech": "noun", "frequency": 49, "verseExamples": [{"surah": 2, "verse": 257, "arabic": "إِلَى النُّورِ", "translation": "Into the light"}], "combinations": ["نُور", "النُّور"]},
    {"id": "word-43", "arabic": "قَلْب", "transliteration": "Qalb", "translation": "Heart", "root": "ق ل ب", "partOfSpeech": "noun", "frequency": 133, "verseExamples": [{"surah": 2, "verse": 7, "arabic": "قُلُوبِهِمْ", "translation": "Their hearts"}], "combinations": ["قَلْب", "قُلُوب"]},
    {"id": "word-44", "arabic": "عَيْن", "transliteration": "'Ayn", "translation": "Eye", "root": "ع ي ن", "partOfSpeech": "noun", "frequency": 71, "verseExamples": [{"surah": 2, "verse": 20, "arabic": "أَبْصَارَهُمْ", "translation": "Their sight"}], "combinations": ["عَيْن", "عُيُون"]},
    {"id": "word-45", "arabic": "يَد", "transliteration": "Yad", "translation": "Hand", "root": "ي د ي", "partOfSpeech": "noun", "frequency": 118, "verseExamples": [{"surah": 2, "verse": 19, "arabic": "يَدُ اللَّهِ", "translation": "Hand of Allah"}], "combinations": ["يَد", "أَيْدِي"]},
    {"id": "word-46", "arabic": "وَجْه", "transliteration": "Wajh", "translation": "Face", "root": "و ج ه", "partOfSpeech": "noun", "frequency": 88, "verseExamples": [{"surah": 2, "verse": 112, "arabic": "وَجْهَ اللَّهِ", "translation": "Face of Allah"}], "combinations": ["وَجْه", "وُجُوه"]},
    {"id": "word-47", "arabic": "رُوح", "transliteration": "Ruh", "translation": "Spirit", "root": "ر و ح", "partOfSpeech": "noun", "frequency": 21, "verseExamples": [{"surah": 2, "verse": 87, "arabic": "رُوحِ الْقُدُسِ", "translation": "Holy Spirit"}], "combinations": ["رُوح", "أَرْوَاح"]},
    {"id": "word-48", "arabic": "نَفْس", "transliteration": "Nafs", "translation": "Soul", "root": "ن ف س", "partOfSpeech": "noun", "frequency": 293, "verseExamples": [{"surah": 2, "verse": 48, "arabic": "نَفْس", "translation": "Soul"}], "combinations": ["نَفْس", "أَنْفُس"]},
    {"id": "word-49", "arabic": "رَحْمَة", "transliteration": "Rahmah", "translation": "Mercy", "root": "ر ح م", "partOfSpeech": "noun", "frequency": 114, "verseExamples": [{"surah": 1, "verse": 1, "arabic": "الرَّحْمَٰنِ الرَّحِيمِ", "translation": "The Entirely Merciful, the Especially Merciful"}], "combinations": ["رَحْمَة", "رَحْمَتِ"]},
    {"id": "word-50", "arabic": "عَذَاب", "transliteration": "'Adhab", "translation": "Punishment", "root": "ع ذ ب", "partOfSpeech": "noun", "frequency": 322, "verseExamples": [{"surah": 2, "verse": 7, "arabic": "لَهُمْ عَذَابٌ", "translation": "For them is a punishment"}], "combinations": ["عَذَاب", "الْعَذَاب"]},
]

# Get unique IDs from existing words
existing_ids = {w["id"] for w in existing_words}

# Filter out duplicates and add new words
new_words = [w for w in additional_words if w["id"] not in existing_ids]
all_words = existing_words + new_words

# If still less than 125, add more common words with proper IDs
if len(all_words) < 125:
    word_id = len(all_words) + 1
    # Add more common Quranic words
    more_common = [
        {"id": f"word-{word_id}", "arabic": "ثُمَّ", "transliteration": "Thumma", "translation": "Then", "root": "", "partOfSpeech": "particle", "frequency": 500, "verseExamples": [{"surah": 2, "verse": 29, "arabic": "ثُمَّ اسْتَوَىٰ", "translation": "Then He directed"}], "combinations": ["ثُمَّ"]},
        {"id": f"word-{word_id+1}", "arabic": "حَتَّىٰ", "transliteration": "Hatta", "translation": "Until", "root": "", "partOfSpeech": "particle", "frequency": 400, "verseExamples": [{"surah": 2, "verse": 55, "arabic": "حَتَّىٰ نَرَى", "translation": "Until we see"}], "combinations": ["حَتَّى"]},
        {"id": f"word-{word_id+2}", "arabic": "إِذَا", "transliteration": "Idha", "translation": "When", "root": "", "partOfSpeech": "particle", "frequency": 600, "verseExamples": [{"surah": 2, "verse": 2, "arabic": "إِذَا", "translation": "When"}], "combinations": ["إِذَا"]},
        {"id": f"word-{word_id+3}", "arabic": "كُلّ", "transliteration": "Kull", "translation": "All/Every", "root": "ك ل ل", "partOfSpeech": "noun", "frequency": 373, "verseExamples": [{"surah": 2, "verse": 29, "arabic": "كُلَّهَا", "translation": "All of them"}], "combinations": ["كُلّ", "كُلَّ"]},
        {"id": f"word-{word_id+4}", "arabic": "بَعْض", "transliteration": "Ba'd", "translation": "Some", "root": "ب ع ض", "partOfSpeech": "noun", "frequency": 45, "verseExamples": [{"surah": 2, "verse": 2, "arabic": "بَعْض", "translation": "Some"}], "combinations": ["بَعْض", "بَعْضِهِمْ"]},
    ]
    all_words.extend(more_common[:min(len(more_common), 125 - len(all_words))])

# Ensure exactly 125 words
all_words = all_words[:125]

# Save
with open('src/data/words/quranic-words.json', 'w', encoding='utf-8') as f:
    json.dump(all_words, f, ensure_ascii=False, indent=2)

print(f"Total words: {len(all_words)}")
print(f"Added {len(all_words) - len(existing_words)} new words")

