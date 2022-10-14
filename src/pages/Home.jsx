import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Sort from '../components/Sort';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import { fetchCategories } from '../redux/slices/categoriesSlice';
import {
  fetchProducts,
  fetchProductsCount,
  setCurrentPage,
  setFilters,
} from '../redux/slices/productsSlice';
import Pagination from '../components/Pagination';
import { pagesCount } from '../utils/pagesCount';
import { checkCategory } from '../utils/checkCategory';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, productsStatus, productsCount, currentPage, categoryId } = useSelector(
    (state) => state.products,
  );
  let { categories, categoriesStatus } = useSelector((state) => state.categories);
  const isCategoriesLoading = categoriesStatus === 'loaded';

  const [sortId, setSortId] = React.useState(0);
  // console.log(products);
  const limit = 3;

  const pageCount = pagesCount(productsCount, limit);
  const startProduct = currentPage * limit - limit;

  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    dispatch(fetchCategories());
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      // console.log(params);

      dispatch(setFilters(params));
      isSearch.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (!isSearch.current) {
      let catId = checkCategory(categories, categoryId);

      const params = { startProduct, limit, categoryId: catId };
      dispatch(fetchProducts(params));
      dispatch(fetchProductsCount({ categoryId: catId }));
    }
    isSearch.current = false;
  }, [categoryId, currentPage, categories]);

  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, currentPage]);

  return (
    <div className="content">
      <div className="container">
        <div className="content__top">
          <Categories
            categoryId={categoryId}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
          />
          <Sort sortId={sortId} setSortId={setSortId} />
        </div>
        <h2 className="content__title">Все пиццы</h2>
        <div className="content__items">
          {productsStatus === 'loading' ? (
            <>
              {[...Array(limit)].map((_, index) => (
                <Skeleton key={index} />
              ))}
            </>
          ) : (
            products.map((product) => <PizzaBlock key={product._id} {...product} />)
          )}
          {productsStatus === 'error' && <h1>Connection error</h1>}
        </div>
        {pageCount > 1 && (
          <Pagination
            limit={limit}
            pageCount={pageCount}
            currentPage={currentPage}
            onChangePage={(page) => dispatch(setCurrentPage(page))}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
