# 📸 Image Management Guide for EMBOS Beauty Salon

## How to Add & Change Images

### 1. **Hero Section Images** (Main Home Page)
Located in: `src/components/Hero.tsx`

**Current Images:**
- **Korean side (left)**: `/KOREAN_GIRL.png` - Change this to your Korean beauty makeup image
- **Bridal side (right)**: Pexels URL - Replace with your bridal photo

**How to replace:**
```tsx
// Find these lines and replace the src values:
<img src="/KOREAN_GIRL.png" alt="Korean beauty makeup" />
<img src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg" alt="Indian bridal wedding" />
```

**Steps:**
1. Add your images to `/public/` folder (e.g., `/public/your-image.png`)
2. Replace the `src` path with your filename
3. Update the `alt` text to describe your image

---

### 2. **About Section Image**
Located in: `src/components/About.tsx`

**Current image:** `/KOREAN_GIRL.png` (top section)

**Replace with:**
```tsx
<img src="/your-studio-image.png" alt="EMBOS Studio" />
```

---

### 3. **Navigation Logo**
Located in: `src/components/Navigation.tsx` & `src/components/Hero.tsx`

**Current:** `/logo.jpeg`

**To change:**
1. Replace your logo in `/public/logo.jpeg` or
2. Update the `src` to point to your new logo file

---

### 4. **Gallery Images**
Located in: `src/components/Gallery.tsx`

**Current:** Using Pexels placeholder images

**To add your own gallery images:**

Option A: Replace placeholder URLs
```tsx
const PLACEHOLDER_IMAGES: GalleryImage[] = [
  { 
    id: '1', 
    url: 'https://your-image-url.jpg',  // Replace this
    description: 'Glass Skin Treatment', 
    category: 'Korean', 
    created_at: '' 
  },
  // Add more images...
];
```

Option B: Upload to Supabase (Database)
- Connect your Supabase database
- Images will auto-load from the `gallery_images` table

---

### 5. **Pillar Services Section** (Bridal & Korean Beauty Cards)
Located in: `src/components/PillarServices.tsx`

**Current bridal image:** Pexels URL
**Current Korean image:** `/KOREAN_GIRL.png`

**To replace:**
```tsx
<img src="/your-bridal-image.png" alt="Bridal Studio" />
<img src="/your-korean-image.png" alt="Korean Beauty" />
```

---

### 6. **Footer Logo**
Located in: `src/components/Footer.tsx`

**Current:** `/logo.jpeg`

Same process - update the `/public/logo.jpeg` file

---

## 📁 Recommended Folder Structure

Place all your images in the `/public/` folder:
```
/public/
  ├── logo.jpeg
  ├── KOREAN_GIRL.png
  ├── bridal-makeup-1.jpg
  ├── korean-beauty-1.jpg
  ├── nail-art-1.jpg
  ├── gallery-image-1.jpg
  └── gallery-image-2.jpg
```

## 🎨 Image Optimization Tips

1. **Compression**: Compress images to reduce file size (use tools like TinyPNG)
2. **Format**: Use `.jpg` for photos, `.png` for logos/graphics
3. **Dimensions**: 
   - Hero images: 1920x1080px or larger
   - Gallery images: 800x600px minimum
   - Logo: 200x200px
4. **Quality**: Keep high quality for beauty salon (at least 85% compression)

## 🔗 Adding External URLs

You can also use image URLs from:
- Your own website/cloud storage
- Unsplash, Pexels, Pixabay
- Cloudinary, Imgur, etc.

Replace any image `src` with the full URL:
```tsx
<img src="https://example.com/your-image.jpg" alt="Description" />
```

## 📱 Responsive Images

The website is responsive - images scale automatically. However, make sure images are:
- Wide enough for desktop (1920px+)
- Optimized for mobile viewing
- Clear and professional quality

## ❓ Need Help?

After adding images:
1. Save the file
2. The dev server will auto-refresh
3. Check if images display correctly
4. Adjust alt text for accessibility

---

**Color Guide Reference:**
- 🩷 Baby Pink: `#FFE8F0` (backgrounds)
- 💙 Sky Blue: `#40BFFF` (accents & highlights)

Happy styling! ✨
