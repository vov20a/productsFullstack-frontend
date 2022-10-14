export const checkCategory = (categories, categoryId) => {
  let catId = categories[categoryId]?._id;
  if (categories[categoryId]?.title === 'Все') {
    catId = undefined;
  }
  return catId;
};
