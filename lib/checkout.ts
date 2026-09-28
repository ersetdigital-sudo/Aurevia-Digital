type DetectedOperator = { name: string };

const operatorPrefixes: Array<{ name: string; prefixes: string[] }> = [
  { name: "Telkomsel", prefixes: ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"] },
  { name: "Indosat", prefixes: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"] },
  { name: "XL", prefixes: ["0817", "0818", "0819", "0859", "0877", "0878"] },
  { name: "Axis", prefixes: ["0831", "0832", "0833", "0838"] },
  { name: "Tri", prefixes: ["0895", "0896", "0897", "0898", "0899"] },
  { name: "Smartfren", prefixes: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"] },
];

export function detectOperator(number: string): DetectedOperator | null {
  const clean = number.replace(/\D/g, "");
  if (clean.length < 4) return null;

  const prefix = clean.slice(0, 4);
  return operatorPrefixes.find((entry) => entry.prefixes.includes(prefix)) ?? null;
}

const refAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createTrxRef(): string {
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += refAlphabet[Math.floor(Math.random() * refAlphabet.length)];
  }
  return `AD-${code}`;
}

export type SavedInvoice = {
  ref: string;
  service: string;
  product: string;
  target: string;
  targetLabel: string;
  amount: number;
  createdAt: number;
};

const INVOICE_KEY = "aurevia.invoices";

export function saveInvoice(invoice: SavedInvoice): void {
  try {
    const raw = window.localStorage.getItem(INVOICE_KEY);
    const parsed: SavedInvoice[] = raw ? (JSON.parse(raw) as SavedInvoice[]) : [];
    const next = [invoice, ...parsed.filter((entry) => entry.ref !== invoice.ref)].slice(0, 20);
    window.localStorage.setItem(INVOICE_KEY, JSON.stringify(next));
  } catch {
    // localStorage bisa diblokir (private mode) — struk tetap tampil di layar sukses.
  }
}

export function findInvoice(ref: string): SavedInvoice | null {
  try {
    const raw = window.localStorage.getItem(INVOICE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedInvoice[];
    return parsed.find((entry) => entry.ref === ref) ?? null;
  } catch {
    return null;
  }
}
