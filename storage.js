const VALID_TYPES = new Set(["income", "expense"]);

function validateEntry(entry) {
  if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
    return null;
  }
  const type = entry.type;
  const title = typeof entry.title === "string" ? entry.title.trim() : "";
  // Ensure the loaded amount is coerced to integer (cents) in case it was stored as floats before.
  const amount = Math.round(Number(entry.amount));

  if (!VALID_TYPES.has(type) || title.length === 0 || !Number.isFinite(amount) || amount < 0) {
    return null;
  }
  return { type, title, amount };
}

export class LocalStorageService {
  #key;
  constructor(key = "entry_list") { 
    this.#key = key; 
  }

  load() {
    try {
      const raw = localStorage.getItem(this.#key);
      if (!raw) return [];
      
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      
      const validated = parsed.map(validateEntry).filter(Boolean);
      if (validated.length < parsed.length) {
        console.warn(`[BudgetApp] Dropped ${parsed.length - validated.length} malformed entries from storage.`);
      }
      return validated;
    } catch (e) {
      console.error("[BudgetApp] Corrupted localStorage data — resetting.", e);
      return [];
    }
  }

  save(entries) {
    localStorage.setItem(this.#key, JSON.stringify(entries));
  }
}
