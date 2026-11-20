/* =====================================================================
   Bondhan Education – LMS interaktif SEO (HTML + CSS + JavaScript murni)
   Data tersimpan di localStorage browser siswa. Konten ada di js/data.js
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const KEY = "bondhan_education_seo_v1";
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

/* ---------- state ---------- */
const fresh = () => ({
  nama: "", kelas: "", read: {}, lat: {}, music: true, quiz: { ans: [], done: false },
  pj: { kel: "", kanal: "", produk: "", plat: PLATFORM[0], ang: ["", "", "", ""], ph: TAHAP.map(() => ({ chk: {}, link: "", note: "", done: false })),
    lk: { kw: "", lt: ["", "", ""], file: "", title: "", desc: "", tags: "", pos: "", views: "", ctr: "", trafik: "" }, rub: [0, 0, 0, 0, 0] }
});
let S = (() => { try { const s = JSON.parse(localStorage.getItem(KEY)); return s ? { ...fresh(), ...s, pj: { ...fresh().pj, ...s.pj } } : fresh(); } catch (e) { return fresh(); } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const T = { tab: "beranda", mod: 0, qi: 0, urut: {}, jod: {}, kls: {}, msg: {}, open: new Set() };   // state sementara (tidak disimpan)
const setPath = (o, p, v) => { const k = p.split("."); const last = k.pop(); const t = k.reduce((a, x) => a[x], o); t[last] = v; };

/* ---------- audio ---------- */
const bgm = $("#bgm"); bgm.volume = .25; let ac;
function tone(f, d = .15, t = 0) { try { ac = ac || new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(), s = ac.currentTime + t; o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(.2, s); g.gain.exponentialRampToValueAtTime(.001, s + d); o.connect(g); g.connect(ac.destination); o.start(s); o.stop(s + d); } catch (e) {} }
const sOk = () => { tone(660, .12); tone(880, .22, .12); }, sNo = () => { tone(220, .22); tone(160, .3, .18); };
function syncMusic() { $("#mbtn").textContent = S.music ? "🔊 Musik" : "🔇 Musik"; if (S.music) bgm.play().catch(() => {}); else bgm.pause(); }
$("#mbtn").onclick = () => { S.music = !S.music; save(); syncMusic(); };
document.addEventListener("click", () => { if (S.music && bgm.paused) bgm.play().catch(() => {}); }, { once: false });

/* ---------- perhitungan progres ---------- */
const wc = x => (x.trim().match(/\S+/g) || []).length;
function seoCheck() {                                              // SEO Checker untuk Lembar Kerja Praktik Video SEO
  const L = S.pj.lk, kw = L.kw.trim().toLowerCase(), t = L.title.trim(), d = L.desc.trim(), tags = L.tags.split(",").map(x => x.trim()).filter(Boolean);
  const slug = kw.replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-"), first100 = d.split(/\s+/).slice(0, 100).join(" ").toLowerCase(), idx = kw ? t.toLowerCase().indexOf(kw) : -1;
  return [
    [kw.length >= 3, "Kata kunci utama terisi"],
    [L.lt.filter(x => wc(x) >= 4).length >= 3, "3 kata kunci turunan long-tail (masing-masing ≥ 4 kata)"],
    [!!slug && /^[a-z0-9]+(-[a-z0-9]+)*\.mp4$/.test(L.file.trim()) && L.file.trim().includes(slug), "Nama file .mp4 memuat kata kunci (huruf kecil, tanda hubung)"],
    [t.length >= 50 && t.length <= 60, `Judul 50–60 karakter (sekarang ${t.length})`],
    [idx >= 0 && idx <= 12, "Kata kunci utama berada di bagian awal judul"],
    [wc(d) >= 150, `Deskripsi minimal 150 kata (sekarang ${wc(d)})`],
    [!!kw && first100.includes(kw), "Kata kunci utama ada di 100 kata pertama deskripsi"],
    [/\b\d{1,2}:\d{2}\b/.test(d), "Ada timestamps/chapters (mis. 00:45)"],
    [(d.match(/#[\p{L}\d_]+/gu) || []).length >= 3, "Minimal 3 hashtag relevan di deskripsi"],
    [tags.length >= 5 && tags.length <= 8, `5–8 tags dipisahkan koma (sekarang ${tags.length})`]
  ];
}
function seoPanel() {
  const ck = seoCheck(), n = ck.filter(x => x[0]).length, L = S.pj.lk, ctr = parseFloat(String(L.ctr).replace(",", "."));
  const adv = isNaN(ctr) ? "" : ctr < 4 ? "⚠️ CTR < 4%: rumuskan perbaikan judul/thumbnail dan evaluasi hook 15 detik pertama." : "✅ CTR ≥ 4%: judul & thumbnail cukup efektif. Pertahankan dan uji variasi.";
  return `<b>🔍 SEO Checker: ${n}/10 terpenuhi</b><div class="bt"><i class="c" style="width:${Math.max(2, n * 10)}%"></i></div><ul class="ckl">${ck.map(c => `<li>${c[0] ? "✅" : "⬜"} ${c[1]}</li>`).join("")}</ul>
  <div class="serp"><small>Pratinjau hasil pencarian</small><div class="sp-t">${esc(L.title) || "Judul videomu tampil di sini"}</div><div class="sp-c">${esc(S.pj.kanal) || "Nama kanal"} · ${esc(L.views) || "0"} tayangan</div><div class="sp-d">${esc(L.desc.slice(0, 150)) || "Deskripsi singkat tampil di sini…"}</div></div>${adv ? `<p class="fb ${ctr < 4 ? "bad" : "good"}">${adv}</p>` : ""}`;
}
function calc() {
  const rd = Object.keys(S.read).length, latD = Object.keys(S.lat).length, latSc = Object.values(S.lat).reduce((a, x) => a + x.sc, 0);
  const phD = S.pj.ph.filter(p => p.done).length, right = S.quiz.ans.filter((a, i) => a === KUIS[i].a).length, quiz = S.quiz.done ? right * 10 : 0;
  const rated = S.pj.rub.every(x => x > 0), nilai = rated ? Math.round(RUBRIK.reduce((a, r, i) => a + r[1] * S.pj.rub[i] / 4, 0)) : 0, seo = seoCheck().filter(x => x[0]).length;
  return { rd, mp: Math.round(rd / TOTAL_CARDS * 100), latD, latSc, lp: Math.round(latD / LATIHAN.length * 100), phD, pp: Math.round(phD / TAHAP.length * 100), right, quiz, rated, nilai, seo, lulus: S.quiz.done && quiz >= 70 };
}
const BADGES = [
  ["🪪", "Profil Lengkap", "Isi nama & kelas", c => !!(S.nama && S.kelas)], ["📚", "Penjelajah Materi", "Baca ≥ 8 kartu", c => c.rd >= 8],
  ["🧠", "Master Materi", "Baca semua kartu", c => c.rd >= TOTAL_CARDS], ["🎯", "Juara Latihan", "Selesaikan semua latihan", c => c.latD >= LATIHAN.length],
  ["🔍", "SEO Specialist", "SEO Checker ≥ 8/10", c => c.seo >= 8], ["🏆", "Project Hero", "Selesaikan 6 tahap PjBL", c => c.phD >= TAHAP.length], ["🎓", "Kuis Master", "Nilai kuis ≥ 80", c => c.quiz >= 80]
];
const bar = (l, v, cl = "") => `<div class="bar"><div class="bl"><span>${l}</span><b>${v}%</b></div><div class="bt"><i class="${cl}" style="width:${Math.max(2, v)}%"></i></div></div>`;

/* ---------- tampilan ---------- */
const V = {};
V.beranda = () => {
  const c = calc();
  return `<section class="hero"><p class="gold">🎓 Bondhan Education</p><h1>Halo${S.nama ? ", " + esc(S.nama) : ", SEO Specialist"}! 👋</h1><p>Pelajari <b>Search Engine Optimization (SEO)</b>: dari riset kata kunci sampai membuat video yang naik ke halaman 1 pencarian. Kerjakan proyek PjBL bersama kelompokmu dan raih sertifikat.</p>
  <div class="row">${[["materi", "📖 Mulai Belajar"], ["latihan", "🎮 Latihan"], ["pjbl", "🎬 Proyek PjBL"], ["kuis", "📝 Kuis"]].map(x => `<button class="btn gold-b" data-a="tab" data-t="${x[0]}">${x[1]}</button>`).join("")}</div></section>
  <section class="card"><h2>🪪 Profil Siswa <small>(tersimpan otomatis)</small></h2><div class="g2"><input data-k="nama" value="${esc(S.nama)}" placeholder="Nama lengkap siswa"><input data-k="kelas" value="${esc(S.kelas)}" placeholder="Kelas (mis. XI BD 1)"></div>
  <p class="muted">Kelompok PjBL: ${S.pj.kel ? `<b>${esc(S.pj.kel)}</b> · ${esc(S.pj.plat)}` : "belum diisi – lengkapi di tab Proyek PjBL"}</p></section>
  <section class="stats">${[["📖", c.mp + "%", "Materi (" + c.rd + "/" + TOTAL_CARDS + ")"], ["🎮", c.latSc, "Skor latihan"], ["🎬", c.phD + "/" + TAHAP.length, "Tahap PjBL"], ["📝", S.quiz.done ? c.quiz : "—", "Nilai kuis"]].map(x => `<div class="card st"><div class="em">${x[0]}</div><b>${x[1]}</b><span>${x[2]}</span></div>`).join("")}</section>
  <section class="card">${bar("Progres Materi", c.mp)}${bar("Progres Latihan", c.lp, "p")}${bar("Progres Proyek PjBL", c.pp, "g")}${bar("SEO Checker Video", c.seo * 10, "p")}${bar("Nilai Kuis", c.quiz, "c")}</section>
  <section class="card"><h2>🏅 Koleksi Lencana</h2><div class="badges">${BADGES.map(b => { const k = b[3](c); return `<div class="badge ${k ? "on" : ""}"><span>${b[0]}</span><b>${b[1]}</b><small>${b[2]}</small></div>`; }).join("")}</div></section>
  <section class="card"><h2>🧭 Alur Belajar</h2><ol class="flow"><li><b>Materi</b> – ruang lingkup, jenis SEO, keyword, teknik optimasi</li><li><b>Latihan</b> – urutkan, jodohkan, dan klasifikasi konsep</li><li><b>Proyek PjBL</b> – 6 tahap Video SEO + SEO Checker</li><li><b>Kuis HOTS</b> – 10 soal studi kasus</li><li><b>Sertifikat & Laporan</b> – unduh bukti belajar</li></ol></section>
  <p class="muted"><a href="#" data-a="reset">Reset semua progres</a></p>`;
};
V.materi = () => {
  const m = MATERI[T.mod];
  return `<div class="pills">${MATERI.map((x, i) => `<button class="pill ${i === T.mod ? "on" : ""}" data-a="mod" data-i="${i}">${x.em} ${x.t}</button>`).join("")}</div>
  <p class="muted">Buka setiap kartu untuk menandainya sudah dibaca (${Object.keys(S.read).length}/${TOTAL_CARDS}).</p>
  ${m.cards.map(c => `<details class="card acc" data-id="${c.id}" ${T.open.has(c.id) ? "open" : ""}><summary><span>${c.t}</span><em class="rd">${S.read[c.id] ? "✓ dibaca" : ""}</em></summary><div class="body">${c.h}</div></details>`).join("")}`;
};
V.latihan = () => `<h2>🎮 Latihan Interaktif</h2><p class="muted">Selesaikan semua latihan. Benar di percobaan pertama = 100 poin, selanjutnya 60 poin.</p>${LATIHAN.map(L => {
  const done = S.lat[L.id], msg = T.msg[L.id] || "";
  let body = "";
  if (L.tipe === "urut") {
    const st = T.urut[L.id] || (T.urut[L.id] = { pool: shuffle(L.steps.map((_, i) => i)), pick: [], tries: 0 });
    body = `<p class="muted">Klik langkah sesuai urutan yang benar:</p><div class="chips">${st.pool.filter(i => !st.pick.includes(i)).map(i => `<button class="chip" data-a="up" data-id="${L.id}" data-i="${i}">${esc(L.steps[i])}</button>`).join("")}</div>
    <ol class="ans">${st.pick.map(i => `<li>${esc(L.steps[i])}</li>`).join("") || "<li class='muted'>(belum ada)</li>"}</ol><div class="row"><button class="btn" data-a="uc" data-id="${L.id}" ${st.pick.length < L.steps.length || done ? "disabled" : ""}>Periksa</button><button class="btn ghost" data-a="ur" data-id="${L.id}">Ulangi</button></div>`;
  } else if (L.tipe === "jodoh") {
    const st = T.jod[L.id] || (T.jod[L.id] = { defs: shuffle(L.pairs.map(p => p[1])), ans: {}, tries: 0 });
    body = `<div class="jod">${L.pairs.map((p, i) => `<label><b>${esc(p[0])}</b><select data-c="jd" data-id="${L.id}" data-i="${i}" ${done ? "disabled" : ""}><option value="">— pilih pasangan —</option>${st.defs.map(d => `<option ${st.ans[i] === d ? "selected" : ""}>${esc(d)}</option>`).join("")}</select></label>`).join("")}</div><div class="row"><button class="btn" data-a="jc" data-id="${L.id}" ${done ? "disabled" : ""}>Periksa</button></div>`;
  } else {
    const st = T.kls[L.id] || (T.kls[L.id] = { ans: {}, tries: 0 });
    body = `<div class="jod">${L.items.map((it, i) => `<label><b>${esc(it[0])}</b><select data-c="kd" data-id="${L.id}" data-i="${i}" ${done ? "disabled" : ""}><option value="">— pilih kategori —</option>${L.cats.map((cn, j) => `<option value="${j}" ${st.ans[i] === String(j) ? "selected" : ""}>${cn}</option>`).join("")}</select></label>`).join("")}</div><div class="row"><button class="btn" data-a="kc" data-id="${L.id}" ${done ? "disabled" : ""}>Periksa</button></div>`;
  }
  return `<section class="card ${done ? "done" : ""}"><h3>${L.t} ${done ? `<span class="ok">✓ ${done.sc} poin</span>` : ""}</h3>${body}<p class="fb ${msg.startsWith("✅") ? "good" : "bad"}">${msg}</p></section>`;
}).join("")}`;

V.pjbl = () => {
  const c = calc(), P = S.pj, L = P.lk;
  return `<div class="hero small"><h2>🎬 Proyek PjBL: Video SEO</h2><p>Kelompokmu berperan sebagai <b>Tim Video SEO Specialist</b>: merancang, memproduksi, dan mengoptimasi video promosi produk/jasa lokal agar muncul di peringkat atas pencarian <b>tanpa iklan berbayar</b>. Durasi: 3–4 pertemuan.</p></div>
  <section class="card"><h3>📋 Identitas Kelompok</h3><div class="g2"><input data-k="pj.kel" value="${esc(P.kel)}" placeholder="Nama / nomor kelompok"><select data-k="pj.plat">${PLATFORM.map(x => `<option ${P.plat === x ? "selected" : ""}>${x}</option>`).join("")}</select><input data-k="pj.kanal" value="${esc(P.kanal)}" placeholder="Nama kanal / akun video"><input data-k="pj.produk" value="${esc(P.produk)}" placeholder="Topik / produk yang dipromosikan"></div>
  <h4>👥 Pembagian Peran Tim</h4>${PERAN.map((r, i) => `<div class="role"><div><b>${i + 1}. ${r[0]}</b><small>${r[1]}</small></div><input data-k="pj.ang.${i}" value="${esc(P.ang[i])}" placeholder="Nama siswa"></div>`).join("")}${bar("Progres Proyek (" + c.phD + "/" + TAHAP.length + " tahap)", c.pp, "g")}</section>
  ${TAHAP.map((t, ti) => {
    const ph = P.ph[ti], id = "ph" + ti;
    return `<details class="card acc ${ph.done ? "done" : ""}" data-id="${id}" ${T.open.has(id) ? "open" : ""}><summary><span>Tahap ${ti + 1}: ${t.n}</span><em class="rd">${t.w}${ph.done ? " · ✓ selesai" : ""}</em></summary><div class="body"><p class="muted">Fokus: ${t.fk}</p>
    <ul class="chk">${t.um.map((x, i) => `<li><label><input type="checkbox" data-c="chk" data-t="${ti}" data-i="${i}" ${ph.chk[i] ? "checked" : ""}><span>${x}</span></label></li>`).join("")}</ul>
    <div class="box"><b>🎯 Tagihan / Bukti Kerja:</b> ${t.out}</div><input data-k="pj.ph.${ti}.link" value="${esc(ph.link)}" placeholder="Tautan bukti (video / Google Drive / screenshot)"><textarea data-k="pj.ph.${ti}.note" rows="3" placeholder="Catatan & ringkasan hasil kerja tahap ini">${esc(ph.note)}</textarea>
    <button class="btn ${ph.done ? "ghost" : ""}" data-a="phd" data-t="${ti}">${ph.done ? "↩ Batalkan selesai" : "✔ Tandai Tahap Selesai"}</button></div></details>`;
  }).join("")}
  <section class="card"><h3>🧪 Lembar Kerja Praktik Optimasi Video SEO</h3><p class="muted">Isi rancangan optimasi videomu. SEO Checker di bawah menilai otomatis berdasarkan materi.</p>
  <label class="lbl">1. Kata Kunci Utama (Main Keyword)</label><input data-k="pj.lk.kw" value="${esc(L.kw)}" placeholder="contoh: rekomendasi sepatu sekolah lokal murah">
  <label class="lbl">2. Kata Kunci Turunan (Long-Tail, ≥ 4 kata)</label><div class="g3">${[0, 1, 2].map(i => `<input data-k="pj.lk.lt.${i}" value="${esc(L.lt[i])}" placeholder="Long-tail ${i + 1}">`).join("")}</div>
  <label class="lbl">3. Nama File Video</label><input data-k="pj.lk.file" value="${esc(L.file)}" placeholder="rekomendasi-sepatu-sekolah-lokal-murah.mp4">
  <label class="lbl">4. Judul Video (50–60 karakter)</label><input data-k="pj.lk.title" value="${esc(L.title)}" placeholder="Kata kunci utama di awal judul + power words">
  <label class="lbl">5. Draf Deskripsi (≥ 150 kata) + timestamps + 3 hashtag</label><textarea data-k="pj.lk.desc" rows="7" placeholder="Paragraf pertama memuat kata kunci utama… 00:00 Pembukaan … #hashtag1 #hashtag2 #hashtag3">${esc(L.desc)}</textarea>
  <label class="lbl">6. Daftar Tags (5–8, pisahkan dengan koma)</label><input data-k="pj.lk.tags" value="${esc(L.tags)}" placeholder="sepatu sekolah, sepatu lokal, ...">
  <label class="lbl">7. Hasil Uji Peringkat & Analitik (Hari ke-4)</label><div class="g4"><input data-k="pj.lk.pos" value="${esc(L.pos)}" placeholder="Urutan ke-"><input data-k="pj.lk.views" value="${esc(L.views)}" placeholder="Views"><input data-k="pj.lk.ctr" value="${esc(L.ctr)}" placeholder="CTR thumbnail %"><input data-k="pj.lk.trafik" value="${esc(L.trafik)}" placeholder="Trafik Search %"></div>
  <div class="seo" id="seopanel">${seoPanel()}</div></section>
  <section class="card"><h3>📊 Rubrik & Penilaian Diri</h3><p class="muted">Nilai sendiri kelompokmu (1–4) sebelum presentasi. Guru memberi nilai akhir.</p>
  <table class="rub"><tr><th>Aspek</th><th>Bobot</th><th>Skor</th></tr>${RUBRIK.map((r, i) => `<tr><td><b>${r[0]}</b><br><small>${r[2]}</small></td><td>${r[1]}%</td><td><select data-c="rub" data-i="${i}"><option value="0">—</option>${SKOR.map((sk, j) => `<option value="${j + 1}" ${P.rub[i] === j + 1 ? "selected" : ""}>${j + 1} · ${sk}</option>`).join("")}</select></td></tr>`).join("")}</table>
  <p class="big">Estimasi nilai proyek: <b>${c.rated ? c.nilai + "/100" : "isi semua skor"}</b></p><button class="btn gold-b" data-a="report">⬇️ Unduh Laporan PjBL (.html)</button></section>`;
};

V.kuis = () => {
  const c = calc(), ans = S.quiz.ans;
  if (S.quiz.done) return `<section class="hero small"><div class="em big">${c.quiz >= 80 ? "🏆" : c.quiz >= 70 ? "🎉" : "💪"}</div><h2>Nilai Kuis: ${c.quiz}/100</h2><p>Benar ${c.right} dari 10 soal</p></section><h3>Pembahasan</h3>${KUIS.map((q, i) => `<div class="card"><b>${ans[i] === q.a ? "✅" : "❌"} Soal ${i + 1}.</b> Jawabanmu: ${"ABCD"[ans[i]] ?? "-"} · Kunci: <b>${"ABCD"[q.a]}</b><p class="muted">💡 ${q.e}</p></div>`).join("")}<button class="btn ghost" data-a="qreset">🔁 Ulangi Kuis</button>${cert(c)}`;
  const q = KUIS[T.qi], a = ans[T.qi], ansd = a !== undefined;
  return `<div class="bl"><span>📝 Kuis HOTS · Soal ${T.qi + 1}/10</span><span>Terjawab ${ans.filter(x => x !== undefined).length}/10</span></div><div class="bt"><i class="c" style="width:${(T.qi + 1) * 10}%"></i></div>
  <section class="card"><p class="q">${q.q}</p>${q.o.map((o, j) => `<button class="opt ${ansd ? (j === q.a ? "good" : j === a ? "bad" : "dim") : ""}" data-a="ans" data-i="${j}" ${ansd ? "disabled" : ""}><b>${"ABCD"[j]}.</b> ${o}</button>`).join("")}
  ${ansd ? `<div class="box ${a === q.a ? "okb" : "nob"}"><b>${a === q.a ? "✅ Benar!" : "❌ Kurang tepat. Kunci: " + "ABCD"[q.a]}</b><p>💡 ${q.e}</p></div>` : ""}</section>
  <div class="row between"><button class="btn ghost" data-a="qprev" ${T.qi === 0 ? "disabled" : ""}>◀ Sebelumnya</button>${T.qi < 9 ? `<button class="btn" data-a="qnext" ${ansd ? "" : "disabled"}>Berikutnya ▶</button>` : `<button class="btn gold-b" data-a="qfin" ${ans.filter(x => x !== undefined).length < 10 ? "disabled" : ""}>Selesai ✔</button>`}</div>`;
};
const cert = c => `<section class="cert" id="cert"><p>🎓 BONDHAN EDUCATION</p><h2>SERTIFIKAT BELAJAR DIGITAL</h2><p>Mengaplikasikan Search Engine Optimization (SEO) untuk Meningkatkan Visibilitas Konten & Penjualan Digital</p><p>diberikan kepada</p><div class="nm">${esc(S.nama) || "Nama Siswa"}</div><p>Kelas ${esc(S.kelas) || "-"} · ${S.pj.kel ? esc(S.pj.kel) : "Kelompok -"}</p>
  <div class="row center"><div>📝 Kuis<br><b>${c.quiz}/100</b></div><div>🎮 Latihan<br><b>${c.latSc}</b></div><div>🎬 Tahap PjBL<br><b>${c.phD}/${TAHAP.length}</b></div><div>🔍 SEO Checker<br><b>${c.seo}/10</b></div></div><p><span class="stamp ${c.lulus ? "ok" : ""}">${c.lulus ? "LULUS" : "BELUM LULUS · butuh kuis ≥ 70"}</span></p></section>
  ${!S.nama || !S.kelas ? "<p class='fb bad'>⚠️ Lengkapi Nama & Kelas di tab Beranda.</p>" : ""}<div class="row"><button class="btn gold-b" data-a="report">⬇️ Unduh Laporan & Sertifikat (.html)</button><button class="btn ghost" data-a="print">🖨️ Cetak</button></div>`;

/* ---------- laporan unduhan ---------- */
function report() {
  const c = calc(), P = S.pj, L = P.lk, tgl = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const ph = TAHAP.map((t, i) => { const p = P.ph[i]; return `<tr><td>Tahap ${i + 1}: ${t.n}<br><small>${t.w}</small></td><td>${p.done ? "✔ Selesai" : "…"} (${Object.values(p.chk).filter(Boolean).length}/${t.um.length} tugas)</td><td>${p.link ? `<a href="${esc(p.link)}">${esc(p.link)}</a><br>` : ""}${esc(p.note)}</td></tr>`; }).join("");
  const peran = PERAN.map((r, i) => `<tr><td>${r[0]}</td><td>${esc(P.ang[i]) || "-"}</td></tr>`).join("");
  const lk = [["Kata Kunci Utama", L.kw], ["Kata Kunci Turunan", L.lt.filter(Boolean).join(" | ")], ["Nama File Video", L.file], ["Judul Video (" + L.title.trim().length + " karakter)", L.title], ["Draf Deskripsi (" + wc(L.desc) + " kata)", L.desc], ["Tags", L.tags], ["Hasil Uji (Hari ke-4)", `Urutan ke-${L.pos || "-"} · Views ${L.views || "-"} · CTR ${L.ctr || "-"}% · Trafik Search ${L.trafik || "-"}%`]].map(r => `<tr><td>${r[0]}</td><td style="white-space:pre-wrap">${esc(r[1]) || "-"}</td></tr>`).join("");
  const ck = seoCheck().map(x => `<li>${x[0] ? "✅" : "⬜"} ${x[1]}</li>`).join("");
  const rub = RUBRIK.map((r, i) => `<tr><td>${r[0]}</td><td>${r[1]}%</td><td>${P.rub[i] ? P.rub[i] + " · " + SKOR[P.rub[i] - 1] : "-"}</td></tr>`).join("");
  const ql = KUIS.map((q, i) => `<tr><td>${i + 1}</td><td>${"ABCD"[S.quiz.ans[i]] ?? "-"}</td><td>${"ABCD"[q.a]}</td><td style="color:${S.quiz.ans[i] === q.a ? "#059669" : "#dc2626"}">${S.quiz.ans[i] === q.a ? "Benar" : "Salah"}</td></tr>`).join("");
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>Laporan - ${esc(S.nama || "Siswa")}</title><style>body{font-family:Segoe UI,Arial,sans-serif;background:#eef2ff;margin:0;padding:20px;color:#1e1b4b}.w{max-width:860px;margin:auto}.cert{background:#fffdf5;border:10px double #f59e0b;padding:28px;text-align:center;border-radius:12px}.cert h1{color:#4338ca;margin:6px}.nm{font:italic 700 32px Georgia,serif;border-bottom:2px solid #f59e0b;display:inline-block;min-width:55%;margin:8px}.box{background:#fff;border-radius:12px;padding:16px;margin-top:16px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #e5e7eb;padding:7px;text-align:left;vertical-align:top;font-size:14px}.st{display:inline-block;padding:5px 16px;border-radius:20px;font-weight:700;color:#fff;background:${c.lulus ? "#059669" : "#d97706"}}@media print{body{background:#fff}}</style></head><body><div class="w"><div class="cert"><p>🎓 BONDHAN EDUCATION</p><h1>SERTIFIKAT & LAPORAN BELAJAR</h1><p>Mengaplikasikan Search Engine Optimization (SEO) untuk Meningkatkan Visibilitas Konten & Penjualan Digital</p><div class="nm">${esc(S.nama || "Nama Siswa")}</div><p>Kelas ${esc(S.kelas || "-")} · ${esc(P.kel || "Kelompok -")}</p><p>Nilai Kuis <b>${c.quiz}/100</b> · Skor Latihan <b>${c.latSc}</b> · Tahap PjBL <b>${c.phD}/${TAHAP.length}</b> · SEO Checker <b>${c.seo}/10</b> · Materi <b>${c.mp}%</b></p><p><span class="st">${c.lulus ? "LULUS" : "BELUM LULUS (kuis ≥ 70)"}</span></p><p>${tgl}</p></div>
<div class="box"><h3>Proyek PjBL Video SEO – ${esc(P.kanal || "(kanal belum diisi)")}</h3><p>Platform: ${esc(P.plat)} · Produk/Topik: ${esc(P.produk || "-")}</p><table><tr><th>Peran</th><th>Nama</th></tr>${peran}</table></div>
<div class="box"><h3>Rekap Tahapan</h3><table><tr><th>Tahap</th><th>Status</th><th>Bukti / Catatan</th></tr>${ph}</table></div>
<div class="box"><h3>Lembar Kerja Praktik Optimasi Video SEO</h3><table>${lk}</table><h4>SEO Checker: ${c.seo}/10</h4><ul style="list-style:none;padding:0">${ck}</ul></div>
<div class="box"><h3>Penilaian Diri Rubrik (estimasi ${c.rated ? c.nilai + "/100" : "-"})</h3><table><tr><th>Aspek</th><th>Bobot</th><th>Skor</th></tr>${rub}</table></div>
<div class="box"><h3>Rekap Kuis (${c.right}/10 benar)</h3><table><tr><th>No</th><th>Jawaban</th><th>Kunci</th><th>Hasil</th></tr>${ql}</table></div></div></body></html>`;
}
function download() { const b = new Blob([report()], { type: "text/html" }), a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "Laporan_Belajar_" + (S.nama || "Siswa").replace(/\s+/g, "_") + ".html"; document.body.appendChild(a); a.click(); a.remove(); }

/* ---------- aksi ---------- */
const act = {
  tab: d => go(d.t),
  mod: d => { T.mod = +d.i; render(); },
  reset: () => { if (confirm("Hapus semua progres & profil?")) { S = fresh(); save(); T.urut = {}; T.jod = {}; T.kls = {}; T.msg = {}; T.qi = 0; render(); } },
  up: d => { T.urut[d.id].pick.push(+d.i); render(); },
  ur: d => { delete T.urut[d.id]; T.msg[d.id] = ""; render(); },
  uc: d => { const L = LATIHAN.find(x => x.id === d.id), st = T.urut[d.id], okk = st.pick.every((v, i) => v === i); if (okk) { sOk(); S.lat[d.id] = { sc: st.tries ? 60 : 100 }; save(); T.msg[d.id] = "✅ Urutan benar!"; } else { sNo(); st.tries++; st.pick = []; T.msg[d.id] = "❌ Urutan belum tepat. Coba lagi!"; } render(); },
  jc: d => { const L = LATIHAN.find(x => x.id === d.id), st = T.jod[d.id], okk = L.pairs.every((p, i) => st.ans[i] === p[1]); if (okk) { sOk(); S.lat[d.id] = { sc: st.tries ? 60 : 100 }; save(); T.msg[d.id] = "✅ Semua pasangan benar!"; } else { sNo(); st.tries++; const n = L.pairs.filter((p, i) => st.ans[i] === p[1]).length; T.msg[d.id] = `❌ Baru ${n}/${L.pairs.length} pasangan benar. Perbaiki yang salah.`; } render(); },
  kc: d => { const L = LATIHAN.find(x => x.id === d.id), st = T.kls[d.id], n = L.items.filter((it, i) => st.ans[i] === String(it[1])).length; if (n === L.items.length) { sOk(); S.lat[d.id] = { sc: st.tries ? 60 : 100 }; save(); T.msg[d.id] = "✅ Semua klasifikasi benar!"; } else { sNo(); st.tries++; T.msg[d.id] = `❌ Baru ${n}/${L.items.length} benar. Perbaiki yang salah.`; } render(); },
  phd: d => { const p = S.pj.ph[+d.t]; p.done = !p.done; save(); if (p.done) sOk(); render(); },
  ans: d => { const q = KUIS[T.qi]; S.quiz.ans[T.qi] = +d.i; save(); +d.i === q.a ? sOk() : sNo(); render(); },
  qnext: () => { T.qi++; render(); }, qprev: () => { T.qi--; render(); },
  qfin: () => { S.quiz.done = true; save(); sOk(); render(); window.scrollTo(0, 0); },
  qreset: () => { S.quiz = { ans: [], done: false }; T.qi = 0; save(); render(); },
  report: download, print: () => window.print()
};
function go(t) { T.tab = t; render(); window.scrollTo(0, 0); }
function render() {
  const y = window.scrollY;
  $("#app").innerHTML = V[T.tab]();
  $$("[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === T.tab));
  window.scrollTo(0, y);
}
document.addEventListener("click", e => { const t = e.target.closest("[data-tab]"); if (t) return go(t.dataset.tab); const b = e.target.closest("[data-a]"); if (!b) return; e.preventDefault(); act[b.dataset.a](b.dataset); });
document.addEventListener("input", e => { const k = e.target.dataset.k; if (!k) return; setPath(S, k, e.target.value); save(); if (k.startsWith("pj.lk") || k === "pj.kanal") { const pn = $("#seopanel"); if (pn) pn.innerHTML = seoPanel(); } });
document.addEventListener("change", e => {
  const d = e.target.dataset; if (d.k && e.target.tagName === "SELECT") { setPath(S, d.k, e.target.value); save(); } if (!d.c) return;
  if (d.c === "jd") { T.jod[d.id].ans[+d.i] = e.target.value; }
  if (d.c === "kd") { T.kls[d.id].ans[+d.i] = e.target.value; }
  if (d.c === "chk") { S.pj.ph[+d.t].chk[+d.i] = e.target.checked; save(); }
  if (d.c === "rub") { S.pj.rub[+d.i] = +e.target.value; save(); render(); }
});
document.addEventListener("click", e => {                        // accordion: catat terbuka & tandai materi dibaca (sinkron saat klik)
  const sm = e.target.closest("details.acc > summary"); if (!sm) return; const d = sm.parentElement, id = d.dataset.id;
  if (!d.open) { T.open.add(id); if (!S.read[id] && !id.startsWith("ph")) { S.read[id] = 1; save(); const r = $(".rd", d); if (r) r.textContent = "✓ dibaca"; } } else T.open.delete(id);
});
$("#nav").innerHTML = [["beranda", "🏠", "Beranda"], ["materi", "📖", "Materi"], ["latihan", "🎮", "Latihan"], ["pjbl", "🚀", "Proyek PjBL"], ["kuis", "📝", "Kuis"]].map(x => `<button data-tab="${x[0]}"><span>${x[1]}</span>${x[2]}</button>`).join("");
syncMusic(); render();
