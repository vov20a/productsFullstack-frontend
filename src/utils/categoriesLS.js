export const categoriesLS = () => {
  const data = localStorage.getItem('categories');
  const items = data ? JSON.parse(data) : [];

  return items;
};
