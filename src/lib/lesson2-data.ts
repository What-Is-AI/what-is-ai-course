export const CAT_RULE_IDS = [
  "fourLegs",
  "fur",
  "whiskers",
  "tail",
  "pointyEars",
  "meows",
  "claws",
  "smallBody",
] as const;

export type CatRuleId = (typeof CAT_RULE_IDS)[number];

export const DOG_SHARED_RULE_IDS: CatRuleId[] = [
  "fourLegs",
  "fur",
  "tail",
  "whiskers",
  "claws",
  "pointyEars",
];

export type CounterexampleResult =
  | "false-positive"
  | "false-negative"
  | "ambiguous";

export type CounterexampleMeta = {
  id: string;
  result: CounterexampleResult;
  image: string;
  skipIfAny?: CatRuleId[];
  requireAny?: CatRuleId[];
};

export const COUNTEREXAMPLES: CounterexampleMeta[] = [
  {
    id: "tiger",
    result: "false-positive",
    image: "/lesson2/your-rules-meet-reality/tiger.png",
    skipIfAny: ["meows", "smallBody"],
  },
  {
    id: "dog",
    result: "false-positive",
    image: "/lesson2/your-rules-meet-reality/dog.png",
    skipIfAny: ["meows"],
  },
  {
    id: "hairless",
    result: "false-negative",
    image: "/lesson2/your-rules-meet-reality/hairless-cat.png",
    requireAny: ["fur"],
  },
  {
    id: "lion-cub",
    result: "false-positive",
    image: "/lesson2/your-rules-meet-reality/lion-cub.png",
  },
  {
    id: "dark",
    result: "ambiguous",
    image: "/lesson2/your-rules-meet-reality/black-cat-dark.png",
  },
  {
    id: "upside-down",
    result: "ambiguous",
    image: "/lesson2/your-rules-meet-reality/cat-upside-down.png",
  },
];

export function isCatRuleId(value: string): value is CatRuleId {
  return (CAT_RULE_IDS as readonly string[]).includes(value);
}

export function pinnedHasSuggestion(
  pinned: string[],
  id: CatRuleId,
  label: string,
): boolean {
  const needleId = id.toLowerCase();
  const needleLabel = label.trim().toLowerCase();
  return pinned.some((rule) => {
    const hay = rule.trim().toLowerCase();
    return (
      hay === needleId ||
      hay === needleLabel ||
      (needleLabel.length > 0 && hay.includes(needleLabel))
    );
  });
}

export function customPinnedRules(
  rules: string[],
  suggestionLabels: Record<CatRuleId, string>,
): string[] {
  return rules.filter((rule) => {
    const hay = rule.trim().toLowerCase();
    if (!hay) return false;
    if (isCatRuleId(rule.trim())) return false;
    return !CAT_RULE_IDS.some((id) => {
      const label = suggestionLabels[id].trim().toLowerCase();
      return hay === label || hay.includes(label) || label.includes(hay);
    });
  });
}

export function counterexamplesForRules(
  rules: string[],
  suggestionLabels: Record<CatRuleId, string>,
): CounterexampleMeta[] {
  return COUNTEREXAMPLES.filter((ex) => {
    if (
      ex.skipIfAny?.some((id) =>
        pinnedHasSuggestion(rules, id, suggestionLabels[id]),
      )
    ) {
      return false;
    }
    if (
      ex.requireAny &&
      !ex.requireAny.some((id) =>
        pinnedHasSuggestion(rules, id, suggestionLabels[id]),
      )
    ) {
      return false;
    }
    return true;
  });
}

export const RULE_EXCEPTION_IDS = [
  "breeds",
  "lighting",
  "angles",
  "occlusion",
  "backgrounds",
  "kittens",
  "cartoons",
  "statues",
  "halfVisible",
  "rain",
  "snow",
  "motionBlur",
] as const;

export type TrainSampleMeta = {
  id: string;
  label: "cat" | "dog";
  image: string;
};

export const TRAIN_SAMPLES: TrainSampleMeta[] = [
  { id: "c1", label: "cat", image: "/lesson2/fluffy-orange-lounging.png" },
  { id: "d1", label: "dog", image: "/lesson2/golden-retriever-outdoors.png" },
  { id: "c2", label: "cat", image: "/lesson2/tabby-staring.png" },
  { id: "d2", label: "dog", image: "/lesson2/huskyinsnow.png" },
  { id: "c3", label: "cat", image: "/lesson2/black-cat-windowsill.png" },
  { id: "d3", label: "dog", image: "/lesson2/beagle-puppy.png" },
  { id: "c4", label: "cat", image: "/lesson2/siamese-sitting.png" },
  { id: "d4", label: "dog", image: "/lesson2/corgi-on-grass.png" },
];

export const TRAIN_TEST_IMAGE = {
  answer: "cat" as const,
  confidence: 97,
  image: "/lesson2/blurry-animal-sofa.png",
};

export const TRAIN_TRAP_TEST_IMAGE = {
  answer: "cat" as const,
  prediction: "dog" as const,
  confidence: 88,
  image: "/lesson2/cat-in-snow.png",
};

export type ApproachAnswer = "rules" | "learning" | "hybrid";

export type ApproachProblemMeta = {
  id: string;
  answer: ApproachAnswer;
};

export const APPROACH_PROBLEMS: ApproachProblemMeta[] = [
  { id: "traffic", answer: "rules" },
  { id: "speech", answer: "learning" },
  { id: "calculator", answer: "rules" },
  { id: "medical", answer: "learning" },
  { id: "sorting", answer: "rules" },
  { id: "spam", answer: "learning" },
  { id: "chess-classic", answer: "hybrid" },
  { id: "chess-modern", answer: "learning" },
];

export const TWIST_GUESS_IDS = ["idea", "math", "ready", "rules"] as const;

export const CHAIR_EXAMPLE_IDS = [
  "kitchen",
  "office",
  "beanBag",
  "wheelchair",
  "rock",
] as const;

export const INTERNET_STICKY_IDS = [
  "books",
  "wikipedia",
  "github",
  "news",
  "conversations",
  "websites",
] as const;
