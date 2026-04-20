import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── YOUR RAILWAY BACKEND URL ──────────────────────────────────────────────
// After you deploy to Railway, paste your URL here.
// It looks like: https://isbn-backend-production-xxxx.up.railway.app
const BACKEND = "https://web-production-bca9f.up.railway.app";

// ─── Download Excel from Railway (includes Amazon + Flipkart) ──────────────
async function downloadBulkExcel(books, showStatus) {
    const isbns = books.map(b => b.isbn);

    showStatus(`⏳ Sending ${isbns.length} ISBN(s) to server — fetching Amazon + Flipkart data…`, "info");

    let response;
    try {
        response = await fetch(`${BACKEND}/bulk-excel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isbns }),
        });
    } catch (err) {
        showStatus("❌ Could not reach the server. Check your Railway URL in BACKEND constant.", "error");
        return false;
    }

    if (!response.ok) {
        showStatus(`❌ Server error: ${response.status}. Try again in a moment.`, "error");
        return false;
    }

    // Download the Excel file the server sends back
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "books_all_sources.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showStatus(`✅ Downloaded books_all_sources.xlsx — includes Google Books, OpenLibrary, Amazon & Flipkart data!`, "success");
    return true;
}
// %%% Styles %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
    .platform-grid { margin-top: 14px; border: 1px solid #1e1e2e; border-radius: 8px; overflow: hidden; }
    .platform-row { display: grid; grid-template-columns: 100px 1fr 1fr; border-bottom: 1px solid #1e1e2e; font-size: 0.72rem; }
    .platform-row:last-child { border-bottom: none; }
    .platform-header { background: #0d0d14; }
    .platform-cell { padding: 6px 10px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .platform-cell.label { color: #f0e040; font-weight: 600; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; }
    .platform-cell.src-g { color: #4285f4; }
    .platform-cell.src-ol { color: #f0e040; }
    .platform-cell.na { color: #334155; font-style: italic; }
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

// %%% Load ZXing %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

// %%% Load SheetJS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

// %%% Convert image URL to base64 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

// %%% Store link generator %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function storeLinks(isbn) {
    const q = encodeURIComponent(isbn);
    return {
        flipkart: `https://www.flipkart.com/search?q=${q}&otracker=search`,
        amazon: `https://www.amazon.in/s?k=${q}`,
        google: `https://books.google.com/books?q=isbn:${isbn}`,
        isbnIndia: `https://www.isbn.gov.in/Book_Detail.aspx?id=${isbn}`,
    };
}

const NA = "N/A";
const v = (val) => (val !== undefined && val !== null && val !== "") ? String(val) : NA;

// %%% Data sources — fetched in PARALLEL %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

async function fetchGoogleBooks(isbn) {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`;
        let res = await fetch(url);
        
        // If rate limited, wait 2 seconds and try once more
        if (res.status === 429) {
            await new Promise(r => setTimeout(r, 2000));
            res = await fetch(url);
        }
        
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.totalItems) return null;
        
        const v = data.items[0].volumeInfo;
        return {
            title:       v.title || "",
            subtitle:    v.subtitle || "",
            authors:     (v.authors || []).join(", "),
            publisher:   v.publisher || "",
            year:        (v.publishedDate || "").slice(0, 4),
            pages:       v.pageCount || "",
            language:    v.language || "",
            categories:  (v.categories || []).join(", "),
            description: (v.description || "").slice(0, 400),
            thumbnail:   v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || "",
        };
    } catch {
        return null;
    }
}

async function fetchOpenLibrary(isbn) {
    try {
        const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        const data = await res.json();
        const b = data[`ISBN:${isbn}`];
        if (!b) return null;
        return {
            title: v(b.title),
            subtitle: b.subtitle || "",
            authors: v((b.authors || []).map(a => a.name).join(", ")),
            publisher: v((b.publishers || []).map(p => p.name).join(", ")),
            year: v(b.publish_date),
            pages: v(b.number_of_pages),
            language: v(b.language?.key?.replace("/languages/", "")),
            categories: v((b.subjects || []).slice(0, 4).map(s => s.name || s).join(", ")),
            description: typeof b.notes === "string" ? b.notes.slice(0, 200) : "",
            thumbnail: b.cover?.large || b.cover?.medium || b.cover?.small || "",
        };
    } catch { return null; }
}

// Merge best available data for display
function mergeBest(g, o) {
    if (!g && !o) return null;
    const p = g || o;
    return {
        title: p.title,
        subtitle: p.subtitle,
        authors: p.authors,
        publisher: p.publisher,
        year: p.year,
        pages: p.pages,
        language: p.language,
        categories: p.categories,
        description: p.description,
        thumbnail: g?.thumbnail || o?.thumbnail || "",
    };
}

// %%% Export XLSX + HTML %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
async function doExport(books, showStatus) {
    showStatus("📦 Loading export library...", "info");
    let XLSX;
    try { XLSX = await loadXLSX(); } catch {
        showStatus("Failed to load export library. Check your internet.", "error"); return;
    }

    showStatus("🖼  Fetching cover images — please wait...", "info");
    const images = await Promise.all(books.map(b => imgToBase64(b.thumbnail)));

    const wb = XLSX.utils.book_new();

    // Sheet 1 — All Platform Data (Google Books + OpenLibrary columns side-by-side)
    const s1headers = [
        "#", "ISBN",
        "GB Title", "GB Authors", "GB Publisher", "GB Year", "GB Pages", "GB Language", "GB Categories",
        "OL Title", "OL Authors", "OL Publisher", "OL Year", "OL Pages", "OL Language", "OL Categories",
        "Best Title", "Best Authors", "Best Publisher", "Best Year", "Best Pages", "Best Language",
        "Cover URL",
        "Flipkart Link", "Amazon India Link", "Google Books Link", "ISBN India Link",
        "On Google Books?", "On OpenLibrary?",
    ];
    const s1rows = books.map((b, i) => {
        const g = b.google || {};
        const o = b.openlibrary || {};
        const l = storeLinks(b.isbn);
        return [
            i + 1, b.isbn,
            g.title || NA, g.authors || NA, g.publisher || NA, g.year || NA, g.pages || NA, g.language || NA, g.categories || NA,
            o.title || NA, o.authors || NA, o.publisher || NA, o.year || NA, o.pages || NA, o.language || NA, o.categories || NA,
            b.title, b.authors, b.publisher, b.year, b.pages, b.language,
            b.thumbnail || NA,
            l.flipkart, l.amazon, l.google, l.isbnIndia,
            b.google ? "Yes" : "No",
            b.openlibrary ? "Yes" : "No",
        ];
    });
    const ws1 = XLSX.utils.aoa_to_sheet([s1headers, ...s1rows]);
    ws1["!cols"] = [
        {wch:4},{wch:16},
        {wch:32},{wch:28},{wch:22},{wch:6},{wch:7},{wch:8},{wch:30},
        {wch:32},{wch:28},{wch:22},{wch:10},{wch:7},{wch:8},{wch:30},
        {wch:32},{wch:28},{wch:22},{wch:6},{wch:7},{wch:8},
        {wch:50},
        {wch:55},{wch:55},{wch:55},{wch:55},
        {wch:16},{wch:16},
    ];
    XLSX.utils.book_append_sheet(wb, ws1, "All Platform Data");

    // Sheet 2 — Google Books raw
    const ws2 = XLSX.utils.aoa_to_sheet([
        ["#","ISBN","Title","Authors","Publisher","Year","Pages","Language","Categories","Description","Cover URL"],
        ...books.map((b, i) => {
            const g = b.google || {};
            return [i+1, b.isbn, g.title||NA, g.authors||NA, g.publisher||NA, g.year||NA,
                g.pages||NA, g.language||NA, g.categories||NA, g.description||NA, g.thumbnail||NA];
        })
    ]);
    ws2["!cols"] = [{wch:4},{wch:16},{wch:34},{wch:28},{wch:24},{wch:6},{wch:7},{wch:8},{wch:30},{wch:50},{wch:55}];
    XLSX.utils.book_append_sheet(wb, ws2, "Google Books");

    // Sheet 3 — OpenLibrary raw
    const ws3 = XLSX.utils.aoa_to_sheet([
        ["#","ISBN","Title","Authors","Publisher","Year","Pages","Language","Categories","Description","Cover URL"],
        ...books.map((b, i) => {
            const o = b.openlibrary || {};
            return [i+1, b.isbn, o.title||NA, o.authors||NA, o.publisher||NA, o.year||NA,
                o.pages||NA, o.language||NA, o.categories||NA, o.description||NA, o.thumbnail||NA];
        })
    ]);
    ws3["!cols"] = [{wch:4},{wch:16},{wch:34},{wch:28},{wch:24},{wch:10},{wch:7},{wch:8},{wch:30},{wch:50},{wch:55}];
    XLSX.utils.book_append_sheet(wb, ws3, "OpenLibrary");

    // Sheet 4 — Covers (Excel 365 =IMAGE())
    const ws4 = XLSX.utils.aoa_to_sheet([
        ["#","Title","Cover URL","=IMAGE() Formula (Excel 365)"],
        ...books.map((b, i) => [i+1, b.title, b.thumbnail||NA, b.thumbnail ? `=IMAGE("${b.thumbnail}")` : NA])
    ]);
    ws4["!cols"] = [{wch:4},{wch:36},{wch:55},{wch:55}];
    XLSX.utils.book_append_sheet(wb, ws4, "Covers (Excel365)");

    // Sheet 5 — Store Links
    const ws5 = XLSX.utils.aoa_to_sheet([
        ["#","Title","ISBN","Flipkart","Amazon India","Google Books","ISBN India Gov"],
        ...books.map((b, i) => {
            const l = storeLinks(b.isbn);
            return [i+1, b.title, b.isbn, l.flipkart, l.amazon, l.google, l.isbnIndia];
        })
    ]);
    ws5["!cols"] = [{wch:4},{wch:36},{wch:16},{wch:55},{wch:55},{wch:55},{wch:55}];
    XLSX.utils.book_append_sheet(wb, ws5, "Store Links");

    XLSX.writeFile(wb, "book_list.xlsx");

    // HTML with embedded images (all platform columns)
    const htmlRows = books.map((b, i) => {
        const l = storeLinks(b.isbn);
        const g = b.google || {};
        const o = b.openlibrary || {};
        const imgTag = images[i]
            ? `<img src="${images[i]}" style="width:56px;height:80px;object-fit:cover;border-radius:4px;box-shadow:0 2px 8px #0003">`
            : `<div style="width:56px;height:80px;background:#e2e8f0;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.5rem">📚</div>`;
        const cell = (val) => `<td style="font-size:12px">${(!val || val === NA) ? '<span style="color:#bbb;font-style:italic">N/A</span>' : val}</td>`;
        return `<tr>
            <td style="text-align:center;color:#94a3b8;font-size:12px">${i+1}</td>
            <td style="text-align:center;padding:6px 8px">${imgTag}</td>
            <td><strong style="font-size:13px">${b.title}</strong>${b.subtitle ? `<br><span style="color:#64748b;font-size:11px">${b.subtitle}</span>` : ""}</td>
            <td style="font-family:monospace;font-size:11px">${b.isbn}</td>
            <td style="font-size:11px;white-space:nowrap">
                <a href="${l.flipkart}" target="_blank" style="display:block;color:#e65100;margin-bottom:3px;text-decoration:none">🛒 Flipkart</a>
                <a href="${l.amazon}" target="_blank" style="display:block;color:#f57f17;margin-bottom:3px;text-decoration:none">🛒 Amazon</a>
                <a href="${l.google}" target="_blank" style="display:block;color:#1565c0;margin-bottom:3px;text-decoration:none">📖 Google Books</a>
                <a href="${l.isbnIndia}" target="_blank" style="display:block;color:#1b5e20;text-decoration:none">🏛 ISBN India</a>
            </td>
            ${cell(g.title)}${cell(g.authors)}${cell(g.publisher)}${cell(g.year)}${cell(g.pages)}${cell(g.language)}${cell(g.categories)}
            ${cell(o.title)}${cell(o.authors)}${cell(o.publisher)}${cell(o.year)}${cell(o.pages)}${cell(o.language)}${cell(o.categories)}
        </tr>`;
    }).join("\n");

    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Book List – All Platform Data</title>
<style>
body{font-family:Arial,sans-serif;background:#f8fafc;color:#1e293b;margin:0;padding:24px}
h1{font-size:1.5rem;margin-bottom:4px}p{color:#64748b;font-size:13px;margin-bottom:18px}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px #0001}
th{background:#0f172a;color:#f1f5f9;padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.8px;white-space:nowrap}
th.gb{background:#1a3a6b;color:#90caf9}th.ol{background:#7c5000;color:#fde68a}
td{padding:8px 12px;border-bottom:1px solid #e2e8f0;vertical-align:middle}
tr:last-child td{border-bottom:none}tr:hover td{background:#f1f5f9}
</style></head><body>
<h1>📚 Book List – All Platform Data</h1>
<p>Generated ${new Date().toLocaleString()} &nbsp;·&nbsp; ${books.length} book${books.length!==1?"s":""} &nbsp;·&nbsp; Blue columns = Google Books · Orange columns = OpenLibrary · N/A = not found on that platform</p>
<table><thead><tr>
<th>#</th><th>Cover</th><th>Title</th><th>ISBN</th><th>Buy / Search</th>
<th class="gb">GB Title</th><th class="gb">GB Authors</th><th class="gb">GB Publisher</th><th class="gb">GB Year</th><th class="gb">GB Pages</th><th class="gb">GB Lang</th><th class="gb">GB Categories</th>
<th class="ol">OL Title</th><th class="ol">OL Authors</th><th class="ol">OL Publisher</th><th class="ol">OL Year</th><th class="ol">OL Pages</th><th class="ol">OL Lang</th><th class="ol">OL Categories</th>
</tr></thead>
<tbody>${htmlRows}</tbody></table></body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "book_list_all_platforms.html"; a.click();
    URL.revokeObjectURL(url);

    showStatus(`✅ Downloaded: book_list.xlsx (5 sheets) + book_list_all_platforms.html — N/A used wherever a platform has no data`, "success");
}

// %%% Main Component %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

    const startCamera = async () => {
        setStatus(null);
        showStatus("📷 Loading scanner...", "info");
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

    // Fetch Google Books + OpenLibrary in PARALLEL, store both
    const fetchBook = useCallback(async (rawIsbn) => {
        const isbn = rawIsbn.replace(/[^0-9X]/gi, "");
        if (isbn.length < 8) { showStatus("ISBN too short. Check the number.", "error"); return; }
        setLoading(true);
        showStatus(`🔍 Querying Google Books + OpenLibrary simultaneously for: ${isbn}`, "info");

        const [gb, ol] = await Promise.all([fetchGoogleBooks(isbn), fetchOpenLibrary(isbn)]);
        const merged = mergeBest(gb, ol);
        const links = storeLinks(isbn);

        if (!merged) {
            showStatus(`No data found on any platform for ISBN ${isbn}. Search manually on stores below.`, "error");
            setPreview({ isbn, noData: true, storeLinks: links });
            setLoading(false); return;
        }

        const book = {
            isbn,
            title: merged.title,
            subtitle: merged.subtitle,
            authors: merged.authors,
            publisher: merged.publisher,
            year: merged.year,
            pages: merged.pages,
            language: merged.language,
            categories: merged.categories,
            description: merged.description,
            thumbnail: merged.thumbnail,
            storeLinks: links,
            google: gb,       // full Google Books data (null if not found)
            openlibrary: ol,  // full OpenLibrary data (null if not found)
        };

        setPreview(book);
        setBooks(prev => {
            if (prev.find(b => b.isbn === isbn)) {
                showStatus(`Already in list: "${book.title}"`, "info"); return prev;
            }
            const found = [gb && "Google Books", ol && "OpenLibrary"].filter(Boolean).join(" + ") || "unknown";
            showStatus(`✅ Added: "${book.title}" — found on: ${found}`, "success");
            return [book, ...prev];
        });
        setLoading(false);
    }, [showStatus]);

    const handleSearch = () => { lastScannedRef.current = ""; fetchBook(isbnInput); };
    const removeBook = (isbn) => setBooks(prev => prev.filter(b => b.isbn !== isbn));

    const handleExport = async () => {
    if (!books.length) { showStatus("No books to export.", "error"); return; }
    setExporting(true);

    // Try the Railway backend first (gives Amazon + Flipkart data)
    const backendSuccess = await downloadBulkExcel(books, showStatus);

    // If backend failed or not set up yet, fall back to the original browser export
    if (!backendSuccess) {
        showStatus("⚠️ Falling back to browser-only export (no Amazon/Flipkart prices)…", "info");
        await doExport(books, showStatus);
    }

    setExporting(false);
};

    const openSheets = () => {
        if (!books.length) { showStatus("No books to export.", "error"); return; }
        const h = ["#","ISBN","Best Title","Best Authors","Best Publisher","Best Year",
            "GB Title","GB Authors","GB Publisher","GB Year",
            "OL Title","OL Authors","OL Publisher","OL Year",
            "Flipkart","Amazon","Google Books","ISBN India","On GB?","On OL?"];
        const rows = books.map((b,i) => {
            const g = b.google||{}; const o = b.openlibrary||{}; const l = storeLinks(b.isbn);
            return [i+1,b.isbn,b.title,b.authors,b.publisher,b.year,
                g.title||NA,g.authors||NA,g.publisher||NA,g.year||NA,
                o.title||NA,o.authors||NA,o.publisher||NA,o.year||NA,
                l.flipkart,l.amazon,l.google,l.isbnIndia,
                b.google?"Yes":"No", b.openlibrary?"Yes":"No"];
        });
        const tsv = [h,...rows].map(r=>r.join("\t")).join("\n");
        navigator.clipboard.writeText(tsv).then(() => {
            window.open("https://sheets.new","_blank");
            showStatus("📋 Copied! In new Google Sheet: click A1 → Ctrl+V to paste.", "success");
        }).catch(() => {
            window.open("https://sheets.new","_blank");
            showStatus("Opened Sheets. Download XLSX and use File → Import.", "info");
        });
    };

    useEffect(() => () => stopCamera(), [stopCamera]);

    // Platform comparison panel shown below book preview
    const PlatformPanel = ({ book }) => {
        const g = book.google;
        const o = book.openlibrary;
        const fields = [
            ["Title",      g?.title,      o?.title],
            ["Authors",    g?.authors,    o?.authors],
            ["Publisher",  g?.publisher,  o?.publisher],
            ["Year",       g?.year,       o?.year],
            ["Pages",      g?.pages,      o?.pages],
            ["Language",   g?.language,   o?.language],
            ["Categories", g?.categories, o?.categories],
        ];
        return (
            <div className="platform-grid">
                <div className="platform-row platform-header">
                    <div className="platform-cell label">Field</div>
                    <div className="platform-cell" style={{color:"#4285f4",fontWeight:700,fontSize:"0.7rem"}}>
                        🔵 Google Books{!g && <span style={{marginLeft:6,color:"#f87171",fontSize:"0.6rem"}}>not found</span>}
                    </div>
                    <div className="platform-cell" style={{color:"#f0e040",fontWeight:700,fontSize:"0.7rem"}}>
                        🟡 OpenLibrary{!o && <span style={{marginLeft:6,color:"#f87171",fontSize:"0.6rem"}}>not found</span>}
                    </div>
                </div>
                {fields.map(([label, gVal, oVal]) => (
                    <div className="platform-row" key={label}>
                        <div className="platform-cell label">{label}</div>
                        <div className={`platform-cell ${(!gVal || gVal===NA) ? "na" : "src-g"}`} title={gVal||NA}>{gVal||NA}</div>
                        <div className={`platform-cell ${(!oVal || oVal===NA) ? "na" : "src-ol"}`} title={oVal||NA}>{oVal||NA}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <style>{STYLES}</style>
            <div className="app">
                <div className="wrap">

                    <div className="header">
                        <h1>📚 Book ISBN Scanner</h1>
                        <p>FLIPKART · AMAZON · GOOGLE BOOKS · OPENLIBRARY · ISBN INDIA · EXPORT WITH COVERS</p>
                    </div>

                    {/* Scanner */}
                    <div className="card">
                        <div className="card-label">01 — Camera Scanner</div>
                        {scanning ? (
                            <div className="cam-box" style={{maxWidth:420,margin:"0 auto 14px"}}>
                                <video ref={videoRef} playsInline muted style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} />
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
                                : <button className="btn btn-red" onClick={stopCamera}>✖ Stop Camera</button>}
                        </div>
                        <div className="input-group">
                            <input
                                value={isbnInput}
                                onChange={e => setIsbnInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                                placeholder="Type or paste ISBN (10 or 13 digits)…"
                            />
                            <button className="btn btn-yellow" onClick={handleSearch} disabled={loading || !isbnInput.trim()}>
                                {loading ? <><span className="spinner" /> Searching…</> : "🔍 Search All"}
                            </button>
                        </div>
                        {status && <div className={`status status-${status.type}`}>{status.msg}</div>}
                    </div>

                    {/* Preview */}
                    {preview && (
                        <div className="card">
                            <div className="card-label">02 — Last Scanned Book</div>
                            {preview.noData ? (
                                <>
                                    <div style={{color:"#f87171",marginBottom:10}}>
                                        No data found on Google Books or OpenLibrary for ISBN: <strong>{preview.isbn}</strong>
                                    </div>
                                    <div className="store-links">
                                        <a href={preview.storeLinks.flipkart} target="_blank" className="store-link store-flipkart">🛒 Flipkart</a>
                                        <a href={preview.storeLinks.amazon} target="_blank" className="store-link store-amazon">🛒 Amazon</a>
                                        <a href={preview.storeLinks.google} target="_blank" className="store-link store-google">📖 Google Books</a>
                                        <a href={preview.storeLinks.isbnIndia} target="_blank" className="store-link store-isbn">🏛 ISBN India</a>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="book-preview">
                                        {preview.thumbnail
                                            ? <img src={preview.thumbnail} className="book-cover" alt="" />
                                            : <div className="book-cover-ph">📚</div>}
                                        <div className="book-info">
                                            <h3>
                                                {preview.title}
                                                {preview.google && <span className="source-badge src-google">Google</span>}
                                                {preview.openlibrary && <span className="source-badge src-openlibrary">OpenLib</span>}
                                            </h3>
                                            <div className="meta-grid">
                                                <span className="meta-key">ISBN</span><span className="meta-val">{preview.isbn}</span>
                                                <span className="meta-key">Authors</span><span className="meta-val">{preview.authors}</span>
                                                <span className="meta-key">Publisher</span><span className="meta-val">{preview.publisher}</span>
                                                <span className="meta-key">Year</span><span className="meta-val">{preview.year}</span>
                                                <span className="meta-key">Pages</span><span className="meta-val">{preview.pages}</span>
                                                <span className="meta-key">Language</span><span className="meta-val">{preview.language}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Side-by-side platform comparison */}
                                    <PlatformPanel book={preview} />

                                    <div className="store-links" style={{marginTop:12}}>
                                        <a href={preview.storeLinks.flipkart} target="_blank" className="store-link store-flipkart">🛒 Flipkart</a>
                                        <a href={preview.storeLinks.amazon} target="_blank" className="store-link store-amazon">🛒 Amazon</a>
                                        <a href={preview.storeLinks.google} target="_blank" className="store-link store-google">📖 Google Books</a>
                                        <a href={preview.storeLinks.isbnIndia} target="_blank" className="store-link store-isbn">🏛 ISBN India</a>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Book List */}
                    <div className="card">
                        <div className="card-label">
                            03 — Book List
                            {books.length > 0 && <span className="badge">{books.length} book{books.length!==1?"s":""}</span>}
                        </div>

                        {books.length === 0 ? (
                            <div className="empty">
                                <span className="empty-icon">📭</span>
                                Scan or type an ISBN above to start building your list
                            </div>
                        ) : (
                            <div className="table-scroll">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th><th>Cover</th><th>Title</th><th>Authors</th>
                                            <th>Publisher</th><th>Year</th><th>ISBN</th><th>Pages</th>
                                            <th>Lang</th>
                                            <th title="Found on Google Books">GB✓</th>
                                            <th title="Found on OpenLibrary">OL✓</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books.map((b, i) => (
                                            <tr key={b.isbn}>
                                                <td>{i + 1}</td>
                                                <td style={{padding:"4px 8px"}}>
                                                    {b.thumbnail
                                                        ? <img src={b.thumbnail} style={{width:30,height:42,objectFit:"cover",borderRadius:3,display:"block"}} alt="" />
                                                        : <span style={{fontSize:"1.1rem"}}>📚</span>}
                                                </td>
                                                <td title={b.title}>{b.title.slice(0,22)}{b.title.length>22?"…":""}</td>
                                                <td title={b.authors}>{(b.authors||"").slice(0,18)}{(b.authors||"").length>18?"…":""}</td>
                                                <td title={b.publisher}>{(b.publisher||"").slice(0,15)}{(b.publisher||"").length>15?"…":""}</td>
                                                <td>{b.year}</td>
                                                <td style={{fontFamily:"monospace",fontSize:"0.7rem"}}>{b.isbn}</td>
                                                <td>{b.pages}</td>
                                                <td>{b.language}</td>
                                                <td style={{color:b.google?"#4285f4":"#334155",fontSize:"0.7rem",textAlign:"center"}}>
                                                    {b.google ? "✓" : "✗"}
                                                </td>
                                                <td style={{color:b.openlibrary?"#f0e040":"#334155",fontSize:"0.7rem",textAlign:"center"}}>
                                                    {b.openlibrary ? "✓" : "✗"}
                                                </td>
                                                <td>
                                                    <button className="btn btn-red" style={{padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>removeBook(b.isbn)}>✕</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="export-row">
                            <button className="btn btn-yellow" onClick={handleExport} disabled={!books.length||exporting}>
                                {exporting ? <><span className="spinner" /> Exporting…</> : "⬇ Download Excel + HTML"}
                            </button>
                            <button className="btn btn-teal" onClick={openSheets} disabled={!books.length}>📊 Google Sheets</button>
                            {books.length > 0 && (
                                <button className="btn btn-red" style={{marginLeft:"auto"}} onClick={()=>{if(confirm("Clear all books?"))setBooks([]);}}>🗑 Clear All</button>
                            )}
                        </div>
                        {books.length > 0 && (
                            <div className="export-note">
                                Excel = <strong>5 sheets</strong>: All Platform Data (GB + OL columns side-by-side) · Google Books raw · OpenLibrary raw · Covers (=IMAGE() for Excel 365) · Store Links<br />
                                HTML = same table with actual cover images embedded · <strong>N/A</strong> shown wherever a platform has no data for that field
                            </div>
                        )}
                    </div>

                    {/* Help */}
                    <div className="card">
                        <div className="card-label">How it works</div>
                        <div style={{fontSize:"0.78rem",lineHeight:2.2,color:"#64748b"}}>
                            <span style={{color:"#f0e040"}}>Search strategy</span> → Google Books + OpenLibrary are queried <strong style={{color:"#40e0b0"}}>in parallel</strong> every time. Data from both is stored separately and shown side-by-side in the preview grid and Excel.<br />
                            <span style={{color:"#f0e040"}}>N/A</span> → shown wherever a platform doesn't have that field for the book (not a fallback — both are always tried).<br />
                            <span style={{color:"#f0e040"}}>Why not Flipkart/Amazon data?</span> → Their APIs block browser requests (CORS policy). Store links open their site so you can check prices manually.<br />
                            <span style={{color:"#f0e040"}}>GB✓ / OL✓ columns</span> → checkmarks in the book list show which platform actually returned data for that ISBN.<br />
                            <span style={{color:"#475569"}}>Data: Google Books API + Open Library · Free, no login required</span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
