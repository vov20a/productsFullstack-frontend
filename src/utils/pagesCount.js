export const pagesCount = (allItems, limit) => {
  return Math.ceil(allItems / limit);
};

export const getPageArray = (pagesCount) => {
  const result = [];
  for (let i = 0; i < pagesCount; i++) {
    result.push(i + 1);
  }
  return result;
};
