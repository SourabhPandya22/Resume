/**
 * SOURABH PANDYA — FRONTEND HTML DEVELOPER PORTFOLIO
 * Core Interactions, Animations & Navigation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Custom Cursor (Desktop & Fine Pointers Only)
  // --------------------------------------------------------------------------
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorOutline = document.querySelector('.custom-cursor-outline');

  if (cursorDot && cursorOutline && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateOutline = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      requestAnimationFrame(animateOutline);
    };
    requestAnimationFrame(animateOutline);

    // Hover state over interactive elements
    const interactiveSelectors = 'a, button, input, textarea, select, .window-tab, .filter-btn, .project-card, .skill-item, .stat-box';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Header & ScrollSpy Active Navigation
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  const handleScrollSpy = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    handleScrollSpy();
  }, { passive: true });

  handleHeaderScroll();
  handleScrollSpy();

  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#0') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile drawer if open
        closeMobileMenu();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const menuToggleBtn = document.querySelector('.menu-toggle-btn');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');

  const openMobileMenu = () => {
    menuToggleBtn?.classList.add('active');
    menuToggleBtn?.setAttribute('aria-expanded', 'true');
    mobileNavDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    menuToggleBtn?.classList.remove('active');
    menuToggleBtn?.setAttribute('aria-expanded', 'false');
    mobileNavDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuToggleBtn?.addEventListener('click', () => {
    const isOpen = mobileNavDrawer?.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileNavDrawer?.addEventListener('click', (e) => {
    if (e.target === mobileNavDrawer) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Hero Interactive Code Editor Tabs
  // --------------------------------------------------------------------------
  const codeTabs = document.querySelectorAll('.window-tab');
  const codePanes = document.querySelectorAll('.code-view-pane');

  codeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      codeTabs.forEach((t) => t.classList.remove('active'));
      codePanes.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(`pane-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Stat Number Counter Animation (IntersectionObserver)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateCounters = () => {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing function outQuart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(easeOut * target);

        const plusSpan = stat.querySelector('.stat-plus');
        const plusText = plusSpan ? plusSpan.outerHTML : '';
        stat.innerHTML = `${currentVal}${plusText}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.innerHTML = `${target}${plusText}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.querySelector('.stats-grid-row');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 6. Projects Category Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Contact Form Interactive Handler & Mailto Generator
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolioContactForm');
  const formFeedback = document.getElementById('formFeedbackAlert');
  const submitBtn = document.getElementById('contactSubmitBtn');

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && re.test(email.trim());
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('senderName')?.value || '').trim();
      const email = (document.getElementById('senderEmail')?.value || '').trim();
      const projectType = document.getElementById('projectType')?.value || 'Website Development';
      const rawMessage = (document.getElementById('senderMessage')?.value || '').trim();

      if (!name || !email || !rawMessage) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback-alert error';
          formFeedback.innerHTML = '<span>⚠️</span><div>Please complete all required fields.</div>';
          formFeedback.style.display = 'flex';
        } else {
          alert('Please complete all required fields.');
        }
        return;
      }

      if (!isValidEmail(email)) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback-alert error';
          formFeedback.innerHTML = '<span>⚠️</span><div>Please enter a valid email address.</div>';
          formFeedback.style.display = 'flex';
        } else {
          alert('Please enter a valid email address.');
        }
        return;
      }

      // Normalize newlines in message to CRLF (\r\n) for RFC 6068 compliant email body encoding
      // This prevents Windows/Outlook byte-offset drift that truncates names and corrupts '@' into '#'
      const normalizedMessage = rawMessage.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

      const bodyLines = [
        'Hi Sourabh,',
        '',
        'I am contacting you regarding a new project.',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Project Type: ${projectType}`,
        '',
        'Project Details:',
        normalizedMessage,
        '',
        'Best regards,',
        name
      ];

      const fullBodyText = bodyLines.join('\r\n');
      const subject = `Project Inquiry: ${projectType} from ${name}`;

      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(fullBodyText);

      const mailtoUrl = `mailto:sourabhpandya.0@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // 1. Enter Loading State
      const btnText = submitBtn?.querySelector('.btn-text');
      const originalBtnText = btnText?.innerHTML || 'Start a Conversation →';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        if (btnText) btnText.textContent = 'Please wait...';
      }

      // Show loader and requested message to user
      if (formFeedback) {
        formFeedback.className = 'form-feedback-alert loading';
        formFeedback.innerHTML = `
          <div class="form-loader-spinner" aria-hidden="true"></div>
          <div>Please wait your message need to submit.</div>
        `;
        formFeedback.style.display = 'flex';
      }

      // 2. Wait for user to see the loader and message, then launch mail app and reset form
      setTimeout(() => {
        // Trigger user's mail client via anchor click for maximum cross-browser/OS compatibility
        const mailLink = document.createElement('a');
        mailLink.href = mailtoUrl;
        mailLink.style.display = 'none';
        document.body.appendChild(mailLink);
        mailLink.click();

        // 3. Reset form fields
        contactForm.reset();

        // 4. Update status feedback alert
        if (formFeedback) {
          formFeedback.className = 'form-feedback-alert success';
          formFeedback.innerHTML = `
            <span style="font-size: 1.1rem; font-weight: bold;">✓</span>
            <div><strong>Thank you, ${name}!</strong> Opening your email client to send the message...</div>
          `;
        }

        // 5. Restore submit button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
          if (btnText) btnText.innerHTML = originalBtnText;
        }

        setTimeout(() => {
          if (mailLink.parentNode) {
            mailLink.parentNode.removeChild(mailLink);
          }
        }, 200);

      }, 1200);
    });
  }

  // --------------------------------------------------------------------------
  // 8. Copy to Clipboard Utility (for Email / Phone)
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-trigger');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy') || '';
      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>✓ Copied to clipboard!</span>';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Scroll-Driven Reveal Engine (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealSelectors = [
    '.section-header',
    '.about-narrative',
    '.about-photo-frame',
    '.stat-box',
    '.edu-card',
    '.skill-category-card',
    '.timeline-entry',
    '.project-card',
    '.service-card',
    '.why-card',
    '.trusted-card',
    '.contact-card',
    '.contact-form-card'
  ].join(', ');

  const revealElements = document.querySelectorAll(revealSelectors);

  revealElements.forEach((el) => {
    el.classList.add('reveal-on-scroll');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
});
