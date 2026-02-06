# Aryan Anand Taal Bamboo Dukan

Elegant, high‑performance single‑page site for a local bamboo and construction materials business in Kochas, Bihar. Built as a static site with Tailwind via CDN, optimized for mobile users and fast contact actions (call/WhatsApp).

## Highlights
- One‑page marketing layout with clear service and product sections
- Local gallery with lightbox
- Performance‑friendly images (lazy loading, async decoding, explicit sizing)
- Accessibility improvements (focus management, keyboard support)

## Tech Stack
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- Google Fonts
- Embedded Google Maps

## Project Structure
```
.
├── app.js
├── favicon.svg
├── index.html
├── styles.css
├── business1.jpg
├── business2.jpg
├── business3.jpg
├── business4.jpg
├── business5.jpg
└── scripts/
    └── optimize-images.py
```

## Run Locally
Open `index.html` in your browser. No build step required.

## Image Optimization
This project includes a helper script to optimize local images with Pillow.

1. Install Pillow:
```
pip install pillow
```

2. Run the optimizer:
```
python scripts/optimize-images.py
```

### Options
```
python scripts/optimize-images.py --quality 78
python scripts/optimize-images.py --webp
python scripts/optimize-images.py --in-place
```

## Notes
- External dependencies (Tailwind CDN, Google Fonts, Maps, and remote images) require internet access.
- If you convert images to WebP, update the `<img src>` paths in `index.html`.

## License
All rights reserved. This is a private business site.
