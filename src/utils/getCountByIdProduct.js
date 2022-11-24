export const getCountByIdProduct = (items, id) => {
  const addedItemsArray = [];
  items.forEach((item) => {
    if (item._id === id) {
      addedItemsArray.push(item);
    }
  });
  let addedCount = 0;
  addedCount = addedItemsArray.reduce((sum, obj) => {
    return obj?.count + sum;
  }, 0);
  return addedCount;
};
