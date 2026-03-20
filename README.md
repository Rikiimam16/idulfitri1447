# 🎉 3D Model Idul Fitri Interactive

Website interaktif bertema **Idul Fitri 1447 H** dengan tampilan **3D model** dan elemen ucapan yang modern, elegan, dan interaktif.

🔗 Live Demo: https://idulfitri.rikzx.my.id/

## ✨ Fitur Utama

- 🕌 **10 Model 3D Idul Fitri**
  - Masjid
  - Ka'bah
  - Al-Quran
  - Ketupat
  - Bulan Sabit
  - Lentera (Fanous)
  - Bedug
  - Opor Ayam
  - Nastar
  - THR (Spesial 🎁)

- 🎊 **Efek Animasi**
  - Confetti saat klik THR
  - Glow & animasi UI
  - Loading screen animatif

- 🎵 **Background Music**
  - Takbiran
  - Lagu Idul Fitri
  - Bisa switch & pause

- 📱 **Responsive Design**
  - Support HP & Desktop

- 🎁 **Fitur THR Interaktif**
  - Klik area tengah (invisible button)
  - Muncul confetti 🎉
  - Redirect ke link DANA Kaget

---

## 🧠 Konsep Project

Project ini dibuat untuk:
- Media ucapan **Selamat Idul Fitri**
- Menampilkan elemen budaya Islam dalam bentuk **3D interaktif**
- Memberikan pengalaman unik dengan fitur **THR digital**

---

## 🛠️ Teknologi yang Digunakan

- **HTML5**
- **CSS3 (Animation & Glassmorphism)**
- **JavaScript (Vanilla)**
- **Three.js** → render 3D model
- **GSAP** → animasi smooth
- **Canvas Confetti** → efek ledakan 🎊


## 🚀 Cara Menjalankan

1. Download / clone project
2. Buka folder
3. Jalankan dengan:
   - Live Server (VSCode) atau
   - Upload ke Netlify / Hosting

---

## 🎯 Cara Kerja THR

- Terdapat tombol invisible (`#thrButton`)
- Posisi di tengah 3D model
- Saat diklik:
  1. Muncul confetti 🎉
  2. Device getar (HP)
  3. Redirect ke link DANA

```js
thrButton.addEventListener('click', () => {
    confetti();
    navigator.vibrate(100);
    window.location.href = 'https://link.dana.id/kaget/...';
});
````

## 🎨 Customisasi

### Ganti Link THR

```js
window.location.href = 'LINK_KAMU';
```

## 👨‍💻 Author

Dibuat oleh: **RikzCode**

## ⭐ Support

Kalau suka project ini:

* ⭐ Star repo
* 🔗 Share ke teman
* 🎁 Kirim THR 😆
