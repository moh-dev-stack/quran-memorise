import type { Surah, Question } from "./types";
import adDuha from "@/data/surahs/ad-duha.json";
import alAsr from "@/data/surahs/al-asr.json";
import alKawthar from "@/data/surahs/al-kawthar.json";
import anNasr from "@/data/surahs/an-nasr.json";
import quraysh from "@/data/surahs/quraysh.json";
import alIkhlas from "@/data/surahs/al-ikhlas.json";
import alFil from "@/data/surahs/al-fil.json";
import alQadr from "@/data/surahs/al-qadr.json";
import alMasad from "@/data/surahs/al-masad.json";
import alFalaq from "@/data/surahs/al-falaq.json";
import alKafirun from "@/data/surahs/al-kafirun.json";
import anNas from "@/data/surahs/an-nas.json";
import alMaun from "@/data/surahs/al-maun.json";
import atTakathur from "@/data/surahs/at-takathur.json";
import azZalzalah from "@/data/surahs/az-zalzalah.json";
import alBayyinah from "@/data/surahs/al-bayyinah.json";
import atTin from "@/data/surahs/at-tin.json";
import ashSharh from "@/data/surahs/ash-sharh.json";
import alHumazah from "@/data/surahs/al-humazah.json";
import alMumtahanah from "@/data/surahs/al-mumtahanah.json";
import asSaff from "@/data/surahs/as-saff.json";
import alJumuah from "@/data/surahs/al-jumuah.json";
import alMunafiqun from "@/data/surahs/al-munafiqun.json";
import atTalaq from "@/data/surahs/at-talaq.json";
import atTahrim from "@/data/surahs/at-tahrim.json";
import alAdiyat from "@/data/surahs/al-adiyat.json";
import alQariah from "@/data/surahs/al-qariah.json";
import ashShams from "@/data/surahs/ash-shams.json";

/**
 * Loads a surah by its number
 * Supports multiple surahs
 */
export function loadSurah(surahNumber: number): Surah | null {
  switch (surahNumber) {
    case 60:
      return alMumtahanah as Surah;
    case 61:
      return asSaff as Surah;
    case 62:
      return alJumuah as Surah;
    case 63:
      return alMunafiqun as Surah;
    case 65:
      return atTalaq as Surah;
    case 66:
      return atTahrim as Surah;
    case 91:
      return ashShams as Surah;
    case 93:
      return adDuha as Surah;
    case 94:
      return ashSharh as Surah;
    case 95:
      return atTin as Surah;
    case 97:
      return alQadr as Surah;
    case 98:
      return alBayyinah as Surah;
    case 99:
      return azZalzalah as Surah;
    case 100:
      return alAdiyat as Surah;
    case 101:
      return alQariah as Surah;
    case 102:
      return atTakathur as Surah;
    case 103:
      return alAsr as Surah;
    case 104:
      return alHumazah as Surah;
    case 105:
      return alFil as Surah;
    case 106:
      return quraysh as Surah;
    case 107:
      return alMaun as Surah;
    case 108:
      return alKawthar as Surah;
    case 109:
      return alKafirun as Surah;
    case 110:
      return anNasr as Surah;
    case 111:
      return alMasad as Surah;
    case 112:
      return alIkhlas as Surah;
    case 113:
      return alFalaq as Surah;
    case 114:
      return anNas as Surah;
    default:
      return null;
  }
}

/**
 * Converts a surah into an array of questions
 */
export function surahToQuestions(surah: Surah): Question[] {
  return surah.verses.map((verse) => ({
    verse,
    surahNumber: surah.number,
    surahName: surah.name,
  }));
}

/**
 * Gets all questions for a surah
 */
export function getQuestionsForSurah(surahNumber: number): Question[] {
  const surah = loadSurah(surahNumber);
  if (!surah) {
    return [];
  }
  return surahToQuestions(surah);
}

/**
 * Gets a random question from a surah
 */
export function getRandomQuestion(surahNumber: number): Question | null {
  const questions = getQuestionsForSurah(surahNumber);
  if (questions.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

/**
 * Gets all available surahs
 * Returns surahs sorted by number
 */
export function getAvailableSurahs(): Surah[] {
  const surahNumbers = [
    60, 61, 62, 63, 65, 66, 91, 93, 94, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
  ];
  
  const surahs: Surah[] = [];
  for (const number of surahNumbers) {
    const surah = loadSurah(number);
    if (surah) {
      surahs.push(surah);
    }
  }
  
  return surahs.sort((a, b) => a.number - b.number);
}

