/**
 * Responsive audit: checks every page for horizontal overflow at each
 * breakpoint, and confirms the navigation switches at the right width.
 *
 * Horizontal overflow is the failure this catches, and it is easy to
 * reintroduce: an inline `gridTemplateColumns` cannot be overridden by a media
 * query, and a bare `fr` track refuses to shrink below its content's
 * min-content width. Both shipped during the initial build and were caught
 * here, not by eye.
 *
 * Paste into the browser console on the running site, or run through a
 * DevTools/CDP session. Returns a summary object; logs nothing on success.
 */
(async () => {
  const PATHS = [
    '/', '/engineering', '/blockchain', '/ai-engineering', '/ai-engineering/services',
    '/ai-engineering/value-discovery', '/ai-engineering/data-and-integration',
    '/ai-engineering/production-ai-systems', '/ai-engineering/support-and-run',
    '/ai-engineering/evaluation-and-observability', '/method/live', '/assurance',
    '/industries/professional-services', '/industries/insurance-financial-services',
    '/case-studies', '/insights', '/about', '/contact', '/security-and-data', '/certifications',
    '/privacy', '/terms', '/modern-slavery',
    '/case-studies/lytics', '/case-studies/blockguard',
    '/case-studies/chysler', '/case-studies/sandoz',
    '/case-studies/health-predictor',
  ];
  const WIDTHS = [360, 390, 768, 1024, 1440];
  const NAV_BREAKPOINT = 860; // must match the media query in globals.css

  const overflow = [];
  const navIssues = [];

  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;left:-99999px;top:0;border:0;';
  document.body.appendChild(frame);

  for (const width of WIDTHS) {
    for (const path of PATHS) {
      frame.style.width = width + 'px';
      frame.style.height = '900px';
      await new Promise(done => { frame.onload = done; frame.src = path; });
      await new Promise(done => setTimeout(done, 150));

      const doc = frame.contentDocument;
      const win = frame.contentWindow;

      const excess = doc.documentElement.scrollWidth - win.innerWidth;
      if (excess > 1) {
        // Name the widest offending element so the cause is obvious.
        let culprit = '(no single element — check margins and padding)';
        let widest = 0;
        doc.querySelectorAll('body *').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > widest && rect.width > win.innerWidth + 1) {
            widest = rect.width;
            culprit = el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 40) +
                      ' (' + Math.round(rect.width) + 'px)';
          }
        });
        overflow.push(width + 'px ' + path + ' — overflow ' + excess + 'px — ' + culprit);
      }

      const desktopNav = doc.querySelector('.nav');
      const mobileNav = doc.querySelector('.nav-mobile');
      const desktopShown = desktopNav && win.getComputedStyle(desktopNav).display !== 'none';
      const mobileShown = mobileNav && win.getComputedStyle(mobileNav).display !== 'none';
      const shouldBeMobile = width <= NAV_BREAKPOINT;
      if (shouldBeMobile ? (!mobileShown || desktopShown) : (!desktopShown || mobileShown)) {
        navIssues.push(width + 'px ' + path + ' — desktopNav=' + desktopShown + ' mobileNav=' + mobileShown);
      }
    }
  }

  frame.remove();
  const result = {
    checked: WIDTHS.length * PATHS.length,
    overflow: overflow.length ? overflow : 'none',
    navigation: navIssues.length ? navIssues : 'correct at every width',
  };
  console.log(result);
  return result;
})();
