// Dev only: load the owner's PDF in Node with the same parser the app uses.
// The parsed book is cached in .gita-dev/ (git-ignored). Never commit its contents.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { normalizePage, parseBook, PARSER_VERSION } from "../js/book-parser.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEV = path.join(ROOT, ".gita-dev");

export function pdfPath() {
  if (process.env.GITA_PDF) return process.env.GITA_PDF;
  const folder = path.join(process.env.HOME, "Documents/Gita_App");
  const file = fs.existsSync(folder) && fs.readdirSync(folder).find((f) => f.toLowerCase().endsWith(".pdf"));
  if (!file) throw new Error("Set GITA_PDF to the Holy Geeta PDF path.");
  return path.join(folder, file);
}

export async function loadPages(file = pdfPath()) {
  const pdf = await getDocument({ data: new Uint8Array(fs.readFileSync(file)), useSystemFonts: true }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) pages.push(normalizePage(await (await pdf.getPage(n)).getTextContent()));
  return pages;
}

export async function loadBook({ fresh = false } = {}) {
  const file = pdfPath();
  const stat = fs.statSync(file);
  const cache = path.join(DEV, "book.json");
  const stamp = `${PARSER_VERSION}:${stat.size}:${stat.mtimeMs}:${fs.statSync(path.join(ROOT, "js/book-parser.mjs")).mtimeMs}`;
  if (!fresh && fs.existsSync(cache)) {
    const cached = JSON.parse(fs.readFileSync(cache, "utf8"));
    if (cached.stamp === stamp) return cached.book;
  }
  const book = parseBook(await loadPages(file));
  fs.mkdirSync(DEV, { recursive: true });
  fs.writeFileSync(cache, JSON.stringify({ stamp, book }));
  return book;
}
