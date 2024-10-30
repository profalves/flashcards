import { UUID } from "crypto";

export type ITranslationService = {
  translate(
    text: string,
    from?: string,
    to?: string
  ): Promise<TranslationServiceResult>;
};

export type TranslationServiceResult = {
  inputText: string;
  result: TranslationResponse;
};

export type TranslationResponse = {
  id: UUID;
  input: string[];
  from: string;
  to: string;
  translation: string[];
  engines: string[];
  languageDetection: LanguageDetection;
  contextResults: ContextResults;
  correctedText?: string;
  pronunciation?: string;
};

type LanguageDetection = {
  detectedLanguage: string;
  isDirectionChanged: boolean;
  originalDirection: string;
};

type ContextResults = {
  rudeWords: boolean;
  colloquialisms: boolean;
  riskyWords: boolean;
  results: TranslationResults[];
};

type TranslationResults = {
  translation: string;
  sourceExamples: string[];
};

export type Translation = {
  result: string;
  examples: string[];
  inputText: string;
  from?: {
    pronunciation: string;
  };
};

// {
//   "id": "2c353df1-5a01-4d9a-9add-75d35d00ba67",
//   "from": "eng",
//   "to": "por",
//   "input": [
//       "ball"
//   ],
//   "correctedText": null,
//   "translation": [
//       "bola"
//   ],
//   "engines": [
//       "Context"
//   ],
//   "languageDetection": {
//       "detectedLanguage": "eng",
//       "isDirectionChanged": false,
//       "originalDirection": "eng-por",
//       "originalDirectionContextMatches": 44910,
//       "changedDirectionContextMatches": 0,
//       "timeTaken": 35
//   },
//   "contextResults": {
//       "rudeWords": false,
//       "colloquialisms": false,
//       "riskyWords": false,
//       "results": [
//           {
//               "translation": "bola",
//               "sourceExamples": [
//                   "She watched as the quarterback prepared to hand off the <em>ball</em>.",
//                   "He struggled to pump up the large beach <em>ball</em> by himself.",
//                   "As the defender approached, he decided to hand off the <em>ball</em>.",
//                   "In football, the player must hand off the <em>ball</em> skillfully.",
//                   "Surrounded by debris, the wrecking <em>ball</em> continued its destructive path.",
//                   "The bounced soccer <em>ball</em> landed near the goal, making everyone cheer.",
//                   "With a strong follow through, the golf <em>ball</em> soared across the course.",
//                   "He faked a pass and opted to hand off the <em>ball</em> instead.",
//                   "Please pump up the soccer <em>ball</em> so we can start the game."
//               ],
//               "targetExamples": [
//                   "Ela viu quando o quarterback se preparou para passar a <em>bola</em>.",
//                   "Ele teve dificuldade para encher a grande <em>bola</em> de praia sozinho.",
//                   "Quando o defensor se aproximou, ele decidiu passar a <em>bola</em>.",
//                   "No futebol americano, o jogador deve passar a <em>bola</em> com habilidade.",
//                   "Cercada por destroços, a <em>bola</em> de demolição continuou seu caminho destrutivo.",
//                   "A <em>bola</em> de futebol rebatida caiu perto do gol, fazendo todos vibrarem.",
//                   "Com um movimento bem executado, a <em>bola</em> de golfe voou pelo campo.",
//                   "Ele fingiu um passe e optou por passar a <em>bola</em> em vez disso.",
//                   "Por favor, encha a <em>bola</em> de futebol para podermos começar o jogo."
//               ],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nf.",
//               "frequency": 38390,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "esfera",
//               "sourceExamples": [],
//               "targetExamples": [],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nf.",
//               "frequency": 4818,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "baile",
//               "sourceExamples": [
//                   "She felt like royalty in her dress-up gown at the <em>ball</em>."
//               ],
//               "targetExamples": [
//                   "Ela se sentiu como realeza em seu vestido no <em>baile</em>."
//               ],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nm.",
//               "frequency": 3027,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "esférico",
//               "sourceExamples": [],
//               "targetExamples": [],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nm.",
//               "frequency": 351,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "novelo",
//               "sourceExamples": [],
//               "targetExamples": [],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nm.",
//               "frequency": 102,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "bala",
//               "sourceExamples": [],
//               "targetExamples": [],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nm.",
//               "frequency": 88,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "saco",
//               "sourceExamples": [],
//               "targetExamples": [],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nm.",
//               "frequency": 66,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "beisebol",
//               "sourceExamples": [],
//               "targetExamples": [],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nm.",
//               "frequency": 56,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "basebol",
//               "sourceExamples": [],
//               "targetExamples": [],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nm.",
//               "frequency": 45,
//               "vowels": null,
//               "transliteration": null
//           },
//           {
//               "translation": "mosquete",
//               "sourceExamples": [],
//               "targetExamples": [],
//               "rude": false,
//               "colloquial": false,
//               "partOfSpeech": "nm.",
//               "frequency": 40,
//               "vowels": null,
//               "transliteration": null
//           }
//       ],
//       "totalContextCallsMade": 1,
//       "timeTakenContext": 0
//   },
//   "truncated": false,
//   "timeTaken": 35
// }
