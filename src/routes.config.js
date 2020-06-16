import { dynamic } from './utils';
// import { routes as homeRoutes } from './pages/home';
// import { routes as loginRoutes } from './pages/login';
// import { routes as registerRoutes } from './pages/register';
// const NotFound = dynamic(import('./pages/common/not-found'));
// const IndexLayout = dynamic(import('./layout/index-layout'));

const HomeIndex = dynamic(import('./pages/home/home-index'));

const routes = [
  {
    path: '/',
    component: HomeIndex
  }
];

export { routes };
