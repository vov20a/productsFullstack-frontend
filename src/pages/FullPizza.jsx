import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { typeValue } from '../components/PizzaBlock';
import { addItem } from '../redux/slices/cartSlice';
import { getCountByIdProduct } from '../utils/getCountByIdProduct';
import { Skeleton } from '../components/PizzaBlock/Skeleton';

function FullPizza() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pizza, setPizza] = React.useState({});
  const [sizeId, setSizeId] = React.useState(0);
  const [typeId, setTypeId] = React.useState(0);
  const { id } = useParams();
  const { items } = useSelector((state) => state.cart);

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setPizza(data);
        // console.log(data);
      } catch (e) {
        alert(e.message);
        navigate('/'); //return to home
      }
    }
    fetchPizza();
  }, []);

  if (!pizza.categoryId) {
    return (
      <div className="container" style={{ padding: 10 }}>
        <div className="pizza-block">
          <Skeleton />
        </div>
      </div>
    );
  }
  const clickAddItem = () => {
    const item = {
      _id: pizza._id,
      title: pizza.title,
      productUrl: pizza.productUrl,
      price: pizza.price,
      size: pizza.sizes[sizeId],
      type: typeValue[typeId],
    };
    dispatch(addItem(item));
  };
  const addedCount = getCountByIdProduct(items, pizza._id);
  // console.log(pizza);
  return (
    <div className="container" style={{ padding: 10 }}>
      <div className="pizza-block">
        <img
          className="pizza-block__image"
          src={process.env.REACT_APP_API_URL + '/uploads/' + pizza.productUrl}
          alt="Pizza"
        />
        <h4 className="pizza-block__title">{pizza.title}</h4>

        <div className="pizza-block__selector">
          <ul>
            {pizza.types.map((type) => (
              <li
                key={type}
                onClick={() => setTypeId(type)}
                className={
                  pizza.types[0] === 1
                    ? type === 1
                      ? 'active'
                      : ''
                    : type === typeId
                    ? 'active'
                    : ''
                }>
                {typeValue[type]}
              </li>
            ))}
          </ul>
          <ul>
            {pizza.sizes.map((size, index) => (
              <li
                key={size}
                onClick={() => setSizeId(index)}
                className={index === sizeId ? 'active' : ''}>
                {size} см.
              </li>
            ))}
          </ul>
        </div>
        <div className="pizza-block__bottom">
          <div className="pizza-block__price">от {pizza.price} ₽</div>
          <div onClick={clickAddItem} className="button button--outline button--add">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                fill="white"
              />
            </svg>
            <span>Добавить</span>
            {addedCount > 0 && <i>{addedCount}</i>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullPizza;
