'use strict';
(function () {
  var welcome = document.getElementById('bienvenida');
  var hub = document.querySelector('.hub');
  var start = document.getElementById('empezar-demo');
  var aperture = document.getElementById('demo-aperture');
  var film = document.getElementById('brand-film');
  var brandMark = document.querySelector('.portal-mark');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  brandMark.classList.add('is-static');
  var buttons = Array.from(document.querySelectorAll('.switch button'));
  var prevArrow = document.querySelector('.page-arrow-prev');
  var nextArrow = document.querySelector('.page-arrow-next');
  var frames = new Map(buttons.map(function (button) {
    return [button.dataset.demo, document.getElementById(button.getAttribute('aria-controls'))];
  }));
  var launched = false;
  var launchToken = 0;
  var cleanup = function () {};
  var ready = new Set();
  var heroSlides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  var heroIndicators = Array.from(document.querySelectorAll('[data-hero-indicator]'));
  var orbitTrace = document.querySelector('.orbit-trace');
  var heroIndex = 0;
  var orbitRotation = 0;
  var heroTimer = null;
  var HERO_INTERVAL_MS = 1500;

  function advanceHero() {
    if (heroSlides.length < 2 || !orbitTrace) return;
    var nextIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].classList.remove('is-active');
    heroSlides[nextIndex].classList.add('is-active');
    heroIndex = nextIndex;

    heroIndicators.forEach(function (indicator, index) {
      indicator.classList.toggle('is-active', index === heroIndex);
    });

    orbitRotation += 120;
    orbitTrace.style.setProperty('--orbit-rotation', orbitRotation + 'deg');
  }

  function startHeroCarousel() {
    if (reduced.matches || launched || document.hidden || heroTimer !== null || heroSlides.length < 2) return;
    heroTimer = window.setInterval(advanceHero, HERO_INTERVAL_MS);
  }

  function stopHeroCarousel() {
    if (heroTimer !== null) {
      window.clearInterval(heroTimer);
      heroTimer = null;
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopHeroCarousel();
    else startHeroCarousel();
  });

  // Keep the CSS camera move synchronized with the original MP4 playback.
  film.addEventListener('playing', function () {
    brandMark.classList.add('is-playing');
    brandMark.classList.remove('is-paused', 'is-static');
  });
  film.addEventListener('pause', function () {
    if (!film.ended && brandMark.classList.contains('is-playing')) {
      brandMark.classList.add('is-paused');
    }
  });
  film.addEventListener('ended', function () {
    brandMark.classList.remove('is-paused');
  });

  frames.forEach(function (frame, id) {
    frame.addEventListener('load', function () {
      if (frame.getAttribute('src')) ready.add(id);
      try {
        var innerDoc = frame.contentDocument;
        if (innerDoc) innerDoc.addEventListener('keydown', handleViewerKeydown);
      } catch (error) {}
    });
  });

  function getActiveIndex() {
    var index = buttons.findIndex(function (button) {
      return button.getAttribute('aria-selected') === 'true';
    });
    return index < 0 ? 0 : index;
  }

  function stepDemo(delta, focus) {
    var currentIndex = getActiveIndex();
    var nextIndex = (currentIndex + delta + buttons.length) % buttons.length;
    var nextButton = buttons[nextIndex];
    select(nextButton.dataset.demo);
    commit(nextButton.dataset.demo, 'replaceState');
    if (focus) nextButton.focus({ preventScroll: true });
  }

  function isTypingTarget(target) {
    return !!(target && (target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]')));
  }

  function handleViewerKeydown(event) {
    if (welcome.hidden === false) return;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (isTypingTarget(event.target)) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepDemo(-1, false);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepDemo(1, false);
    }
  }

  function select(id) {
    buttons.forEach(function (button) {
      var active = button.dataset.demo === id;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    frames.forEach(function (frame, key) {
      var active = key === id;
      frame.classList.toggle('is-on', active);
      if (active && !frame.getAttribute('src')) frame.src = frame.dataset.src;
    });
  }

  function commit(id, method) {
    if (location.hash !== '#' + id) history[method](null, '', '#' + id);
  }

  function finish(id, focus) {
    stopHeroCarousel();
    cleanup();
    ++launchToken;
    launched = true;
    document.body.classList.remove('launching', 'revealing');
    welcome.hidden = true;
    film.pause();
    hub.hidden = false;
    hub.removeAttribute('inert');
    hub.removeAttribute('aria-hidden');
    select(id);
    start.removeAttribute('aria-busy');
    if (focus) document.getElementById('tab-' + id).focus({ preventScroll: true });
  }

  function reset() {
    cleanup();
    ++launchToken;
    launched = false;
    document.body.classList.remove('launching', 'revealing');
    welcome.hidden = false;
    hub.hidden = true;
    start.removeAttribute('aria-busy');
    film.pause();
    film.currentTime = 0;
    brandMark.classList.remove('is-playing', 'is-paused');
    brandMark.classList.add('is-static');
    if (!reduced.matches) {
      var replay = film.play();
      if (replay) replay.catch(function () { brandMark.classList.add('is-static'); });
    }
    startHeroCarousel();
    start.focus({ preventScroll: true });
  }

  function enter() {
    stopHeroCarousel();
    var id = '01';
    var token = ++launchToken;
    launched = true;
    commit(id, 'pushState');
    if (reduced.matches) { finish(id, true); return; }

    var rect = aperture.getBoundingClientRect();
    var cta = start.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    if (x < 0 || x > innerWidth || y < 0 || y > innerHeight) {
      x = cta.left + cta.width / 2;
      y = cta.top + cta.height / 2;
    }
    document.body.style.setProperty('--door-x', x + 'px');
    document.body.style.setProperty('--door-y', y + 'px');
    start.setAttribute('aria-busy', 'true');
    film.pause();
    hub.hidden = false;
    hub.setAttribute('inert', '');
    hub.setAttribute('aria-hidden', 'true');
    document.body.classList.add('launching');

    var frame = frames.get(id);
    var started = false;
    var waitTimer;
    var endTimer;
    var warmTimer;
    var complete = function (event) {
      if (event && (event.target !== hub || event.animationName !== 'open-demo')) return;
      if (token === launchToken) finish(id, true);
    };

    function reveal() {
      if (started || token !== launchToken) return;
      started = true;
      clearTimeout(waitTimer);
      frame.removeEventListener('load', reveal);
      if (reduced.matches) { finish(id, true); return; }
      document.body.classList.add('revealing');
      hub.addEventListener('animationend', complete);
      endTimer = setTimeout(complete, 1200);
    }

    cleanup = function () {
      clearTimeout(waitTimer);
      clearTimeout(warmTimer);
      clearTimeout(endTimer);
      frame.removeEventListener('load', reveal);
      hub.removeEventListener('animationend', complete);
    };
    warmTimer = setTimeout(function () {
      if (ready.has(id)) reveal();
      else {
        frame.addEventListener('load', reveal);
        waitTimer = setTimeout(reveal, 420);
      }
    }, 180);
    select(id);
  }

  start.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!launched) enter();
  });

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      select(button.dataset.demo);
      commit(button.dataset.demo, 'replaceState');
    });
  });

  if (prevArrow) prevArrow.addEventListener('click', function () {
    stepDemo(-1, false);
  });
  if (nextArrow) nextArrow.addEventListener('click', function () {
    stepDemo(1, false);
  });

  document.addEventListener('keydown', handleViewerKeydown);

  document.querySelector('.switch').addEventListener('keydown', function (event) {
    var index = buttons.findIndex(function (button) {
      return button.getAttribute('aria-selected') === 'true';
    });
    var next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    else if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons[next].click();
    buttons[next].focus({ preventScroll: true });
  });

  function syncHash(focus) {
    var id = location.hash.slice(1);
    if (frames.has(id)) finish(id, focus);
    else if (launched) reset();
  }

  function handleHash() {
    var id = location.hash.slice(1);
    var active = buttons.find(function (button) {
      return button.getAttribute('aria-selected') === 'true';
    });
    if (frames.has(id) && welcome.hidden && active && active.dataset.demo === id) return;
    syncHash(true);
  }

  window.addEventListener('popstate', handleHash);
  window.addEventListener('hashchange', handleHash);
  syncHash(false);

  if (!launched && !reduced.matches) {
    startHeroCarousel();
    film.muted = true;
    var playback = film.play();
    if (playback) playback.catch(function () { brandMark.classList.add('is-static'); });
  }
})();
