# QuickQR — QR Code Generator

Aplikasi web ringan berbasis *client-side* untuk mengubah teks atau tautan (URL) menjadi QR Code secara instan. Dirancang agar dapat di-hosting gratis menggunakan **GitHub Pages** tanpa memerlukan server *backend* maupun database.

**QR CODE GENERATOR BY @alfinz531**

## Fitur Utama
- **Konversi Instan:** Mengubah teks bebas atau tautan URL menjadi QR Code secara langsung di browser.
- **Kustomisasi Ukuran:** Pilihan resolusi `200 x 200`, `256 x 256`, `320 x 320`, hingga `512 x 512 (HD)`.
- **Kustomisasi Warna:** Pemilih warna (*color picker*) dengan tampilan kode HEX real-time untuk modul gelap QR Code.
- **Unduh Format PNG:** Mengekspor hasil QR Code menjadi file gambar `.png` siap pakai.
- **Error Correction Tinggi:** Menggunakan level `H` (High) untuk ketahanan baca yang lebih baik.
- **Notifikasi Browser (`alert`):** Memberikan umpan balik langsung saat QR Code berhasil dibuat atau input masih kosong.

## Struktur Proyek
```text
qr-code-generator/
├── index.html
├── style.css
├── script.js
└── README.md

---

## 2. Penjelasan Lengkap Masing-Masing File

| File | Peran & Tanggung Jawab | Detail Implementasi |
| :--- | :--- | :--- |
| **`index.html`** | Kerangka antarmuka (*UI*) dan pemuat dependensi | Memuat Tailwind CSS serta `qrcode.min.js` lewat CDN, menghubungkan `style.css` dan `script.js`, menyediakan input `#qr-text`, pilihan ukuran `#qr-size`, pemilih warna `#qr-color`, tombol `#generate-btn`, area tampil `#qrcode`, tombol unduh `#download-btn`, dan *footer* `QR CODE GENERATOR BY @alfinz531`. |
| **`style.css`** | Gaya visual khusus & animasi | Mengatur pola latar *grid* (`body.bg-grid-pattern`) dengan gradasi radial di bagian atas, efek bayangan kartu (`.qr-card`), animasi kemunculan QR (`.animate-fade-in`), efek *hover* pada bingkai QR (`.qr-preview-frame`), perataan tengah `<canvas>`/`<img>` di dalam `#qrcode`, serta perapihan *swatch* input warna. |
| **`script.js`** | Logika interaktivitas & ekspor gambar | Menangani perubahan kode HEX saat warna dipilih, memvalidasi isi input `#qr-text`, menginstansiasi `new QRCode(...)`, mengatur visibilitas `#placeholder` dan `#qr-wrapper`, menampilkan `alert()`, dan mengubah `<canvas>`/`<img>` menjadi file `.png` saat tombol unduh ditekan. |
| **`README.md`** | Dokumentasi proyek di GitHub | Menjelaskan tujuan aplikasi, daftar fitur, struktur folder, stack teknologi, dan panduan *deployment* ke GitHub Pages. |

---

## 3. Alur Kerja Aplikasi (*Workflow*)

1. **Inisialisasi Halaman:** Browser memuat `index.html`, menerapkan gaya dari `style.css` dan Tailwind CSS, lalu mengunduh pustaka `QRCode.js` dan menjalankan `script.js`.
2. **Penyesuaian Parameter (Opsional):** Pengguna mengetik teks/URL di `#qr-text`, memilih ukuran piksel di `#qr-size`, atau memilih warna di `#qr-color` (yang otomatis memperbarui teks `#color-hex` menjadi huruf kapital).
3. **Pemicuan & Validasi:** Saat tombol **Generate QR Code** diklik atau tombol **Enter** ditekan pada `#qr-text`, fungsi `generateQRCode()` memeriksa `qrText.value.trim()`. Jika kosong, input difokuskan, diberi *ring* merah sementara, dan memunculkan `alert('Masukkan teks atau URL terlebih dahulu!')`.
4. **Render QR Code:** Isi `#qrcode` dikosongkan (`innerHTML = ''`), lalu `new QRCode(...)` membuat QR Code baru dengan warna terang `#ffffff` dan `correctLevel: QRCode.CorrectLevel.H`. Elemen `#placeholder` disembunyikan dan `#qr-wrapper` ditampilkan.
5. **Notifikasi & Pengunduhan:** Setelah tampil, `alert('QR Code berhasil dibuat!')` muncul. Saat tombol **Unduh PNG** diklik, skrip mengambil data gambar dari `<canvas>` (`toDataURL('image/png')`) atau `<img>` (`.src`) dan memicu pengunduhan otomatis bernama `qrcode-<timestamp>.png`.

---

## 4. Bagaimana Sistem QR Code Digenerasi?

<Image alt="Diagram anatomi QR Code yang menampilkan finder pattern, timing pattern, alignment pattern, data module, quiet zone, dan proses encoding data" caption="Anatomi dan proses generasi QR Code" src="image_agent_tag_8205634007129959825"/>

Diagram di atas memperlihatkan komponen utama sebuah QR Code beserta alur pengkodean datanya. Di balik layar, `QRCode.js` mengolah string input menjadi matriks 2 dimensi melalui tahapan berikut:

1. **Analisis & Pengkodean Data (*Data Encoding*):** Teks atau URL diubah menjadi deretan bit biner sesuai mode karakter yang cocok (numerik, alfanumerik, atau *byte*/UTF-8), lengkap dengan penanda mode, panjang data, dan *padding* bit hingga memenuhi kapasitas blok versi QR yang dipilih.
2. **Perhitungan *Error Correction* (Reed-Solomon):** Pada kode kita, `correctLevel` diatur ke `QRCode.CorrectLevel.H` (*High*, sekitar **30%** pemulihan data). Algoritma Reed-Solomon menghitung *codeword* koreksi kesalahan agar QR Code tetap terbaca meskipun sebagian area tertutup kotoran, tergores, atau diberi logo.
3. **Penyusunan Matriks & Pola Fungsional:** Bit data dan koreksi kesalahan disusun ke dalam grid kotak-kotak (*modules*), digabungkan dengan pola penentu posisi dan kalibrasi seperti *finder pattern* di tiga sudut, *timing pattern*, *alignment pattern*, serta batas tepi kosong (*quiet zone*).
4. **Penerapan *Masking* & *Format Info*:** Pola *mask* diterapkan pada area data untuk menghindari pola visual yang membingungkan *scanner* kamera, lalu informasi format (level koreksi dan ID *mask*) disematkan.
