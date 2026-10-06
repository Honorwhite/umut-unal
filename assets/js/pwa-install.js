/**
 * PWA Install Banner & Guidance Controller
 * - Displays an install ribbon right above the mobile bottom dock.
 * - Strict device & browser targeting:
 *   - iOS: Only mobile Safari (excludes CriOS, FxiOS, EdgiOS, and social in-app browsers).
 *   - Android: Only mobile Chrome (excludes Samsung Browser, Firefox, Edge, Opera, and in-app webviews).
 *   - Strictly hidden on desktop devices and standalone PWA mode.
 * - Interactions:
 *   - Android Chrome: Triggers native PWA install prompt (`beforeinstallprompt`) or opens Chrome guidance dialog.
 *   - iOS Safari: Opens custom iOS "Add to Home Screen" step-by-step visual guidance popup.
 */

(function () {
  'use strict';

  // 1. Device and Browser Eligibility Detection (Canlı Mod: Sadece iOS Safari ve Android Chrome)
  function getEligiblePlatform() {
    // Standalone (zaten ana ekrana eklenip uygulama olarak açılmışsa gizle)
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches;

    if (isStandalone) return null;

    // Bu oturumda kullanıcı kapat butonuna bastıysa gösterme
    if (sessionStorage.getItem('pwa_banner_dismissed') === '1') {
      return null;
    }

    const ua = navigator.userAgent || '';
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Sadece mobil cihazlarda görünsün (ekran genişliği <= 991px ve dokunmatik)
    if (window.innerWidth > 991 || !isTouch) return null;

    // Apple / iOS Tespiti (iPhone, iPod, iPad)
    const isIOS =
      /iPhone|iPad|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // Apple'da SADECE Safari'de görünsün:
      // Chrome (CriOS), Firefox (FxiOS), Edge (EdgiOS), Opera (OPiOS/OPT), Brave, DuckDuckGo
      // ve uygulama içi tarayıcıları (Instagram, Facebook, Twitter, WhatsApp, TikTok vb.) hariç tut
      const isOtherIOSBrowser =
        /CriOS|FxiOS|EdgiOS|OPiOS|OPT|Brave|DuckDuckGo|Instagram|FBAN|FBAV|Twitter|Line|Snapchat|TikTok|MicroMessenger/i.test(
          ua
        );
      const isSafari = /Safari/i.test(ua) && !isOtherIOSBrowser;

      if (isSafari) {
        return 'ios';
      }
      return null;
    }

    // Android Tespiti
    const isAndroid = /Android/i.test(ua);
    const isAndroidMobile = isAndroid && /Mobile/i.test(ua);

    if (isAndroidMobile) {
      // Android'de SADECE Chrome'da görünsün:
      // Samsung Internet, Firefox, Edge, Opera, UCBrowser, Xiaomi/Miui ve uygulama içi webview'ları hariç tut
      const isOtherAndroidBrowser =
        /SamsungBrowser|Firefox|FxiOS|EdgA|OPR|OPT|UCBrowser|MiuiBrowser|Instagram|FBAN|FBAV|Twitter|Line|Snapchat|TikTok|Version\/.*Chrome/i.test(
          ua
        );
      const isChrome = /Chrome/i.test(ua) && !isOtherAndroidBrowser;

      if (isChrome) {
        return 'android';
      }
      return null;
    }

    return null;
  }

  // 2. Service Worker Registration (Guarantees Android PWA prompt eligibility)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {
          // Fallback if root path differs in subfolder
          navigator.serviceWorker.register('sw.js').catch(() => {});
        });
    });
  }

  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    removeBanner();
  });

  // 3. UI Templates and Injection
  function createPwaUI(platform) {
    if (document.getElementById('pwa-install-banner')) return;

    const isIOS = platform === 'ios';

    // Banner Element
    const banner = document.createElement('aside');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', 'Uygulama İndirme Bildirimi');

    banner.innerHTML = `
      <div class="pwa-banner-content" id="pwa-banner-trigger">
        <div class="pwa-banner-icon-box">
          <img src="apple-touch-icon.png" alt="Doç. Dr. Umut Ünal" class="pwa-banner-img" width="38" height="38" />
        </div>
        <div class="pwa-banner-text">
          <span class="pwa-banner-title">Doç. Dr. Umut Ünal</span>
          <span class="pwa-banner-desc">${
            isIOS
              ? 'Hızlı erişim için uygulamayı ekleyin'
              : 'Hızlı randevu için uygulamayı indirin'
          }</span>
        </div>
      </div>
      <div class="pwa-banner-actions">
        <button type="button" class="pwa-btn-install" id="pwa-install-btn" aria-label="Uygulamayı ${
          isIOS ? 'Yükle' : 'İndir'
        }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>${isIOS ? 'Yükle' : 'İndir'}</span>
        </button>
        <button type="button" class="pwa-btn-close" id="pwa-close-btn" aria-label="Bildirimi Kapat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // iOS Guide Modal
    const iosModal = document.createElement('div');
    iosModal.id = 'pwa-ios-modal';
    iosModal.className = 'pwa-modal-overlay';
    iosModal.setAttribute('role', 'dialog');
    iosModal.setAttribute('aria-modal', 'true');
    iosModal.setAttribute('aria-labelledby', 'pwa-ios-title');

    iosModal.innerHTML = `
      <div class="pwa-modal-sheet" id="pwa-ios-sheet">
        <div class="pwa-modal-drag-pill"></div>
        <button type="button" class="pwa-modal-x" id="pwa-ios-x-btn" aria-label="Kapat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="pwa-modal-head">
          <img src="apple-touch-icon.png" alt="Doç. Dr. Umut Ünal" class="pwa-modal-logo" width="56" height="56" />
          <div class="pwa-modal-head-info">
            <h3 id="pwa-ios-title" class="pwa-modal-heading">Doç. Dr. Umut Ünal</h3>
            <span class="pwa-modal-sub">Safari ile Ana Ekrana Ekleyin</span>
          </div>
        </div>

        <div class="pwa-steps-list">
          <div class="pwa-step-card">
            <div class="pwa-step-num">1</div>
            <div class="pwa-step-icon-wrap ios-share-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </div>
            <div class="pwa-step-detail">
              <strong>Safari Paylaş Menüsünü Açın</strong>
              <span>Safari alt menüsünün ortasındaki <b>Paylaş</b> (kareden yukarı ok) simgesine dokunun.</span>
            </div>
          </div>

          <div class="pwa-step-card">
            <div class="pwa-step-num">2</div>
            <div class="pwa-step-icon-wrap ios-add-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <div class="pwa-step-detail">
              <strong>"Ana Ekrana Ekle"yi Seçin</strong>
              <span>Aşağı kaydırıp <b>"Ana Ekrana Ekle"</b> seçeneğine dokunun.</span>
            </div>
          </div>

          <div class="pwa-step-card">
            <div class="pwa-step-num">3</div>
            <div class="pwa-step-icon-wrap ios-check-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="pwa-step-detail">
              <strong>"Ekle" Butonuna Basın</strong>
              <span>Sağ üst köşedeki mavi <b>"Ekle"</b> yazısına dokunarak işlemi tamamlayın.</span>
            </div>
          </div>
        </div>

        <div class="pwa-bottom-hint">
          <span>Safari alt menüsündeki paylaş butonuna dokunun</span>
          <svg class="pwa-bounce-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="4" x2="12" y2="20"></line>
            <polyline points="19 13 12 20 5 13"></polyline>
          </svg>
        </div>

        <button type="button" class="pwa-confirm-btn" id="pwa-ios-done-btn">
          Anladım
        </button>
      </div>
    `;

    // Android Guide Modal (Fallback if beforeinstallprompt is not natively ready)
    const androidModal = document.createElement('div');
    androidModal.id = 'pwa-android-modal';
    androidModal.className = 'pwa-modal-overlay';
    androidModal.setAttribute('role', 'dialog');
    androidModal.setAttribute('aria-modal', 'true');
    androidModal.setAttribute('aria-labelledby', 'pwa-android-title');

    androidModal.innerHTML = `
      <div class="pwa-modal-sheet" id="pwa-android-sheet">
        <div class="pwa-modal-drag-pill"></div>
        <button type="button" class="pwa-modal-x" id="pwa-android-x-btn" aria-label="Kapat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="pwa-modal-head">
          <img src="apple-touch-icon.png" alt="Doç. Dr. Umut Ünal" class="pwa-modal-logo" width="56" height="56" />
          <div class="pwa-modal-head-info">
            <h3 id="pwa-android-title" class="pwa-modal-heading">Doç. Dr. Umut Ünal</h3>
            <span class="pwa-modal-sub">Chrome ile Hızlıca Yükleyin</span>
          </div>
        </div>

        <div class="pwa-steps-list">
          <div class="pwa-step-card">
            <div class="pwa-step-num">1</div>
            <div class="pwa-step-icon-wrap android-dots-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2.2"></circle>
                <circle cx="12" cy="12" r="2.2"></circle>
                <circle cx="12" cy="19" r="2.2"></circle>
              </svg>
            </div>
            <div class="pwa-step-detail">
              <strong>Chrome Menüsünü Açın</strong>
              <span>Sağ üst köşedeki <b>üç nokta (⋮)</b> simgesine dokunun.</span>
            </div>
          </div>

          <div class="pwa-step-card">
            <div class="pwa-step-num">2</div>
            <div class="pwa-step-icon-wrap android-install-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                <polyline points="9 10 12 13 15 10"></polyline>
                <line x1="12" y1="6" x2="12" y2="13"></line>
              </svg>
            </div>
            <div class="pwa-step-detail">
              <strong>"Uygulamayı Yükle"yi Seçin</strong>
              <span>Menüden <b>"Uygulamayı Yükle"</b> veya <b>"Ana Ekrana Ekle"</b> seçeneğine dokunun.</span>
            </div>
          </div>

          <div class="pwa-step-card">
            <div class="pwa-step-num">3</div>
            <div class="pwa-step-icon-wrap ios-check-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="pwa-step-detail">
              <strong>Yüklemeyi Onaylayın</strong>
              <span>Çıkan onay penceresinde <b>"Yükle"</b> butonuna basarak kurulumu bitirin.</span>
            </div>
          </div>
        </div>

        <button type="button" class="pwa-confirm-btn" id="pwa-android-done-btn">
          Anladım
        </button>
      </div>
    `;

    document.body.appendChild(banner);
    document.body.appendChild(iosModal);
    document.body.appendChild(androidModal);
    document.body.classList.add('has-pwa-banner');

    // Bind Actions
    setupEvents(platform, banner, iosModal, androidModal);
  }

  function setupEvents(platform, banner, iosModal, androidModal) {
    const isIOS = platform === 'ios';

    function openModal(modal) {
      modal.classList.add('pwa-modal-active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
      modal.classList.remove('pwa-modal-active');
      document.body.style.overflow = '';
    }

    function handleTrigger() {
      if (isIOS) {
        openModal(iosModal);
      } else {
        // Android Chrome: trigger install prompt
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          deferredInstallPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              removeBanner();
            }
            deferredInstallPrompt = null;
          });
        } else {
          // If deferredInstallPrompt was not available or already triggered, show Android guide
          openModal(androidModal);
        }
      }
    }

    // Trigger on Banner content click or Install button click
    const actionTrigger = document.getElementById('pwa-banner-trigger');
    const installBtn = document.getElementById('pwa-install-btn');
    if (actionTrigger) actionTrigger.addEventListener('click', handleTrigger);
    if (installBtn) installBtn.addEventListener('click', handleTrigger);

    // Close Banner
    const closeBtn = document.getElementById('pwa-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sessionStorage.setItem('pwa_banner_dismissed', '1');
        removeBanner();
      });
    }

    // iOS Modal Close Handlers
    const iosCloseBtn = document.getElementById('pwa-ios-x-btn');
    const iosDoneBtn = document.getElementById('pwa-ios-done-btn');
    if (iosCloseBtn) iosCloseBtn.addEventListener('click', () => closeModal(iosModal));
    if (iosDoneBtn) iosDoneBtn.addEventListener('click', () => closeModal(iosModal));
    iosModal.addEventListener('click', (e) => {
      if (e.target === iosModal) closeModal(iosModal);
    });

    // Android Modal Close Handlers
    const androidCloseBtn = document.getElementById('pwa-android-x-btn');
    const androidDoneBtn = document.getElementById('pwa-android-done-btn');
    if (androidCloseBtn) androidCloseBtn.addEventListener('click', () => closeModal(androidModal));
    if (androidDoneBtn) androidDoneBtn.addEventListener('click', () => closeModal(androidModal));
    androidModal.addEventListener('click', (e) => {
      if (e.target === androidModal) closeModal(androidModal);
    });
  }

  function removeBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.classList.add('pwa-banner-hiding');
      setTimeout(() => {
        banner.remove();
        document.body.classList.remove('has-pwa-banner');
      }, 300);
    }
  }

  // 4. Initializer
  function init() {
    const platform = getEligiblePlatform();
    if (!platform) return;

    // Small delay to ensure smooth page load and natural dock rendering
    setTimeout(() => {
      createPwaUI(platform);
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
