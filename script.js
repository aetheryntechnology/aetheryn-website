/*!
 * Aetheryn Technology — site script (vanilla JS, no dependencies)
 * Loaded as ./script.js with `defer`. Classic script (not an ES module) so the
 * site also works when index.html is opened straight from disk.
 *
 * Modules: Menu · ActiveNav · Pixels · Reveal · Filter · Tabs · ToTop · ContactForm · Year
 * Rules: no scroll listeners, no looping animation, honours prefers-reduced-motion.
 */
(function () {
  'use strict';

  var d = document;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Menu — accessible mobile navigation toggle
     --------------------------------------------------------------------- */
  var Menu = {
    init: function () {
      this.nav = d.getElementById('nav');
      this.btn = d.getElementById('menu-btn');
      if (!this.nav || !this.btn) return;

      var self = this;
      this.btn.addEventListener('click', function () {
        self.set(!self.nav.classList.contains('open'));
      });
      this.nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) self.set(false);
      });
      d.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && self.nav.classList.contains('open')) {
          self.set(false);
          self.btn.focus();
        }
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 1000) self.set(false);
      });
    },
    set: function (open) {
      this.nav.classList.toggle('open', open);
      this.btn.setAttribute('aria-expanded', String(open));
      this.btn.textContent = open ? 'CLOSE' : 'MENU';
    }
  };

  /* ---------------------------------------------------------------------
     ActiveNav — highlight the nav link of the section in view
     (IntersectionObserver, so there is no scroll handler)
     --------------------------------------------------------------------- */
  var ActiveNav = {
    init: function () {
      var nav = d.getElementById('nav');
      if (!nav || !('IntersectionObserver' in window)) return;

      var links = {};
      Array.prototype.forEach.call(nav.querySelectorAll('a[href^="#"]'), function (a) {
        links[a.getAttribute('href').slice(1)] = a;
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          /* the hero (#top) has no nav link, so entering it clears the highlight */
          if (links[en.target.id]) links[en.target.id].setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      Object.keys(links).concat('top').forEach(function (id) {
        var section = d.getElementById(id);
        if (section) io.observe(section);
      });
    }
  };

  /* ---------------------------------------------------------------------
     Pixels — stagger the hero pixel-grid entrance (one-shot, CSS-driven)
     --------------------------------------------------------------------- */
  var Pixels = {
    init: function () {
      if (reduceMotion) return;
      var cells = d.querySelectorAll('.pixels i');
      Array.prototype.forEach.call(cells, function (cell, i) {
        cell.style.setProperty('--i', i);
      });
    }
  };

  /* ---------------------------------------------------------------------
     Reveal — one-time fade/slide for section heads as they enter the viewport
     --------------------------------------------------------------------- */
  var Reveal = {
    init: function () {
      var items = d.querySelectorAll('.reveal');
      if (!items.length) return;

      if (reduceMotion || !('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
        return;
      }

      var io = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('in');
          observer.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

      Array.prototype.forEach.call(items, function (el) { io.observe(el); });
    }
  };

  /* Filter — blueprint category chips */
  var Filter = {
    init: function () {
      var chips = d.querySelectorAll('.chip[data-filter]');
      var items = d.querySelectorAll('#work-grid .work');
      if (!chips.length) return;
      Array.prototype.forEach.call(chips, function (chip) {
        chip.addEventListener('click', function () {
          var f = chip.getAttribute('data-filter');
          Array.prototype.forEach.call(chips, function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
          Array.prototype.forEach.call(items, function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-cat') === f); });
        });
      });
    }
  };

  /* Tabs — accessible tablist with arrow-key support */
  var Tabs = {
    init: function () {
      Array.prototype.forEach.call(d.querySelectorAll('[data-tabs]'), function (root) {
        var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
        function select(tab, focus) {
          tabs.forEach(function (t) {
            var on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            d.getElementById(t.getAttribute('aria-controls')).hidden = !on;
          });
          if (focus) tab.focus();
        }
        tabs.forEach(function (t, i) {
          t.addEventListener('click', function () { select(t); });
          t.addEventListener('keydown', function (e) {
            var n = null;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
            else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
            else if (e.key === 'Home') n = 0;
            else if (e.key === 'End') n = tabs.length - 1;
            if (n !== null) { e.preventDefault(); select(tabs[n], true); }
          });
        });
      });
    }
  };

  /* ToTop — show the back-to-top button once the hero has scrolled away */
  var ToTop = {
    init: function () {
      var btn = d.getElementById('totop'), hero = d.getElementById('top');
      if (!btn || !hero || !('IntersectionObserver' in window)) return;
      new IntersectionObserver(function (en) { btn.hidden = en[0].isIntersecting; }).observe(hero);
    }
  };

  /* ---------------------------------------------------------------------
     ContactForm — native validation, then POST to data-endpoint
     or open the visitor's email app with the message prefilled
     --------------------------------------------------------------------- */
  var ContactForm = {
    init: function () {
      var form = d.getElementById('contact-form');
      if (!form) return;
      var status = form.querySelector('.status');
      var honeypot = form.querySelector('.hp');

      function show(text) {
        status.textContent = text;
        status.classList.add('show');
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (honeypot && honeypot.value) return;      /* bots fill the hidden field */
        if (!form.reportValidity()) return;

        var f = form.elements;
        var data = {
          name: f.name.value.trim(),
          email: f.email.value.trim(),
          company: f.company.value.trim(),
          budget: f.budget.value,
          timeline: f.timeline.value,
          service: f.service.value,
          message: f.message.value.trim()
        };
        var endpoint = form.getAttribute('data-endpoint');
        var to = form.getAttribute('data-mailto');

        if (endpoint) {
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
          })
            .then(function (r) {
              if (!r.ok) throw new Error('Request failed');
              show('Thank you. Your message has reached us and we will reply within one business day.');
              form.reset();
            })
            .catch(function () {
              show('We could not send your message. Please email us at ' + to + '.');
            });
        } else {
          var body = 'Name: ' + data.name + '\nEmail: ' + data.email + '\nCompany: ' + data.company + '\nService: ' + data.service + '\nBudget: ' + data.budget + '\nTimeline: ' + data.timeline + '\n\n' + data.message;
          window.location.href = 'mailto:' + to +
            '?subject=' + encodeURIComponent('Aetheryn Technology enquiry: ' + data.service) +
            '&body=' + encodeURIComponent(body);
          show('Your email app should open with the message ready to send.');
        }
      });
    }
  };

  /* ---------------------------------------------------------------------
     Year — keep the footer copyright current
     --------------------------------------------------------------------- */
  var Year = {
    init: function () {
      var el = d.getElementById('year');
      if (el) el.textContent = new Date().getFullYear();
    }
  };

  /* Boot */
  [Menu, ActiveNav, Pixels, Reveal, Filter, Tabs, ToTop, ContactForm, Year].forEach(function (m) { m.init(); });
})();
