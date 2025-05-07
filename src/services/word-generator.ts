const FALLBACK_WORDS = [
  "apple", "brave", "crane", "drive", "early", "flame", "grape", "haste", "image", "jolly",
  "knock", "light", "magic", "noble", "ocean", "proud", "quiet", "roast", "shiny", "table",
  "unity", "value", "watch", "xerox", "young", "zebra", "alert", "blend", "chase", "dream",
  "elite", "frost", "giant", "hover", "ideal", "judge", "karma", "lemon", "mango", "nerve",
  "olive", "pearl", "query", "rider", "scale", "toast", "ultra", "visit", "waste", "yield",
  "azure", "blink", "crisp", "dozen", "epoch", "fable", "gleam", "heart", "ivory", "jewel",
  "koala", "laser", "music", "nymph", "oasis", "prism", "quota", "radar", "slope", "trace",
  "union", "vivid", "wreck", "yacht", "zonal", "amber", "brick", "charm", "drift", "equip",
  "field", "grace", "house", "input", "joint", "logic", "medal", "north", "orbit", "phase"
];

/**
 * Asynchronously retrieves a random word of a specified length.
 * Attempts to fetch from an API, falls back to a predefined list on failure.
 *
 * @param length The length of the word to retrieve. Defaults to 5.
 * @returns A promise that resolves to a string representing the random word.
 */
export async function getRandomWord(length: number = 5): Promise<string> {
  try {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${length}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data && data.length > 0 && typeof data[0] === 'string' && data[0].length === length) {
      return data[0].toLowerCase();
    }
    throw new Error('API returned invalid data');
  } catch (error) {
    console.warn(`Failed to fetch word from API, using fallback: ${error instanceof Error ? error.message : String(error)}`);
    const fallbackWordsOfLength = FALLBACK_WORDS.filter(word => word.length === length);
    if (fallbackWordsOfLength.length > 0) {
      return fallbackWordsOfLength[Math.floor(Math.random() * fallbackWordsOfLength.length)].toLowerCase();
    }
    // This should ideally not happen if FALLBACK_WORDS is populated for common lengths
    return "error"; // Or a generic word like "hello"
  }
}
