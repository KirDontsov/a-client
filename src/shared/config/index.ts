export const createSidebarLinks = () => {
  let res = [];
  res.push(
    { id: 1, name: "Avito client", icon: "book", url: "/" },
    { id: 2, name: "Avito editor", icon: "book", url: "/editor" },
    { id: 4, name: "Аналитика", icon: "chart", url: "/avito-analytics" },
    { id: 5, name: "Firms", icon: "dashboard", url: "/firms" },
    { id: 6, name: "Log In", icon: "login", url: "/login" }
  );

  return res;
};
