  document.getElementById('year').textContent = new Date().getFullYear();

  // --- language switch ---
  var langButtons = document.querySelectorAll('.lang-switch button');
  var phFields = document.querySelectorAll('.contact-form [data-ph-ru]');
  function applyPlaceholders(lang){
    phFields.forEach(function(f){
      f.placeholder = f.getAttribute(lang === 'en' ? 'data-ph-en' : 'data-ph-ru');
    });
  }
  applyPlaceholders('ru');

  // --- contact form: AJAX submit via fetch, no page reload ---
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    var successBox = document.getElementById('formSuccess');
    var errorBox = document.getElementById('formError');
    var submitBtn = document.getElementById('contactSubmit');
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      errorBox.hidden = true;
      successBox.hidden = true;
      submitBtn.disabled = true;
      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      }).then(function(response){
        if(response.ok){
          contactForm.hidden = true;
          successBox.hidden = false;
        } else {
          errorBox.hidden = false;
          submitBtn.disabled = false;
        }
      }).catch(function(){
        errorBox.hidden = false;
        submitBtn.disabled = false;
      });
    });
  }
  langButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var lang = btn.getAttribute('data-lang');
      document.body.classList.toggle('lang-en', lang === 'en');
      document.documentElement.lang = lang;
      langButtons.forEach(function(b){ b.classList.toggle('active', b === btn); });
      applyPlaceholders(lang);
    });
  });

  // --- mobile nav ---
  document.getElementById('navToggle').addEventListener('click', function(){
    document.getElementById('navLinks').classList.toggle('open');
  });

  // --- catalog: two independent filter rows (Состав / Повод) combined with AND ---
  var allWorks = document.querySelectorAll('li.work');
  var typeFilter = 'all';
  var tagFilter = 'all';

  function applyFilters(){
    var visibleCount = 0;
    allWorks.forEach(function(li){
      var cat = li.getAttribute('data-cat');
      var tags = (li.getAttribute('data-tags') || '').split(' ');
      var typeOk = (typeFilter === 'all' || cat === typeFilter);
      var tagOk = (tagFilter === 'all' || tags.indexOf(tagFilter) !== -1);
      var show = typeOk && tagOk;
      li.classList.toggle('hidden-by-filter', !show);
      if(show) visibleCount++;
    });
    var emptyState = document.getElementById('emptyState');
    if(emptyState) emptyState.hidden = visibleCount > 0;
  }

  function updateChipCounts(){
    document.querySelectorAll('.type-filters .chip').forEach(function(chip){
      var f = chip.getAttribute('data-filter');
      var n = (f === 'all') ? allWorks.length
        : document.querySelectorAll('li.work[data-cat="' + f + '"]').length;
      var el = chip.querySelector('.chip-count');
      if(el) el.textContent = ' (' + n + ')';
    });
    document.querySelectorAll('.tag-filters .chip').forEach(function(chip){
      var f = chip.getAttribute('data-filter');
      var n = 0;
      if(f === 'all'){
        n = allWorks.length;
      } else {
        allWorks.forEach(function(li){
          var tags = (li.getAttribute('data-tags') || '').split(' ');
          if(tags.indexOf(f) !== -1) n++;
        });
      }
      var el = chip.querySelector('.chip-count');
      if(el) el.textContent = ' (' + n + ')';
    });
  }
  updateChipCounts();

  document.querySelectorAll('.type-filters .chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      document.querySelectorAll('.type-filters .chip').forEach(function(c){ c.classList.toggle('active', c === chip); });
      typeFilter = chip.getAttribute('data-filter');
      applyFilters();
    });
  });
  document.querySelectorAll('.tag-filters .chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      document.querySelectorAll('.tag-filters .chip').forEach(function(c){ c.classList.toggle('active', c === chip); });
      tagFilter = chip.getAttribute('data-filter');
      applyFilters();
    });
  });

  // --- audio preview toggle ---
  document.querySelectorAll('.icon-btn.play').forEach(function(btn){
    var src = btn.getAttribute('data-audio');
    if(!src){ btn.disabled = true; btn.title = 'Пример — добавьте mp3 в data-audio'; return; }
    btn.addEventListener('click', function(){
      var audio = btn.closest('li').querySelector('audio.preview');
      audio.src = src;
      audio.classList.add('shown');
      audio.play();
    });
  });

  // --- PDF preview links: disable placeholders ---
  document.querySelectorAll('.icon-btn.pdf').forEach(function(a){
    var pdf = a.getAttribute('data-pdf');
    if(!pdf){
      a.addEventListener('click', function(e){ e.preventDefault(); });
      a.style.opacity = '.45';
      a.title = 'Пример — добавьте ссылку в data-pdf';
    } else {
      a.href = pdf;
    }
  });
