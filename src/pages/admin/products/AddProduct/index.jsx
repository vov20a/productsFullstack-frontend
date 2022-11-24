import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import styles from './AddProduct.module.scss';
import axios from '../../../../axios';

const typeValues = ['тонкое', 'традиционное'];
const sizeValues = ['26', '30', '40'];

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = window.localStorage.getItem('categories');
  const categoriesArr = JSON.parse(categories);

  const [title, setTitle] = React.useState('');
  const [types, setTypes] = React.useState([]);
  const [sizes, setSizes] = React.useState([]);
  const [price, setPrice] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const [category, setCategory] = React.useState('');
  const [productUrl, setProductUrl] = React.useState('');

  const inputFileRef = React.useRef();
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      // console.log(data.URL);
      setProductUrl(data.URL);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла');
    }
  };
  const onClickRemoveImage = () => {
    setProductUrl('');
  };

  const isEditting = Boolean(id);

  const AddProduct = React.useRef(false);
  if (location.pathname === '/admin/add-product') {
    AddProduct.current = true;
  }

  React.useEffect(() => {
    if (AddProduct.current) {
      setTitle('');
      setTypes([]);
      setSizes([]);
      setPrice(0);
      setRating(0);
      setCategory('');
      setProductUrl('');
      AddProduct.current = false;
    }
  }, [AddProduct.current]);

  React.useEffect(() => {
    let arrTypes = [];
    if (id) {
      axios
        .get(`/products/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          for (let i = 0; i < data.types.length; i++) {
            arrTypes[i] = data.types[i] > -1 ? typeValues[data.types[i]] : '';
          }
          setTypes(arrTypes);
          setSizes(data.sizes);
          setPrice(data.price);
          setRating(data.rating);
          setCategory(data.categoryId.title);
          setProductUrl(data.productUrl);
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении product');
        });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      title: '',
      types: [],
      sizes: [],
      price: 0,
      rating: 0,
      category: '',
      // productUrl: '',
    },
    //valid after change somthing in form
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    // if (values.productUrl === '') {
    //   delete values.productUrl;
    // }
    for (let i = 0; i < values.types.length; i++) {
      values.types[i] = i;
    }

    const categoryObj = categoriesArr.find(
      (category) => category.title.toLowerCase() === values.category.toLowerCase(),
    );

    const params = {
      ...values,
      categoryId: categoryObj._id,
      productUrl: isEditting ? productUrl : 'http://localhost:4444' + productUrl,
    };

    isEditting
      ? axios
          .patch(`/products/${id}`, params)
          .then(() => {
            navigate('/admin/all-products', { state: 'Product editted!' });
          })
          .catch((err) => {
            console.warn(err);
            alert('Ошибка при редактировании product');
          })
      : axios
          .post('/products', params)
          .then(() => {
            navigate('/admin/all-products', { state: 'Product created!' });
          })
          .catch((err) => {
            console.warn(err);
            alert('Ошибка при создании product');
          });
  };

  return (
    <Grid item xs={12} md={9} sx={{ border: '2px solid teal' }}>
      <Paper classes={{ root: styles.root }}>
        <Typography classes={{ root: styles.title }} variant="h5">
          {isEditting ? 'Edit product' : 'Create product'}
        </Typography>
        {/* {errorLogin && (
          <Typography classes={{ root: styles.error }} variant="h5">
            Не удалось зарегистрироваться!
          </Typography>
        )} */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            className={styles.field}
            label="Title"
            value={title}
            error={Boolean(errors?.title?.message)}
            helperText={errors?.title?.message}
            {...register('title', {
              onChange: (e) => setTitle(e.target.value),
              required: 'Укажите название',
              minLength: { value: 3, message: 'Min length 3' },
            })}
            fullWidth
            type="text"
            autoComplete="current-fullName"
          />

          <FormControl sx={{ mb: 2, width: '100%' }}>
            <InputLabel id="demo-multiple-checkbox-label">Выберите тип</InputLabel>
            <Select
              multiple
              value={types}
              input={<OutlinedInput label="Выберите тип" />}
              renderValue={(selected) => selected.join(', ')}
              {...register('types', {
                onChange: (e) => setTypes(e.target.value),
                required: 'Выберите тип',
              })}>
              {typeValues.map((type) => (
                <MenuItem key={type} value={type} sx={{ width: 200 }}>
                  <Checkbox checked={types.indexOf(type) > -1} />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ mb: 2, width: '100%' }}>
            <InputLabel id="demo-multiple-checkbox-label">Выберите размер</InputLabel>
            <Select
              multiple
              value={sizes}
              input={<OutlinedInput label="Выберите размер" />}
              renderValue={(selected) => selected.join(', ')}
              {...register('sizes', {
                onChange: (e) => setSizes(e.target.value),
                required: 'Выберите размер',
              })}>
              {sizeValues.map((size) => (
                <MenuItem key={size} value={size} sx={{ width: 200 }}>
                  <Checkbox checked={sizes.indexOf(size) > -1} />
                  <ListItemText primary={size} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            className={styles.field}
            label="Price"
            error={Boolean(errors.price?.message)}
            helperText={errors.price?.message}
            value={price}
            {...register('price', {
              onChange: (e) => setPrice(e.target.value),
              required: 'Укажите цену',
              max: 1000,
            })}
            fullWidth
            type="number"
            autoComplete="current-price"
          />
          <TextField
            className={styles.field}
            label="Rating"
            error={Boolean(errors.rating?.message)}
            helperText={errors.rating?.message}
            value={rating}
            {...register('rating', {
              onChange: (e) => setRating(e.target.value),
              required: 'Укажите райтинг',
              max: 10,
            })}
            fullWidth
            type="number"
            autoComplete="current-rating"
          />
          <TextField
            sx={{ marginBottom: '15px' }}
            id="standard-select-category"
            select
            label="Выберите категорию"
            value={category}
            error={Boolean(errors.category?.message)}
            helperText={errors.category?.message}
            {...register('category', {
              onChange: (e) => setCategory(e.target.value),
              required: 'choose the category',
            })}
            fullWidth>
            {categoriesArr.map((category) => (
              <MenuItem key={category._id} value={category.title}>
                {category.title}
              </MenuItem>
            ))}
          </TextField>
          <div style={{ width: '100%', border: '1px solid #ccc' }}>
            <Button
              onClick={() => inputFileRef.current.click()}
              fullWidth
              style={{
                color: '#999',
                display: 'flex',
                justifyContent: 'flex-start',
              }}>
              Загрузить каритинку
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
            {productUrl && (
              <Grid container direction="row">
                <Grid item md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <img
                    style={{ width: 70, height: 70, alignItems: 'flex-end' }}
                    src={productUrl}
                    alt="Uploaded"
                  />
                </Grid>
                <Grid item md={2}>
                  <CancelOutlinedIcon
                    sx={{ color: 'red', cursor: 'pointer', alignItems: 'flex-start' }}
                    onClick={onClickRemoveImage}
                  />
                </Grid>
              </Grid>
            )}
          </div>
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

export default AddProduct;
