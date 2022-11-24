import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Grid, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';

import styles from './AddUser.module.scss';
import axios from '../../../../axios';

const roles = [
  { name: 'ADMIN', value: 'admin' },
  { name: 'USER', value: 'user' },
];

const AddUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [role, setRole] = React.useState('');

  const isEditting = Boolean(id);

  const AddUser = React.useRef(false);
  if (location.pathname === '/admin/add-user') {
    AddUser.current = true;
  }
  // React.useEffect(() => {}, [email]);

  React.useEffect(() => {
    if (AddUser.current) {
      setFullName('');
      setEmail('');
      setPassword('');
      setAvatarUrl('');
      setRole('');
      AddUser.current = false;
    }
  }, [AddUser.current]);

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/auth/user/${id}`)
        .then(({ data }) => {
          setFullName(data.fullName);
          setEmail(data.email);
          setPassword('');
          setAvatarUrl(data.avatarUrl);
          setRole(data.role);
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении user');
        });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: fullName,
      email: email,
      password: '',
      avatarUrl: avatarUrl,
      role: role,
    },
    //valid after change somthing in form
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    if (values.avatarUrl === '') {
      delete values.avatarUrl;
    }
    isEditting
      ? axios
          .patch(`/auth/edit/${id}`, values)
          .then(() => {
            navigate('/admin/all-users', { state: 'User editted!' });
          })
          .catch((err) => {
            console.warn(err);
            alert('Ошибка при редактировании user');
          })
      : axios
          .post('/auth/create', values)
          .then(() => {
            navigate('/admin/all-users', { state: 'User created!' });
          })
          .catch((err) => {
            console.warn(err);
            alert('Ошибка при создании user');
          });
  };

  // console.log('render');
  return (
    <Grid item xs={12} md={9} sx={{ border: '2px solid teal' }}>
      <Paper classes={{ root: styles.root }}>
        <Typography classes={{ root: styles.title }} variant="h5">
          {isEditting ? 'Edit user' : 'Create user'}
        </Typography>
        {/* {errorLogin && (
          <Typography classes={{ root: styles.error }} variant="h5">
            Не удалось зарегистрироваться!
          </Typography>
        )} */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            className={styles.field}
            label="FullName"
            value={fullName}
            error={Boolean(errors?.fullName?.message)}
            helperText={errors?.fullName?.message}
            {...register('fullName', {
              onChange: (e) => setFullName(e.target.value),
              required: 'Укажите имя',
              minLength: { value: 3, message: 'Min length 3' },
            })}
            fullWidth
            type="text"
            autoComplete="current-fullName"
          />
          <TextField
            className={styles.field}
            label="E-Mail"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            value={email}
            {...register('email', {
              onChange: (e) => setEmail(e.target.value),
              required: 'Укажите почту',
              pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Неверный формат' },
            })}
            fullWidth
            type="email"
            autoComplete="current-email"
          />
          <TextField
            className={styles.field}
            label="Пароль"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            value={password}
            {...register('password', {
              onChange: (e) => setPassword(e.target.value),
              required: 'Укажите пароль',
              minLength: { value: 6, message: 'Min length 6' },
            })}
            fullWidth
            type="password"
            autoComplete="current-password"
          />

          <TextField
            className={styles.field}
            label="Аватар (https)"
            error={Boolean(errors.avatarUrl?.message)}
            helperText={errors.avatarUrl?.message}
            value={avatarUrl}
            {...register('avatarUrl', {
              onChange: (e) => setAvatarUrl(e.target.value),
              required: false,
              pattern: { value: /^https?:\/\/(?!.*:\/\/)\S+/, message: 'Неверный формат' },
            })}
            fullWidth
          />
          <TextField
            id="standard-select-currency"
            select
            label="Выберите роль"
            value={role}
            error={Boolean(errors.role?.message)}
            helperText={errors.role?.message}
            {...register('role', {
              onChange: (e) => setRole(e.target.value),
              required: 'user or admin',
            })}
            fullWidth>
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            className={styles.button}
            disabled={!isValid}
            type="submit"
            size="large"
            variant="contained"
            fullWidth>
            {isEditting ? 'Сохранить' : 'Создать'}
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default AddUser;
