import type { Locale } from './config';

/**
 * Interface strings. Every visible string in components must come from here.
 * `pt` is the source of truth; `en` must have exactly the same keys (enforced by the type below).
 */
const pt = {
  'site.title': 'Portfolio & Blog',
  'site.description': 'Projetos, experiências e artigos sobre programação.',
  'nav.home': 'Início',
  'nav.about': 'Sobre',
  'nav.projects': 'Projetos',
  'nav.blog': 'Blog',
  'nav.now': 'Agora',
  'nav.skip': 'Pular para o conteúdo',
  'theme.toggle': 'Alternar tema claro/escuro',
  'home.latestPosts': 'Últimos artigos',
  'home.featuredProjects': 'Projetos em destaque',
  'blog.title': 'Blog',
  'blog.description': 'Artigos sobre programação, projetos e carreira.',
  'blog.empty': 'Nenhum artigo publicado ainda.',
  'blog.readingTime': '{minutes} min de leitura',
  'blog.publishedOn': 'Publicado em',
  'blog.updatedOn': 'Atualizado em',
  'projects.title': 'Projetos',
  'projects.description': 'Coisas que construí e estou construindo.',
  'projects.empty': 'Nenhum projeto publicado ainda.',
  'projects.status.active': 'Ativo',
  'projects.status.paused': 'Pausado',
  'projects.status.done': 'Concluído',
  'projects.relatedPosts': 'Artigos sobre este projeto',
  'about.title': 'Sobre',
  'about.experience': 'Experiência',
  'about.present': 'atual',
  'now.title': 'Agora',
  'notFound.title': 'Página não encontrada',
  'notFound.back': 'Voltar para o início',
  'footer.rss': 'RSS',
} as const;

export type UiKey = keyof typeof pt;

const en: Record<UiKey, string> = {
  'site.title': 'Portfolio & Blog',
  'site.description': 'Projects, experience and articles about programming.',
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.projects': 'Projects',
  'nav.blog': 'Blog',
  'nav.now': 'Now',
  'nav.skip': 'Skip to content',
  'theme.toggle': 'Toggle light/dark theme',
  'home.latestPosts': 'Latest articles',
  'home.featuredProjects': 'Featured projects',
  'blog.title': 'Blog',
  'blog.description': 'Articles about programming, projects and career.',
  'blog.empty': 'No articles published yet.',
  'blog.readingTime': '{minutes} min read',
  'blog.publishedOn': 'Published on',
  'blog.updatedOn': 'Updated on',
  'projects.title': 'Projects',
  'projects.description': "Things I've built and I'm building.",
  'projects.empty': 'No projects published yet.',
  'projects.status.active': 'Active',
  'projects.status.paused': 'Paused',
  'projects.status.done': 'Done',
  'projects.relatedPosts': 'Articles about this project',
  'about.title': 'About',
  'about.experience': 'Experience',
  'about.present': 'present',
  'now.title': 'Now',
  'notFound.title': 'Page not found',
  'notFound.back': 'Back to home',
  'footer.rss': 'RSS',
};

export const ui: Record<Locale, Record<UiKey, string>> = { pt, en };
