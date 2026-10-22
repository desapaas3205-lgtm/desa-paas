/**
 * Logika Interaktif Website Resmi Desa Paas, Kec. Pameungpeuk, Kab. Garut
 */

// Konfigurasi Kontak Resmi Desa Paas (Bisa diedit sewaktu-waktu)
const DESA_CONFIG = {
  namaDesa: "Desa Paas",
  kecamatan: "Pameungpeuk",
  kabupaten: "Garut",
  provinsi: "Jawa Barat",
  kodepos: "44175",
  alamatKantor: "Jalan Raya Pemeungpeuk No.277 Desa Paas Kec. Pameungpeuk Kab. Garut",
  whatsappAdmin: "6282123456789", // Ganti dengan nomor WA Pelayanan Desa Paas resmi
  emailDesa: "pemdespaas.garut@gmail.com",
  sosmed: {
    tiktok: "https://www.tiktok.com/@pemdespaas",
    facebook: "https://www.facebook.com/Pemdes.Paas",
    instagram: "https://www.instagram.com/pemdes.paas/",
    youtube: "https://www.youtube.com/@pemdespaas"
  },
  jamBuka: { buka: 7.5, tutup: 15.5 }, // 07:30 - 15:30 WIB
  hariKerja: [1, 2, 3, 4, 5] // 1: Senin s/d 5: Jumat
};

// 1. Inisialisasi Status Jam Kerja Kantor
function initOfficeStatus() {
  const statusEl = document.getElementById('officeStatusIndicator');
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const hours = now.getHours() + now.getMinutes() / 60;

  const isWorkDay = DESA_CONFIG.hariKerja.includes(day);
  const isOpen = isWorkDay && hours >= DESA_CONFIG.jamBuka.buka && hours < DESA_CONFIG.jamBuka.tutup;

  if (isOpen) {
    statusEl.innerHTML = `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Kantor Buka (Pelayanan 07:30 - 15:30)
      </span>
    `;
  } else {
    statusEl.innerHTML = `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-amber-300 border border-emerald-800">
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        Kantor Tutup • Buka Hari Kerja 07:30 WIB
      </span>
    `;
  }
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileNavMenu');
  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// 3. Database Syarat Dokumen Pengajuan Surat
const SYARAT_SURAT = {
  "Surat Pengantar KTP / KK": [
    "Fotokopi Kartu Keluarga (KK) lama",
    "Fotokopi Akta Kelahiran / Ijazah",
    "Surat Pengantar dari Ketua RT dan RW setempat"
  ],
  "Surat Keterangan Domisili": [
    "Fotokopi KTP Pemohon",
    "Fotokopi Kartu Keluarga (KK)",
    "Surat Pengantar dari Ketua RT dan RW domisili saat ini"
  ],
  "Surat Keterangan Tidak Mampu (SKTM)": [
    "Fotokopi KTP dan Kartu Keluarga (KK)",
    "Surat Pengantar RT/RW yang menerangkan kondisi ekonomi",
    "Foto rumah tampak depan/keseluruhan (bila diperlukan)",
    "Tujuan penggunaan (Beasiswa/Keringanan RS/Bansos)"
  ],
  "Surat Keterangan Usaha (SKU)": [
    "Fotokopi KTP dan KK Pelaku Usaha",
    "Surat Pengantar RT/RW lokasi usaha berjalan",
    "Foto tempat/kegiatan usaha di Desa Paas",
    "Rincian jenis usaha yang dijalankan"
  ],
  "Surat Pengantar SKCK": [
    "Fotokopi KTP dan KK",
    "Fotokopi Akta Lahir / Ijazah Terakhir",
    "Surat Pengantar dari RT/RW setempat",
    "Pas foto 4x6 latar merah (3 lembar) untuk Polsek"
  ],
  "Surat Keterangan Kematian": [
    "Fotokopi KTP & KK almarhum/almarhumah",
    "Fotokopi KTP pelapor/ahli waris",
    "Surat Keterangan Medis/Rumah Sakit (jika ada)",
    "Surat Pengantar dari RT/RW setempat"
  ],
  "Surat Pengantar Nikah (Model N1-N4)": [
    "Fotokopi KTP, KK, dan Akta Kelahiran calon pengantin",
    "Fotokopi KTP orang tua / wali",
    "Pas foto 2x3 dan 4x6 latar biru",
    "Surat Pengantar RT/RW",
    "Akta Cerai / Kematian (jika duda/janda)"
  ]
};

// 4. Update Syarat Dokumen secara Realtime di Form Layanan
function updateSyaratList(jenisSurat) {
  const container = document.getElementById('syaratContainer');
  const listEl = document.getElementById('syaratList');
  if (!container || !listEl) return;

  const syarat = SYARAT_SURAT[jenisSurat] || [
    "KTP & KK Asli / Fotokopi",
    "Surat Pengantar RT/RW setempat"
  ];

  listEl.innerHTML = syarat.map(s => `
    <li class="flex items-start gap-2 text-sm text-slate-700">
      <svg class="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${s}</span>
    </li>
  `).join('');

  container.classList.remove('hidden');
}

// 5. Generator Permohonan Surat via WhatsApp
function handleSuratSubmit(e) {
  e.preventDefault();

  const nama = document.getElementById('suratNama').value.trim();
  const nik = document.getElementById('suratNik').value.trim();
  const wa = document.getElementById('suratWa').value.trim();
  const dusun = document.getElementById('suratDusun').value;
  const rtRw = document.getElementById('suratRtRw').value.trim();
  const jenis = document.getElementById('suratJenis').value;
  const keperluan = document.getElementById('suratKeperluan').value.trim();

  if (!nama || !nik || !jenis || !keperluan) {
    alert("Mohon lengkapi Nama, NIK, Jenis Surat, dan Keperluan Anda.");
    return;
  }

  if (nik.length < 16) {
    alert("Nomor NIK harus 16 digit sesuai e-KTP/Kartu Keluarga.");
    return;
  }

  // Format pesan WhatsApp resmi ke Layanan Pemdes
  const pesan = `*PERMOHONAN LAYANAN SURAT MANDIRI*
*PEMERINTAH DESA PAAS - KEC. PAMEUNGPEUK*
---------------------------------------
Kepada Yth. Petugas Pelayanan Kantor Desa Paas

Saya yang bertanda tangan di bawah ini:
* Nama Lengkap : ${nama}
* NIK : ${nik}
* No. Kontak/WA : ${wa || '-'}
* Alamat : ${dusun}, RT/RW ${rtRw || '-'}, Desa Paas
* Jenis Permohonan : *${jenis}*
* Keperluan : ${keperluan}

Mohon informasi kesiapan berkas atau jadwal pengambilan di Kantor Desa Paas. Terima kasih.
---------------------------------------
_Dikirim via Portal Website Desa Paas (Garut)_`;

  const encodedPesan = encodeURIComponent(pesan);
  const waUrl = `https://wa.me/${DESA_CONFIG.whatsappAdmin}?text=${encodedPesan}`;

  // Buka WhatsApp
  window.open(waUrl, '_blank');
}

// 6. Manajemen Berita Dinamis, Modal & Berbagi ke Media Sosial (Bersih Tanpa Berita Contoh)
const DEFAULT_BERITA = {};

// Ambil seluruh data berita aktif (Hanya berita nyata yang dimasukkan operator)
function getSemuaBerita() {
  try {
    const deletedIds = JSON.parse(localStorage.getItem('DESA_DELETED_BERITA') || '[]');
    let customBerita = JSON.parse(localStorage.getItem('DESA_CUSTOM_BERITA') || '[]');

    // Singkirkan data contoh dummy lama (id 1, 2, 3, 4) jika masih tersimpan di browser
    const cleanedBerita = customBerita.filter(b => !['1', '2', '3', '4'].includes(String(b.id)));
    if (cleanedBerita.length !== customBerita.length) {
      localStorage.setItem('DESA_CUSTOM_BERITA', JSON.stringify(cleanedBerita));
      customBerita = cleanedBerita;
    }

    // Filter berita yang sudah dihapus oleh operator
    return customBerita.filter(b => !deletedIds.includes(String(b.id)));
  } catch (e) {
    console.error("Gagal membaca memori berita:", e);
    return [];
  }
}

function getBeritaById(id) {
  const all = getSemuaBerita();
  return all.find(b => String(b.id) === String(id));
}

// Tambah berita baru dari operator
function simpanBeritaBaru(data) {
  let customBerita = [];
  try {
    customBerita = JSON.parse(localStorage.getItem('DESA_CUSTOM_BERITA') || '[]');
  } catch (e) {
    customBerita = [];
  }

  // Hapus contoh dummy lama jika ada
  customBerita = customBerita.filter(b => !['1', '2', '3', '4'].includes(String(b.id)));

  const itemBaru = {
    id: 'paas_' + Date.now(),
    kategori: data.kategori || 'Pemerintahan',
    judul: data.judul,
    tanggal: data.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    penulis: data.penulis || 'Pemerintah Desa Paas',
    ringkasan: data.ringkasan || (data.isi.substring(0, 140) + '...'),
    isi: data.isi,
    gambar: data.gambar || '',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  };

  customBerita.unshift(itemBaru);

  try {
    localStorage.setItem('DESA_CUSTOM_BERITA', JSON.stringify(customBerita));
  } catch (err) {
    console.warn("Kapasitas penyimpanan browser hampir penuh, mengompresi foto...", err);
    try {
      // Jika penyimpanan browser penuh karena foto resolusi tinggi, simpan dengan foto dikosongkan agar teks artikel tidak hilang
      itemBaru.gambar = '';
      customBerita[0] = itemBaru;
      localStorage.setItem('DESA_CUSTOM_BERITA', JSON.stringify(customBerita));
      alert("Catatan: Foto terlalu besar untuk memori lokal browser. Teks berita berhasil disimpan!");
    } catch (err2) {
      alert("Gagal menyimpan berita: " + err2.message);
      return null;
    }
  }

  return itemBaru;
}

// Hapus berita oleh operator
function hapusBeritaById(id) {
  try {
    const deletedIds = JSON.parse(localStorage.getItem('DESA_DELETED_BERITA') || '[]');
    if (!deletedIds.includes(String(id))) {
      deletedIds.push(String(id));
      localStorage.setItem('DESA_DELETED_BERITA', JSON.stringify(deletedIds));
    }
    let customBerita = JSON.parse(localStorage.getItem('DESA_CUSTOM_BERITA') || '[]');
    customBerita = customBerita.filter(b => String(b.id) !== String(id));
    localStorage.setItem('DESA_CUSTOM_BERITA', JSON.stringify(customBerita));
  } catch (e) {
    console.error("Gagal menghapus berita:", e);
  }
}

// Variabel berita aktif di modal pembaca
let currentActiveBerita = null;

function bukaModalBerita(id) {
  const berita = getBeritaById(id);
  if (!berita) return;

  currentActiveBerita = berita;

  const modal = document.getElementById('beritaModal');
  const modalKategori = document.getElementById('modalKategori');
  const modalJudul = document.getElementById('modalJudul');
  const modalMeta = document.getElementById('modalMeta');
  const modalIsi = document.getElementById('modalIsi');
  const modalGambar = document.getElementById('modalGambar');
  const modalGambarImg = document.getElementById('modalGambarImg');

  if (!modal) return;

  if (modalKategori) modalKategori.textContent = berita.kategori;
  if (modalJudul) modalJudul.textContent = berita.judul;
  if (modalMeta) modalMeta.textContent = `${berita.tanggal} • Oleh ${berita.penulis}`;

  if (modalGambar && modalGambarImg) {
    if (berita.gambar) {
      modalGambarImg.src = berita.gambar;
      modalGambar.classList.remove('hidden');
    } else {
      modalGambar.classList.add('hidden');
    }
  }

  if (modalIsi) {
    const rawIsi = berita.isi || '';
    modalIsi.innerHTML = rawIsi.split(/\n\n|\r\n\r\n/).map(p => `<p class="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">${p}</p>`).join('');
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function tutupModalBerita() {
  const modal = document.getElementById('beritaModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Fitur Berbagi Berita ke Media Sosial
function shareBerita(platform) {
  if (!currentActiveBerita) return;
  const pageUrl = window.location.href.split('#')[0];
  const shareText = `*${currentActiveBerita.judul}*\n\nBaca informasi resmi Desa Paas selengkapnya di:\n${pageUrl}`;

  if (platform === 'wa') {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  } else if (platform === 'fb') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(`${currentActiveBerita.judul}\n${pageUrl}`).then(() => {
      const copyTextEl = document.getElementById('copyText');
      if (copyTextEl) {
        copyTextEl.textContent = 'Tersalin! ✓';
        setTimeout(() => { copyTextEl.textContent = 'Salin Link'; }, 2000);
      } else {
        alert("Tautan berita berhasil disalin!");
      }
    }).catch(() => {
      prompt("Salin tautan berita:", pageUrl);
    });
  }
}

// Render Dinamis Berita di Beranda & Halaman Berita
function renderBeritaDynamic() {
  const indexGrid = document.getElementById('beritaGridIndex');
  const pageGrid = document.getElementById('beritaGridPage');
  const featuredBox = document.getElementById('beritaFeaturedContainer');

  const list = getSemuaBerita();

  // 1. Render Beranda (index.html)
  if (indexGrid) {
    if (list.length === 0) {
      indexGrid.innerHTML = `
        <div class="col-span-full py-12 px-4 text-center rounded-3xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div class="w-14 h-14 rounded-2xl bg-emerald-950/40 text-emerald-400 flex items-center justify-center mx-auto mb-3 text-2xl border border-emerald-800/60">
            <i class="fa-regular fa-newspaper"></i>
          </div>
          <h4 class="text-base font-bold text-slate-800 dark:text-white">Belum Ada Berita yang Diterbitkan</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Seluruh contoh berita lama telah dibersihkan. Publikasi berita resmi terbaru yang dimasukkan operator akan otomatis muncul di sini.
          </p>
          <a href="admin.html" class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-desa-600 hover:bg-desa-500 text-white text-xs font-bold transition-colors">
            <i class="fa-solid fa-pen-to-square"></i> Tulis Berita Pertama di Portal Operator
          </a>
        </div>
      `;
    } else {
      const items = list.slice(0, 4);
      indexGrid.innerHTML = items.map(b => `
        <article class="bento-card p-5 flex flex-col justify-between group">
          <div>
            ${b.gambar ? `
              <div class="h-36 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img src="${b.gambar}" alt="${b.judul}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
            ` : ''}
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${b.badgeColor || 'bg-emerald-100 text-emerald-800'} mb-2.5">${b.kategori}</span>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug hover:text-desa-600 dark:hover:text-emerald-400 cursor-pointer" onclick="bukaModalBerita('${b.id}')">
              ${b.judul}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
              ${b.ringkasan || (b.isi.substring(0, 120) + '...')}
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-400 dark:text-slate-500">${b.tanggal}</span>
            <button onclick="bukaModalBerita('${b.id}')" class="font-bold text-desa-700 dark:text-emerald-400 hover:text-desa-900 dark:hover:text-emerald-300">
              Baca <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </article>
      `).join('');
    }
  }

  // 2. Render Halaman Berita (berita.html)
  if (pageGrid) {
    if (list.length === 0) {
      if (featuredBox) featuredBox.classList.add('hidden');
      pageGrid.innerHTML = `
        <div class="col-span-full py-16 px-4 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="w-16 h-16 rounded-2xl bg-emerald-950/40 text-emerald-400 flex items-center justify-center mx-auto mb-3 text-3xl border border-emerald-800/60">
            <i class="fa-regular fa-newspaper"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">Belum Ada Publikasi Berita</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Seluruh contoh berita sebelumnya telah dibersihkan. Silakan masuk ke Portal Operator untuk mempublikasikan artikel dan dokumentasi kegiatan Desa Paas.
          </p>
          <a href="admin.html" class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-desa-600 hover:bg-desa-500 text-white text-xs font-bold transition-colors shadow">
            <i class="fa-solid fa-pen-to-square"></i> Tulis Berita Pertama di Portal Operator
          </a>
        </div>
      `;
    } else {
      const featured = list[0];
      const rest = list.slice(1);

      if (featuredBox) {
        featuredBox.classList.remove('hidden');
        featuredBox.innerHTML = `
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-4">
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${featured.badgeColor || 'bg-emerald-100 text-emerald-800'}">${featured.kategori}</span>
                <span class="text-xs text-slate-400"><i class="fa-regular fa-calendar mr-1"></i> ${featured.tanggal}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight hover:text-desa-700 dark:hover:text-emerald-400 cursor-pointer" onclick="bukaModalBerita('${featured.id}')">
                ${featured.judul}
              </h2>
              <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                ${featured.ringkasan || (featured.isi.substring(0, 200) + '...')}
              </p>
              <div class="pt-2">
                <button onclick="bukaModalBerita('${featured.id}')" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-desa-700 hover:bg-desa-800 text-white text-sm font-bold transition-all shadow-sm">
                  Baca Berita Lengkap <i class="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
            <div class="lg:col-span-5">
              ${featured.gambar ? `
                <div class="h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <img src="${featured.gambar}" alt="${featured.judul}" class="w-full h-full object-cover">
                </div>
              ` : `
                <div class="h-64 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-950/60 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center justify-center p-6 text-center shadow-inner">
                  <div class="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center text-3xl mb-3 shadow">
                    <i class="fa-solid fa-newspaper"></i>
                  </div>
                  <span class="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">${featured.kategori}</span>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">${featured.penulis}</p>
                </div>
              `}
            </div>
          </div>
        `;
      }

      pageGrid.innerHTML = rest.map(b => `
        <article class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between card-hover group">
          <div>
            ${b.gambar ? `
              <div class="h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img src="${b.gambar}" alt="${b.judul}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
            ` : `
              <div class="h-40 rounded-2xl bg-emerald-50 dark:bg-slate-800/80 flex items-center justify-center text-5xl text-emerald-600 dark:text-emerald-400 mb-5 border border-emerald-100 dark:border-slate-700">
                <i class="fa-solid fa-newspaper"></i>
              </div>
            `}
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${b.badgeColor || 'bg-emerald-100 text-emerald-800'}">${b.kategori}</span>
              <span class="text-xs text-slate-400">${b.tanggal}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug hover:text-desa-700 dark:hover:text-emerald-400 cursor-pointer" onclick="bukaModalBerita('${b.id}')">
              ${b.judul}
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
              ${b.ringkasan || (b.isi.substring(0, 140) + '...')}
            </p>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="text-xs text-slate-400">Oleh ${b.penulis}</span>
            <button onclick="bukaModalBerita('${b.id}')" class="text-xs font-bold text-desa-700 dark:text-emerald-400 hover:text-desa-900 dark:hover:text-emerald-300">
              Baca Selengkapnya <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </article>
      `).join('');
    }
  }
}


// 7. Pengaduan Warga via WhatsApp
function handleAduanSubmit(e) {
  e.preventDefault();
  const nama = document.getElementById('aduanNama').value.trim();
  const kontak = document.getElementById('aduanKontak').value.trim();
  const kategori = document.getElementById('aduanKategori').value;
  const pesan = document.getElementById('aduanPesan').value.trim();

  if (!nama || !pesan) {
    alert("Mohon isi Nama dan Pesan Aspirasi / Pengaduan Anda.");
    return;
  }

  const formatPesan = `*ASPIRASI & PENGADUAN WARGA*
*DESA PAAS - KEC. PAMEUNGPEUK*
---------------------------------------
* Nama Warga : ${nama}
* Kontak : ${kontak || '-'}
* Bidang/Kategori : *${kategori}*

*Pesan / Laporan:*
${pesan}
---------------------------------------
_Disampaikan melalui website resmi Desa Paas_`;

  window.open(`https://wa.me/${DESA_CONFIG.whatsappAdmin}?text=${encodeURIComponent(formatPesan)}`, '_blank');
}

// 8. Inisialisasi Tema Gelap & Terang (Dark / Light Mode)
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  if (!toggleBtns.length) return;

  function updateThemeUI(isDark) {
    document.querySelectorAll('.theme-toggle-label').forEach(el => {
      el.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
    });
    document.querySelectorAll('.theme-toggle-text').forEach(el => {
      el.textContent = isDark ? 'Terang' : 'Gelap';
    });
  }

  // Set status awal
  const isDarkInitial = document.documentElement.classList.contains('dark');
  updateThemeUI(isDarkInitial);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      if (isCurrentlyDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeUI(false);
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeUI(true);
      }
    });
  });
}

// DOM Ready Init
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initOfficeStatus();
  initMobileMenu();
  renderBeritaDynamic();

  // Listener jenis surat
  const suratJenisSelect = document.getElementById('suratJenis');
  if (suratJenisSelect) {
    suratJenisSelect.addEventListener('change', (e) => updateSyaratList(e.target.value));
  }

  // Listener form surat
  const formSurat = document.getElementById('formSuratMandiri');
  if (formSurat) {
    formSurat.addEventListener('submit', handleSuratSubmit);
  }

  // Listener form aduan
  const formAduan = document.getElementById('formAduanWarga');
  if (formAduan) {
    formAduan.addEventListener('submit', handleAduanSubmit);
  }
});

