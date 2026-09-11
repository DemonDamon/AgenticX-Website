export const SITE_UI_THEME_STORAGE_KEY = 'agx-site-ui-theme';

export const SITE_THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(SITE_UI_THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t!=='dark'&&t!=='light'&&t!=='system')t='system';var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`;
