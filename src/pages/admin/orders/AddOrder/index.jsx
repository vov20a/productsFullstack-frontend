import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  Checkbox,
  OutlinedInput,
  ListItemText,
  FormControl,
  InputLabel,
} from '@mui/material';
import styles from './AddOrder.module.scss';
import axios from '../../../../axios';

const typeValues = ['тонкое', 'традиционное'];

const AddOrder = () => {
  const navigate = useNavigate();

  // const categories = window.localStorage.getItem('categories');
  // const categoriesArr = JSON.parse(categories);

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState();
  const [products, setProducts] = React.useState([]);
  const [productsArr, setProductsArr] = React.useState([]);

  React.useEffect(() => {
    axios
      .get('/products')
      .then(({ data }) => {
        setProductsArr(data);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении продуктов');
      });
    setFullName('');
    setEmail('');
    setPhone();
    setProducts([]);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: null,
      products: [],
    },
    //valid after change somthing in form
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const fakeProducts = [];
    values.products.forEach((item) => {
      let obj = { ...item, size: item.sizes[0], type: typeValues[0] };
      delete obj.sizes;
      delete obj.types;
      fakeProducts.push(obj);
    });
    let totalPrice = 0;
    fakeProducts.forEach((item) => {
      totalPrice += item.price;
    });
    const params = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      products: fakeProducts,
      totalPrice,
    };

    axios
      .post('/orders', params)
      .then(() => {
        navigate('/admin/all-orders', { state: 'Order created!' });
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при создании order');
      });
  };

  return (
    <Grid item xs={12} md={9} sx={{ border: '2px solid teal' }}>
      <Paper classes={{ root: styles.root }}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Create order.
        </Typography>

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
            // autoComplete="current-fullName"
          />
          <TextField
            className={styles.field}
            label="Email"
            error={Boolean(errors.email?.message)}
            helperText={errors.email?.message}
            value={email}
            {...register('email', {
              onChange: (e) => setEmail(e.target.value),
              required: 'Укажите email',
              pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Неверный формат' },
            })}
            fullWidth
            type="email"
            // autoComplete="current-Email"
          />
          <TextField
            className={styles.field}
            label="Введите номер телефона"
            value={phone}
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
            type="tel"
            fullWidth
          />

          <FormControl sx={{ mb: 2, width: '100%' }}>
            <InputLabel id="demo-multiple-checkbox-label">Выберите products</InputLabel>
            <Select
              multiple
              value={products}
              input={<OutlinedInput label="Выберите products" />}
              renderValue={(selected) => {
                const arr = [];
                selected.forEach((item) => {
                  arr.push(item.title);
                });
                return arr.join(', ');
              }}
              {...register('products', {
                onChange: (e) => setProducts(e.target.value),
                required: 'Выберите products',
              })}>
              {productsArr.map((product) => (
                <MenuItem key={product._id} value={product} sx={{ width: 200 }}>
                  <Checkbox checked={products.indexOf(product) > -1} />
                  <ListItemText primary={product.title} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            className={styles.button}
            disabled={!isValid}
            type="submit"
            size="large"
            variant="contained"
            fullWidth>
            Создать
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default AddOrder;
