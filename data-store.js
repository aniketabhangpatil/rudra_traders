/**
 * Rudra Traders (रुद्र ट्रेडर्स) - Data Store & Local Storage Management
 * Handles localStorage for rates/content/settings and IndexedDB for gallery photos.
 */

const STORAGE_KEYS = {
  RATES: 'rudra_crop_rates',
  SETTINGS: 'rudra_business_settings',
  CONTENT: 'rudra_website_content',
  LANGUAGE: 'rudra_selected_language',
  AUTH: 'rudra_admin_auth'
};

const DB_CONFIG = {
  name: 'RudraTradersDB',
  version: 1,
  store: 'gallery_photos'
};

// Default Crop Rates (₹ / quintal)
const DEFAULT_RATES = {
  soybean: {
    nameMr: 'सोयाबीन',
    nameEn: 'Soybean',
    rate: '5150',
    minRate: '4850',
    maxRate: '5300',
    notesMr: 'ओलावा १०% पेक्षा कमी, स्वच्छ, माती नसलेला पिवळा दाणा.',
    notesEn: 'Moisture below 10%, clean dust-free yellow bold seed.'
  },
  chickpea: {
    nameMr: 'हरभरा (चना)',
    nameEn: 'Chickpea (Chana)',
    rate: '5950',
    minRate: '5650',
    maxRate: '6200',
    notesMr: 'चांगला वाळलेला, कीड नसलेला गावरान व काबुली हरभरा.',
    notesEn: 'Well dried, pest-free native & bold chickpea.'
  },
  wheat: {
    nameMr: 'गहू',
    nameEn: 'Wheat',
    rate: '2850',
    minRate: '2650',
    maxRate: '3150',
    notesMr: 'लोकवन, शरबती व सिहोर उत्तम प्रत, स्वच्छ दाणा.',
    notesEn: 'Lokwan, Sharbati & premium dry grain, clean lot.'
  },
  lastUpdated: new Date().toLocaleDateString('mr-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + ' - सकाळी ०९:३०'
};

// Default Business Settings
const DEFAULT_SETTINGS = {
  traderNameMr: 'दीपक माधव वेताळ',
  traderNameEn: 'Dipak Madhav Vetal',
  traderTitleMr: 'प्रोप्रायटर / संचालक: दीपक माधव वेताळ',
  traderTitleEn: 'Proprietor: Dipak Madhav Vetal',
  phoneDisplay: '70574 06889',
  phoneCall: '+917057406889',
  whatsappNumber: '917057406889',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Near+Laxmi+Narayan+School+Ward+No+4+Wakadi+Rahata+Ahmednagar+413719',
  addressMr: 'मु. पो. वाकडी, ता. राहाता, जि. अहमदनगर. लक्ष्मी नारायण शाळेजवळ, वॉर्ड नं. ४, पिन कोड - ४१३७१९',
  addressEn: 'At Post Wakadi, Taluka Rahata, Dist. Ahmednagar. Near Laxmi Narayan School, Ward No. 4, Pin Code - 413719',
  defaultLang: 'mr'
};

// Default Bilingual Website Content
const DEFAULT_CONTENT = {
  hero: {
    headlineMr: 'शेतीमाल व्यापारात आपला विश्वासू भागीदार',
    headlineEn: 'Your Trusted Partner for Agricultural Crop Trading',
    subtextMr: 'वाकडी व परिसरातील शेतकरी बांधवांसाठी सोयाबीन, हरभरा आणि गहू खरेदीची खात्रीशीर, पारदर्शक आणि तत्पर व्यवस्था.',
    subtextEn: 'Guaranteed fair weighing, transparent market rates, and prompt payment for Soybean, Chickpea, and Wheat in Wakdi.'
  },
  about: {
    titleMr: 'रुद्र ट्रेडर्स - शेतकरी हितासाठी कटिबद्ध व्यापार (प्रोप्रा. दीपक माधव वेताळ)',
    titleEn: 'Rudra Traders - Committed to Farmer Prosperity (Prop. Dipak Madhav Vetal)',
    descMr: 'रुद्र ट्रेडर्स (संचालक: दीपक माधव वेताळ) ही मु. पो. वाकडी (लक्ष्मी नारायण शाळेजवळ, वॉर्ड नं. ४, ता. राहाता, जि. अहमदनगर, पिन कोड - ४१३७१९) येथील अग्रगण्य शेतीमाल खरेदी केंद्र आहे. आम्ही स्थानिक शेतकरी बांधवांकडून थेट सोयाबीन, हरभरा आणि गहू खरेदी करतो. आमच्याकडे १००% अचूक संगणकीकृत वजन, चालू बाजारभाव आणि त्वरित हिशोब व थेट पेमेंट दिले जाते. शेतकऱ्यांचा विश्वास हेच आमचे भांडवल आहे.',
    descEn: 'Rudra Traders (Proprietor: Dipak Madhav Vetal) is a premier agricultural trading center located at Post Wakadi, Near Laxmi Narayan School, Ward No. 4, Taluka Rahata, Dist. Ahmednagar, Pin Code - 413719. We directly purchase Soybean, Chickpea, and Wheat from farmers with certified digital weighing, transparent market rates, and instant payment settlement via cash or bank.'
  },
  howItWorks: {
    titleMr: 'सोपी व पारदर्शक खरेदी कार्यपद्धती',
    titleEn: 'Simple & Transparent 4-Step Trading Process',
    step1TitleMr: '१. दर माहिती व संपर्क',
    step1TitleEn: '1. Inquire Today\'s Rates',
    step1DescMr: 'दीपक वेताळ (70574 06889) यांच्याशी थेट कॉल किंवा व्हॉट्सअ‍ॅपवर संपर्क करून चालू दर जाणून घ्या.',
    step1DescEn: 'Contact Dipak Vetal (70574 06889) via direct call or WhatsApp to confirm today\'s market rate.',
    step2TitleMr: '२. शेतीमाल संकलन केंद्रावर आणा',
    step2TitleEn: '2. Bring Produce to Center',
    step2DescMr: 'आपला सोयाबीन, हरभरा किंवा गहू आमच्या वाकडी (लक्ष्मी नारायण शाळेजवळ, पिन ४१३७१९) येथील खरेदी केंद्रावर आणा.',
    step2DescEn: 'Bring your harvested crop to our Wakadi trading center near Laxmi Narayan School (Pin 413719).',
    step3TitleMr: '३. ओलावा व अचूक वजन तपासणी',
    step3TitleEn: '3. Quality & Digital Weighing',
    step3DescMr: 'प्रतवारी व ओलावा तपासून प्रमाणित डिजिटल इलेक्ट्रॉनिक काट्यावर अचूक वजन केले जाते.',
    step3DescEn: 'Quality and moisture are inspected before accurate weighing on certified digital scales.',
    step4TitleMr: '४. तात्काळ हिशोब व थेट पेमेंट',
    step4DescMr: 'वजन पावती सोबत तात्काळ हिशोब करून बँक खात्यात आरटीजीएस/युपीआय किंवा रोख पेमेंट दिले जाते.',
    step4DescEn: 'Instant weighing bill is generated and direct payment is disbursed via bank transfer or cash.'
  },
  footer: {
    noteMr: 'रुद्र ट्रेडर्स (प्रोप्रा. दीपक माधव वेताळ) - मु. पो. वाकडी, ता. राहाता, जि. अहमदनगर. लक्ष्मी नारायण शाळेजवळ, वॉर्ड नं. ४, पिन कोड - ४१३७१९. फोन: 70574 06889.',
    noteEn: 'Rudra Traders (Prop. Dipak Madhav Vetal) - At Post Wakadi, Near Laxmi Narayan School, Ward No. 4, Taluka Rahata, Dist. Ahmednagar, Pin Code - 413719. Phone: 70574 06889.'
  }
};

// Initial Demo Gallery Photos (High Quality Authentic SVG Placeholders)
const DEFAULT_GALLERY_PHOTOS = [
  {
    id: 1,
    titleMr: 'प्रमाणित इलेक्ट्रॉनिक वजन काटा केंद्र',
    titleEn: 'Certified Electronic Weighbridge Station',
    descMr: 'शेतकऱ्यांसमोर पारदर्शक वजन करणारा प्रमाणित डिजिटल काटा.',
    descEn: 'Transparent computerized weighing facility directly in front of the farmer.',
    src: 'assets/gallery_placeholder1.svg',
    isDefault: true,
    featured: true,
    order: 1
  },
  {
    id: 2,
    titleMr: 'धान्य गुणवत्ता व ओलावा (Moisture) तपासणी',
    titleEn: 'Grain Quality & Moisture Inspection Desk',
    descMr: 'सोयाबीन, हरभरा आणि गहू यांच्या ओलाव्याची अचूक चाचणी.',
    descEn: 'Moisture and grain grading desk ensuring fair evaluation without arbitrary cuts.',
    src: 'assets/gallery_placeholder2.svg',
    isDefault: true,
    featured: true,
    order: 2
  },
  {
    id: 3,
    titleMr: 'तात्काळ हिशोब व थेट बिलिंग कार्यालय',
    titleEn: 'Instant Settlement & Direct Billing Office',
    descMr: 'वजन होताच संगणकीय पावती व थेट बँक खात्यात रक्कम वर्ग.',
    descEn: 'Prompt accounting slip and instant settlement via RTGS/NEFT/Cash.',
    src: 'assets/gallery_placeholder3.svg',
    isDefault: true,
    featured: true,
    order: 3
  }
];

// ==========================================
// LocalStorage Getters & Setters
// ==========================================
function getStoredRates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RATES);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_RATES));
  } catch (e) {
    console.warn('LocalStorage read error for rates, fallback to defaults', e);
    return JSON.parse(JSON.stringify(DEFAULT_RATES));
  }
}

function saveStoredRates(rates) {
  localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(rates));
  window.dispatchEvent(new Event('rudra_rates_updated'));
}

function getStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }
}

function saveStoredSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  window.dispatchEvent(new Event('rudra_settings_updated'));
}

function getStoredContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTENT);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  }
}

function saveStoredContent(content) {
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content));
  window.dispatchEvent(new Event('rudra_content_updated'));
}

function getSelectedLanguage() {
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'mr';
}

function setSelectedLanguage(lang) {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  window.dispatchEvent(new Event('rudra_lang_changed'));
}

// ==========================================
// IndexedDB for Gallery Photographs
// ==========================================
function openGalleryDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported by this browser'));
      return;
    }
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(DB_CONFIG.store)) {
        const store = db.createObjectStore(DB_CONFIG.store, { keyPath: 'id', autoIncrement: true });
        store.createIndex('order', 'order', { unique: false });
        store.createIndex('featured', 'featured', { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function getGalleryPhotos() {
  try {
    const db = await openGalleryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.store, 'readonly');
      const store = tx.objectStore(DB_CONFIG.store);
      const req = store.getAll();

      req.onsuccess = () => {
        let photos = req.result;
        if (!photos || photos.length === 0) {
          // Initialize defaults
          initDefaultGallery().then(resolve).catch(reject);
        } else {
          photos.sort((a, b) => (a.order || 0) - (b.order || 0));
          resolve(photos);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB fallback to static gallery:', err);
    return JSON.parse(JSON.stringify(DEFAULT_GALLERY_PHOTOS));
  }
}

async function initDefaultGallery() {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_CONFIG.store, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.store);
    DEFAULT_GALLERY_PHOTOS.forEach((photo) => {
      store.put(photo);
    });
    tx.oncomplete = () => resolve(DEFAULT_GALLERY_PHOTOS);
    tx.onerror = () => reject(tx.error);
  });
}

async function saveGalleryPhoto(photoObj) {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_CONFIG.store, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.store);
    const req = store.put(photoObj);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deleteGalleryPhoto(id) {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_CONFIG.store, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.store);
    const req = store.delete(Number(id));

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

async function resetGalleryToDefault() {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_CONFIG.store, 'readwrite');
    const store = tx.objectStore(DB_CONFIG.store);
    store.clear().onsuccess = () => {
      DEFAULT_GALLERY_PHOTOS.forEach((item) => store.put(item));
      resolve(DEFAULT_GALLERY_PHOTOS);
    };
    tx.onerror = () => reject(tx.error);
  });
}

// Utility: Build WhatsApp URL based on language and optional crop
function getWhatsAppUrl(cropKey = '') {
  const settings = getStoredSettings();
  const lang = getSelectedLanguage();
  const traderName = lang === 'mr' ? 'दीपकजी वेताळ (रुद्र ट्रेडर्स)' : 'Dipak Madhav Vetal (Rudra Traders)';
  let msg = '';

  if (lang === 'mr') {
    if (cropKey === 'soybean') {
      msg = `नमस्कार ${traderName}, मला आजच्या सोयाबीन (Soybean) खरेदी दराविषयी व विक्रीसाठी चौकशी करायची आहे. चालू दर व माल आणण्याची वेळ कळवावी.`;
    } else if (cropKey === 'chickpea') {
      msg = `नमस्कार ${traderName}, मला आजच्या हरभरा / चना (Chickpea) खरेदी दराविषयी व विक्रीसाठी चौकशी करायची आहे. चालू दर व प्रतवारीची माहिती द्यावी.`;
    } else if (cropKey === 'wheat') {
      msg = `नमस्कार ${traderName}, मला आजच्या गहू (Wheat) खरेदी दराविषयी व विक्रीसाठी चौकशी करायची आहे. चालू दर व खरेदीची माहिती द्यावी.`;
    } else {
      msg = `नमस्कार ${traderName}, मला वाकडी खरेदी केंद्रावर आजच्या शेतीमाल दराविषयी चौकशी करायची आहे.`;
    }
  } else {
    if (cropKey === 'soybean') {
      msg = `Hello ${traderName}, I would like to enquire about today's Soybean purchase rates and selling process at Wakadi. Please let me know the current rate.`;
    } else if (cropKey === 'chickpea') {
      msg = `Hello ${traderName}, I would like to enquire about today's Chickpea (Chana) purchase rates and selling process at Wakadi. Please let me know the current rate.`;
    } else if (cropKey === 'wheat') {
      msg = `Hello ${traderName}, I would like to enquire about today's Wheat purchase rates and selling process at Wakadi. Please let me know the current rate.`;
    } else {
      msg = `Hello ${traderName}, I would like to enquire about today's crop trading rates at Rudra Traders, Wakadi.`;
    }
  }

  // Directly send to 7057406889 (WhatsApp format: 917057406889)
  const targetNumber = settings.whatsappNumber || '917057406889';
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`;
}
