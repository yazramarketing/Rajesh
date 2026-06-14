'use strict';
// ── Progress bar ──
const pbar = document.getElementById('pbar');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (pbar) pbar.style.width = (window.scrollY / h * 100) + '%';
}, { passive: true });
// ════════════════════
// LOADER (SVG Ring)
// ════════════════════
const ldFill = document.getElementById('ld-fill');
const ldPct  = document.getElementById('ld-pct');
const ldArc  = document.getElementById('ld-arc');
const CIRC   = 2 * Math.PI * 52; // 326.726
let pct = 0;
const ldInt = setInterval(() => {
  pct = Math.min(pct + Math.random() * 1.5 + 0.4, 100);
  const p = Math.floor(pct);
  if (ldFill) ldFill.style.width = pct + '%';
  if (ldPct)  ldPct.textContent = p + '%';
  if (ldArc)  ldArc.style.strokeDashoffset = CIRC - (CIRC * pct / 100);
  if (pct >= 100) {
    clearInterval(ldInt);
    setTimeout(() => {
      const ld = document.getElementById('loader');
      if (ld) { ld.classList.add('gone'); setTimeout(() => initReveal(), 300); }
    }, 400);
  }
}, 55);
// ════════════════════
// HEADER
// ════════════════════
const hdr    = document.getElementById('hdr');
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');
const hdrBtns = document.getElementById('hdr-btns');
window.addEventListener('scroll', () => {
  hdr?.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
}, { passive: true });
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav?.classList.toggle('open');
  hdrBtns?.classList.toggle('open');
  document.body.classList.toggle('locked');
});
nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger?.classList.remove('open');
    nav?.classList.remove('open');
    hdrBtns?.classList.remove('open');
    document.body.classList.remove('locked');
  });
});
document.getElementById('logo-link')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
function highlightNav() {
  const ids = ['about', 'services', 'portfolio', 'why-us', 'testimonials', 'contact'];
  let cur = '';
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) cur = id;
  });
  nav?.querySelectorAll('a').forEach(a => {
    const id = a.getAttribute('href').slice(1);
    a.classList.toggle('active', id === cur);
  });
}
// ════════════════════
// SMOOTH SCROLL
// ════════════════════
function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
}
window.goTo = goTo;
document.querySelectorAll('[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    e.preventDefault();
    goTo(id);
  });
});
// ════════════════════
// REVEAL ON SCROLL
// ════════════════════
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('vis'), i * 75);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
  els.forEach(el => io.observe(el));
}
// ════════════════════
// COUNTER ANIMATION
// ════════════════════
function animCount(el, target, dur = 1800) {
  const t0 = performance.now();
  const step = now => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.cnt[data-n]').forEach(el => {
        animCount(el, +el.dataset.n);
        el.removeAttribute('data-n');
      });
      cio.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.hero-stats, .stats-band, .about-visual').forEach(el => cio.observe(el));
// ════════════════════
// RIPPLE
// ════════════════════
const rroot = document.getElementById('rroot');
document.querySelectorAll('.btn-primary, .btn-cta').forEach(btn => {
  btn.addEventListener('click', e => {
    const el = document.createElement('div');
    el.className = 'rpl-el';
    const sz = 120;
    el.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:rgba(244,123,58,0.3)`;
    rroot?.appendChild(el);
    setTimeout(() => el.remove(), 900);
  });
});
// Marquee is self-contained in HTML — no JS duplication needed
// ════════════════════
// CARD HOVER TILT
// ════════════════════
document.querySelectorAll('.svc-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const r = this.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    this.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
  });
});
// ════════════════════
// SEND VIA WHATSAPP
// ════════════════════
function sendWA() {
  const svc = document.getElementById('cf-svc')?.value || '';
  const msg = document.getElementById('cf-msg')?.value.trim() || '';
  if (!msg) {
    const ta = document.getElementById('cf-msg');
    if (ta) {
      ta.style.borderColor = '#ef4444';
      ta.style.boxShadow = '0 0 0 3px rgba(239,68,68,.12)';
      ta.focus();
      ta.addEventListener('input', () => { ta.style.borderColor = ''; ta.style.boxShadow = ''; }, { once: true });
    }
    return;
  }
  let text = "Hi Rajesh! I found Yazra Marketing and I'm interested.\n\n";
  if (svc) text += `*Service:* ${svc}\n\n`;
  text += `*Message:* ${msg}`;
  window.open(`https://wa.me/919342199463?text=${encodeURIComponent(text)}`, '_blank');
}
window.sendWA = sendWA;
// ════════════════════
// HERO ENTRANCE ANIM
// ════════════════════
['.hero-kicker', '.hero-h1', '.hero-p', '.hero-ctas', '.hero-stats'].forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  setTimeout(() => {
    el.style.transition = 'opacity .7s ease, transform .7s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 2600 + i * 130);
});
// Hero right
const heroRight = document.querySelector('.hero-right');
if (heroRight) {
  heroRight.style.opacity = '0';
  setTimeout(() => {
    heroRight.style.transition = 'opacity 1s ease';
    heroRight.style.opacity = '1';
  }, 3200);
}
// ════════════════════
// CONSOLE BRANDING
// ════════════════════
console.log('%c✦ YAZRA MARKETING ✦', 'color:#F47B3A;font-size:20px;font-weight:900;letter-spacing:3px');
console.log('%cPremium Digital Agency · Navy + Orange Theme', 'color:#B8C5D8;font-size:12px;font-weight:600');
console.log('%cFounder: Rajesh · BSc CS AIML · Takshashila University, Villupuram', 'color:#6B7FA0;font-size:11px');

