/**
 * Generate stable unique IDs for options
 * Uses a combination of content hash and index to ensure uniqueness
 */

/**
 * Simple hash function for strings
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a stable ID for an option based on its content
 */
export function generateOptionId(
  content: string,
  index: number,
  prefix?: string
): string {
  const hash = hashString(content);
  const prefixStr = prefix ? `${prefix}-` : "";
  return `${prefixStr}${hash}-${index}`;
}

/**
 * Generate IDs for multiple options
 */
export function generateOptionIds(
  contents: string[],
  prefix?: string
): string[] {
  return contents.map((content, index) =>
    generateOptionId(content, index, prefix)
  );
}

/**
 * Generate ID for Arabic + Transliteration option
 */
export function generateArabicTransOptionId(
  arabic: string,
  transliteration: string,
  index: number
): string {
  const combined = `${arabic}::${transliteration}`;
  return generateOptionId(combined, index, "arabic-trans");
}

