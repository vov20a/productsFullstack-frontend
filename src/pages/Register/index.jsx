import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { dataStatus, fetchRegister, selectIsAuth } from '../../redux/slices/authSlice';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Register.module.scss';

const Register = () => {
  const isAuth = useSelector(selectIsAuth);
  const loginStatus = useSelector(dataStatus);
  const errorLogin = loginStatus === 'error';
  const dispatch = useDispatch();
  // const [isAvatarLoad, setAvatarLoad] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: 'petr@mail.ru',
      password: 1234,
      avatarUrl: '',
    },
    //valid after change somthing in form
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    if (values.avatarUrl === '') {
      delete values.avatarUrl;
    }

    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return; //alert('Не удалось авторизоваться');
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      {errorLogin && (
        <Typography classes={{ root: styles.error }} variant="h5">
          Не удалось зарегистрироваться!
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="FullName"
          error={Boolean(errors?.fullName?.message)}
          helperText={errors?.fullName?.message}
          {...register('fullName', {
            required: 'Укажите имя',
            minLength: { value: 3, message: 'Min length 3' },
          })}
          fullWidth
          type="text"
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Укажите почту',
            pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Неверный формат' },
          })}
          fullWidth
          type="email"
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'Укажите пароль',
            minLength: { value: 6, message: 'Min length 6' },
          })}
          fullWidth
        />

        <TextField
          className={styles.field}
          label="Аватар (https)"
          error={Boolean(errors.avatarUrl?.message)}
          helperText={errors.avatarUrl?.message}
          {...register('avatarUrl', {
            required: false,
            pattern: { value: /^https?:\/\/(?!.*:\/\/)\S+/, message: 'Неверный формат' },
          })}
          fullWidth
        />

        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Создать
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
