/**
 * Rudra Traders (रुद्र ट्रेडर्स) - Admin Panel Management Script
 * Handles Demo Authentication, Tabs, Rates editing, Gallery uploads via IndexedDB,
 * Website Content editing, Business Settings, and LocalStorage updates.
 */

const DEMO_CREDENTIALS = {
  user: 'rudra_traders',
  pass: 'rudra_traders28151'
};

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupLoginForm();
  setupTabs();
  setupRatesForm();
  setupGalleryManager();
  setupContentForm();
  setupSettingsForm();
});

// Toast notification helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅'}</span> <div>${message}</div>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Confirmation modal helper
function showConfirmModal(title, description, onConfirm) {
  const modal = document.getElementById('confirmModal');
  const titleEl = document.getElementById('confirmModalTitle');
  const descEl = document.getElementById('confirmModalDesc');
  const confirmBtn = document.getElementById('confirmModalActionBtn');
  const cancelBtn = document.getElementById('confirmModalCancelBtn');

  titleEl.textContent = title;
  descEl.textContent = description;

  modal.classList.add('active');

  const cleanup = () => {
    modal.classList.remove('active');
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
  };

  confirmBtn.onclick = () => {
    cleanup();
    onConfirm();
  };

  cancelBtn.onclick = () => {
    cleanup();
  };
}

// ==========================================
// Demo Authentication
// ==========================================
function checkAuth() {
  const isAuth = sessionStorage.getItem('rudra_admin_logged_in') === 'true';
  const loginView = document.getElementById('adminLoginView');
  const dashboardView = document.getElementById('adminDashboardView');

  if (isAuth) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    loadAllAdminData();
  } else {
    if (loginView) loginView.style.display = 'flex';
    if (dashboardView) dashboardView.style.display = 'none';
  }
}

function setupLoginForm() {
  const form = document.getElementById('adminLoginForm');
  const togglePassBtn = document.getElementById('togglePasswordBtn');
  const passInput = document.getElementById('adminPassword');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      togglePassBtn.textContent = isPass ? '👁️' : '🔒';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const userEl = document.getElementById('adminUsername');
      const u = userEl ? userEl.value.trim() : '';
      const p = passInput.value.trim();

      if (u === DEMO_CREDENTIALS.user && p === DEMO_CREDENTIALS.pass) {
        sessionStorage.setItem('rudra_admin_logged_in', 'true');
        showToast('लॉगिन यशस्वी! Welcome to Rudra Traders Admin Dashboard.');
        if (userEl) userEl.value = '';
        passInput.value = '';
        checkAuth();
      } else {
        showToast('चुकीचे वापरकर्तानाव किंवा पासवर्ड! कृपया पुन्हा प्रयत्न करा. (Invalid Username or Password)', 'error');
        passInput.value = '';
        passInput.focus();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('rudra_admin_logged_in');
      const userEl = document.getElementById('adminUsername');
      if (userEl) userEl.value = '';
      if (passInput) passInput.value = '';
      showToast('लॉगआउट केले. Logged out successfully.', 'warning');
      checkAuth();
    });
  }
}

// ==========================================
// Tabs Switching
// ==========================================
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

function loadAllAdminData() {
  loadRatesData();
  loadGalleryData();
  loadContentData();
  loadSettingsData();
}

// ==========================================
// 1. Manage Current Rates (Tab A)
// ==========================================
function setupRatesForm() {
  const form = document.getElementById('ratesEditForm');
  const resetBtn = document.getElementById('resetRatesBtn');
  const setNowBtn = document.getElementById('setTimestampNowBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveRatesFromInputs();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      showConfirmModal(
        'दर मूळ स्थितीवर आणावेत का?',
        'सर्व पिकांचे खरेदी दर मूळ प्रात्यक्षिक (Demo Defaults) मूल्यांवर रीसेट केले जातील. आपण सहमत आहात का?',
        () => {
          localStorage.removeItem(STORAGE_KEYS.RATES);
          loadRatesData();
          window.dispatchEvent(new Event('rudra_rates_updated'));
          showToast('खरेदी दर मूळ स्थितीवर रीसेट झाले! Rates reset to default.');
        }
      );
    });
  }

  if (setNowBtn) {
    setNowBtn.addEventListener('click', () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('mr-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) + ' - ' + now.toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' });
      document.getElementById('rateLastUpdated').value = formatted;
      showToast('सध्याची वेळ अपडेट केली.');
    });
  }
}

function loadRatesData() {
  const rates = getStoredRates();

  // Soybean
  document.getElementById('soybeanRate').value = rates.soybean.rate || '';
  document.getElementById('soybeanMinRate').value = rates.soybean.minRate || '';
  document.getElementById('soybeanMaxRate').value = rates.soybean.maxRate || '';
  document.getElementById('soybeanNotesMr').value = rates.soybean.notesMr || '';
  document.getElementById('soybeanNotesEn').value = rates.soybean.notesEn || '';

  // Chickpea
  document.getElementById('chickpeaRate').value = rates.chickpea.rate || '';
  document.getElementById('chickpeaMinRate').value = rates.chickpea.minRate || '';
  document.getElementById('chickpeaMaxRate').value = rates.chickpea.maxRate || '';
  document.getElementById('chickpeaNotesMr').value = rates.chickpea.notesMr || '';
  document.getElementById('chickpeaNotesEn').value = rates.chickpea.notesEn || '';

  // Wheat
  document.getElementById('wheatRate').value = rates.wheat.rate || '';
  document.getElementById('wheatMinRate').value = rates.wheat.minRate || '';
  document.getElementById('wheatMaxRate').value = rates.wheat.maxRate || '';
  document.getElementById('wheatNotesMr').value = rates.wheat.notesMr || '';
  document.getElementById('wheatNotesEn').value = rates.wheat.notesEn || '';

  // Timestamp
  document.getElementById('rateLastUpdated').value = rates.lastUpdated || '';
}

function saveRatesFromInputs() {
  const current = getStoredRates();

  current.soybean.rate = document.getElementById('soybeanRate').value.trim();
  current.soybean.minRate = document.getElementById('soybeanMinRate').value.trim();
  current.soybean.maxRate = document.getElementById('soybeanMaxRate').value.trim();
  current.soybean.notesMr = document.getElementById('soybeanNotesMr').value.trim();
  current.soybean.notesEn = document.getElementById('soybeanNotesEn').value.trim();

  current.chickpea.rate = document.getElementById('chickpeaRate').value.trim();
  current.chickpea.minRate = document.getElementById('chickpeaMinRate').value.trim();
  current.chickpea.maxRate = document.getElementById('chickpeaMaxRate').value.trim();
  current.chickpea.notesMr = document.getElementById('chickpeaNotesMr').value.trim();
  current.chickpea.notesEn = document.getElementById('chickpeaNotesEn').value.trim();

  current.wheat.rate = document.getElementById('wheatRate').value.trim();
  current.wheat.minRate = document.getElementById('wheatMinRate').value.trim();
  current.wheat.maxRate = document.getElementById('wheatMaxRate').value.trim();
  current.wheat.notesMr = document.getElementById('wheatNotesMr').value.trim();
  current.wheat.notesEn = document.getElementById('wheatNotesEn').value.trim();

  current.lastUpdated = document.getElementById('rateLastUpdated').value.trim();

  saveStoredRates(current);
  showToast('शेतीमाल खरेदी दर यशस्वीरित्या सेव्ह केले! Rates updated successfully.');
}

// ==========================================
// 2. Manage Gallery (Tab B) with IndexedDB
// ==========================================
let pendingImageDataUrl = '';
let adminGalleryCache = [];

function setupGalleryManager() {
  const uploadBox = document.getElementById('galleryUploadBox');
  const fileInput = document.getElementById('galleryFileInput');
  const previewWrap = document.getElementById('galleryPreviewWrap');
  const previewImg = document.getElementById('galleryPreviewImg');
  const form = document.getElementById('galleryAddForm');
  const resetGalleryBtn = document.getElementById('resetGalleryBtn');

  if (uploadBox && fileInput) {
    uploadBox.addEventListener('click', () => fileInput.click());

    uploadBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
      uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBox.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processUploadedImage(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        processUploadedImage(fileInput.files[0]);
      }
    });
  }

  function processUploadedImage(file) {
    if (!file.type.startsWith('image/')) {
      showToast('कृपया वैध छायाचित्र निवडा! Please select an image file.', 'error');
      return;
    }

    // Limit check for client-side storage safety
    if (file.size > 8 * 1024 * 1024) {
      showToast('फोटोचा आकार ८ MB पेक्षा कमी असावा. Image exceeds 8MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      pendingImageDataUrl = e.target.result;
      previewImg.src = pendingImageDataUrl;
      previewWrap.style.display = 'block';
      showToast('फोटो निवडला गेला! आता माहिती भरून सेव्ह करा.');
    };
    reader.readAsDataURL(file);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!pendingImageDataUrl) {
        showToast('कृपया प्रथम छायाचित्र निवडा किंवा अपलोड करा.', 'warning');
        return;
      }

      const titleMr = document.getElementById('photoTitleMr').value.trim();
      const titleEn = document.getElementById('photoTitleEn').value.trim();
      const descMr = document.getElementById('photoDescMr').value.trim();
      const descEn = document.getElementById('photoDescEn').value.trim();
      const featured = document.getElementById('photoFeatured').checked;

      const newPhoto = {
        titleMr: titleMr || 'संकलन केंद्र छायाचित्र',
        titleEn: titleEn || 'Collection Center Photograph',
        descMr: descMr || '',
        descEn: descEn || '',
        src: pendingImageDataUrl,
        featured: featured,
        order: adminGalleryCache.length + 1,
        createdAt: new Date().toISOString()
      };

      try {
        await saveGalleryPhoto(newPhoto);
        showToast('छायाचित्र गॅलरीमध्ये जोडले गेले! Photo saved to IndexedDB.');
        form.reset();
        previewWrap.style.display = 'none';
        pendingImageDataUrl = '';
        loadGalleryData();
      } catch (err) {
        showToast('फोटो सेव्ह करताना त्रुटी आली: ' + err.message, 'error');
      }
    });
  }

  if (resetGalleryBtn) {
    resetGalleryBtn.addEventListener('click', () => {
      showConfirmModal(
        'गॅलरी मूळ स्थितीवर आणावी का?',
        'सर्व अपलोड केलेले फोटो हटवून मूळ ३ प्रात्यक्षिक छायाचित्रे पुन्हा लोड केली जातील. आपण सहमत आहात का?',
        async () => {
          try {
            await resetGalleryToDefault();
            loadGalleryData();
            showToast('गॅलरी मूळ स्थितीवर रीसेट झाली! Gallery reset to defaults.');
          } catch (err) {
            showToast('त्रुटी: ' + err.message, 'error');
          }
        }
      );
    });
  }
}

async function loadGalleryData() {
  const tableBody = document.getElementById('adminGalleryTableBody');
  if (!tableBody) return;

  try {
    adminGalleryCache = await getGalleryPhotos();
    if (!adminGalleryCache || adminGalleryCache.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted);">कोणतेही छायाचित्र उपलब्ध नाही. No photos in gallery.</td></tr>`;
      return;
    }

    let rowsHtml = '';
    adminGalleryCache.forEach((photo, index) => {
      rowsHtml += `
        <tr>
          <td>
            <img src="${photo.src}" class="gallery-thumb-admin" alt="Thumb">
          </td>
          <td>
            <strong>${photo.titleMr || photo.titleEn}</strong>
            <div style="font-size: 0.78rem; color: var(--admin-text-muted);">${photo.titleEn || ''}</div>
          </td>
          <td>
            ${photo.featured ? '<span class="admin-badge" style="background: #78350f; color: #fbbf24;">⭐ Featured</span>' : '<span style="color: var(--admin-text-muted);">सामान्य</span>'}
          </td>
          <td>
            <div class="gallery-actions-cell">
              <button class="btn-admin btn-admin-secondary btn-admin-sm" onclick="moveGalleryPhoto(${index}, -1)" ${index === 0 ? 'disabled' : ''}>▲</button>
              <button class="btn-admin btn-admin-secondary btn-admin-sm" onclick="moveGalleryPhoto(${index}, 1)" ${index === adminGalleryCache.length - 1 ? 'disabled' : ''}>▼</button>
            </div>
          </td>
          <td>
            <div class="gallery-actions-cell">
              <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="confirmDeleteGalleryPhoto(${photo.id})">हटवा 🗑️</button>
            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = rowsHtml;
  } catch (err) {
    console.error('Error loading gallery in admin:', err);
  }
}

window.moveGalleryPhoto = async function(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= adminGalleryCache.length) return;

  const temp = adminGalleryCache[index];
  adminGalleryCache[index] = adminGalleryCache[newIndex];
  adminGalleryCache[newIndex] = temp;

  // Re-index order
  for (let i = 0; i < adminGalleryCache.length; i++) {
    adminGalleryCache[i].order = i + 1;
    await saveGalleryPhoto(adminGalleryCache[i]);
  }

  showToast('छायाचित्रांचा क्रम बदलला.');
  loadGalleryData();
};

window.confirmDeleteGalleryPhoto = function(id) {
  showConfirmModal(
    'छायाचित्र हटवायचे आहे का?',
    'हे छायाचित्र गॅलरीमधून कायमचे हटवले जाईल. आपण खात्री करत आहात का?',
    async () => {
      try {
        await deleteGalleryPhoto(id);
        showToast('छायाचित्र यशस्वीरित्या हटवले!');
        loadGalleryData();
      } catch (err) {
        showToast('फोटो हटवताना त्रुटी: ' + err.message, 'error');
      }
    }
  );
};

// ==========================================
// 3. Edit Website Content (Tab C)
// ==========================================
function setupContentForm() {
  const form = document.getElementById('contentEditForm');
  const resetBtn = document.getElementById('resetContentBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveContentFromInputs();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      showConfirmModal(
        'मजकूर मूळ स्थितीवर आणावा का?',
        'सर्व मजकूर (Hero, About Us, How It Works) मूळ डीफॉल्ट स्थितीवर रीसेट होईल.',
        () => {
          localStorage.removeItem(STORAGE_KEYS.CONTENT);
          loadContentData();
          window.dispatchEvent(new Event('rudra_content_updated'));
          showToast('वेबसाइट मजकूर रीसेट झाला!');
        }
      );
    });
  }
}

function loadContentData() {
  const c = getStoredContent();

  document.getElementById('heroHeadlineMr').value = c.hero.headlineMr || '';
  document.getElementById('heroHeadlineEn').value = c.hero.headlineEn || '';
  document.getElementById('heroSubtextMr').value = c.hero.subtextMr || '';
  document.getElementById('heroSubtextEn').value = c.hero.subtextEn || '';

  document.getElementById('aboutTitleMr').value = c.about.titleMr || '';
  document.getElementById('aboutTitleEn').value = c.about.titleEn || '';
  document.getElementById('aboutDescMr').value = c.about.descMr || '';
  document.getElementById('aboutDescEn').value = c.about.descEn || '';

  document.getElementById('step1TitleMr').value = c.howItWorks.step1TitleMr || '';
  document.getElementById('step1DescMr').value = c.howItWorks.step1DescMr || '';
  document.getElementById('step2TitleMr').value = c.howItWorks.step2TitleMr || '';
  document.getElementById('step2DescMr').value = c.howItWorks.step2DescMr || '';
  document.getElementById('step3TitleMr').value = c.howItWorks.step3TitleMr || '';
  document.getElementById('step3DescMr').value = c.howItWorks.step3DescMr || '';
  document.getElementById('step4TitleMr').value = c.howItWorks.step4TitleMr || '';
  document.getElementById('step4DescMr').value = c.howItWorks.step4DescMr || '';

  document.getElementById('footerNoteMr').value = c.footer.noteMr || '';
  document.getElementById('footerNoteEn').value = c.footer.noteEn || '';
}

function saveContentFromInputs() {
  const c = getStoredContent();

  c.hero.headlineMr = document.getElementById('heroHeadlineMr').value.trim();
  c.hero.headlineEn = document.getElementById('heroHeadlineEn').value.trim();
  c.hero.subtextMr = document.getElementById('heroSubtextMr').value.trim();
  c.hero.subtextEn = document.getElementById('heroSubtextEn').value.trim();

  c.about.titleMr = document.getElementById('aboutTitleMr').value.trim();
  c.about.titleEn = document.getElementById('aboutTitleEn').value.trim();
  c.about.descMr = document.getElementById('aboutDescMr').value.trim();
  c.about.descEn = document.getElementById('aboutDescEn').value.trim();

  c.howItWorks.step1TitleMr = document.getElementById('step1TitleMr').value.trim();
  c.howItWorks.step1DescMr = document.getElementById('step1DescMr').value.trim();
  c.howItWorks.step2TitleMr = document.getElementById('step2TitleMr').value.trim();
  c.howItWorks.step2DescMr = document.getElementById('step2DescMr').value.trim();
  c.howItWorks.step3TitleMr = document.getElementById('step3TitleMr').value.trim();
  c.howItWorks.step3DescMr = document.getElementById('step3DescMr').value.trim();
  c.howItWorks.step4TitleMr = document.getElementById('step4TitleMr').value.trim();
  c.howItWorks.step4DescMr = document.getElementById('step4DescMr').value.trim();

  c.footer.noteMr = document.getElementById('footerNoteMr').value.trim();
  c.footer.noteEn = document.getElementById('footerNoteEn').value.trim();

  saveStoredContent(c);
  showToast('वेबसाइट मजकूर यशस्वीरित्या सेव्ह झाला! Website content updated.');
}

// ==========================================
// 4. Business Settings (Tab D)
// ==========================================
function setupSettingsForm() {
  const form = document.getElementById('settingsEditForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const s = getStoredSettings();

      s.traderNameMr = document.getElementById('settingsTraderNameMr').value.trim();
      s.traderNameEn = document.getElementById('settingsTraderNameEn').value.trim();
      s.traderTitleMr = `प्रोप्रायटर: ${s.traderNameMr}`;
      s.traderTitleEn = `Proprietor: ${s.traderNameEn}`;

      s.phoneDisplay = document.getElementById('settingsPhone').value.trim();
      s.phoneCall = s.phoneDisplay.replace(/\s+/g, '');
      if (!s.phoneCall.startsWith('+')) {
        s.phoneCall = s.phoneCall.startsWith('91') ? `+${s.phoneCall}` : `+91${s.phoneCall}`;
      }

      let wa = document.getElementById('settingsWhatsapp').value.trim().replace(/\D/g, '');
      if (wa.length === 10) wa = `91${wa}`;
      s.whatsappNumber = wa;

      s.mapsUrl = document.getElementById('settingsMaps').value.trim();
      s.addressMr = document.getElementById('settingsAddressMr').value.trim();
      s.addressEn = document.getElementById('settingsAddressEn').value.trim();
      s.defaultLang = document.getElementById('settingsDefaultLang').value;

      saveStoredSettings(s);
      showToast('व्यवसाय सेटिंग्ज सेव्ह झाल्या! Business settings saved.');
    });
  }
}

function loadSettingsData() {
  const s = getStoredSettings();

  const tMr = document.getElementById('settingsTraderNameMr');
  const tEn = document.getElementById('settingsTraderNameEn');
  if (tMr) tMr.value = s.traderNameMr || 'दीपक माधव वेताळ';
  if (tEn) tEn.value = s.traderNameEn || 'Dipak Madhav Vetal';

  document.getElementById('settingsPhone').value = s.phoneDisplay || '';
  document.getElementById('settingsWhatsapp').value = s.whatsappNumber || '';
  document.getElementById('settingsMaps').value = s.mapsUrl || '';
  document.getElementById('settingsAddressMr').value = s.addressMr || '';
  document.getElementById('settingsAddressEn').value = s.addressEn || '';
  document.getElementById('settingsDefaultLang').value = s.defaultLang || 'mr';
}
