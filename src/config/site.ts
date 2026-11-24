/** Site-wide settings. Contact data and availability are read by the contact dialog. */
export const SITE = {
  author: 'Davi Brito',
  role: 'Fullstack Engineer',
  /** Brand mark printed on share images (the canonical host is the configured site URL). */
  domain: 'daaviib.site',
  /** Explanation of "now" pages, linked from the intro of /now. */
  nowPageAbout: 'https://nownownow.com/about',
  contact: {
    email: 'brit.davi122@gmail.com',
    /** WhatsApp number in E.164 digits only (no "+", spaces or dashes). */
    whatsapp: '5585984662837',
    /** Scheduling link (e.g. Cal.com). Empty = the option is hidden. */
    schedulingUrl: '',
  },
  availability: {
    /** Shows the green "available" line in the hero and the contact dialog. */
    open: true,
    label: { pt: 'Aberto a projetos PJ e freelas', en: 'Open to contract and freelance work' },
  },
  social: {
    github: 'https://github.com/daavii-b',
    linkedin: 'https://www.linkedin.com/in/daaviib',
  },
} as const;
