export const createSidebarLinks = () => {
  let res = [];
  res.push(
    { id: 1, name: 'Аккаунты', icon: 'account', url: '/accounts', children: ['/accounts/create', '/accounts/'] },
    // { id: 2, name: 'Фид', icon: 'book', url: '/feed' },
    { id: 3, name: 'Редактор', icon: 'editor', url: '/editor', children: ['/create'] },
    { id: 4, name: 'Фиды', icon: 'book', url: '/feeds', children: ['/feeds/'] },
    { id: 5, name: 'Аналитика', icon: 'chart', url: '/analytics', children: ['/analytics/'] },
    // { id: 6, name: 'Фирмы', icon: 'dashboard', url: '/firms' },
    { id: 7, name: 'Вход', icon: 'login', url: '/login' },
  );

  return res;
};
