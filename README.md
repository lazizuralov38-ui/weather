# 🌤️ Obhavo — Kunlik Ob-havo Kuzatuvi

Har qanday shahar bo'yicha real vaqtdagi ob-havoni ko'rsatadigan veb-ilova. Joriy harorat, shamol, namlik, bosim va 7 kunlik prognozni namoyish etadi.

**Jonli demo:** loyihani GitHub Pages orqali yuklaganingizdan so'ng shu yerga havola qo'shing.

## Xususiyatlari

- 🔍 Istalgan shahar bo'yicha qidiruv (avtomatik takliflar bilan)
- 🌡️ Joriy harorat, sezilma harorat, yuqori/past ko'rsatkichlar
- 🧭 Shamol yo'nalishi va tezligi (kompas ko'rinishida)
- 💧 Namlik, yog'ingarchilik ehtimoli va atmosfera bosimi
- 📅 7 kunlik ob-havo prognozi
- 🎨 Ob-havo turiga qarab o'zgaruvchi fon ranglari (quyoshli, bulutli, yomg'irli, qorli va h.k.)
- 📱 Mobil qurilmalarga moslashgan (responsive) dizayn

## Texnologiyalar

- Sof HTML, CSS va JavaScript (hech qanday freymvork yoki build tizimi talab qilinmaydi)
- Ob-havo ma'lumotlari: [Open-Meteo API](https://open-meteo.com) — bepul va API kalitisiz ishlaydi

## Loyihani ishga tushirish

Hech qanday o'rnatish shart emas — shunchaki `index.html` faylini brauzerda oching:

```bash
git clone https://github.com/FOYDALANUVCHI_NOMI/obhavo-ilova.git
cd obhavo-ilova
open index.html   # yoki brauzeringizda faylni oching
```

Yoki [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) kabi VS Code kengaytmasi bilan ishga tushiring.

## GitHub'ga yuklash

```bash
git init
git add .
git commit -m "Obhavo ilovasi: birinchi versiya"
git branch -M main
git remote add origin https://github.com/FOYDALANUVCHI_NOMI/obhavo-ilova.git
git push -u origin main
```

## GitHub Pages orqali onlayn joylashtirish

1. GitHub'dagi repozitoriyingizga o'ting → **Settings** → **Pages**
2. **Source** bo'limida `main` branch va `/ (root)` papkasini tanlang
3. **Save** tugmasini bosing
4. Bir necha daqiqadan so'ng ilova quyidagi manzilda ochiladi:
   `https://FOYDALANUVCHI_NOMI.github.io/obhavo-ilova/`

## Loyiha tuzilishi

```
obhavo-ilova/
├── index.html      # Sahifa tuzilishi
├── style.css       # Dizayn va uslublar
├── script.js       # Open-Meteo API bilan ishlash mantig'i
└── README.md       # Ushbu fayl
```

## Ma'lumotlar manbai haqida

Ilova [Open-Meteo](https://open-meteo.com) ochiq ob-havo API'sidan foydalanadi:
- Geokodlash (shahar nomidan koordinata topish): `geocoding-api.open-meteo.com`
- Ob-havo prognozi: `api.open-meteo.com`

Ikkala xizmat ham bepul, ro'yxatdan o'tish yoki API kalit talab qilmaydi — shuning uchun loyihada hech qanday maxfiy kalit (secret) saqlanmaydi va uni to'g'ridan-to'g'ri ochiq repozitoriy sifatida yuklash mumkin.

## Litsenziya

Ushbu loyihadan erkin foydalanishingiz, o'zgartirishingiz va o'z portfolioingizga qo'shishingiz mumkin.
