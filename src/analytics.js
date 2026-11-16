/**
 * Analítica de visitas con GoatCounter (gratis, sin cookies y sin banner de consentimiento).
 * Está apagada mientras `GOATCOUNTER_CODE` esté vacío. Para activarla, crea una cuenta en
 * https://www.goatcounter.com y pon aquí el código de tu sitio (lo que va antes de .goatcounter.com).
 */
export const GOATCOUNTER_CODE = 'sadchris';

/** Nombre del evento para un clic en un enlace de interés, o null si no se mide. */
export function clickEventName(link) {
  if (!link) return null;
  if (link.dataset.cta) return `clic-${link.dataset.cta}`;
  if (link.dataset.social) return `red-${link.dataset.social}`;
  const href = link.getAttribute('href') || '';
  if (href.startsWith('https://wa.me/')) return 'clic-whatsapp';
  if (href.startsWith('mailto:')) return 'clic-correo';
  if (href.includes('calendar.app.google')) return 'clic-agendar';
  if (href.includes('superprof.')) return 'clic-superprof';
  return null;
}

export function initAnalytics(doc = document, code = GOATCOUNTER_CODE) {
  if (!code) return false;
  const script = doc.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  doc.head.append(script);
  doc.addEventListener('click', (e) => {
    const name = clickEventName(e.target.closest?.('a'));
    if (name && window.goatcounter?.count) window.goatcounter.count({ path: name, title: name, event: true });
  });
  return true;
}
