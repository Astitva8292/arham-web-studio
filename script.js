/* =========================================================
   ARHAM WEB STUDIO — script.js
   Vanilla JS only. No frameworks/libraries.
   ========================================================= */

   document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------
       1. Set current year in footer
    --------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  
    /* ---------------------------------------------------
       2. Sticky navbar background on scroll
    --------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const onScrollNav = () => {
      if (window.scrollY > 24) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    onScrollNav();
    window.addEventListener('scroll', onScrollNav, { passive: true });
  
  
    /* ---------------------------------------------------
       3. Mobile nav toggle
    --------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
  
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
  
      // Close mobile menu when a link is clicked
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  
  
    /* ---------------------------------------------------
       4. Glowing cursor effect (desktop only, follows pointer)
    --------------------------------------------------- */
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
      let rafId = null;
      let mouseX = 0, mouseY = 0;
  
      const updateGlow = () => {
        cursorGlow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        rafId = null;
      };
  
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('active');
        if (!rafId) rafId = requestAnimationFrame(updateGlow);
      }, { passive: true });
  
      document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
    }
  
  
    /* ---------------------------------------------------
       5. Scroll-triggered fade-up reveal (IntersectionObserver)
    --------------------------------------------------- */
    const fadeEls = document.querySelectorAll('.fade-up');
  
    if ('IntersectionObserver' in window && fadeEls.length) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      });
  
      fadeEls.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback: just show everything
      fadeEls.forEach(el => el.classList.add('in-view'));
    }
  
  
    /* ---------------------------------------------------
       6. Animated timeline progress line (Process section)
    --------------------------------------------------- */
    const timeline = document.getElementById('timeline');
    const timelineFill = document.getElementById('timelineFill');
    const timelineSteps = document.querySelectorAll('.timeline-step');
  
    const updateTimeline = () => {
      if (!timeline || !timelineFill) return;
  
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;
  
      // Progress: 0 when timeline top enters bottom of viewport, 1 when bottom reaches middle
      const start = viewportH * 0.85;
      const end = viewportH * 0.35;
      const total = rect.height;
  
      let progressPx = start - rect.top;
      progressPx = Math.max(0, Math.min(progressPx, total + (start - end)));
  
      const fillHeight = Math.max(0, Math.min(100, (progressPx / total) * 100));
      timelineFill.style.height = fillHeight + '%';
  
      // Mark steps active as the line passes them
      timelineSteps.forEach(step => {
        const stepRect = step.getBoundingClientRect();
        const stepCenter = stepRect.top + stepRect.height * 0.2;
        if (stepCenter < start) {
          step.classList.add('is-active');
        } else {
          step.classList.remove('is-active');
        }
      });
    };
  
    if (timeline) {
      updateTimeline();
      window.addEventListener('scroll', updateTimeline, { passive: true });
      window.addEventListener('resize', updateTimeline);
    }
  
  
    /* ---------------------------------------------------
       7. FAQ Accordion
    --------------------------------------------------- */
    const accordionItems = document.querySelectorAll('.accordion-item');
  
    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');
      const panelInner = item.querySelector('.accordion-panel-inner');
  
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
  
        // Close all other accordion items first
        accordionItems.forEach(other => {
          if (other !== item) {
            other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            other.querySelector('.accordion-panel').style.height = '0px';
          }
        });
  
        if (isOpen) {
          trigger.setAttribute('aria-expanded', 'false');
          panel.style.height = '0px';
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.height = panelInner.offsetHeight + 'px';
        }
      });
    });
  
    // Recalculate open accordion height on resize (text reflow)
    window.addEventListener('resize', () => {
      accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const panel = item.querySelector('.accordion-panel');
        const panelInner = item.querySelector('.accordion-panel-inner');
        if (trigger.getAttribute('aria-expanded') === 'true') {
          panel.style.height = panelInner.offsetHeight + 'px';
        }
      });
    });
  
  
    /* ---------------------------------------------------
       8. Contact form handling
       NOTE: This demo only simulates submission in the browser.
       To actually receive messages, connect this form to a
       backend, form service (e.g. Formspree, Getform) or
       mailto fallback. Edit the handleSubmit function below.
    --------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
  
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const name = contactForm.name.value.trim();
        const business = contactForm.business.value.trim();
        const phone = contactForm.phone.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();
  
        if (!name || !business || !phone || !email || !message) {
          formStatus.textContent = 'Please fill in every field before sending.';
          formStatus.classList.remove('success');
          return;
        }
  
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          formStatus.textContent = 'Please enter a valid email address.';
          formStatus.classList.remove('success');
          return;
        }
  
        // ----- EDIT HERE -----
        // Replace this block with a real submission, e.g.:
        // fetch('https://your-form-endpoint.com', { method: 'POST', body: new FormData(contactForm) })
        // For now, this just simulates a successful send.
        formStatus.textContent = `Thanks ${name.split(' ')[0]}, your message has been sent. I'll be in touch soon.`;
        formStatus.classList.add('success');
        contactForm.reset();
      });
    }
  
  });