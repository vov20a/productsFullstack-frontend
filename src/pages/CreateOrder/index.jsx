import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { selectIsAuth, dataUser } from '../../redux/slices/authSlice';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './CreateOrder.module.scss';
import { fetchOrder } from '../../redux/slices/ordersSlice';
import { clearItems } from '../../redux/slices/cartSlice';
import { createProductsHtmlTable } from '../../utils/createProductsHtml';

const CreateOrder = () => {
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector(dataUser);
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      phone: '',
    },
    //valid after change somthing in form
    mode: 'onChange',
  });

  const onSubmit = async (value) => {
    const productsHtml = createProductsHtmlTable(items, totalPrice);
    const params = {
      products: items,
      totalPrice,
      fullName: user.fullName,
      email: user.email,
      phone: value.phone,
      message: `<h2>Hello ${user.fullName}</h2>
                   ${productsHtml}`,
    };
    // console.log(params);
    const data = await dispatch(fetchOrder(params));
    if (!data.payload) {
      return alert('Не удалось создать заказ');
    } else {
      dispatch(clearItems());
      navigate('/', { state: 'createdOrder' });
    }
  };

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  const goBack = () => {
    navigate(-1);
  };

  // const mail = <OrderMail fullName={user.fullName} products={items} totalPrice={totalPrice} />;
  // console.log(mail);

  return (
    <div className="content">
      <div className="container">
        <Paper classes={{ root: styles.root }}>
          <Typography classes={{ root: styles.title }} variant="h5">
            Заказ
          </Typography>
          <Typography classes={{ root: styles.order }} variant="h5">
            Закзчик: <span style={{ color: 'teal' }}>{user.fullName}</span>
          </Typography>
          <Typography classes={{ root: styles.order }} variant="h5">
            EMail: <span style={{ color: 'teal' }}>{user.email}</span>
          </Typography>
          <Typography classes={{ root: styles.order }} variant="h5">
            Общая сумма: <span style={{ color: 'teal' }}>{totalPrice} ₽</span>
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              error={Boolean(errors.phone?.message)}
              helperText={errors.phone?.message}
              {...register('phone', {
                required: 'Укажите телефон',
                // minLength: { value: 9, message: 'Min length 9' },
                pattern: {
                  value: /^(\+7|8)( |-)?\d{3}( |-)?\d{3}( |-)?\d{2}( |-)?\d{2}$/,
                  message: 'Неверный формат',
                },
              })}
              type="text"
              className={styles.field}
              label="Введите номер телефона"
              fullWidth
            />

            <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
              Отправить
            </Button>
          </form>
        </Paper>{' '}
        <div
          onClick={goBack}
          className="button button--outline button--add go-back-btn"
          style={{ marginLeft: 100 }}>
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 13L1 6.93015L6.86175 1"
              stroke="#D3D3D3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Вернуться назад</span>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
