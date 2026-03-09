// For browsers that don't support cross-document view transitions natively,
// intercept navigation and use the same-document View Transition API as fallback.
if (!CSS.supports || !CSS.supports('view-transition-name', 'none')) {
  console.warn('View Transitions not supported in this browser.');
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link || link.origin !== location.origin) return;

  // If cross-document view transitions are supported (@view-transition auto),
  // the browser handles it — no JS needed. This fallback is for older browsers.
  if (!document.startViewTransition) return;

  e.preventDefault();

  document.startViewTransition(async () => {
    const res = await fetch(link.href);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    document.title = doc.title;
    document.querySelector('main').replaceWith(doc.querySelector('main'));
    history.pushState(null, '', link.href);
  });
});

// Handle back/forward navigation
window.addEventListener('popstate', () => {
  if (!document.startViewTransition) {
    location.reload();
    return;
  }

  document.startViewTransition(async () => {
    const res = await fetch(location.href);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    document.title = doc.title;
    document.querySelector('main').replaceWith(doc.querySelector('main'));
  });
});
