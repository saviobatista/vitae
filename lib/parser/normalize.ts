import type { DatesLocale, NormalizeOptions } from "@/types";

/**
 * 1) Base cleanup: unicode, line breaks, spaces, dashes, paragraphs.
 */
export function normalizeWhitespace(input: string): string {
  const unicodeNormalized =
    typeof input.normalize === "function" ? input.normalize("NFKC") : input;

  const lineBreaksNormalized = unicodeNormalized.replace(/\r\n?/g, "\n");

  const spacesStandardized = lineBreaksNormalized.replace(/\u00A0|\t/g, " ");

  const lineEndsTrimmed = spacesStandardized
    .split("\n")
    .map((line) => line.replace(/[ ]+$/g, ""))
    .join("\n");

  const spacesCollapsed = lineEndsTrimmed.replace(/[ ]{2,}/g, " ");

  const dashesNormalized = spacesCollapsed.replace(/[–—]/g, "–");

  const paragraphsNormalized = dashesNormalized.replace(/\n{3,}/g, "\n\n");

  const result = paragraphsNormalized.trim();

  return result;
}

/**
 * Heuristics for joining:
 */
const isBullet = (line: string): boolean =>
  /^[\s]*([-*•–]\s+|\d+\.\s+)/.test(line);

const isCapsHeader = (line: string): boolean => {
  const clean = line.trim();
  if (clean === "") return false;
  const words = clean.split(/\s+/);
  if (words.length < 2) return false;
  const upperCount = words.filter(
    (w) => w.length > 1 && w === w.toUpperCase()
  ).length;
  return upperCount >= Math.max(2, Math.floor(words.length * 0.6));
};

const canJoinWithNext = (next: string): boolean =>
  next !== "" && !isBullet(next) && !isCapsHeader(next);

const joinPair = (curr: string, next: string): string =>
  /[A-Za-zÀ-ÿ]-$/.test(curr) ? curr.slice(0, -1) + next : `${curr} ${next}`;

/**
 * 2) Join lines that belong to the same sentence/section.
 */
export function smartJoinLines(input: string): string {
  const lines = input.split("\n").map((l) => l.trim());

  const process = (rest: string[], acc: string[]): string[] => {
    if (rest.length === 0) return acc;

    const curr = rest[0];
    if (curr === "") return process(rest.slice(1), acc.concat(""));

    const next = rest[1] ?? "";
    const shouldJoin = canJoinWithNext(next);

    if (shouldJoin) {
      const merged = joinPair(curr, next);
      return process([merged, ...rest.slice(2)], acc);
    }

    return process(rest.slice(1), acc.concat(curr));
  };

  return process(lines, []).join("\n");
}

/**
 * 3) Dates: normalize ranges using locale (i18n).
 */
const escapeForRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeConnectors = (s: string): string =>
  s.replace(/\s*(?:to|–|—|-)\s*/gi, " – ");

const buildRangeRegex = (locale: DatesLocale): RegExp => {
  const monthKeys = Object.keys(locale.months).map((k) => escapeForRegex(k));
  const openWords = locale.openRange.map((w) => escapeForRegex(w));
  const monthPattern = monthKeys.join("|");
  const yearPattern = "\\d{4}";
  return new RegExp(
    `(?<m1>${monthPattern})?\\s*(?<y1>${yearPattern})\\s*–\\s*(?:(?<m2>${monthPattern})?\\s*(?<y2>${yearPattern})|(?<open>${openWords.join("|")}))`,
    "gi"
  );
};

const replaceWithISO = (s: string, re: RegExp, locale: DatesLocale): string =>
  s.replace(
    re,
    (_m, _m1, _y1, _m2, _y2, _open, _i, _str, g: Record<string, string>) => {
      const y1 = g.y1;
      const m1 = g.m1 ? locale.months[String(g.m1).toLowerCase()] : null;
      const y2 = g.y2;
      const m2 = g.m2 ? locale.months[String(g.m2).toLowerCase()] : null;
      const open = g.open;

      const left = m1 ? `${y1}-${m1}` : y1;
      const right = open ? "Present" : m2 ? `${y2}-${m2}` : y2;

      return `${left} - ${right}`;
    }
  );

const normalizeYearToYear = (s: string): string =>
  s.replace(
    /(?<!\d)(\d{4})\s*[–-]\s*(\d{4})(?!\d)/g,
    (_m, a: string, b: string) => `${a} - ${b}`
  );

export function normalizeDateRanges(
  input: string,
  locale: DatesLocale
): string {
  const connectorsNormalized = normalizeConnectors(input);
  const rangeRegex = buildRangeRegex(locale);
  const monthYearNormalized = replaceWithISO(
    connectorsNormalized,
    rangeRegex,
    locale
  );
  const yearYearNormalized = normalizeYearToYear(monthYearNormalized);
  const result = yearYearNormalized;
  return result;
}

/** Merge extra open-range words from options into the locale (lowercased + unique). */
const mergeOpenRange = (
  locale: DatesLocale,
  opts?: NormalizeOptions
): DatesLocale => {
  if (!opts?.dateRangePattern || opts.dateRangePattern.length === 0)
    return locale;
  const extras = opts.dateRangePattern.map((w) => w.toLowerCase());
  const merged = Array.from(new Set([...(locale.openRange ?? []), ...extras]));
  return { months: locale.months, openRange: merged };
};

const DEFAULTS: Required<
  Pick<NormalizeOptions, "newlineWhiteSpace" | "joinLineSection">
> = {
  newlineWhiteSpace: true,
  joinLineSection: true,
};

export function normalizeBlock(input: string, locale: DatesLocale): string;
export function normalizeBlock(
  input: string,
  locale: DatesLocale,
  options: NormalizeOptions
): string;

export function normalizeBlock(
  input: string,
  locale: DatesLocale,
  options?: NormalizeOptions
): string {
  const opts = { ...DEFAULTS, ...(options ?? {}) };
  const effectiveLocale = mergeOpenRange(locale, options);

  const afterWhitespace = opts.newlineWhiteSpace
    ? normalizeWhitespace(input)
    : input;
  const afterJoin = opts.joinLineSection
    ? smartJoinLines(afterWhitespace)
    : afterWhitespace;
  const afterDates = normalizeDateRanges(afterJoin, effectiveLocale);

  return afterDates.trim();
}
