export const createSidebarLinks = () => {
  let res = [];
  res.push(
    { id: 1, name: 'Аккаунты', icon: 'account', url: '/' },
    // { id: 2, name: 'Фид', icon: 'book', url: '/feed' },
    { id: 3, name: 'Редактор', icon: 'book', url: '/editor' },
    { id: 4, name: 'Фиды', icon: 'book', url: '/avito/feeds' },
    { id: 5, name: 'Аналитика', icon: 'chart', url: '/avito-analytics' },
    // { id: 6, name: 'Фирмы', icon: 'dashboard', url: '/firms' },
    { id: 7, name: 'Вход', icon: 'login', url: '/login' },
  );

  return res;
};
