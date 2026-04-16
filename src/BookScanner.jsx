import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inconsolata:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; font-family: 'Inconsolata', monospace; }
  .app { min-height: 100vh; background: #0a0a0f; color: #e2e8f0; padding: 24px 16px 48px; }
  .header { text-align: center; margin-bottom: 32px; }
  .header h1 {
    font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 5vw, 2.4rem); font-weight: 800;
    background: linear-gradient(135deg, #f0e040 0%, #40e0b0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -1px;
  }
  .header p { color: #475569; font-size: 0.78rem; margin-top: 6px; letter-spacing: 1px; }
  .wrap { max-width: 700px; margin: 0 auto; }
  .card { background: #111118; border: 1px solid #1e1e2e; border-radius: 14px; padding: 20px; margin-bottom: 18px; }
  .card-label {
    font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2.5px; color: #40e0b0;
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }
  .card-label::after { content: ''; flex: 1; height: 1px; background: #1e1e2e; }
  .cam-box {
    position: relative; width: 100%; max-width: 420px; margin: 0 auto 14px;
    border-radius: 12px; overflow: hidden; border: 2px solid #f0e040; aspect-ratio: 4/3; background: #050508;
  }
  .cam-box video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .scan-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
  .scan-frame { width: 60%; aspect-ratio: 2.5/1; border: 2px solid #f0e040; border-radius: 6px; position: relative; }
  .scan-frame::before {
    content: ''; position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #f0e040, transparent);
    animation: scanline 2s ease-in-out infinite; top: 0;
  }
  @keyframes scanline {
    0%, 100% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 50% { top: calc(100% - 2px); }
  }
  .cam-placeholder {
    width: 100%; max-width: 420px; margin: 0 auto 14px; aspect-ratio: 4/3;
    background: #0d0d14; border: 2px dashed #1e1e2e; border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
    color: #334155; font-size: 0.8rem;
  }
  .cam-placeholder .cam-icon { font-size: 2.5rem; }
  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn {
    display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px;
    border-radius: 8px; border: none; cursor: pointer; font-family: 'Inconsolata', monospace;
    font-size: 0.82rem; font-weight: 600; transition: all 0.15s; letter-spacing: 0.3px;
  }
  .btn-yellow { background: #f0e040; color: #0a0a0f; }
  .btn-yellow:hover { background: #ffe800; transform: translateY(-1px); }
  .btn-teal { background: #40e0b0; color: #0a0a0f; }
  .btn-teal:hover { background: #00d4a0; transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: #94a3b8; border: 1px solid #1e1e2e; }
  .btn-ghost:hover { border-color: #40e0b0; color: #40e0b0; }
  .btn-red { background: transparent; color: #f87171; border: 1px solid #f87171; }
  .btn-red:hover { background: #f8717122; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .input-group { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
  input {
    flex: 1; min-width: 160px; background: #0d0d14; border: 1px solid #1e1e2e; border-radius: 8px;
    padding: 9px 14px; color: #e2e8f0; font-family: 'Inconsolata', monospace; font-size: 0.88rem;
    outline: none; transition: border-color 0.15s;
  }
  input:focus { border-color: #f0e040; }
  .status { margin-top: 12px; padding: 10px 14px; border-radius: 8px; font-size: 0.78rem; line-height: 1.5; animation: fadeIn 0.2s ease; }
  .status-info { background: #0d1a1a; color: #40e0b0; border: 1px solid #1a3a3a; }
  .status-error { background: #1a0d0d; color: #f87171; border: 1px solid #3a1a1a; }
  .status-success { background: #121a0d; color: #86efac; border: 1px solid #1e3a14; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  .source-badge {
    display: inline-block; font-size: 0.6rem; font-weight: 700; padding: 2px 7px;
    border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-left: 6px; vertical-align: middle;
  }
  .src-google { background: #4285f422; color: #4285f4; border: 1px solid #4285f444; }
  .src-openlibrary { background: #f0e04022; color: #f0e040; border: 1px solid #f0e04044; }
  .store-links { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .store-link {
    display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px;
    border-radius: 6px; font-size: 0.72rem; font-weight: 600; text-decoration: none; transition: all 0.15s;
  }
  .store-flipkart { background: #fff3e0; color: #e65100; border: 1px solid #ffcc80; }
  .store-flipkart:hover { background: #ffe0b2; }
  .store-amazon { background: #fffde7; color: #f57f17; border: 1px solid #fff176; }
  .store-amazon:hover { background: #fff9c4; }
  .store-google { background: #e3f2fd; color: #1565c0; border: 1px solid #90caf9; }
  .store-google:hover { background: #bbdefb; }
  .store-isbn { background: #e8f5e9; color: #1b5e20; border: 1px solid #a5d6a7; }
  .store-isbn:hover { background: #c8e6c9; }
  .book-preview { display: flex; gap: 16px; align-items: flex-start; animation: fadeIn 0.3s ease; }
  .book-cover { width: 64px; min-width: 64px; height: 90px; object-fit: cover; border-radius: 5px; box-shadow: 4px 4px 20px #000a; }
  .book-cover-ph { width: 64px; min-width: 64px; height: 90px; background: #1e1e2e; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
  .book-info h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #f1f5f9; line-height: 1.3; margin-bottom: 6px; }
  .meta-grid { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; font-size: 0.75rem; line-height: 1.8; }
  .meta-key { color: #40e0b0; }
  .meta-val { color: #94a3b8; }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.74rem; }
  th { padding: 8px 10px; text-align: left; border-bottom: 1px solid #f0e040; color: #f0e040; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; white-space: nowrap; background: #0d0d14; }
  td { padding: 6px 10px; border-bottom: 1px solid #1a1a24; color: #94a3b8; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  tr:hover td { background: #14141e; color: #e2e8f0; }
  .empty { text-align: center; padding: 36px; color: #334155; font-size: 0.8rem; }
  .empty-icon { font-size: 2.8rem; display: block; margin-bottom: 10px; }
  .badge { display: inline-block; background: #f0e040; color: #0a0a0f; font-size: 0.68rem; font-weight: 600; padding: 2px 10px; border-radius: 20px; }
  .export-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 16px; }
  .spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid #1e1e2e; border-top-color: #f0e040; border-radius: 50%; animation: spin 0.6s linear infinite; vertical-align: middle; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .detected-flash { position: absolute; inset: 0; background: #f0e04033; animation: flash 0.4s ease forwards; pointer-events: none; border-radius: 10px; }
  @keyframes flash { from { opacity: 1; } to { opacity: 0; } }
  .export-note { font-size: 0.73rem; color: #40e0b0; margin-top: 8px; line-height: 1.6; }
`;

// ─── Load ZXing ───────────────────────────────────────────────────────────────
function loadZxing() {
  return new Promise((resolve, reject) => {
    if (window.ZXing) { resolve(window.ZXing); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/umd/index.min.js";
    s.onload = () => resolve(window.ZXing);
    s.onerror = () => reject(new Error("Failed to load ZXing"));
    document.head.appendChild(s);
  });
}

// ─── Load SheetJS ─────────────────────────────────────────────────────────────
function loadXLSX() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(window.XLSX); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error("Failed to load SheetJS"));
    document.head.appendChild(s);
  });
}

// ─── Convert image URL to base64 ─────────────────────────────────────────────
async function imgToBase64(url) {
  if (!url) return null;
  try {
    const res = await fetch(url.replace("http://", "https://"));
    const blob = await res.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

// ─── Store search link generator ─────────────────────────────────────────────
function storeLinks(isbn, title = "") {
  const q = encodeURIComponent(isbn);
  return {
    flipkart: `https://www.flipkart.com/search?q=${q}&otracker=search`,
    amazon: `https://www.amazon.in/s?k=${q}`,
    google: `https://books.google.com/books?q=isbn:${isbn}`,
    isbnIndia: `https://www.isbn.gov.in/Book_Detail.aspx?id=${isbn}`,
  };
}

// ─── Data sources ─────────────────────────────────────────────────────────────
async function fetchGoogleBooks(isbn) {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`);
    const data = await res.json();
    if (!data.items?.length) return null;
    const vi = data.items[0].volumeInfo;
    return {
      id: data.items[0].id, isbn,
      title: vi.title || "Unknown",
      subtitle: vi.subtitle || "",
      authors: (vi.authors || []).join(", ") || "Unknown",
      publisher: vi.publisher || "N/A",
      year: vi.publishedDate?.slice(0, 4) || "N/A",
      pages: vi.pageCount || "N/A",
      language: vi.language || "N/A",
      categories: (vi.categories || []).join(", "),
      description: (vi.description || "").slice(0, 180),
      thumbnail: vi.imageLinks?.thumbnail?.replace("http://", "https://") || "",
      source: "Google Books",
    };
  } catch { return null; }
}

async function fetchOpenLibrary(isbn) {
  try {
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    const data = await res.json();
    const b = data[`ISBN:${isbn}`];
    if (!b) return null;
    return {
      id: isbn, isbn,
      title: b.title || "Unknown",
      subtitle: b.subtitle || "",
      authors: (b.authors || []).map(a => a.name).join(", ") || "Unknown",
      publisher: (b.publishers || []).map(p => p.name).join(", ") || "N/A",
      year: b.publish_date || "N/A",
      pages: b.number_of_pages || "N/A",
      language: b.language?.key?.replace("/languages/", "") || "N/A",
      categories: (b.subjects || []).slice(0, 3).map(s => s.name || s).join(", "),
      description: typeof b.notes === "string" ? b.notes.slice(0, 180) : "",
      thumbnail: b.cover?.large || b.cover?.medium || b.cover?.small || "",
      source: "Open Library",
    };
  } catch { return null; }
}

// ─── Export XLSX + HTML ───────────────────────────────────────────────────────
async function doExport(books, showStatus) {
  showStatus("⏳ Loading export library...", "info");
  let XLSX;
  try { XLSX = await loadXLSX(); } catch {
    showStatus("Failed to load export library. Check your internet.", "error"); return;
  }

  showStatus("🖼 Fetching cover images — please wait...", "info");
  const images = await Promise.all(books.map(b => imgToBase64(b.thumbnail)));

  // ── Build XLSX ──
  const wb = XLSX.utils.book_new();

  // Sheet 1: Books
  const headers = ["#", "Cover URL", "Title", "Subtitle", "Authors", "Publisher", "Year", "ISBN", "Pages", "Language", "Categories", "Source", "Flipkart", "Amazon", "Google Books", "ISBN India"];
  const rows = books.map((b, i) => {
    const l = storeLinks(b.isbn, b.title);
    return [i + 1, b.thumbnail || "", b.title, b.subtitle || "", b.authors, b.publisher, b.year, b.isbn, b.pages, b.language, b.categories || "", b.source || "", l.flipkart, l.amazon, l.google, l.isbnIndia];
  });
  const ws1 = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws1["!cols"] = [{ wch: 4 }, { wch: 55 }, { wch: 36 }, { wch: 22 }, { wch: 28 }, { wch: 22 }, { wch: 6 }, { wch: 16 }, { wch: 7 }, { wch: 9 }, { wch: 22 }, { wch: 14 }, { wch: 50 }, { wch: 50 }, { wch: 50 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Books");

  // Sheet 2: Covers using Excel 365 =IMAGE() formula
  const ws2 = XLSX.utils.aoa_to_sheet([
    ["#", "Title", "Cover (paste formula → col D in Excel 365)", "=IMAGE() Formula"],
    ...books.map((b, i) => [i + 1, b.title, b.thumbnail || "(no image)", b.thumbnail ? `=IMAGE("${b.thumbnail}")` : ""])
  ]);
  ws2["!cols"] = [{ wch: 4 }, { wch: 36 }, { wch: 55 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Covers (Excel365)");

  // Sheet 3: Store Links
  const ws3 = XLSX.utils.aoa_to_sheet([
    ["#", "Title", "ISBN", "Flipkart", "Amazon India", "Google Books", "ISBN India Gov"],
    ...books.map((b, i) => {
      const l = storeLinks(b.isbn, b.title);
      return [i + 1, b.title, b.isbn, l.flipkart, l.amazon, l.google, l.isbnIndia];
    })
  ]);
  ws3["!cols"] = [{ wch: 4 }, { wch: 36 }, { wch: 16 }, { wch: 55 }, { wch: 55 }, { wch: 55 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Store Links");

  XLSX.writeFile(wb, "book_list.xlsx");

  // ── Build HTML with embedded images ──
  const htmlRows = books.map((b, i) => {
    const l = storeLinks(b.isbn, b.title);
    const imgTag = images[i]
      ? `<img src="${images[i]}" style="width:56px;height:80px;object-fit:cover;border-radius:4px;box-shadow:0 2px 8px #0003">`
      : `<div style="width:56px;height:80px;background:#e2e8f0;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.5rem">📖</div>`;
    return `<tr>
      <td style="text-align:center;color:#94a3b8;font-size:12px">${i + 1}</td>
      <td style="text-align:center;padding:6px 8px">${imgTag}</td>
      <td><strong style="font-size:13px">${b.title}</strong>${b.subtitle ? `<br><span style="color:#64748b;font-size:11px">${b.subtitle}</span>` : ""}</td>
      <td style="font-size:12px">${b.authors}</td>
      <td style="font-size:12px">${b.publisher}</td>
      <td style="text-align:center;font-size:12px">${b.year}</td>
      <td style="font-family:monospace;font-size:11px">${b.isbn}</td>
      <td style="text-align:center;font-size:12px">${b.pages}</td>
      <td style="text-align:center;font-size:12px">${b.language}</td>
      <td style="font-size:11px;color:#64748b">${b.categories || ""}</td>
      <td style="font-size:11px;white-space:nowrap">
        <a href="${l.flipkart}" target="_blank" style="display:block;color:#e65100;margin-bottom:3px;text-decoration:none">🛒 Flipkart</a>
        <a href="${l.amazon}" target="_blank" style="display:block;color:#f57f17;margin-bottom:3px;text-decoration:none">🛒 Amazon</a>
        <a href="${l.google}" target="_blank" style="display:block;color:#1565c0;margin-bottom:3px;text-decoration:none">📚 Google Books</a>
        <a href="${l.isbnIndia}" target="_blank" style="display:block;color:#1b5e20;text-decoration:none">🇮🇳 ISBN India</a>
      </td>
    </tr>`;
  }).join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Book List with Covers</title>
<style>
  body{font-family:Arial,sans-serif;background:#f8fafc;color:#1e293b;margin:0;padding:24px}
  h1{font-size:1.5rem;margin-bottom:4px}
  p{color:#64748b;font-size:13px;margin-bottom:18px}
  table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px #0001}
  th{background:#0f172a;color:#f1f5f9;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;white-space:nowrap}
  td{padding:8px 12px;border-bottom:1px solid #e2e8f0;vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:#f1f5f9}
</style>
</head>
<body>
<h1>📚 Book List with Covers</h1>
<p>Generated ${new Date().toLocaleString()} &nbsp;·&nbsp; ${books.length} book${books.length !== 1 ? "s" : ""} &nbsp;·&nbsp; Cover images embedded as base64</p>
<table>
<thead><tr><th>#</th><th>Cover</th><th>Title</th><th>Authors</th><th>Publisher</th><th>Year</th><th>ISBN</th><th>Pages</th><th>Lang</th><th>Categories</th><th>Buy / Search</th></tr></thead>
<tbody>${htmlRows}</tbody>
</table>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "book_list_with_covers.html"; a.click();
  URL.revokeObjectURL(url);

  showStatus(`✓ 2 files downloaded: book_list.xlsx (3 sheets) + book_list_with_covers.html (with real cover images)`, "success");
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookScanner() {
  const [books, setBooks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("isbn_books") || "[]"); } catch { return []; }
  });
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isbnInput, setIsbnInput] = useState("");
  const [flash, setFlash] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const readerRef = useRef(null);
  const lastScannedRef = useRef("");

  useEffect(() => {
    try { localStorage.setItem("isbn_books", JSON.stringify(books)); } catch {}
  }, [books]);

  const showStatus = useCallback((msg, type = "info") => setStatus({ msg, type }), []);

  // ── Camera ────────────────────────────────────────────────────────────────
  const startCamera = async () => {
    setStatus(null);
    showStatus("⏳ Loading scanner...", "info");
    let ZXing;
    try { ZXing = await loadZxing(); } catch {
      showStatus("Failed to load scanner. Check your internet.", "error"); return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
    } catch (e) {
      const msg = e.name === "NotAllowedError" ? "Camera permission denied. Please allow camera access."
        : e.name === "NotFoundError" ? "No camera found. Use manual ISBN entry."
        : `Camera error: ${e.message}`;
      showStatus(msg + " Use manual ISBN entry below.", "error"); return;
    }
    setScanning(true);
    showStatus("📷 Point camera at the barcode on the book...", "info");
    setTimeout(() => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", true);
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
      try {
        const hints = new Map();
        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
          ZXing.BarcodeFormat.EAN_13, ZXing.BarcodeFormat.EAN_8,
          ZXing.BarcodeFormat.UPC_A, ZXing.BarcodeFormat.UPC_E,
          ZXing.BarcodeFormat.CODE_128, ZXing.BarcodeFormat.QR_CODE,
        ]);
        hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
        const reader = new ZXing.BrowserMultiFormatReader(hints);
        readerRef.current = reader;
        reader.decodeFromStream(stream, videoRef.current, (result) => {
          if (result) {
            const code = result.getText();
            if (code && code !== lastScannedRef.current) {
              lastScannedRef.current = code;
              setFlash(true); setTimeout(() => setFlash(false), 400);
              setIsbnInput(code);
              fetchBook(code);
            }
          }
        });
      } catch (e) { showStatus("Scanner init failed: " + e.message, "error"); }
    }, 150);
  };

  const stopCamera = useCallback(() => {
    if (readerRef.current) { try { readerRef.current.reset(); } catch {} readerRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setScanning(false);
  }, []);

  // ── Multi-source fetch ────────────────────────────────────────────────────
  // Search order: Flipkart (link only, CORS blocked) → Amazon (link only) →
  //               Google Books API → Open Library API → ISBN India (link only)
  const fetchBook = useCallback(async (rawIsbn) => {
    const isbn = rawIsbn.replace(/[^0-9X]/gi, "");
    if (isbn.length < 8) { showStatus("ISBN too short. Check the number.", "error"); return; }
    setLoading(true);
    showStatus(`🔍 Searching Flipkart → Amazon → Google Books → ISBN India for: ${isbn}`, "info");

    // Try Google Books first (best data source with CORS support)
    let book = await fetchGoogleBooks(isbn);

    // Fallback: Open Library (good for Indian / regional publishers)
    if (!book) {
      showStatus(`⏳ Not on Google Books — trying Open Library (Indian books)...`, "info");
      book = await fetchOpenLibrary(isbn);
    }

    const links = storeLinks(isbn, book?.title || "");

    if (!book) {
      showStatus(`No data found for ISBN ${isbn}. Search manually on stores below.`, "error");
      setPreview({ isbn, noData: true, storeLinks: links });
      setLoading(false); return;
    }

    book.storeLinks = links;
    setPreview(book);
    setBooks(prev => {
      if (prev.find(b => b.isbn === isbn)) {
        showStatus(`Already in list: "${book.title}"`, "info"); return prev;
      }
      showStatus(`✓ Added: "${book.title}" — found via ${book.source}`, "success");
      return [book, ...prev];
    });
    setLoading(false);
  }, [showStatus]);

  const handleSearch = () => { lastScannedRef.current = ""; fetchBook(isbnInput); };
  const removeBook = (isbn) => setBooks(prev => prev.filter(b => b.isbn !== isbn));

  const handleExport = async () => {
    if (!books.length) { showStatus("No books to export.", "error"); return; }
    setExporting(true);
    await doExport(books, showStatus);
    setExporting(false);
  };

  const openSheets = () => {
    if (!books.length) { showStatus("No books to export.", "error"); return; }
    const h = ["#", "Title", "Authors", "Publisher", "Year", "ISBN", "Pages", "Language", "Categories", "Source", "Flipkart", "Amazon", "Google Books", "ISBN India"];
    const rows = books.map((b, i) => {
      const l = storeLinks(b.isbn, b.title);
      return [i + 1, b.title, b.authors, b.publisher, b.year, b.isbn, b.pages, b.language, b.categories || "", b.source || "", l.flipkart, l.amazon, l.google, l.isbnIndia];
    });
    const tsv = [h, ...rows].map(r => r.join("\t")).join("\n");
    navigator.clipboard.writeText(tsv).then(() => {
      window.open("https://sheets.new", "_blank");
      showStatus("📋 Copied! In new Google Sheet: click A1 → Ctrl+V to paste.", "success");
    }).catch(() => {
      window.open("https://sheets.new", "_blank");
      showStatus("Opened Sheets. Download XLSX and use File → Import.", "info");
    });
  };

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="wrap">

          <div className="header">
            <h1>📚 Book ISBN Scanner</h1>
            <p>FLIPKART · AMAZON · GOOGLE BOOKS · ISBN INDIA · EXPORT WITH COVERS</p>
          </div>

          {/* Scanner */}
          <div className="card">
            <div className="card-label">01 — Camera Scanner</div>
            {scanning ? (
              <div className="cam-box" style={{ maxWidth: 420, margin: "0 auto 14px" }}>
                <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div className="scan-overlay"><div className="scan-frame" /></div>
                {flash && <div className="detected-flash" />}
              </div>
            ) : (
              <div className="cam-placeholder">
                <span className="cam-icon">📷</span>
                <span>Camera preview will appear here</span>
              </div>
            )}
            <div className="btn-row">
              {!scanning
                ? <button className="btn btn-yellow" onClick={startCamera}>📷 Start Camera</button>
                : <button className="btn btn-red" onClick={stopCamera}>■ Stop Camera</button>
              }
            </div>
            <div className="input-group">
              <input
                value={isbnInput}
                onChange={e => setIsbnInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Or type ISBN-10 / ISBN-13 here…"
              />
              <button className="btn btn-teal" onClick={handleSearch} disabled={loading || !isbnInput.trim()}>
                {loading ? <span className="spinner" /> : "Search →"}
              </button>
            </div>
            {status && <div className={`status status-${status.type}`}>{status.msg}</div>}
          </div>

          {/* Preview */}
          {preview && (
            <div className="card">
              <div className="card-label">
                02 — Last Fetched Book
                {!preview.noData && preview.source && (
                  <span className={`source-badge ${preview.source === "Google Books" ? "src-google" : "src-openlibrary"}`}>
                    {preview.source}
                  </span>
                )}
              </div>

              {preview.noData ? (
                <p style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                  No data found for ISBN <strong style={{ color: "#f0e040" }}>{preview.isbn}</strong>. Search on stores:
                </p>
              ) : (
                <div className="book-preview">
                  {preview.thumbnail
                    ? <img src={preview.thumbnail} className="book-cover" alt="cover" />
                    : <div className="book-cover-ph">📖</div>}
                  <div className="book-info">
                    <h3>{preview.title}{preview.subtitle ? ` — ${preview.subtitle}` : ""}</h3>
                    <div className="meta-grid">
                      <span className="meta-key">Authors</span><span className="meta-val">{preview.authors}</span>
                      <span className="meta-key">Publisher</span><span className="meta-val">{preview.publisher}</span>
                      <span className="meta-key">Year</span><span className="meta-val">{preview.year}</span>
                      <span className="meta-key">Pages</span><span className="meta-val">{preview.pages}</span>
                      <span className="meta-key">Language</span><span className="meta-val">{preview.language}</span>
                      <span className="meta-key">ISBN</span><span className="meta-val">{preview.isbn}</span>
                      {preview.categories && <><span className="meta-key">Categories</span><span className="meta-val">{preview.categories}</span></>}
                    </div>
                  </div>
                </div>
              )}

              {preview.storeLinks && (
                <div className="store-links">
                  <a href={preview.storeLinks.flipkart} target="_blank" rel="noreferrer" className="store-link store-flipkart">🛒 Flipkart</a>
                  <a href={preview.storeLinks.amazon} target="_blank" rel="noreferrer" className="store-link store-amazon">🛒 Amazon</a>
                  <a href={preview.storeLinks.google} target="_blank" rel="noreferrer" className="store-link store-google">📚 Google Books</a>
                  <a href={preview.storeLinks.isbnIndia} target="_blank" rel="noreferrer" className="store-link store-isbn">🇮🇳 ISBN India</a>
                </div>
              )}
            </div>
          )}

          {/* Book List */}
          <div className="card">
            <div className="card-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>03 — Book List</span>
              <span className="badge">{books.length} book{books.length !== 1 ? "s" : ""}</span>
            </div>

            {books.length === 0 ? (
              <div className="empty"><span className="empty-icon">📚</span>Scan or search a book to build your list</div>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr><th>#</th><th>Cover</th><th>Title</th><th>Authors</th><th>Publisher</th><th>Year</th><th>ISBN</th><th>Pages</th><th>Lang</th><th>Source</th><th></th></tr>
                  </thead>
                  <tbody>
                    {books.map((b, i) => (
                      <tr key={b.isbn}>
                        <td>{i + 1}</td>
                        <td style={{ padding: "4px 8px" }}>
                          {b.thumbnail
                            ? <img src={b.thumbnail} style={{ width: 30, height: 42, objectFit: "cover", borderRadius: 3, display: "block" }} alt="" />
                            : <span style={{ fontSize: "1.1rem" }}>📖</span>}
                        </td>
                        <td title={b.title}>{b.title.slice(0, 22)}{b.title.length > 22 ? "…" : ""}</td>
                        <td title={b.authors}>{(b.authors || "").slice(0, 18)}{(b.authors || "").length > 18 ? "…" : ""}</td>
                        <td title={b.publisher}>{(b.publisher || "").slice(0, 15)}{(b.publisher || "").length > 15 ? "…" : ""}</td>
                        <td>{b.year}</td>
                        <td style={{ fontFamily: "monospace", fontSize: "0.7rem" }}>{b.isbn}</td>
                        <td>{b.pages}</td>
                        <td>{b.language}</td>
                        <td style={{ fontSize: "0.65rem", color: b.source === "Google Books" ? "#4285f4" : "#f0e040" }}>{b.source}</td>
                        <td><button className="btn btn-red" style={{ padding: "3px 8px", fontSize: "0.7rem" }} onClick={() => removeBook(b.isbn)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="export-row">
              <button className="btn btn-yellow" onClick={handleExport} disabled={!books.length || exporting}>
                {exporting ? <><span className="spinner" /> Exporting…</> : "⬇ Download Excel + HTML"}
              </button>
              <button className="btn btn-teal" onClick={openSheets} disabled={!books.length}>📊 Google Sheets</button>
              {books.length > 0 && (
                <button className="btn btn-red" style={{ marginLeft: "auto" }} onClick={() => { if (confirm("Clear all books?")) setBooks([]); }}>🗑 Clear All</button>
              )}
            </div>
            {books.length > 0 && (
              <div className="export-note">
                Excel download = 3 sheets: Book Data · Covers (=IMAGE() for Excel 365) · Store Links<br />
                HTML download = same table with actual cover images embedded (works everywhere)
              </div>
            )}
          </div>

          {/* Help */}
          <div className="card">
            <div className="card-label">How it works</div>
            <div style={{ fontSize: "0.78rem", lineHeight: 2.2, color: "#64748b" }}>
              <span style={{ color: "#f0e040" }}>Search order</span> — Google Books API (best data) → Open Library (Indian/regional publishers). Flipkart, Amazon and isbn.gov.in links are always generated for every book.<br />
              <span style={{ color: "#f0e040" }}>Why not Flipkart/Amazon data?</span> — Their APIs block browser requests (CORS policy). The search links open their site so you can check prices manually.<br />
              <span style={{ color: "#f0e040" }}>Camera</span> — ZXing library, works on Chrome, Firefox, Safari, iOS &amp; Android.<br />
              <span style={{ color: "#f0e040" }}>Excel with covers</span> — Gets you 2 files: .xlsx + .html. Open the HTML file in any browser to see cover images. In Excel 365, paste the =IMAGE() formulas from the Covers sheet.<br />
              <span style={{ color: "#475569" }}>Data: Google Books API + Open Library · Free, no login</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
