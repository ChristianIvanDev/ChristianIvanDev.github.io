import { h, externalLink } from './dom.js';
import { t, pick } from '../i18n.js';

const LINK_LABEL = { roblox: 'project.play.roblox', steam: 'project.view.steam' };

const CUSTOMS_SNIPPET = `@router.get("/pedimentos/{folio}")
async def consultar(folio: str, db=Depends(get_db)):
    pedimento = await db.buscar(folio)
    if pedimento is None:
        raise HTTPException(404)
    return PedimentoOut.from_orm(pedimento)`;

function media(project, lang, { eager }) {
  const [first] = project.images;
  if (!first) {
    return h('figure', { class: 'project__media project__media--code' },
      h('pre', { 'aria-label': t(lang, 'project.customs.code') }, h('code', {}, CUSTOMS_SNIPPET)),
    );
  }
  return h('figure', { class: 'project__media' },
    h('img', {
      src: first.src,
      alt: pick(first.alt, lang),
      loading: eager ? null : 'lazy',
      decoding: 'async',
    }),
  );
}

export function renderProjectCard(project, lang, { detailed = false, className = '' } = {}) {
  const badges = h('div', { class: 'project__badges' },
    h('span', { class: 'chip' }, t(lang, `projects.group.${project.group}`)),
    project.status === 'in-dev' ? h('span', { class: 'chip chip--warn' }, t(lang, 'project.status.indev')) : null,
  );

  const body = h('div', { class: 'project__body' },
    badges,
    h('h3', { class: 'project__title' }, pick(project.title, lang)),
    h('p', { class: 'project__summary' }, pick(project.summary, lang)),
    detailed
      ? [
          h('p', { class: 'card__label project__sub' }, t(lang, 'project.features')),
          h('ul', { class: 'project__features' }, pick(project.features, lang).map((f) => h('li', {}, f))),
        ]
      : null,
    h('ul', { class: 'project__stack', 'aria-label': t(lang, 'project.stack') }, project.stack.map((s) => h('li', {}, s))),
    project.link
      ? externalLink(project.link.href, t(lang, LINK_LABEL[project.link.kind]), t(lang, 'project.link.newtab'), {
          class: `btn btn--light project__link project__link--${project.link.kind}`,
        })
      : null,
  );

  return h('article', {
    class: `card card--flush project ${project.featured ? 'project--featured' : ''} ${className}`.trim(),
    'data-project': project.id,
    'data-tilt': '',
  }, media(project, lang, { eager: false }), body);
}
