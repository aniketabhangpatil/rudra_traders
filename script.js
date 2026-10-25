/**
 * Rudra Traders (रुद्र ट्रेडर्स) - Main Public Script
 * Handles bilingual translation, dynamic crop rate cards, continuous ticker,
 * IndexedDB gallery with lightbox, and live storage sync.
 */

// Translation Dictionary for Static UI Elements
const TRANSLATIONS = {
  mr: {
    navHome: 'मुख्यपृष्ठ',
    navRates: 'आजचे दर',
    navAbout: 'आमच्याबद्दल',
    navHowItWorks: 'कार्यपद्धती',
    navGallery: 'छायाचित्रे',
    navContact: 'संपर्क',
    navAdmin: 'ॲडमिन',
    callNow: 'कॉल करा (70574 06889)',
    whatsappEnquiry: 'व्हॉट्सअ‍ॅपवर चौकशी करा',
    todaysRates: 'आजचे चालू खरेदी दर',
    ratePerQuintal: '₹ / क्विंटल',
    minMaxRange: 'दर मर्यादा',
    qualityNotes: 'गुणवत्ता / ओलावा माहिती',
    sellCropBtn: 'दर चौकशी करा (WhatsApp)',
    enquireCropBtn: 'व्हॉट्सअ‍ॅपवर दर चौकशी करा',
    callNowShort: 'कॉल करा',
    traderName: 'दीपक माधव वेताळ',
    traderTitle: 'प्रोप्रायटर: दीपक माधव वेताळ',
    traderBadge: 'संचालक: दीपक माधव वेताळ (70574 06889)',
    addressFull: 'मु. पो. वाकडी, ता. राहाता, जि. अहमदनगर. लक्ष्मी नारायण शाळेजवळ, वॉर्ड नं. ४',
    lastUpdatedPrefix: 'शेवटचे अपडेट:',
    rateNotUpdated: 'दर अपडेट केलेले नाहीत — खात्रीसाठी कॉल करा',
    liveTickerTag: 'चालू बाजारभाव',
    trustPillar1Title: '१००% अचूक वजन',
    trustPillar1Desc: 'प्रमाणित डिजिटल काटा',
    trustPillar2Title: 'चालू बाजारभाव',
    trustPillar2Desc: 'पारदर्शक दर व्यवस्था',
    trustPillar3Title: 'तात्काळ पेमेंट',
    trustPillar3Desc: 'थेट बँक / रोख हिशोब',
    ratesSectionTag: 'दैनिक बाजारभाव',
    ratesSectionTitle: 'आजचे शेतीमाल खरेदी दर',
    ratesSectionDesc: 'शेतकऱ्यांच्या कष्टाला योग्य मोल देण्यासाठी आम्ही दररोज पारदर्शक व चालू बाजारदर उपलब्ध करून देतो.',
    rateDisclaimer: 'टीप: वरील दर मालाची प्रत, ओलावा व दैनिक बाजार चढ-उतारानुसार बदलू शकतात. माल घेऊन येण्यापूर्वी प्रत्यक्ष फोन करून दराची खात्री करून घ्यावी.',
    aboutTag: 'विश्वासार्ह परंपरा',
    feature1: 'शेतकऱ्यांसमोर पारदर्शक डिजिटल वजन',
    feature2: 'कोणतीही अनाठायी कपात नाही',
    feature3: 'तात्काळ हिशोब व संपूर्ण पेमेंट',
    feature4: 'वाकडी व परिसरातील शेतकऱ्यांचे पसंतीचे केंद्र',
    stat1Num: '१००%',
    stat1Label: 'पारदर्शक संगणकीय वजन',
    stat2Num: '३ प्रमुख पिके',
    stat2Label: 'सोयाबीन, हरभरा, गहू खरेदी',
    stat3Num: '० मध्यस्थ',
    stat3Label: 'थेट शेतकरी खरेदी व त्वरित हिशोब',
    howTag: 'पारदर्शक खरेदी',
    galleryTag: 'संकलन केंद्र',
    galleryTitle: 'व्यवसाय व संकलन केंद्र छायाचित्रे',
    galleryDesc: 'आमच्या वाकडी येथील धान्य संकलन केंद्र, वजन काटा व सुविधांची प्रत्यक्ष छायाचित्रे.',
    galleryPlaceholderNotice: '📷 अधिकृत व्यवसाय छायाचित्रे ॲडमिन पॅनेलमधून जोडता येतात.',
    contactTag: 'संपर्क व पत्ता',
    contactTitle: 'आमच्याशी संपर्क साधा',
    contactDesc: 'आपल्या शेतीमालाच्या विक्रीसाठी किंवा दराच्या अधिक माहितीसाठी केव्हाही संपर्क करा.',
    contactPhoneLabel: 'फोन नंबर',
    contactHoursLabel: 'कामकाजाची वेळ',
    contactHoursVal: 'सकाळी ८:०० ते संध्याकाळी ७:०० (सोमवार ते रविवार)',
    contactAddressLabel: 'पत्ता व ठिकाण',
    openMapsBtn: 'गुगल मॅपवर दिशा पहा',
    footerQuickLinks: 'द्रुत दुवे',
    footerCropsTitle: 'आम्ही खरेदी करत असलेली पिके',
    footerHelplineTitle: 'शेतकरी मदत व संपर्क कक्ष',
    footerRights: 'रुद्र ट्रेडर्स, वाकडी. सर्व हक्क सुरक्षित. (केवळ फ्रंट-एंड प्रात्यक्षिक)',
    modalClose: 'बंद करा'
  },
  en: {
    navHome: 'Home',
    navRates: 'Today\'s Rates',
    navAbout: 'About Us',
    navHowItWorks: 'How It Works',
    navGallery: 'Gallery',
    navContact: 'Contact',
    navAdmin: 'Admin',
    callNow: 'Call Now (70574 06889)',
    whatsappEnquiry: 'Enquire on WhatsApp',
    todaysRates: 'Today\'s Purchase Rates',
    ratePerQuintal: '₹ / Quintal',
    minMaxRange: 'Rate Range',
    qualityNotes: 'Quality & Moisture Specs',
    sellCropBtn: 'Enquire Rate (WhatsApp)',
    enquireCropBtn: 'Enquire Rate on WhatsApp',
    callNowShort: 'Call Now',
    traderName: 'Dipak Madhav Vetal',
    traderTitle: 'Proprietor: Dipak Madhav Vetal',
    traderBadge: 'Trader: Dipak Madhav Vetal (70574 06889)',
    addressFull: 'At Post Wakadi, Taluka Rahata, Dist. Ahmednagar. Near Laxmi Narayan School, Ward No. 4',
    lastUpdatedPrefix: 'Last updated:',
    rateNotUpdated: 'Rate not updated — call to confirm',
    liveTickerTag: 'LIVE RATES',
    trustPillar1Title: '100% Accurate Weight',
    trustPillar1Desc: 'Certified digital scale',
    trustPillar2Title: 'Live Market Rates',
    trustPillar2Desc: 'Transparent daily pricing',
    trustPillar3Title: 'Instant Settlement',
    trustPillar3Desc: 'Direct bank / cash payment',
    ratesSectionTag: 'Daily Rates',
    ratesSectionTitle: 'Current Agricultural Crop Rates',
    ratesSectionDesc: 'Committed to giving farmers fair value with transparent daily purchase prices.',
    rateDisclaimer: 'Note: Above rates vary based on crop quality, moisture levels, and market fluctuations. Please call to confirm before transporting produce.',
    aboutTag: 'Trusted Heritage',
    feature1: 'Transparent digital weighing in front of farmers',
    feature2: 'No arbitrary weight deductions or hidden charges',
    feature3: 'Immediate bill slip & instant payment',
    feature4: 'Preferred trading destination in Wakdi & nearby talukas',
    stat1Num: '100%',
    stat1Label: 'Accurate Digital Weighing',
    stat2Num: '3 Major Crops',
    stat2Label: 'Soybean, Chickpea, Wheat',
    stat3Num: '0 Middlemen',
    stat3Label: 'Direct farmer trading & prompt payment',
    howTag: 'Trading Process',
    galleryTag: 'Trading Center',
    galleryTitle: 'Business & Facility Photographs',
    galleryDesc: 'Authentic views of our crop collection center, weighbridge, and facilities in Wakdi.',
    galleryPlaceholderNotice: '📷 Verified business photographs can be added via the Admin Panel.',
    contactTag: 'Contact & Location',
    contactTitle: 'Get in Touch with Us',
    contactDesc: 'Feel free to contact us for crop selling inquiries or market rate updates.',
    contactPhoneLabel: 'Phone Number',
    contactHoursLabel: 'Business Hours',
    contactHoursVal: '8:00 AM - 7:00 PM (Monday to Sunday)',
    contactAddressLabel: 'Address & Location',
    openMapsBtn: 'Open in Google Maps',
    footerQuickLinks: 'Quick Links',
    footerCropsTitle: 'Crops We Purchase',
    footerHelplineTitle: 'Farmer Support & Helpdesk',
    footerRights: 'Rudra Traders, Wakdi. All rights reserved. (Static Frontend Demo)',
    modalClose: 'Close'
  }
};

// Document Elements
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  renderAllSections();
  setupEventListeners();
  loadGallery();
});

// Format Indian Currency Numerals
function formatInr(val) {
  if (!val || isNaN(val)) return val;
  return Number(val).toLocaleString('en-IN');
}

// Convert English digits to Devanagari numerals if in Marathi mode
function toDevanagariNumerals(str) {
  if (typeof str !== 'string') str = String(str);
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return str.replace(/[0-9]/g, (w) => devanagariDigits[+w]);
}

// Initialize Language
function initLanguage() {
  const currentLang = getSelectedLanguage();
  updateLanguageToggles(currentLang);
  document.documentElement.setAttribute('lang', currentLang);
}

function updateLanguageToggles(lang) {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function switchLanguage(newLang) {
  setSelectedLanguage(newLang);
  document.documentElement.setAttribute('lang', newLang);
  updateLanguageToggles(newLang);
  renderAllSections();
}

// Render All Website Sections
function renderAllSections() {
  const lang = getSelectedLanguage();
  const rates = getStoredRates();
  const settings = getStoredSettings();
  const content = getStoredContent();
  const t = TRANSLATIONS[lang];

  // 1. Static UI Text Translations
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  // 2. Dynamic Content: Hero Section
  const heroHeadlineEl = document.getElementById('heroHeadline');
  const heroSubtextEl = document.getElementById('heroSubtext');
  if (heroHeadlineEl) heroHeadlineEl.textContent = lang === 'mr' ? content.hero.headlineMr : content.hero.headlineEn;
  if (heroSubtextEl) heroSubtextEl.textContent = lang === 'mr' ? content.hero.subtextMr : content.hero.subtextEn;

  // 3. Dynamic Content: About Section
  const aboutTitleEl = document.getElementById('aboutTitle');
  const aboutDescEl = document.getElementById('aboutDesc');
  if (aboutTitleEl) aboutTitleEl.textContent = lang === 'mr' ? content.about.titleMr : content.about.titleEn;
  if (aboutDescEl) aboutDescEl.textContent = lang === 'mr' ? content.about.descMr : content.about.descEn;

  // 4. Dynamic Content: How It Works Section
  const howTitleEl = document.getElementById('howTitle');
  if (howTitleEl) howTitleEl.textContent = lang === 'mr' ? content.howItWorks.titleMr : content.howItWorks.titleEn;

  for (let i = 1; i <= 4; i++) {
    const sTitleEl = document.getElementById(`step${i}Title`);
    const sDescEl = document.getElementById(`step${i}Desc`);
    if (sTitleEl) sTitleEl.textContent = lang === 'mr' ? content.howItWorks[`step${i}TitleMr`] : content.howItWorks[`step${i}TitleEn`];
    if (sDescEl) sDescEl.textContent = lang === 'mr' ? content.howItWorks[`step${i}DescMr`] : content.howItWorks[`step${i}DescEn`];
  }

  // 5. Dynamic Content: Footer Note
  const footerNoteEl = document.getElementById('footerNote');
  if (footerNoteEl) footerNoteEl.textContent = lang === 'mr' ? content.footer.noteMr : content.footer.noteEn;

  // 6. Action Links: Call, WhatsApp, Google Maps
  const callButtons = document.querySelectorAll('.action-call-btn');
  callButtons.forEach((btn) => {
    btn.setAttribute('href', `tel:${settings.phoneCall}`);
  });

  const phoneDisplayEls = document.querySelectorAll('.phone-display-text');
  phoneDisplayEls.forEach((el) => {
    el.textContent = lang === 'mr' ? toDevanagariNumerals(settings.phoneDisplay) : settings.phoneDisplay;
  });

  const whatsappButtons = document.querySelectorAll('.action-whatsapp-btn');
  whatsappButtons.forEach((btn) => {
    const cropKey = btn.dataset.crop || '';
    btn.setAttribute('href', getWhatsAppUrl(cropKey));
  });

  const mapsButtons = document.querySelectorAll('.action-maps-btn');
  mapsButtons.forEach((btn) => {
    btn.setAttribute('href', settings.mapsUrl);
  });

  const addressDisplayEl = document.getElementById('addressDisplayText');
  if (addressDisplayEl) {
    addressDisplayEl.textContent = lang === 'mr' ? settings.addressMr : settings.addressEn;
  }

  // Trader Name & Title
  const traderNameEls = document.querySelectorAll('.trader-name-text');
  traderNameEls.forEach((el) => {
    el.textContent = lang === 'mr' ? (settings.traderNameMr || 'दीपक माधव वेताळ') : (settings.traderNameEn || 'Dipak Madhav Vetal');
  });

  const traderTitleEls = document.querySelectorAll('.trader-title-text');
  traderTitleEls.forEach((el) => {
    el.textContent = lang === 'mr' ? (settings.traderTitleMr || 'प्रोप्रायटर: दीपक माधव वेताळ') : (settings.traderTitleEn || 'Proprietor: Dipak Madhav Vetal');
  });

  // 7. Render Rate Ticker
  renderTicker(rates, lang, t);

  // 8. Render Rate Cards
  renderRateCards(rates, lang, t);

  // 9. Render Hero Quick Card
  renderHeroQuickCard(rates, lang, t);
}

// Render Continuous Scrolling Ticker
function renderTicker(rates, lang, t) {
  const tickerTrack = document.getElementById('tickerTrack');
  if (!tickerTrack) return;

  const crops = [
    { key: 'soybean', icon: 'assets/soybean.svg' },
    { key: 'chickpea', icon: 'assets/chickpea.svg' },
    { key: 'wheat', icon: 'assets/wheat.svg' }
  ];

  let tickerHtml = '';

  const buildGroup = () => {
    let group = '<div class="ticker-group">';
    crops.forEach((c) => {
      const cropData = rates[c.key];
      const name = lang === 'mr' ? cropData.nameMr : cropData.nameEn;
      const rateStr = cropData.rate ? `₹ ${lang === 'mr' ? toDevanagariNumerals(formatInr(cropData.rate)) : formatInr(cropData.rate)} / क्विंटल` : t.rateNotUpdated;

      group += `
        <div class="ticker-item">
          <span class="ticker-crop-name">${name}</span>:
          <span class="ticker-price">${rateStr}</span>
        </div>
        <span class="ticker-sep">•</span>
      `;
    });

    const updatedText = rates.lastUpdated ? `${t.lastUpdatedPrefix} ${rates.lastUpdated}` : '';
    group += `<div class="ticker-updated">${updatedText}</div></div>`;
    return group;
  };

  // Duplicate for seamless 100% infinite marquee loop
  tickerHtml = buildGroup() + buildGroup() + buildGroup();
  tickerTrack.innerHTML = tickerHtml;
}

// Render Rate Cards on Homepage
function renderRateCards(rates, lang, t) {
  const container = document.getElementById('cropRatesGrid');
  if (!container) return;

  const crops = [
    { key: 'soybean', svg: 'assets/soybean.svg', themeClass: 'crop-theme-soybean' },
    { key: 'chickpea', svg: 'assets/chickpea.svg', themeClass: 'crop-theme-chickpea' },
    { key: 'wheat', svg: 'assets/wheat.svg', themeClass: 'crop-theme-wheat' }
  ];

  let cardsHtml = '';

  crops.forEach((crop) => {
    const data = rates[crop.key];
    const name = lang === 'mr' ? data.nameMr : data.nameEn;
    const subname = lang === 'mr' ? data.nameEn : data.nameMr;
    const rateFormatted = data.rate ? `₹ ${lang === 'mr' ? toDevanagariNumerals(formatInr(data.rate)) : formatInr(data.rate)}` : t.rateNotUpdated;
    const minFormatted = data.minRate ? (lang === 'mr' ? toDevanagariNumerals(formatInr(data.minRate)) : formatInr(data.minRate)) : '---';
    const maxFormatted = data.maxRate ? (lang === 'mr' ? toDevanagariNumerals(formatInr(data.maxRate)) : formatInr(data.maxRate)) : '---';
    const notes = lang === 'mr' ? (data.notesMr || '') : (data.notesEn || '');

    cardsHtml += `
      <article class="rate-card ${crop.themeClass}" id="card-${crop.key}">
        <div class="rate-card-top">
          <div class="rate-crop-info">
            <div class="crop-icon-wrap">
              <img src="${crop.svg}" alt="${name}" loading="lazy" width="48" height="48">
            </div>
            <div class="rate-card-names">
              <h3>${name}</h3>
              <span class="crop-subname">${subname}</span>
            </div>
          </div>
          <span class="rate-status-tag">चालू खरेदी • Live</span>
        </div>

        <div class="rate-card-body">
          <div class="rate-price-block">
            <div class="rate-price-label">${t.todaysRates}</div>
            <div class="rate-main-price">${rateFormatted}</div>
            <div class="rate-unit-label">${t.ratePerQuintal}</div>
          </div>

          <div class="rate-range-row">
            <span class="rate-range-label">${t.minMaxRange}:</span>
            <span class="rate-range-val">₹ ${minFormatted} - ₹ ${maxFormatted}</span>
          </div>

          <div class="rate-quality-box">
            <strong>${t.qualityNotes}:</strong> ${notes}
          </div>

          <!-- Direct Crop Enquiry Action Buttons (Sending to 70574 06889) -->
          <div class="rate-card-enquiry-box">
            <a href="${getWhatsAppUrl(crop.key)}" target="_blank" rel="noopener noreferrer" class="btn btn-crop-whatsapp action-whatsapp-btn" data-crop="${crop.key}" aria-label="Enquire about ${name} on WhatsApp">
              <span class="btn-icon">💬</span>
              <span class="btn-text-wrap">
                <span class="btn-title">${t.enquireCropBtn}</span>
                <span class="btn-sub">दीपक वेताळ: 70574 06889</span>
              </span>
            </a>
            <a href="tel:+917057406889" class="btn btn-crop-call action-call-btn" aria-label="Call about ${name}">
              <span>📞</span>
              <span>${t.callNowShort}</span>
            </a>
          </div>
        </div>

        <div class="rate-card-footer">
          <div class="rate-updated-time">
            🕒 ${rates.lastUpdated || ''}
          </div>
          <span class="rate-trader-note">दीपक माधव वेताळ • वाकडी</span>
        </div>
      </article>
    `;
  });

  container.innerHTML = cardsHtml;
}

// Render Hero Quick Rates Column
function renderHeroQuickCard(rates, lang, t) {
  const container = document.getElementById('heroRatesList');
  if (!container) return;

  const crops = [
    { key: 'soybean', svg: 'assets/soybean.svg' },
    { key: 'chickpea', svg: 'assets/chickpea.svg' },
    { key: 'wheat', svg: 'assets/wheat.svg' }
  ];

  let html = '';
  crops.forEach((c) => {
    const data = rates[c.key];
    const namePrimary = lang === 'mr' ? data.nameMr : data.nameEn;
    const nameSecondary = lang === 'mr' ? data.nameEn : data.nameMr;
    const price = data.rate ? `₹ ${lang === 'mr' ? toDevanagariNumerals(formatInr(data.rate)) : formatInr(data.rate)}` : t.rateNotUpdated;

    html += `
      <div class="hero-rate-row">
        <div class="hero-rate-crop">
          <img src="${c.svg}" alt="${namePrimary}" width="38" height="38">
          <div class="hero-rate-names">
            <div class="hero-rate-mr">${namePrimary}</div>
            <div class="hero-rate-en">${nameSecondary}</div>
          </div>
        </div>
        <div class="hero-rate-val">
          <div class="hero-rate-price">${price}</div>
          <div class="hero-rate-unit">${t.ratePerQuintal}</div>
        </div>
        <a href="${getWhatsAppUrl(c.key)}" target="_blank" rel="noopener noreferrer" class="btn-hero-quick-enquire action-whatsapp-btn" data-crop="${c.key}" title="चौकशी करा">
          💬
        </a>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ==========================================
// Gallery & Lightbox
// ==========================================
let currentGalleryList = [];

async function loadGallery() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  try {
    currentGalleryList = await getGalleryPhotos();
    const lang = getSelectedLanguage();

    if (!currentGalleryList || currentGalleryList.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); grid-column: 1/-1;">छायाचित्रे उपलब्ध नाहीत / No photos available.</p>`;
      return;
    }

    let html = '';
    currentGalleryList.forEach((photo, index) => {
      const title = lang === 'mr' ? (photo.titleMr || photo.titleEn) : (photo.titleEn || photo.titleMr);
      const desc = lang === 'mr' ? (photo.descMr || photo.descEn) : (photo.descEn || photo.descMr);
      const badge = photo.featured ? (lang === 'mr' ? '⭐ प्रमुख' : '⭐ Featured') : (lang === 'mr' ? 'केंद्र' : 'Facility');

      html += `
        <div class="gallery-item" data-index="${index}">
          <div class="gallery-img-container">
            <img src="${photo.src}" alt="${title}" loading="lazy">
            <span class="gallery-item-badge">${badge}</span>
            <div class="gallery-zoom-overlay">
              <div class="gallery-zoom-btn">🔍</div>
            </div>
          </div>
          <div class="gallery-meta">
            <h4>${title}</h4>
            <p>${desc}</p>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Attach click for lightbox
    container.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = Number(item.dataset.index);
        openLightbox(idx);
      });
    });
  } catch (err) {
    console.error('Error loading gallery:', err);
  }
}

function openLightbox(index) {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalDesc = document.getElementById('lightboxDesc');

  if (!modal || !currentGalleryList[index]) return;

  const photo = currentGalleryList[index];
  const lang = getSelectedLanguage();
  const title = lang === 'mr' ? (photo.titleMr || photo.titleEn) : (photo.titleEn || photo.titleMr);
  const desc = lang === 'mr' ? (photo.descMr || photo.descEn) : (photo.descEn || photo.descMr);

  modalImg.src = photo.src;
  modalImg.alt = title;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================
// Event Listeners & Cross-Tab Storage Sync
// ==========================================
function setupEventListeners() {
  // Language Switcher Buttons
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.lang;
      switchLanguage(selected);
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
      });
    });
  }

  // Lightbox Close Events
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Cross-Tab Storage Synchronisation (Instant updates when Admin edits rates)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.RATES || e.key === STORAGE_KEYS.SETTINGS || e.key === STORAGE_KEYS.CONTENT) {
      renderAllSections();
      loadGallery();
    }
  });

  // In-tab events
  window.addEventListener('rudra_rates_updated', () => renderAllSections());
  window.addEventListener('rudra_settings_updated', () => renderAllSections());
  window.addEventListener('rudra_content_updated', () => renderAllSections());
}
