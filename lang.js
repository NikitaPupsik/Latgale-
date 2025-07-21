let translations = {};
let currentLang = 'lv';

// Load translation data from JSON file
fetch('lang.json')
  .then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    console.log('Translations loaded:', data);
    translations = data;

    // Get saved language or default to Latvian
    const savedLang = localStorage.getItem('lang') || 'lv';
    setLanguage(savedLang);

    // Attach click listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(button => {
      button.addEventListener('click', () => {
        const selectedLang = button.dataset.lang;
        console.log('Language button clicked:', selectedLang);
        if (selectedLang && selectedLang !== currentLang) {
          setLanguage(selectedLang);
        }
      });
    });
  })
  .catch(err => console.error('Failed to load translations:', err));

function setLanguage(lang) {
  console.log(`Switching language to: ${lang}`);
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let text = translations[lang];

    for (const k of keys) {
      if (text && k in text) {
        text = text[k];
      } else {
        console.warn(`Missing translation key "${key}" for language "${lang}"`);
        text = null;
        break;
      }
    }

    if (text) {
      el.textContent = text;
    }
  });

  // Highlight active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}
