import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Sort, { sortValue } from '../components/Sort';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import { fetchCategories } from '../redux/slices/categoriesSlice';
import { fetchProducts, fetchProductsCount } from '../redux/slices/productsSlice';
import { setCurrentPage, setSortType, setFilters } from '../redux/slices/filterSlice';
import Pagination from '../components/Pagination';
import { pagesCount } from '../utils/pagesCount';
import { checkCategory } from '../utils/checkCategory';
import Search from '../components/Search';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { products, productsStatus, productsCount } = useSelector((state) => state.products);
  const { currentPage, categoryId, sortType, searchValue } = useSelector((state) => state.filter);
  const { categories, categoriesStatus } = useSelector((state) => state.categories);
  const isCategoriesLoading = categoriesStatus === 'loaded';

  const limit = 6;
  const pageCount = pagesCount(productsCount, limit);
  const startProduct = currentPage * limit - limit;

  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (!localStorage.getItem('categories')) {
      dispatch(fetchCategories());
    }
    if (window.location.search) {
      let params = qs.parse(window.location.search.substring(1));
      const sortParam = sortValue.find((item) => item.sortProperty === params.sort);
      params = {
        ...params,
        sortType: sortParam,
        currentPage: params.page,
        searchValue: params.search,
      };
      delete params.sort;
      delete params.page;
      delete params.search;

      dispatch(setFilters(params));
      isSearch.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (!isSearch.current) {
      let catId = checkCategory(categories, categoryId);

      const params = {
        startProduct,
        limit,
        categoryId: catId,
        sort: sortType.sortProperty,
        search: searchValue ? searchValue : '',
      };
      dispatch(fetchProducts(params));
      dispatch(fetchProductsCount({ categoryId: catId, search: params.search }));
    }
    isSearch.current = false;
  }, [categoryId, currentPage, sortType, searchValue]);

  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        categoryId,
        page: currentPage,
        sort: sortType.sortProperty,
        search: searchValue,
      });
      // console.log('query:', queryString);
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, currentPage, sortType, searchValue]);

  return (
    <div className="content">
      <div className="container">
        <div className="content__top">
          <Categories
            categoryId={categoryId}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
          />
          <Sort sortType={sortType} setSortType={setSortType} />
        </div>
        {location.state === 'createdOrder' && (
          <div className="content__top">
            <h2 className="content__title-order">Заказ принят!</h2>
          </div>
        )}
        {location.state === 'sendEmail' && (
          <div className="content__top">
            <h2 className="content__title-order">На Ваш Email отправлено письмо !</h2>
          </div>
        )}
        <div className="content__top">
          {/* <h2 className="content__title">Все пиццы</h2> */}
          <Search />
        </div>
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
