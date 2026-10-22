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

// 6. Modal Berita Lengkap
const BERITA_DATA = {
  1: {
    kategori: "Bantuan Sosial",
    judul: "Penyaluran BLT Dana Desa (BLT-DD) Bagi Keluarga Penerima Manfaat di Desa Paas",
    tanggal: "12 Oktober 2026",
    penulis: "Pemerintah Desa Paas",
    isi: `Pemerintah Desa Paas, Kecamatan Pameungpeuk, Kabupaten Garut kembali menyalurkan program Bantuan Langsung Tunai Dana Desa (BLT-DD) kepada Keluarga Penerima Manfaat (KPM) yang berhak menerima.

Kegiatan penyaluran ini dipimpin langsung oleh Kepala Desa Paas, Bapak Agus Zenal, didampingi jajaran perangkat desa, BPD, pendamping desa, serta Babinsa dan Bhabinkamtibmas.

Kepala Desa Paas menyampaikan bahwa bantuan ini ditujukan untuk menjaga daya beli masyarakat rentan, lansia tunggal, dan warga dengan penyakit menahun. Proses penyaluran berlangsung tertib dan transparan di Aula Kantor Desa Paas dengan jam pelayanan yang terjadwal rapi.`
  },
  2: {
    kategori: "Infrastruktur",
    judul: "Peningkatan Jalan Lingkungan & Normalisasi Drainase Permukiman Desa Paas",
    tanggal: "05 Oktober 2026",
    penulis: "Tim Pengelola Kegiatan (TPK)",
    isi: `Sebagai komitmen mewujudkan konektivitas lingkungan yang aman dan nyaman, Pemerintah Desa Paas menuntaskan program pembangunan rabat beton jalan lingkungan dan pembersihan saluran drainase permukiman.

Pengerjaan ini melibatkan partisipasi swadaya masyarakat dan kelompok gotong royong warga. Drainase yang baik sangat krusial mengingat Desa Paas berada di wilayah dataran rendah Pameungpeuk guna mencegah genangan air saat musim penghujan.`
  },
  3: {
    kategori: "Kesehatan Warga",
    judul: "Pelayanan Terpadu Posyandu & Skrining Pencegahan Stunting Balita Bersama Puskesmas",
    tanggal: "28 September 2026",
    penulis: "Kader Posyandu & PKK Desa Paas",
    isi: `Kader PKK dan Posyandu Desa Paas secara berkala menggelar penimbangan berat badan, pengukuran tinggi badan balita, dan penyuluhan gizi bagi ibu hamil.

Kegiatan ini merupakan bagian dari gerakan terpadu penurunan angka stunting di Kabupaten Garut, didukung dengan pemberian makanan tambahan (PMT) berbahan pangan lokal sehat seperti telur, sayuran, dan olahan ikan.`
  },
  4: {
    kategori: "Perencanaan",
    judul: "Musrenbangdes Desa Paas: Menjaring Aspirasi Pembangunan Tahun Anggaran Mendatang",
    tanggal: "18 September 2026",
    penulis: "Sekretariat Desa Paas",
    isi: `Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Desa Paas diselenggarakan dengan menghadirkan seluruh elemen: Kepala Dusun 1 (Galih Mukhlis), Dusun 2 (Deni Sudian), Dusun 3 (Sutendi), tokoh agama, tokoh pemuda, dan kelompok tani.

Fokus pembahasan mencakup alokasi ketahanan pangan, sarana pertanian, pemberdayaan UMKM lokal olahan laut/singkong, dan peningkatan pelayanan administrasi desa secara digital.`
  }
};

function bukaModalBerita(id) {
  const berita = BERITA_DATA[id];
  if (!berita) return;

  const modal = document.getElementById('beritaModal');
  const modalKategori = document.getElementById('modalKategori');
  const modalJudul = document.getElementById('modalJudul');
  const modalMeta = document.getElementById('modalMeta');
  const modalIsi = document.getElementById('modalIsi');

  if (!modal) return;

  modalKategori.textContent = berita.kategori;
  modalJudul.textContent = berita.judul;
  modalMeta.textContent = `${berita.tanggal} • Oleh ${berita.penulis}`;
  modalIsi.innerHTML = berita.isi.split('\n\n').map(p => `<p class="mb-4 text-slate-700 leading-relaxed">${p}</p>`).join('');

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

