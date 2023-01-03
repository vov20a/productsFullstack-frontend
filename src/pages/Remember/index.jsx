import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchRestorePassword } from '../../redux/slices/authSlice';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Remember.module.scss';

const Remember = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
    },
    //valid after change somthing in form
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRestorePassword(values));

    if (!data.payload) {
      alert('С этим email нет пользователя');
      return <Navigate to="/login" />;
    }
    // console.log('pass', data.payload);
    const date = Date.now();
    const params = { email: data.payload, date: date };
    window.localStorage.setItem('restoreEmail', JSON.stringify(params));

    navigate('/', { state: 'sendEmail' });
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Восстановление пароля
      </Typography>
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
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Отправить email
        </Button>
      </form>
      {/* <Link to="/remember">
        <Typography classes={{ root: styles.error }} variant="h5">
          Remember my password!
        </Typography>
      </Link> */}
    </Paper>
  );
};

export default Remember;
