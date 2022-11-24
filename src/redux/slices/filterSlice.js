import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 1,
  categoryId: 0,
  sortType: { name: 'популярности', sortProperty: 'rating' },
  searchValue: '',
};
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    setSortType(state, action) {
      state.sortType = action.payload;
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setFilters(state, action) {
      state.categoryId = Number(action.payload.categoryId);
      state.currentPage = Number(action.payload.currentPage);
      state.sortType = action.payload.sortType;
      state.searchValue = action.payload.searchValue;
    },
  },
});

export const { setCurrentPage, setCategoryId, setSortType, setSearchValue, setFilters } =
  filterSlice.actions;
export const filterReducer = filterSlice.reducer;
