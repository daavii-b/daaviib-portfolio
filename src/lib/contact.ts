import type { Locale } from '@/i18n/config';

/** Where the visitor is when they open the contact dialog. */
export type ContactContext =
  { kind: 'home' | 'blog' | 'about' | 'projects' | 'other' } | { kind: 'article' | 'project'; title: string };

const MESSAGES: Record<Locale, Record<ContactContext['kind'], (title?: string) => string>> = {
  pt: {
    home: () => 'Olá, Davi! Vim pelo seu site e gostaria de conversar sobre ',
    blog: () => 'Olá, Davi! Vim pelo seu blog e gostaria de conversar sobre ',
    about: () => 'Olá, Davi! Vi seu perfil e gostaria de conversar sobre ',
    projects: () => 'Olá, Davi! Vi seus projetos e gostaria de conversar sobre ',
    other: () => 'Olá, Davi! Vim pelo seu site e gostaria de conversar sobre ',
    article: (title) => `Olá, Davi! Li seu artigo “${title}” e gostaria de conversar sobre `,
    project: (title) => `Olá, Davi! Vi o projeto ${title} e gostaria de conversar sobre `,
  },
  en: {
    home: () => 'Hi Davi! I found your website and would like to talk about ',
    blog: () => 'Hi Davi! I found your blog and would like to talk about ',
    about: () => 'Hi Davi! I saw your profile and would like to talk about ',
    projects: () => 'Hi Davi! I saw your projects and would like to talk about ',
    other: () => 'Hi Davi! I found your website and would like to talk about ',
    article: (title) => `Hi Davi! I read your article “${title}” and would like to talk about `,
    project: (title) => `Hi Davi! I saw the ${title} project and would like to talk about `,
  },
};

const PAGE_NAMES: Record<Locale, Record<ContactContext['kind'], string>> = {
  pt: {
    home: 'Início',
    blog: 'Blog',
    about: 'Sobre',
    projects: 'Projetos',
    other: 'Site',
    article: 'Artigo',
    project: 'Projeto',
  },
  en: {
    home: 'Home',
    blog: 'Blog',
    about: 'About',
    projects: 'Projects',
    other: 'Website',
    article: 'Article',
    project: 'Project',
  },
};

/** Pre-filled message for the context, ending with a space so the visitor can keep typing. */
export function contactMessage(context: ContactContext, lang: Locale): string {
  return MESSAGES[lang][context.kind]('title' in context ? context.title : undefined);
}

/** Email subject, e.g. "Contato pelo site — Artigo". */
export function contactSubject(context: ContactContext, lang: Locale): string {
  const prefix = lang === 'pt' ? 'Contato pelo site' : 'Contact from website';
  return `${prefix} — ${PAGE_NAMES[lang][context.kind]}`;
}

/** https://wa.me link with the message. `phone` must be E.164 digits only. */
export function whatsappUrl(phone: string, message: string): string {
  if (!/^\d{8,15}$/.test(phone)) throw new Error(`Invalid WhatsApp number: ${phone}`);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`;
}

/** mailto: link with subject and body, encoded per RFC 6068. */
export function mailtoUrl(email: string, subject: string, body: string): string {
  const params = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
  return `mailto:${email}?${params}`;
}
