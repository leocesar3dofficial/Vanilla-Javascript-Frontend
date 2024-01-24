const urlPageTitle = 'Leocesar3D';

const routes = {
  '/': {
    template: '/templates/home.html',
    title: `Home | ${urlPageTitle}`,
    description: 'Página Inicial',
  },
  '/sobre': {
    template: '/templates/about.html',
    title: `Sobre | ${urlPageTitle}`,
    description: 'Sobre nós',
  },
  '/contato': {
    template: '/templates/contact.html',
    title: `Entre em contato | ${urlPageTitle}`,
    description: 'Entre em contato',
  },
  '/artigos': {
    template: '/templates/articles.html',
    title: `Artigos | ${urlPageTitle}`,
    description: 'Artigos',
  },
  '/artigo': {
    template: '/templates/article.html',
    title: `Artigo | ${urlPageTitle}`,
    description: 'Artigo',
  },
  404: {
    template: '/templates/404.html',
    title: `404 | ${urlPageTitle}`,
    description: 'Página não encontrada',
  },
};

export default routes;
