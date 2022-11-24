import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';

// const categories = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];

const Categories = ({ categoryId, isCategoriesLoading, categories }) => {
  // console.log(categoryId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (isMounted.current) {
      const json = JSON.stringify(categories);
      localStorage.setItem('categories', json);
    }
    isMounted.current = true;
  }, [categories]);

  const onCategoryClick = (id) => {
    dispatch(setCategoryId(id));
    dispatch(setCurrentPage(1));
    navigate(`?categoryId=${id}`);
  };

  // console.log(categoryId);
  return (
    <div className="categories">
      <ul>
        {isCategoriesLoading &&
          categories.map((item, index) => (
            <li
              onClick={() => onCategoryClick(index)}
              key={index}
              className={index === categoryId ? 'active' : ''}>
              {item.title}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Categories;
