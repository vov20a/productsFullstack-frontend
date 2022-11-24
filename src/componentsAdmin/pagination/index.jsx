import React from 'react';
import { getPageArray } from '../../utils/pagesCount';
import classes from './Pagination.module.css';

const Pagination = ({ pageCount, page, changePage }) => {
  const pageArray = getPageArray(pageCount);
  const currentPage = [];
  currentPage.push(classes.page);
  currentPage.push(classes.page__current);

  return (
    <div className={classes.page__wrapper}>
      {pageArray.map((p) => (
        <span
          onClick={() => changePage(p)}
          key={p}
          className={p === page ? currentPage.join(' ') : classes.page}>
          {p}
        </span>
      ))}
    </div>
  );
};
export default Pagination;
