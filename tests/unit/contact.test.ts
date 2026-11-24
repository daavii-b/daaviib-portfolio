import { describe, expect, it } from 'vitest';

import { contactMessage, contactSubject, mailtoUrl, whatsappUrl } from '@/lib/contact';

describe('contactMessage', () => {
  it('varies by page', () => {
    expect(contactMessage({ kind: 'blog' }, 'pt')).toBe(
      'Olá, Davi! Vim pelo seu blog e gostaria de conversar sobre ',
    );
    expect(contactMessage({ kind: 'about' }, 'en')).toContain('saw your profile');
  });

  it('quotes the article and names the project', () => {
    expect(contactMessage({ kind: 'article', title: 'Por que Astro' }, 'pt')).toBe(
      'Olá, Davi! Li seu artigo “Por que Astro” e gostaria de conversar sobre ',
    );
    expect(contactMessage({ kind: 'project', title: 'Prumo' }, 'en')).toContain('the Prumo project');
  });

  it('has a message for every kind in every locale', () => {
    const kinds = ['home', 'blog', 'about', 'projects', 'other'] as const;
    for (const lang of ['pt', 'en'] as const) {
      for (const kind of kinds) expect(contactMessage({ kind }, lang).length).toBeGreaterThan(10);
    }
  });
});

describe('contactSubject', () => {
  it('names the page', () => {
    expect(contactSubject({ kind: 'article', title: 'x' }, 'pt')).toBe('Contato pelo site — Artigo');
    expect(contactSubject({ kind: 'home' }, 'en')).toBe('Contact from website — Home');
  });
});

describe('whatsappUrl', () => {
  it('encodes the trimmed message', () => {
    expect(whatsappUrl('5585984662837', 'Olá, Davi! ')).toBe(
      'https://wa.me/5585984662837?text=Ol%C3%A1%2C%20Davi!',
    );
  });

  it('rejects numbers that are not E.164 digits', () => {
    expect(() => whatsappUrl('+55 85 98466-2837', 'x')).toThrow(/Invalid WhatsApp number/);
  });
});

describe('mailtoUrl', () => {
  it('encodes subject and body', () => {
    expect(mailtoUrl('a@b.com', 'Contato — Blog', 'Oi & tchau ')).toBe(
      'mailto:a@b.com?subject=Contato%20%E2%80%94%20Blog&body=Oi%20%26%20tchau',
    );
  });
});
