interface StorageService {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
}

interface Translation {
  result: string;
  inputText: string;
  from: {
    pronunciation: string;
  }
  examples: string[]

  // "definitions": {
  //   "verb": [
  //     {
  //       "definition": "perform (an action, the precise nature of which is often unspecified).",
  //       "example": "very little work has been done in this field",
  //       "synonyms": {
  //         "common": [
  //           "carry out undertake discharge execute perpetrate perform accomplish implement achieve complete finish conclude bring about engineer effect realize"
  //         ],
  //         "informal": [
  //           "pull off"
  //         ],
  //         "rare": [
  //           "effectuate"
  //         ]
  //       }
  //     },
  //     {
  //       "definition": "achieve or complete.",
  //       "example": "I never really got the chance to finish school or do my exams"
  //     },
  //     {
  //       "definition": "act or behave in a specified way.",
  //       "example": "they are free to do as they please",
  //       "synonyms": {
  //         "common": [
  //           "act behave conduct oneself acquit oneself"
  //         ],
  //         "rare": [
  //           "comport oneself deport oneself"
  //         ]
  //       }
  //     },
  //     {
  //       "definition": "be suitable or acceptable.",
  //       "example": "if he's anything like you, he'll do",
  //       "synonyms": {
  //         "common": [
  //           "suffice be adequate be satisfactory be acceptable be good enough be of use fill the bill fit the bill answer the purpose serve the purpose meet one's needs pass muster be enough be sufficient"
  //         ],
  //         "informal": [
  //           "make the grade cut the mustard be up to snuff"
  //         ]
  //       }
  //     },
  //     {
  //       "definition": "beat up or kill.",
  //       "labels": [
  //         "informal"
  //       ],
  //       "example": "he was the guy who did Maranzano"
  //     },
  //     {
  //       "definition": "used before a verb (except be, can, may, ought, shall, will ) in questions and negative statements.",
  //       "example": "do you have any pets?"
  //     },
  //     {
  //       "definition": "used to refer to a verb already mentioned.",
  //       "example": "he looks better than he did before"
  //     },
  //     {
  //       "definition": "used to give emphasis to a positive verb.",
  //       "example": "I do want to act on this"
  //     },
  //     {
  //       "definition": "used with inversion of a subject and verb when an adverbial phrase begins a clause for emphasis.",
  //       "example": "only rarely did they succumb"
  //     }
  //   ],
  //   "noun": [
  //     {
  //       "definition": "excrement.",
  //       "labels": [
  //         "informal"
  //       ],
  //       "example": "the air was rancid with the smell of donkey doo"
  //     },
  //     {
  //       "definition": "(in solmization) the first and eighth note of a major scale.",
  //       "labels": [
  //         "Music"
  //       ]
  //     }
  //   ],
  //   "abbreviation": [
  //     {
  //       "definition": "ditto."
  //     }
  //   ]
  // },
  // "translations": {
  //   "verb": [
  //     {
  //       "translation": "ver",
  //       "reversedTranslations": [
  //         "see",
  //         "view",
  //         "do",
  //         "look",
  //         "watch",
  //         "sight"
  //       ],
  //       "frequency": "uncommon"
  //     },
  //     {
  //       "translation": "realizar",
  //       "reversedTranslations": [
  //         "perform",
  //         "accomplish",
  //         "realize",
  //         "do",
  //         "achieve",
  //         "fulfill"
  //       ],
  //       "frequency": "uncommon"
  //     },
  //     {
  //       "translation": "trabalhar",
  //       "reversedTranslations": [
  //         "work",
  //         "labor",
  //         "function",
  //         "do",
  //         "cultivate",
  //         "dig"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "tratar",
  //       "reversedTranslations": [
  //         "treat",
  //         "deal",
  //         "process",
  //         "manage",
  //         "do",
  //         "attend"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "arranjar",
  //       "reversedTranslations": [
  //         "arrange",
  //         "get",
  //         "find",
  //         "fix",
  //         "make",
  //         "do"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "receber",
  //       "reversedTranslations": [
  //         "receive",
  //         "get",
  //         "welcome",
  //         "have",
  //         "accept",
  //         "do"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "preparar",
  //       "reversedTranslations": [
  //         "prepare",
  //         "ready",
  //         "make",
  //         "arrange",
  //         "draw up",
  //         "do"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "visitar",
  //       "reversedTranslations": [
  //         "visit",
  //         "do",
  //         "look up",
  //         "wait upon"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "estudar",
  //       "reversedTranslations": [
  //         "study",
  //         "learn",
  //         "read",
  //         "train",
  //         "do",
  //         "con"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "convir",
  //       "reversedTranslations": [
  //         "agree",
  //         "suit",
  //         "behoove",
  //         "fit",
  //         "be appropriate",
  //         "do"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "obsequiar",
  //       "reversedTranslations": [
  //         "favor",
  //         "treat",
  //         "gratify",
  //         "do",
  //         "favour"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "cozer",
  //       "reversedTranslations": [
  //         "cookdigest",
  //         "do",
  //         "decoct"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "cozinhar",
  //       "reversedTranslations": [
  //         "cookboil",
  //         "dress",
  //         "do"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "representar",
  //       "reversedTranslations": [
  //         "representact",
  //         "depict",
  //         "portray",
  //         "perform",
  //         "do"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "fazer",
  //       "reversedTranslations": [
  //         "do",
  //         "make",
  //         "cause",
  //         "perform",
  //         "create",
  //         "render"
  //       ],
  //       "frequency": "common"
  //     }
  //   ],
  //   "noun": [
  //     {
  //       "translation": "o logro",
  //       "reversedTranslations": [
  //         "shamhoax",
  //         "swindle",
  //         "bluff",
  //         "graft",
  //         "do"
  //       ],
  //       "frequency": "rare"
  //     },
  //     {
  //       "translation": "a mentira",
  //       "reversedTranslations": [
  //         "lielying",
  //         "falsehood",
  //         "untruth",
  //         "mendacity",
  //         "do"
  //       ],
  //       "frequency": "rare"
  //     }
  //   ]
  // }
}