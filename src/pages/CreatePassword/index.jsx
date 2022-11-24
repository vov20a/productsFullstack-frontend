import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUpdatePassword } from '../../redux/slices/authSlice';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './CreatePassword.module.scss';

const CreatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      password: 123456,
      confirm_password: 1234,
    },
    //valid after change somthing in form
    mode: 'onChange',
  });
  // const passPattern = document.querySelector('form input')?.value;
  let pass = document.querySelector('#pass')?.value;
  // let Cpass = document.querySelector('#cpass')?.value;

  // console.log(cpass?.match(new RegExp(`^${pass}$`)));
  const onSubmit = async (values) => {
    const params = window.localStorage.getItem('restoreEmail');
    const { email, date } = JSON.parse(params);

    const data = await dispatch(
      fetchUpdatePassword({ password: `${values.password}`, email: email, date: date }),
    );
    window.localStorage.removeItem('restoreEmail');
    // console.log('first', data);
    if (data.payload.message) {
      alert('Истекло время дествия ссылки');
      navigate('/login', { replace: true });
    }

    if (!data.payload) {
      alert('Не удалось перезаписать пароль!');
      navigate('/login', { replace: true });
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
      navigate('/login', { state: 'Password created' });
    }
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание нового пароля
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="pass"
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth
          type="password"
          autoComplete="current-password"
        />
        <TextField
          id="cpass"
          className={styles.field}
          label="Подтвердите пароль"
          error={Boolean(errors.confirm_password?.message)}
          helperText={errors.confirm_password?.message}
          {...register('confirm_password', {
            required: 'Нет совпадения',
            pattern: { value: new RegExp(`^${pass}$`), message: 'Неверный формат' },
          })}
          fullWidth
          type="password"
          autoComplete="current-password"
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Отправить
        </Button>
      </form>
    </Paper>
  );
};

export default CreatePassword;
