/** Conventional Commits: https://www.conventionalcommits.org */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      ['blog', 'portfolio', 'i18n', 'content', 'ui', 'seo', 'ci', 'deps', 'spec', 'newsletter', 'docs'],
    ],
  },
};
