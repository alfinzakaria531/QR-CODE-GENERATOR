const qrText = document.getElementById('qr-text');
const qrSize = document.getElementById('qr-size');
const qrColor = document.getElementById('qr-color');
const colorHex = document.getElementById('color-hex');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrcodeContainer = document.getElementById('qrcode');
const qrWrapper = document.getElementById('qr-wrapper');
const placeholder = document.getElementById('placeholder');
const toastEl = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');

let toastTimeout;

// Fungsi untuk menampilkan pop-up notifikasi (toast)
function showNotification(message, type = 'success') {
    toastMessage.textContent = message;

    // Reset warna border/ikon sesuai tipe notifikasi
    toastEl.classList.remove('border-emerald-500/60', 'border-rose-500/60', 'text-emerald-300', 'text-rose-300');

    if (type === 'error') {
        toastEl.classList.add('border-rose-500/60', 'text-rose-300');
    } else {
        toastEl.classList.add('border-emerald-500/60', 'text-emerald-300');
    }

    // Tampilkan pop-up
    toastEl.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toastEl.classList.add('opacity-100', 'translate-y-0');

    // Sembunyikan otomatis setelah 3 detik
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastEl.classList.remove('opacity-100', 'translate-y-0');
        toastEl.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 3000);
}

// Update teks kode warna Hex saat color picker berubah
qrColor.addEventListener('input', (e) => {
    colorHex.textContent = e.target.value.toUpperCase();
});

// Fungsi utama generate QR
function generateQRCode() {
    const text = qrText.value.trim();

    if (!text) {
        qrText.focus();
        qrText.classList.add('ring-2', 'ring-rose-500');
        setTimeout(() => qrText.classList.remove('ring-2', 'ring-rose-500'), 1500);
        showNotification('Masukkan teks atau URL terlebih dahulu!', 'error');
        return;
    }

    // Bersihkan QR sebelumnya
    qrcodeContainer.innerHTML = '';

    const size = parseInt(qrSize.value, 10);
    const colorDark = qrColor.value;

    // Buat QR Code baru
    new QRCode(qrcodeContainer, {
        text: text,
        width: size,
        height: size,
        colorDark: colorDark,
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    // Tampilkan hasil dan sembunyikan placeholder
    placeholder.classList.add('hidden');
    qrWrapper.classList.remove('hidden');
    qrWrapper.classList.add('flex');

    // Munculkan pop-up notifikasi berhasil
    showNotification('QR Code berhasil dibuat!', 'success');
}

// Event klik tombol Generate
generateBtn.addEventListener('click', generateQRCode);

// Tekan Enter di input teks untuk generate
qrText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQRCode();
    }
});

// Fungsi Download QR Code sebagai gambar PNG
downloadBtn.addEventListener('click', () => {
    const canvas = qrcodeContainer.querySelector('canvas');
    const img = qrcodeContainer.querySelector('img');

    let imageUrl = '';
    if (canvas) {
        imageUrl = canvas.toDataURL('image/png');
    } else if (img) {
        imageUrl = img.src;
    }

    if (imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('QR Code PNG berhasil diunduh!', 'success');
    }
});
