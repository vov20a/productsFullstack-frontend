import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { dataStatus, fetchAuth, selectIsAuth } from '../../redux/slices/authSlice';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';

const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const loginStatus = useSelector(dataStatus);
  const errorLogin = loginStatus === 'error';
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: 'petr@mail.ru',
      password: '123456',
    },
    //valid after change somthing in form
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    // console.log(values);
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return; //alert('Не удалось авторизоваться');
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  const isCreatedPassword = Boolean(location.state === 'Password created');

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      {isCreatedPassword && (
        <Typography classes={{ root: styles.success }} variant="h5">
          Пароль создан. Войдите в аккаунт!
        </Typography>
      )}
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      {errorLogin && (
        <Typography classes={{ root: styles.error }} variant="h5">
          Неверный логин или пароль!
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Укажите почту',
            pattern: { value: /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/, message: 'Неверный формат' },
          })}
          fullWidth
          type="email"
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth
          type="password"
          autoComplete="current-password"
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
      <Link to="/remember">
        <Typography classes={{ root: styles.error }} variant="h5">
          Remember my password!
        </Typography>
      </Link>
    </Paper>
  );
};

export default Login;
