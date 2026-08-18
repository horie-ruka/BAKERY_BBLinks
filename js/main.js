/**
 * BAKERY BBLinks - Main JavaScript Logic
 * 7-Second Arch Photo Slider & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroHeader = document.querySelector('.flore-hero-section > .flore-top-bar');
  if (heroHeader && !document.querySelector('.site-floating-header')) {
    const floatingHeader = heroHeader.cloneNode(true);
    floatingHeader.classList.add('site-floating-header');
    floatingHeader.querySelectorAll('[id]').forEach((element) => {
      element.id = `${element.id}Floating`;
    });
    document.body.prepend(floatingHeader);
  }

  // Reference-style fixed first view: the hero stays behind, then fades as content rises.
  const fixedHero = document.querySelector('.flore-hero-section');
  const pageContents = document.getElementById('contents');
  const heroFadeTargets = document.querySelectorAll([
    '.flore-hero-stage',
    '.flore-hero-footer',
    '.flore-side-arch',
    '.flore-side-dots'
  ].join(','));

  function syncFixedHero() {
    if (!fixedHero || !pageContents) return;

    const heroHeight = window.innerHeight;
    document.documentElement.style.setProperty('--hero-fixed-height', `${heroHeight}px`);

    const progress = Math.min(window.scrollY / Math.max(heroHeight, 1), 1);
    const heroOpacity = Math.max(1 - progress * 1.45, 0);
    heroFadeTargets.forEach((target) => {
      target.style.opacity = heroOpacity;
    });
  }

  syncFixedHero();
  window.addEventListener('scroll', syncFixedHero, { passive: true });
  window.addEventListener('resize', syncFixedHero);

  // Mobile Menu Toggle
  const headerMenus = document.querySelectorAll('.flore-top-bar');

  headerMenus.forEach((header) => {
    const mobileToggle = header.querySelector('.flore-mobile-toggle');
    const mainNav = header.querySelector('nav');
    if (!mobileToggle || !mainNav) return;

    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const isOpen = mainNav.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });
  });

  // 7-Second Arch Photo Slider
  const slides = document.querySelectorAll('.arch-slide');
  const dotsContainer = document.getElementById('archSliderDots');
  let currentSlide = 0;
  let slideInterval = null;

  if (slides.length > 0) {
    // Generate indicator dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetTimer();
      });
      if (dotsContainer) {
        dotsContainer.appendChild(dot);
      }
    });

    const dots = document.querySelectorAll('.arch-slider-dots .dot');

    function goToSlide(n) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

      currentSlide = (n + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    // Set 7-second timer (7000 ms)
    function startTimer() {
      slideInterval = setInterval(nextSlide, 7000);
    }

    function resetTimer() {
      clearInterval(slideInterval);
      startTimer();
    }

    startTimer();
  }

  // Scroll Reveal Animations
  const revealTargets = document.querySelectorAll([
    '.news-section .section-title',
    '.news-card',
    '.concept-copy-area',
    '.concept-text',
    '.concept-points-inline',
    '.concept-imgarea',
    '.arch-point-card',
    '.bakery-immersive-copy',
    '.featured-section .section-title',
    '.menu-card',
    '.btn-center-wrap',
    '.store-info-section .section-title',
    '.store-card-wrapper',
    '.contact-section .section-title',
    '.contact-wrapper',
    '.site-footer'
  ].join(','));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  revealTargets.forEach((target, index) => {
    target.classList.add('reveal-on-scroll');
    target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 90}ms`);
  });

  if (prefersReducedMotion) {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px'
    });

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  // News Popup Modal
  const newsModal = document.getElementById('newsModal');
  const newsModalDate = document.getElementById('newsModalDate');
  const newsModalTag = document.getElementById('newsModalTag');
  const newsModalTitle = document.getElementById('newsModalTitle');
  const newsModalBody = document.getElementById('newsModalBody');
  const newsTriggers = document.querySelectorAll('.news-popup-trigger');
  const newsCloseControls = document.querySelectorAll('[data-news-modal-close]');
  let lastFocusedNewsTrigger = null;

  function openNewsModal(trigger) {
    if (!newsModal) return;

    lastFocusedNewsTrigger = trigger;
    if (newsModalDate) newsModalDate.textContent = trigger.dataset.newsDate || '';
    if (newsModalTag) newsModalTag.textContent = trigger.dataset.newsTag || '';
    if (newsModalTitle) newsModalTitle.textContent = trigger.dataset.newsTitle || trigger.textContent.trim();
    if (newsModalBody) newsModalBody.textContent = trigger.dataset.newsBody || '';

    newsModal.classList.add('is-open');
    newsModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const closeButton = newsModal.querySelector('.news-modal-close');
    if (closeButton) closeButton.focus();
  }

  function closeNewsModal() {
    if (!newsModal || !newsModal.classList.contains('is-open')) return;

    newsModal.classList.remove('is-open');
    newsModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (lastFocusedNewsTrigger) {
      lastFocusedNewsTrigger.focus();
    }
  }

  newsTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openNewsModal(trigger);
    });
  });

  newsCloseControls.forEach((control) => {
    control.addEventListener('click', closeNewsModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNewsModal();
    }
  });

  // Contact Form Web3Forms Handler
  const contactForm = document.getElementById('bakeryContactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const menuInquiryButtons = document.querySelectorAll('.menu-inquiry-btn');

  menuInquiryButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const breadName = button.dataset.breadName || '選択したパン';
      const messageField = contactForm ? contactForm.querySelector('[name="message"]') : null;
      const contactTypeField = contactForm ? contactForm.querySelector('[name="contact_type"]') : null;
      const prefix = `[${breadName}]についての問い合わせ`;

      if (contactTypeField) {
        contactTypeField.value = '取り置き予約';
      }

      if (messageField) {
        const currentMessage = messageField.value.trim();
        const messageWithoutPreviousBread = currentMessage.replace(/^\[[^\]]+\]についての問い合わせ\s*/u, '').trim();
        messageField.value = messageWithoutPreviousBread
          ? `${prefix}\n\n${messageWithoutPreviousBread}`
          : prefix;
      }

      const contactTarget = contactForm
        ? contactForm.closest('.contact-form-box') || contactForm
        : document.getElementById('contact');
      if (contactTarget) {
        contactTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (messageField) {
        setTimeout(() => {
          messageField.focus();
          messageField.setSelectionRange(messageField.value.length, messageField.value.length);
        }, 500);
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitBtn ? submitBtn.textContent : '';

      if (formSuccessMessage) {
        formSuccessMessage.style.display = 'none';
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '送信中...';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || '送信に失敗しました。');
        }

        if (formSuccessMessage) {
          formSuccessMessage.innerHTML = [
            '<p style="font-weight: bold; color: var(--text-flore-dark);">送信完了しました</p>',
            '<p style="font-size: 0.9rem; margin-top: 0.4rem;">お問い合わせありがとうございます。内容を確認次第、折り返しご連絡いたします。</p>'
          ].join('');
          formSuccessMessage.style.display = 'block';
          formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        contactForm.reset();
      } catch (error) {
        if (formSuccessMessage) {
          formSuccessMessage.innerHTML = [
            '<p style="font-weight: bold; color: #B3402A;">送信できませんでした</p>',
            '<p style="font-size: 0.9rem; margin-top: 0.4rem;">時間をおいてもう一度お試しください。お急ぎの場合はお電話でお問い合わせください。</p>'
          ].join('');
          formSuccessMessage.style.display = 'block';
          formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalButtonText || '送信する';
        }
      }
    });
  }
});
