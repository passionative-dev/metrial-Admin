import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField as Input,
  Tabs,
  Button,
  Tab,
} from '@mui/material';
import TabPanel from '../../components/TabPanel';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

//context
import {
  getProductsRequest,
  useProductsState,
  updateProduct,
  createProduct,
} from '../../context/ProductContext';

//components
import Widget from '../../components/Widget';
import { Typography } from '../../components/Wrappers';

const initialProduct = {
  title: '',
  subtitle: '',
  price: 0.1,
  brand: -1,
  available: false,
  date_published: '',
  cat_1: 0,
  cat_2: 0,
  cat_3: 0,
  country: -1,
  state: -1,
  rating: 5,
  description_1: '',
  description_2: '',
  code: '',
  hashtag: '',
  discount: 0,
  extraValues: {},
};

const CreateProduct = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const { productId } = useParams();
  const context = useProductsState();

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [extraFields, setExtraFields] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(initialProduct);

  const getId = useCallback(
    (productId) => {
      return context.products.products.findIndex((c) => {
        return c.id == productId; // eslint-disable-line
      });
    },
    [context.products.products],
  );

  useEffect(() => {
    if (productId && context.products.products[getId(productId)])
      setForm(context.products.products[getId(productId)]);
  }, [context]); // eslint-disable-line

  useEffect(() => {
    async function loadData() {
      setCategories((await axios.get('/category')).data);
      let res = await axios.get('/country');
      setCountries(res.data.filter((country) => country.parent === -1));
      setStates(res.data.filter((country) => country.parent !== -1));

      res = await axios.get('/extra_fields');
      setExtraFields(res.data);

      res = await axios.get('/brand');
      setBrands(res.data);

      getProductsRequest(context.setProducts);
    }
    loadData();
  }, []); //eslint-disable-line

  const history = useHistory();

  const editProduct = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getEditProduct = () => {
    updateProduct(form, context.setProducts, history);
  };

  const createNewProduct = () => {
    createProduct(form, context.setProducts, history);
  };

  const isCreateProduct =
    window.location.hash === '#/app/ecommerce/management/create';

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Widget
            title={isCreateProduct ? 'New Product' : 'Edit Product'}
            disableWidgetMenu
          >
            {!context.products.isLoaded ? (
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <CircularProgress size={26} />
              </Box>
            ) : (
              <Box>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Tabs
                    value={tabIndex}
                    onChange={(e, index) => setTabIndex(index)}
                    aria-label='basic tabs example'
                  >
                    <Tab label='Product Detail' value={0} />
                    <Tab label='Extra Fields' value={1} />
                  </Tabs>
                  <Box display={'flex'} alignItems={'center'}>
                    <Button
                      variant={'contained'}
                      color={'success'}
                      style={{ marginRight: 8 }}
                      onClick={() =>
                        isCreateProduct ? createNewProduct() : getEditProduct()
                      }
                    >
                      {isCreateProduct ? 'Save' : 'Edit'}
                    </Button>
                    <Button
                      variant={'contained'}
                      onClick={() => history.push('/app/ecommerce/management')}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                  <Box display={'flex'} flexDirection='column'>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box width={150}>
                        <Typography variant={'h6'}>Title</Typography>
                      </Box>
                      <Box width={500}>
                        <Input
                          name='title'
                          margin='normal'
                          variant='outlined'
                          value={form.title}
                          fullWidth
                          onChange={(e) => editProduct(e)}
                        />
                      </Box>
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box width={150}>
                        <Typography variant={'h6'}>Subtitle</Typography>
                      </Box>
                      <Box width={500}>
                        <Input
                          name='subtitle'
                          margin='normal'
                          variant='outlined'
                          value={form.subtitle}
                          fullWidth
                          onChange={(e) => editProduct(e)}
                        />
                      </Box>
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box width={150}>
                        <Typography variant={'h6'}>Item Description</Typography>
                      </Box>
                      <Box width={500}>
                        <Input
                          name='description_1'
                          margin='normal'
                          variant='outlined'
                          multiline
                          value={form['description_1']}
                          fullWidth
                          onChange={(e) => editProduct(e)}
                        />
                      </Box>
                    </Box>
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      sx={{ marginTop: 1 }}
                    >
                      <Box width={150}>
                        <Typography variant={'h6'}>Category</Typography>
                      </Box>
                      <Box width={300}>
                        <Select
                          name='cat_1'
                          style={{ minWidth: '290px' }}
                          value={form.cat_1}
                          onChange={(e) => editProduct(e)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value='0'>- None -</MenuItem>
                          {categories
                            .filter((category) => category.parent === -1)
                            .map((item, index) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.title}
                              </MenuItem>
                            ))}
                        </Select>
                      </Box>
                      <Box width={300}>
                        <Select
                          name='cat_2'
                          style={{ minWidth: '290px' }}
                          value={form.cat_2}
                          onChange={(e) => editProduct(e)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value='0'>- None -</MenuItem>
                          {categories
                            .filter(
                              (category) => category.parent === form.cat_1,
                            )
                            .map((item, index) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.title}
                              </MenuItem>
                            ))}
                        </Select>
                      </Box>
                      <Box width={300}>
                        <Select
                          name='cat_3'
                          style={{ minWidth: '290px' }}
                          value={form.cat_3}
                          onChange={(e) => editProduct(e)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value='0'>- None -</MenuItem>
                          {categories
                            .filter(
                              (category) => category.parent === form.cat_2,
                            )
                            .map((item, index) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.title}
                              </MenuItem>
                            ))}
                        </Select>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      sx={{ marginTop: 2 }}
                    >
                      <Box width={150}>
                        <Typography variant={'h6'}>Brand</Typography>
                      </Box>
                      <Box width={300}>
                        <Select
                          name='brand'
                          style={{ minWidth: '300px' }}
                          value={form.brand}
                          onChange={(e) => editProduct(e)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value='-1'>- None -</MenuItem>
                          {brands.map((item, index) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      sx={{ marginTop: 2 }}
                    >
                      <Box width={150}>
                        <Typography variant={'h6'}>Country</Typography>
                      </Box>
                      <Box width={300}>
                        <Select
                          style={{ minWidth: '300px' }}
                          value={form.country}
                          onChange={(e) => {
                            setForm({
                              ...form,
                              country: e.target.value,
                              state: -1,
                            });
                          }}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value='-1'>- None -</MenuItem>
                          {countries.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              {item.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      {states.filter((state) => state.parent === form.country)
                        .length > 0 && (
                        <>
                          <Box width={150}>
                            <Typography
                              variant={'h6'}
                              style={{ textAlign: 'center' }}
                            >
                              State/Region
                            </Typography>
                          </Box>
                          <Box width={300}>
                            <Select
                              style={{ minWidth: '300px' }}
                              value={form.state}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  state: e.target.value,
                                });
                              }}
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              <MenuItem value='-1'>- None -</MenuItem>
                              {states
                                .filter(
                                  (state) => state.parent === form.country,
                                )
                                .map((item, index) => (
                                  <MenuItem key={index} value={item.id}>
                                    {item.title}
                                  </MenuItem>
                                ))}
                            </Select>
                          </Box>
                        </>
                      )}
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box width={150}>
                        <Typography variant={'h6'}>Price</Typography>
                      </Box>
                      <Box width={300}>
                        <Input
                          name='price'
                          margin='normal'
                          variant='outlined'
                          value={form.price}
                          type={'number'}
                          fullWidth
                          onChange={(e) => editProduct(e)}
                        />
                      </Box>
                      <Box width={150}>
                        <Typography
                          variant={'h6'}
                          style={{ textAlign: 'center' }}
                        >
                          Discount
                        </Typography>
                      </Box>
                      <Box width={300}>
                        <Input
                          name='discount'
                          margin='normal'
                          variant='outlined'
                          value={form.discount}
                          type={'number'}
                          fullWidth
                          onChange={(e) => editProduct(e)}
                        />
                      </Box>
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box width={150}>
                        <Typography variant={'h6'}>Description 2</Typography>
                      </Box>
                      <Box width={500}>
                        <Input
                          name='description_2'
                          margin='normal'
                          variant='outlined'
                          multiline
                          value={form['description_2']}
                          fullWidth
                          onChange={(e) => editProduct(e)}
                        />
                      </Box>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box display={'flex'} alignItems={'center'}>
                          <Box width={150}>
                            <Typography variant={'h6'}>Code</Typography>
                          </Box>
                          <Box flex={1}>
                            <Input
                              name='code'
                              margin='normal'
                              variant='outlined'
                              value={form.code}
                              fullWidth
                              onChange={(e) => editProduct(e)}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box display={'flex'} alignItems={'center'}>
                          <Box width={150}>
                            <Typography variant={'h6'}>Hashtag</Typography>
                          </Box>
                          <Box flex={1}>
                            <Input
                              name='hashtag'
                              margin='normal'
                              variant='outlined'
                              value={form.hashtag}
                              fullWidth
                              onChange={(e) => editProduct(e)}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box display={'flex'} alignItems={'center'}>
                          <Box width={150}>
                            <Typography variant={'h6'}>Rating</Typography>
                          </Box>
                          <Box flex={1}>
                            <Input
                              name='rating'
                              margin='normal'
                              variant='outlined'
                              type={'number'}
                              value={form.rating}
                              fullWidth
                              onChange={(e) => editProduct(e)}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box width={150}>
                      <Typography variant={'h6'}>Avaliable</Typography>
                    </Box>
                    <Box width={300}>
                      <Select
                        style={{ minWidth: 300 }}
                        name='available'
                        value={form.available}
                        onChange={(e) => editProduct(e)}
                      >
                        <MenuItem value={false}> False </MenuItem>
                        <MenuItem value={true}> True </MenuItem>
                      </Select>
                    </Box>
                    <Box width={150}>
                      <Typography
                        variant={'h6'}
                        style={{ textAlign: 'center' }}
                      >
                        Date Published
                      </Typography>
                    </Box>
                    <Box width={300}>
                      <Input
                        name='date_published'
                        margin='normal'
                        variant='outlined'
                        value={form.date_published}
                        fullWidth
                        onChange={(e) => editProduct(e)}
                      />
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <Box
                    display={'flex'}
                    flexDirection='column'
                    sx={{ padding: 2 }}
                  >
                    {extraFields
                      .filter((field) => field.id === form.cat_1)
                      .map((field) => (
                        <Box display='flex' alignItems='center' key={field.id}>
                          <Typography style={{ width: 200 }} variant='h6'>
                            {field.name}
                          </Typography>
                          {field.type === 1 && (
                            <Input
                              style={{ minWidth: 200 }}
                              value={form.extraValues[field.name]}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  extraValues: {
                                    ...form.extraValues,
                                    [field.name]: e.target.value,
                                  },
                                });
                              }}
                            ></Input>
                          )}
                          {field.type === 2 && (
                            <Select
                              style={{ minWidth: 200 }}
                              value={form.extraValues[field.name] || ''}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  extraValues: {
                                    ...form.extraValues,
                                    [field.name]: e.target.value,
                                  },
                                });
                              }}
                            >
                              <MenuItem value=''>- None -</MenuItem>
                              {field.defaultValues.map((item, index) => (
                                <MenuItem key={index} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        </Box>
                      ))}
                  </Box>
                </TabPanel>
              </Box>
            )}
          </Widget>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateProduct;
