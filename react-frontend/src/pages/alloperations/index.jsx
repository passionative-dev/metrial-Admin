import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField as Input,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import Widget from '../../components/Widget';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const initialProduct = {
  title: '',
  product_keyword: '',
  brand: -1,
  country: -1,
  category: 0,
  state: -1,
};

function AllOperations() {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [brands, setBrands] = useState([]);
  const [operations, setOperations] = useState([]);
  const [products, setProducts] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [form, setForm] = useState(initialProduct);

  const editProduct = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    async function loadData() {
      setCategories((await axios.get('/category')).data);
      let res = await axios.get('/country');
      setCountries(res.data.filter((country) => country.parent === -1));
      setStates(res.data.filter((country) => country.parent !== -1));
      res = await axios.get('/brand');
      setBrands(res.data);
      res = await axios.get('/products');
      setProducts(res.data);
      res = await axios.get('/operation');
      setOperations(res.data);
    }
    loadData();
  }, []); //eslint-disable-line

  useEffect(() => {
    let result = operations;
    result = result.map((row) => {
      const prod = products.find((product) => product.title === row.output7);
      if (prod) {
        return {
          ...row,
          ...prod,
        };
      }
      return {
        ...row,
        title: row.output7,
      };
    });

    if (form.category > 0)
      result = result.filter((product) => product.cat_1 === form.category);
    if (form.brand > 0)
      result = result.filter((product) => product.brand === form.brand);
    if (form.country > 0)
      result = result.filter((product) => product.country === form.country);
    if (form.state > 0)
      result = result.filter((product) => product.state === form.state);
    if (form.product_keyword.length > 0)
      result = result.filter((product) =>
        product.title.includes(form.product_keyword),
      );

    result = result.map((row) => {
      let op = operations.find((op) => op.output7 === row.title);
      if (op) {
        row = {
          ...row,
          Param1: op.output1,
          Param2: op.output2,
          Param3: op.output3,
          Param4: op.output4,
          Param5: op.output5,
          Param6: op.output6,
        };
        console.log(row)
      }
      return row;
    });

    setTableData(result);
  }, [form, products, operations]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget title='All Operations' disableWidgetMenu>
          <Box
            display='flex'
            alignItems={'center'}
            justifyContent='space-between'
          >
            <FormControl sx={{ m: 1, minWidth: 180 }}>
              <InputLabel>Category</InputLabel>
              <Select
                label='Category'
                name='category'
                value={form.category}
                onChange={editProduct}
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
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 180 }}>
              <Input
                label='Product Search'
                name='product_keyword'
                value={form.product_keyword}
                onChange={editProduct}
              ></Input>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 180 }}>
              <Input label='Parameter'></Input>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 180 }}>
              <InputLabel>Brand</InputLabel>
              <Select
                name='brand'
                label='Brand'
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
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 180 }}>
              <InputLabel>Country</InputLabel>
              <Select
                label='Country'
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
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 180 }}>
              <InputLabel>State/Region</InputLabel>
              <Select
                label='State/Region'
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
                  .filter((state) => state.parent === form.country)
                  .map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          <MUIDataTable
            title='View Result'
            data={tableData}
            columns={[
              'title',
              'category',
              'brand',
              'country',
              'Param1',
              'Param2',
              'Param3',
              'Param4',
              'Param5',
              'Param6',
            ]}
            options={{
              filterType: 'checkbox',
            }}
          ></MUIDataTable>
          {/* <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Brand</StyledTableCell>
                  <StyledTableCell>Country</StyledTableCell>
                  <StyledTableCell align='right'>Param1</StyledTableCell>
                  <StyledTableCell align='right'>Param2</StyledTableCell>
                  <StyledTableCell align='right'>Param3</StyledTableCell>
                  <StyledTableCell align='right'>Param4</StyledTableCell>
                  <StyledTableCell align='right'>Param5</StyledTableCell>
                  <StyledTableCell align='right'>Param6</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.length === 0 && (
                  <StyledTableRow>
                    <StyledTableCell component='td' scope='row' colSpan={10}>
                      No data to show
                    </StyledTableCell>
                  </StyledTableRow>
                )}
                {tableData.map((row) => (
                  <StyledTableRow key={row.title}>
                    <StyledTableCell component='td' scope='row'>
                      {row.title}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row'>
                      {
                        categories.find((category) => category.id === row.cat_1)
                          ?.title
                      }
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row'>
                      {brands.find((brand) => brand.id === row.brand)?.title}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row'>
                      {
                        countries.find((country) => country.id === row.country)
                          ?.title
                      }
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.output1}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.output2}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.output3}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.output4}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.output5}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.output6}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {/* {rows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component='th' scope='row'>
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {row.calories}
                    </StyledTableCell>
                    <StyledTableCell align='right'>{row.fat}</StyledTableCell>
                    <StyledTableCell align='right'>{row.carbs}</StyledTableCell>
                    <StyledTableCell align='right'>
                      {row.protein}
                    </StyledTableCell>
                  </StyledTableRow>
                ))} */}
              {/* </TableBody>
            </Table>
          </TableContainer> */}
        </Widget>
      </Grid>
    </Grid>
  );
}

export default AllOperations;
