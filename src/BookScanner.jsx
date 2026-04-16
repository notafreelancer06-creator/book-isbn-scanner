import React, { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inconsolata:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0f;
    font-family: 'Inconsolata', monospace;
  }

  .app {
    min-height: 100vh;
    background: #0a0a0f;
    color: #e2e8f0;
    padding: 24px 16px 48px;
  }

  .header {
    text-align: center;
    margin-bottom: 32px;
  }

  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 5vw, 2.4rem);
    font-weight: 800;
    background: linear-gradient(135deg, #f0e040 0%, #40e0b0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -1px;
  }

  .header p {
    color: #475569;
    font-size: 0.78rem;
    margin-top: 6px;
    letter-spacing: 1px;
  }

  .wrap { max-width: 700px; margin: 0 auto; }

  .card {
    background: #111118;
    border: 1px solid #1e1e2e;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 18px;
  }

  .card-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: #40e0b0;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1e1e2e;
  }

  .cam-box {
    position: relative;
    width: 100%;
    max-width: 420px;
    margin: 0 auto 14px;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid #f0e040;
    aspect-ratio: 4/3;
    background: #050508;
  }

  .cam-box video {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }

  .scan-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .scan-frame {
    width: 60%;
    aspect-ratio: 2.5/1;
    border: 2px solid #f0e040;
    border-radius: 6px;
    position: relative;
  }

  .scan-frame::before {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #f0e040, transparent);
    animation: scanline 2s ease-in-out infinite;
    top: 0;
  }

  @keyframes scanline {
    0%, 100% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    50% { top: calc(100% - 2px); }
  }

  .cam-placeholder {
    width: 100%;
    max-width: 420px;
    margin: 0 auto 14px;
    aspect-ratio: 4/3;
    background: #0d0d14;
    border: 2px dashed #1e1e2e;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #334155;
    font-size: 0.8rem;
  }

  .cam-placeholder .cam-icon { font-size: 2.5rem; }

  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-family: 'Inconsolata', monospace;
    font-size: 0.82rem;
    font-weight: 600;
    transition: all 0.15s;
    letter-spacing: 0.3px;
  }

  .btn-yellow { background: #f0e040; color: #0a0a0f; }
  .btn-yellow:hover { background: #ffe800; transform: translateY(-1px); }

  .btn-teal { background: #40e0b0; color: #0a0a0f; }
  .btn-teal:hover { background: #00d4a0; transform: translateY(-1px); }

  .btn-ghost {
    background: transparent;
    color: #94a3b8;
    border: 1px solid #1e1e2e;
  }
  .btn-ghost:hover { border-color: #40e0b0; color: #40e0b0; }

  .btn-red {
    background: transparent;
    color: #f87171;
    border: 1px solid #f87171;
  }
  .btn-red:hover { background: #f8717122; }

  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  .input-group { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }

  input {
    flex: 1;
    min-width: 160px;
    background: #0d0d14;
    border: 1px solid #1e1e2e;
    border-radius: 8px;
    padding: 9px 14px;
    color: #e2e8f0;
    font-family: 'Inconsolata', monospace;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.15s;
  }

  input:focus { border-color: #f0e040; }

  .status {
    margin-top: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.78rem;
    line-height: 1.5;
    animation: fadeIn 0.2s ease;
  }

  .status-info { background: #0d1a1a; color: #40e0b0; border: 1px solid #1a3a3a; }
  .status-error { background: #1a0d0d; color: #f87171; border: 1px solid #3a1a1a; }
  .status-success { background: #121a0d; color: #86efac; border: 1px solid #1e3a14; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  .book-preview {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    animation: fadeIn 0.3s ease;
  }

  .book-cover {
    width: 64px;
    min-width: 64px;
    height: 90px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 4px 4px 20px #000a;
  }

  .book-cover-ph {
    width: 64px;
    min-width: 64px;
    height: 90px;
    background: #1e1e2e;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
  }

  .book-info h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1.3;
    margin-bottom: 6px;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 10px;
    font-size: 0.75rem;
    line-height: 1.8;
  }

  .meta-key { color: #40e0b0; }
  .meta-val { color: #94a3b8; }

  .table-scroll { overflow-x: auto; }

  table { width: 100%; border-collapse: collapse; font-size: 0.74rem; }

  th {
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid #f0e040;
    color: #f0e040;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    white-space: nowrap;
    background: #0d0d14;
  }

  td {
    padding: 8px 10px;
    border-bottom: 1px solid #1a1a24;
    color: #94a3b8;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  tr:hover td { background: #14141e; color: #e2e8f0; }

  .empty {
    text-align: center;
    padding: 36px;
    color: #334155;
    font-size: 0.8rem;
  }

  .empty-icon { font-size: 2.8rem; display: block; margin-bottom: 10px; }

  .badge {
    display: inline-block;
    background: #f0e040;
    color: #0a0a0f;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 20px;
  }

  .export-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 16px; }

  .spinner {
    display: inline-block;
    width: 12px; height: 12px;
    border: 2px solid #1e1e2e;
    border-top-color: #f0e040;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .detected-flash {
    position: absolute;
    inset: 0;
    background: #f0e04033;
    animation: flash 0.4s ease forwards;
    pointer-events: none;
    border-radius: 10px;
  }

  @keyframes flash { from { opacity: 1; } to { opacity: 0; } }

  .zxing-loading {
    width: 100%;
    max-width: 420px;
    margin: 0 auto 14px;
    aspect-ratio: 4/3;
    background: #0d0d14;
    border: 2px solid #1e1e2e;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #40e0b0;
    font-size: 0.8rem;
  }
`;

// Dynamically load ZXing from CDN
function loadZxing() {
  return new Promise((resolve, reject) => {
    if (window.ZXing) { resolve(window.ZXing); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@zxing/library@0.19.1/umd/index.min.js";
    script.onload = () => resolve(window.ZXing);
    script.onerror = () => reject(new Error("Failed to load ZXing"));
    document.head.appendChild(script);
  });
}

export default function BookScanner() {
  const [books, setBooks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("isbn_books") || "[]"); } catch { return []; }
  });
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isbnInput, setIsbnInput] = useState("");
  const [flash, setFlash] = useState(false);
  const [zxingReady, setZxingReady] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const readerRef = useRef(null);
  const lastScannedRef = useRef("");

  useEffect(() => {
    try { localStorage.setItem("isbn_books", JSON.stringify(books)); } catch {}
  }, [books]);

  const showStatus = (msg, type = "info") => setStatus({ msg, type });

  // ── Start Camera using ZXing (works on all browsers/devices) ──
  const startCamera = async () => {
    setStatus(null);
    showStatus("⏳ Loading scanner library...", "info");

    let ZXing;
    try {
      ZXing = await loadZxing();
      setZxingReady(true);
    } catch (e) {
      showStatus("Failed to load scanner. Check your internet connection.", "error");
      return;
    }

    // Request camera permission first
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
    } catch (e) {
      if (e.name === "NotAllowedError") {
        showStatus("Camera permission denied. Please allow camera access and try again.", "error");
      } else if (e.name === "NotFoundError") {
        showStatus("No camera found on this device. Use manual ISBN entry below.", "error");
      } else {
        showStatus(`Camera error: ${e.message}. Use manual ISBN entry below.`, "error");
      }
      return;
    }

    setScanning(true);
    showStatus("📷 Point camera at the barcode on the book...", "info");

    // Wait for video element to mount, then attach stream
    setTimeout(() => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", true);
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});

      try {
        const hints = new Map();
        const formats = [
          ZXing.BarcodeFormat.EAN_13,
          ZXing.BarcodeFormat.EAN_8,
          ZXing.BarcodeFormat.UPC_A,
          ZXing.BarcodeFormat.UPC_E,
          ZXing.BarcodeFormat.CODE_128,
          ZXing.BarcodeFormat.QR_CODE,
        ];
        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
        hints.set(ZXing.DecodeHintType.TRY_HARDER, true);

        const reader = new ZXing.BrowserMultiFormatReader(hints);
        readerRef.current = reader;

        reader.decodeFromStream(stream, videoRef.current, (result, err) => {
          if (result) {
            const code = result.getText();
            if (code && code !== lastScannedRef.current) {
              lastScannedRef.current = code;
              setFlash(true);
              setTimeout(() => setFlash(false), 400);
              setIsbnInput(code);
              fetchBook(code);
            }
          }
          // Ignore decode errors — they fire constantly when no barcode visible
        });
      } catch (e) {
        showStatus("Scanner init failed: " + e.message, "error");
      }
    }, 150); // Small delay to let React render the video element
  };

  const stopCamera = useCallback(() => {
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch {}
      readerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setZxingReady(false);
  }, []);

  // ── Google Books fetch ──
  const fetchBook = useCallback(async (rawIsbn) => {
    const isbn = rawIsbn.replace(/[^0-9X]/gi, "");
    if (isbn.length < 8) { showStatus("ISBN too short. Check the number.", "error"); return; }

    setLoading(true);
    showStatus("Searching Google Books for: " + isbn, "info");

    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`);
      const data = await res.json();

      if (!data.items?.length) {
        showStatus(`No result for ISBN ${isbn}. Try a different source or check the digits.`, "error");
        setLoading(false); return;
      }

      const vi = data.items[0].volumeInfo;
      const book = {
        id: data.items[0].id,
        isbn,
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
        link: `https://books.google.com/books?id=${data.items[0].id}`
      };

      setPreview(book);
      setBooks(prev => {
        if (prev.find(b => b.isbn === isbn)) {
          showStatus(`Already in list: "${book.title}"`, "info");
          return prev;
        }
        showStatus(`✓ Added: "${book.title}"`, "success");
        return [book, ...prev];
      });
    } catch (e) {
      showStatus("Network error fetching book data. Check connection.", "error");
    }
    setLoading(false);
  }, []);

  const handleSearch = () => {
    lastScannedRef.current = "";
    fetchBook(isbnInput);
  };

  const removeBook = (isbn) => setBooks(prev => prev.filter(b => b.isbn !== isbn));

  const exportCSV = () => {
    if (!books.length) { showStatus("No books to export.", "error"); return; }
    const headers = ["#", "Title", "Subtitle", "Authors", "Publisher", "Year", "ISBN", "Pages", "Language", "Categories", "Google Books Link"];
    const rows = books.map((b, i) => [
      i + 1,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${(b.subtitle || "").replace(/"/g, '""')}"`,
      `"${b.authors.replace(/"/g, '""')}"`,
      `"${b.publisher.replace(/"/g, '""')}"`,
      b.year, b.isbn, b.pages, b.language,
      `"${(b.categories || "").replace(/"/g, '""')}"`,
      b.link
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "book_list.csv"; a.click();
    URL.revokeObjectURL(url);
    showStatus("✓ CSV downloaded! Open in Excel or import to Google Sheets via File → Import.", "success");
  };

  const openSheets = () => {
    if (!books.length) { showStatus("No books to export.", "error"); return; }
    const headers = ["#", "Title", "Authors", "Publisher", "Year", "ISBN", "Pages", "Language", "Categories"];
    const rows = books.map((b, i) => [i + 1, b.title, b.authors, b.publisher, b.year, b.isbn, b.pages, b.language, b.categories || ""]);
    const tsv = [headers, ...rows].map(r => r.join("\t")).join("\n");
    navigator.clipboard.writeText(tsv).then(() => {
      window.open("https://sheets.new", "_blank");
      showStatus("📋 Copied to clipboard! In the new Google Sheet: click cell A1 → Ctrl+V (or Cmd+V) to paste.", "success");
    }).catch(() => {
      window.open("https://sheets.new", "_blank");
      showStatus("Opened Google Sheets. Download CSV and use File → Import to load your data.", "info");
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
            <p>SCAN BARCODE · GOOGLE BOOKS · EXPORT TO EXCEL OR SHEETS</p>
          </div>

          {/* Scanner Card */}
          <div className="card">
            <div className="card-label">01 — Camera Scanner</div>

            {scanning ? (
              <div className="cam-box" style={{ maxWidth: 420, margin: "0 auto 14px" }}>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div className="scan-overlay">
                  <div className="scan-frame" />
                </div>
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

            {status && (
              <div className={`status status-${status.type}`}>{status.msg}</div>
            )}
          </div>

          {/* Preview Card */}
          {preview && (
            <div className="card">
              <div className="card-label">02 — Last Fetched Book</div>
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
                  <div style={{ marginTop: 10 }}>
                    <a href={preview.link} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: "0.74rem", padding: "5px 12px" }}>
                      🔗 View on Google Books
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Book List */}
          <div className="card">
            <div className="card-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>03 — Book List</span>
              <span className="badge">{books.length} book{books.length !== 1 ? "s" : ""}</span>
            </div>

            {books.length === 0 ? (
              <div className="empty">
                <span className="empty-icon">📚</span>
                Scan or search a book to build your list
              </div>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>#</th><th>Title</th><th>Authors</th><th>Publisher</th>
                      <th>Year</th><th>ISBN</th><th>Pages</th><th>Lang</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((b, i) => (
                      <tr key={b.isbn}>
                        <td>{i + 1}</td>
                        <td title={b.title}>{b.title.slice(0, 28)}{b.title.length > 28 ? "…" : ""}</td>
                        <td title={b.authors}>{b.authors.slice(0, 22)}{b.authors.length > 22 ? "…" : ""}</td>
                        <td title={b.publisher}>{b.publisher.slice(0, 18)}{b.publisher.length > 18 ? "…" : ""}</td>
                        <td>{b.year}</td>
                        <td>{b.isbn}</td>
                        <td>{b.pages}</td>
                        <td>{b.language}</td>
                        <td>
                          <button className="btn btn-red" style={{ padding: "3px 8px", fontSize: "0.7rem" }} onClick={() => removeBook(b.isbn)}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="export-row">
              <button className="btn btn-yellow" onClick={exportCSV} disabled={!books.length}>⬇ Download CSV / Excel</button>
              <button className="btn btn-teal" onClick={openSheets} disabled={!books.length}>📊 Open in Google Sheets</button>
              {books.length > 0 && (
                <button className="btn btn-red" style={{ marginLeft: "auto" }} onClick={() => { if (confirm("Clear all books?")) setBooks([]); }}>🗑 Clear All</button>
              )}
            </div>
          </div>

          {/* Help */}
          <div className="card">
            <div className="card-label">How it works</div>
            <div style={{ fontSize: "0.78rem", lineHeight: 2, color: "#64748b" }}>
              <span style={{ color: "#f0e040" }}>Camera Scan</span> — Works on Chrome, Firefox, Safari, iOS and Android. Point at the barcode on the back of the book.<br />
              <span style={{ color: "#f0e040" }}>Manual Search</span> — Type any ISBN-10 or ISBN-13 and press Enter or Search.<br />
              <span style={{ color: "#f0e040" }}>Download CSV</span> — Opens directly in Excel. Or use Google Sheets → File → Import → Upload.<br />
              <span style={{ color: "#f0e040" }}>Google Sheets button</span> — Opens a new sheet + copies data to clipboard → paste in cell A1.<br />
              <span style={{ color: "#475569" }}>Data source: Google Books API (free, no login required)</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
