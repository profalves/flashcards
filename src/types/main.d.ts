interface StorageService {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
}

interface Translation {
  result: string;
  inputText: string;
  from: {
    pronunciation: string | null;
  };
  examples: string[];
}

interface TranslationResponse {
  id: string;
  from: string;
  to: string;
  input: string[];
  correctedText: null;
  translation: string[];
  engines: string[];
  languageDetection: LanguageDetection;
  contextResults: ContextResults;
  truncated: boolean;
  timeTaken: number;
}

interface ContextResults {
  rudeWords: boolean;
  colloquialisms: boolean;
  riskyWords: boolean;
  results: Result[];
  totalContextCallsMade: number;
  timeTakenContext: number;
}

interface Result {
  translation: string;
  sourceExamples: string[];
  targetExamples: string[];
  rude: boolean;
  colloquial: boolean;
  partOfSpeech: null | string;
  frequency: number;
  vowels: null;
  transliteration: null;
}

interface LanguageDetection {
  detectedLanguage: string;
  isDirectionChanged: boolean;
  originalDirection: string;
  originalDirectionContextMatches: number;
  changedDirectionContextMatches: number;
  timeTaken: number;
}

//   {
//     "id": "41286001-4462-4b3f-982b-25c478874382",
//     "from": "eng",
//     "to": "por",
//     "input": [
//         "freak"
//     ],
//     "correctedText": null,
//     "translation": [
//         "aberração"
//     ],
//     "engines": [
//         "Context"
//     ],
//     "languageDetection": {
//         "detectedLanguage": "eng",
//         "isDirectionChanged": false,
//         "originalDirection": "eng-por",
//         "originalDirectionContextMatches": 4586,
//         "changedDirectionContextMatches": 0,
//         "timeTaken": 38
//     },
//     "contextResults": {
//         "rudeWords": false,
//         "colloquialisms": true,
//         "riskyWords": false,
//         "results": [
//             {
//                 "translation": "aberração",
//                 "sourceExamples": [],
//                 "targetExamples": [],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "nf.",
//                 "frequency": 1492,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "anormal",
//                 "sourceExamples": [],
//                 "targetExamples": [],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "nmf.",
//                 "frequency": 344,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "louco",
//                 "sourceExamples": [],
//                 "targetExamples": [],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "adj./nm.",
//                 "frequency": 267,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "maluco",
//                 "sourceExamples": [
//                     "He thinks you made quite an impression on the <em>freak</em>.",
//                     "I don't get the fact that my fiancé behaves like a <em>freak</em>."
//                 ],
//                 "targetExamples": [
//                     "Ele acha que você causou uma impressão e tanta no <em>maluco</em>.",
//                     "Não percebo porque é que o meu noivo se comporta como um <em>maluco</em>."
//                 ],
//                 "rude": false,
//                 "colloquial": true,
//                 "partOfSpeech": "nm.",
//                 "frequency": 264,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "assustar",
//                 "sourceExamples": [
//                     "His irrational behavior had a tendency to <em>freak</em> out his colleagues.",
//                     "I didn't mean to <em>freak</em> out the kids with that loud noise.",
//                     "His well-timed prank was set up to <em>freak</em> out his unsuspecting friends.",
//                     "The ghost stories around the campfire were meant to <em>freak</em> out the younger campers.",
//                     "And the rumors are starting to <em>freak</em> the people out."
//                 ],
//                 "targetExamples": [
//                     "O comportamento irracional dele tinha a tendência de <em>assustar</em> os colegas.",
//                     "Eu não quis <em>assustar</em> as crianças com aquele barulho alto.",
//                     "A pegadinha bem cronometrada foi armada para <em>assustar</em> seus amigos desprevenidos.",
//                     "As histórias de fantasmas ao redor da fogueira eram para <em>assustar</em> os campistas mais jovens.",
//                     "E os rumores estão começando a <em>assustar</em> as pessoas fora."
//                 ],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "v.",
//                 "frequency": 261,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "surtar",
//                 "sourceExamples": [],
//                 "targetExamples": [],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "v.",
//                 "frequency": 247,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "esquisito",
//                 "sourceExamples": [],
//                 "targetExamples": [],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "adj./nm.",
//                 "frequency": 231,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "passar-se",
//                 "sourceExamples": [],
//                 "targetExamples": [],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "v.",
//                 "frequency": 146,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "estranho",
//                 "sourceExamples": [],
//                 "targetExamples": [],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "adj.",
//                 "frequency": 145,
//                 "vowels": null,
//                 "transliteration": null
//             },
//             {
//                 "translation": "pirar",
//                 "sourceExamples": [],
//                 "targetExamples": [],
//                 "rude": false,
//                 "colloquial": false,
//                 "partOfSpeech": "v.",
//                 "frequency": 140,
//                 "vowels": null,
//                 "transliteration": null
//             }
//         ],
//         "totalContextCallsMade": 1,
//         "timeTakenContext": 0
//     },
//     "truncated": false,
//     "timeTaken": 38
// }
