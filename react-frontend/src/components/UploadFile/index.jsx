import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import FileUpload from 'react-material-file-upload';
import {
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  LinearProgress,
  Typography,
  Snackbar,
  Alert as MuiAlert,
  TextField,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  OutlinedInput,
} from '@mui/material';
import Widget from '../../components/Widget';

import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import './style.css';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import toast from '../../libs/toast';
import { filter } from 'lodash';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

const UploadFile = () => {
  const [file, setFile] = useState([]);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState(0);
  const [percent, setPercent] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError1, setIsError1] = useState(false);
  const [isError2, setIsError2] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = React.useState({ catId: 1, param1: 0.1, param2: 10 });

  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('success');

  const vertical = 'top';
  const horizontal = 'right';

  const [fileRows, setFileRows] = React.useState([]);
  const [selectedCountries, setSelectedCountries] = React.useState([]);
  const [selectedBrands, setSelectedBrands] = React.useState([]);
  const [selectedProducts, setSelectedProducts] = React.useState([]);

  React.useEffect(() => {
    axios
      .get('/operation/config', {})
      .then((res) => {
        setForm(res.data);
      })
      .catch(() => {});
  }, []);
  const handleUpload = () => {
    let formdata = new FormData();
    setState(0);
    formdata.append('file', file[0]);
    formdata.append(
      'directory',
      `${form.catId}_${form.param1}_${form.param2}_${form.param3}`.replace(
        '.',
        '',
      ),
    );
    formdata.append(
      'filtered',
      JSON.stringify(fileRows),
    );
    formdata.append('operation', JSON.stringify(form));
    axios
      .post('/operation/upload', formdata)
      .then((res) => {
        console.log(res);
        if (res.data.status === 0) {
          setState(40);
          setIsError1(true);
        } else if (res.data.status === 1) {
          setState(70);
          setIsError2(true);
        } else if (res.data.status === 2) {
          setState(100);
          setIsSuccess(true);
        } else if (res.data.status === 10) {
          setState(40);
          setIsError1(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsError1(true);
        setState(0);
      });
  };

  useEffect(() => {
    setState(0);
    setProgress(0);
    setPercent(0);
    if (file.length > 0) {
      let formdata = new FormData();
      formdata.append('file', file[0]);
      axios
        .post('/operation/filter', formdata)
        .then((res) => {   
          const saveData = [];
          for(var i=0;i<res.data.rows.length;i++){
            saveData.push({Title: res.data.rows[i].product_title, Param1: res.data.rows[i].parameter1, Param2: res.data.rows[i].parameter2, Param3: res.data.rows[i].parameter3, Param4: res.data.rows[i].parameter4, Param5: res.data.rows[i].parameter5, Param6: res.data.rows[i].parameter6})
          }
          setFileRows(saveData)
          console.log(saveData);
        })
        .catch((err) => {
          toast.error('File Filter was failed');
        });
    } else {
      setFileRows([]);
    }
  }, [file]);

  useEffect(() => {
    const myInterval = setInterval(() => {
      let flag = 0;
      setPercent((prevProgress) => {
        if (prevProgress >= state) {
          flag = 1;
          return prevProgress;
        } else {
          return prevProgress + 4;
        }
      });
      setProgress((prevProgress) => {
        if (prevProgress >= state) {
          flag = 1;
          return prevProgress;
        } else {
          return prevProgress + 4;
        }
      });
      if (flag === 1) {
        console.log(flag);
        clearInterval(myInterval);
      }
    }, 100);
  }, [state]);

  const onFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubscribe = () => {
    axios
      .post('/operation/config', form)
      .then((res) => {
        setMessageType('success');
        setMessage(res.data.message);
        setShowAlert(true);
        setModal(false);
      })
      .catch((err) => {
        setMessageType('error');
        setMessage(err.response.data.message);
        setShowAlert(true);
      });
  };

  const [countries, setCountries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadData() {
      let res = await axios.get('/country');
      setCountries(res.data.filter((country) => country.parent === -1));
      res = await axios.get('/brand');
      setBrands(res.data);
      res = await axios.get('/products');
      setProducts(res.data);
    }
    loadData();
  }, []); //eslint-disable-line

  useEffect(() => {
    setSelectedProducts([]);
  }, [selectedCountries, selectedBrands]);

  // const displayData = []
  return (
    <Widget title='Upload File' disableWidgetMenu>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FileUpload value={file} onChange={setFile} sx={{ padding: 8 }} />
        </Grid>
        <Grid item xs={8}>
          <SettingsApplicationsIcon
            onClick={() => {
              setModal(true);
            }}
            color='primary'
            sx={{ fontSize: 80 }}
            style={{ marginBottom: '10px', cursor: 'pointer' }}
          />
          <FormControl sx={{ m: 1, minWidth: 180 }}>
            <InputLabel>Country</InputLabel>
            <Select
              label='Country'
              multiple
              input={<OutlinedInput label='Country' />}
              value={selectedCountries}
              onChange={(event) => {
                const {
                  target: { value },
                } = event;
                setSelectedCountries(
                  typeof value === 'string' ? value.split(',') : value,
                );
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {countries.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 180 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              name='brand'
              label='Brand'
              multiple
              input={<OutlinedInput label='Brand' />}
              value={selectedBrands}
              onChange={(event) => {
                const {
                  target: { value },
                } = event;
                setSelectedBrands(
                  typeof value === 'string' ? value.split(',') : value,
                );
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {brands.map((item, index) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 180 }}>
            <InputLabel>Products</InputLabel>
            <Select
              label='Products'
              multiple
              input={<OutlinedInput label='Products' />}
              value={selectedProducts}
              onChange={(event) => {
                const {
                  target: { value },
                } = event;
                setSelectedProducts(
                  typeof value === 'string' ? value.split(',') : value,
                );
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {products
                .filter((product) => {
                  if (
                    selectedCountries.length > 0 &&
                    !selectedCountries.includes(product.country)
                  )
                    return false;
                  if (
                    selectedBrands.length > 0 &&
                    !selectedCountries.includes(product.brand)
                  )
                    return false;
                  return true;
                })
                .map((item, index) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Typography sx={{ fontSize: 20 }}>{percent}% uploaded</Typography>
          <LinearProgress
            variant='determinate'
            value={progress}
            className='fileupload-progressbar'
            style={{ marginRight: '30px' }}
          />
          <Button
            variant='contained'
            style={{
              marginTop: '10px',
              right: '30px',
              position: 'absolute',
            }}
            onClick={handleUpload}
          >
            File post
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <MUIDataTable
            title='View Result'
            data={fileRows.filter((row) => {
              const tmp = products.find(
                (p) => row.Title.includes(p.title) //true
              );
              if (!tmp) return true;
              if (tmp) {
                if (
                  selectedCountries.length > 0 &&
                  !selectedCountries.includes(tmp.country)
                ) {
                  return false;
                }
                if (
                  selectedBrands.length > 0 &&
                  !selectedBrands.includes(tmp.brand)
                ) {
                  return false;
                }
                if (
                  selectedProducts.length > 0 &&
                  !selectedProducts.includes(tmp.id)
                ) {
                  return false;
                }
                return true;
              } else {
                return false;
              }
            })}
            columns={[
              'Title',
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
            <Table aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell align='right'>Param1</StyledTableCell>
                  <StyledTableCell align='right'>Param2</StyledTableCell>
                  <StyledTableCell align='right'>Param3</StyledTableCell>
                  <StyledTableCell align='right'>Param4</StyledTableCell>
                  <StyledTableCell align='right'>Param5</StyledTableCell>
                  <StyledTableCell align='right'>Param6</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                saveData.map((row) => (
                  <StyledTableRow key={row.product_title}>
                    <StyledTableCell component='td' scope='row'>
                      {row.product_title}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.parameter1}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.parameter2}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.parameter3}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.parameter4}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.parameter5}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.parameter6}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
        </Grid>
      </Grid>
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={4000}
        onClose={() => {
          setShowAlert(false);
        }}
      >
        <MuiAlert
          onClose={() => {
            setShowAlert(false);
          }}
          size={'large'}
          elevation={6}
          severity={messageType}
          sx={{ width: '100%' }}
          variant='filled'
        >
          {message}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isSuccess}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={4000}
        onClose={() => {
          setIsSuccess(false);
        }}
      >
        <MuiAlert
          onClose={() => {
            setIsSuccess(false);
          }}
          size={'large'}
          elevation={6}
          severity='success'
          sx={{ width: '100%' }}
          variant='filled'
        >
          File uploading is success.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isError1}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={4000}
        onClose={() => {
          setIsError1(false);
        }}
      >
        <MuiAlert
          onClose={() => {
            setIsError1(false);
          }}
          elevation={6}
          severity='error'
          sx={{ width: '100%' }}
          variant='filled'
        >
          File uploading is error.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={isError2}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={4000}
        onClose={() => {
          setIsError2(false);
        }}
      >
        <MuiAlert
          onClose={() => {
            setIsError2(false);
          }}
          elevation={6}
          severity='error'
          sx={{ width: '100%' }}
          variant='filled'
        >
          Python operation is error.
        </MuiAlert>
      </Snackbar>

      <Dialog
        open={modal}
        onClose={() => setModal(false)}
        fullWidth={true}
        maxWidth={'sm'}
      >
        <DialogTitle
          sx={{ fontSize: 20 }}
          style={{ textAlign: 'center', marginTop: '50px' }}
        >
          PARAMETER TURNING FORM
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <FormControl
                variant='standard'
                sx={{ minWidth: '100%' }}
                className='dialog-content'
              >
                <InputLabel id='demo-simple-select-standard-label'>
                  Select Category
                </InputLabel>
                <Select
                  labelId='demo-simple-select-standard-label'
                  name='catId'
                  label='Select Category'
                  value={form.catId}
                  onChange={onFormChange}
                >
                  <MenuItem value={1}>Cat1</MenuItem>
                  <MenuItem value={2}>Cat2</MenuItem>
                  <MenuItem value={3}>cat3</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin='dense'
                label='Parameter 1'
                name='param1'
                type='text'
                fullWidth
                variant='standard'
                className='dialog-content'
                value={form.param1}
                onChange={onFormChange}
              />
              <TextField
                margin='dense'
                label='Parameter 2'
                name='param2'
                type='text'
                fullWidth
                variant='standard'
                className='dialog-content'
                value={form.param2}
                onChange={onFormChange}
              />

              <TextField
                margin='dense'
                label='Parameter 3'
                type='text'
                name='param3'
                fullWidth
                variant='standard'
                className='dialog-content'
                value={form.param3}
                onChange={onFormChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin='dense'
                name='param4'
                label='Parameter 4'
                value={form.param4}
                onChange={onFormChange}
                type='text'
                fullWidth
                variant='standard'
                className='dialog-content'
              />
              <TextField
                margin='dense'
                name='param5'
                value={form.param5}
                label='Parameter 5'
                onChange={onFormChange}
                type='text'
                fullWidth
                variant='standard'
                className='dialog-content'
              />
              <TextField
                margin='dense'
                name='param6'
                label='Parameter 6'
                onChange={onFormChange}
                value={form.param6}
                type='text'
                fullWidth
                variant='standard'
                className='dialog-content'
              />
              <TextField
                margin='dense'
                name='param7'
                label='Parameter 7'
                value={form.param7}
                onChange={onFormChange}
                fullWidth
                variant='standard'
                className='dialog-content'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModal(false);
            }}
            sx={{ fontSize: 20 }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubscribe} sx={{ fontSize: 20 }}>
            Set Values
          </Button>
        </DialogActions>
      </Dialog>
    </Widget>
  );
};

export default UploadFile;
