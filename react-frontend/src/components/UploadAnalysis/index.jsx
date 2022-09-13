import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import MUIDataTable from 'mui-datatables';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { Router, Route, Link } from 'react-router-dom';
import history from './history';

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
import UploadService from "./fileUploadService";
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

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

const UploadAnalysis = () => {
  
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState(0);
  const [fileNames, setFileNames] = useState('');
  const [percent, setPercent] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError1, setIsError1] = useState(false);
  const [isError2, setIsError2] = useState(false);

  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState('')
  const [flag, setFlag] = useState(0);
  const [messageType, setMessageType] = React.useState('success');

  const vertical = 'top';
  const horizontal = 'right';

  const [fileRows, setFileRows] = React.useState([]);
  const [fileInfos, setFileInfos] = useState([]);
  const [form, setForm] = React.useState({ catId: 1, param1: 0.1, param2: 10 });

  React.useEffect(() => {
    axios
      .get('/analysis/config', {})
      .then((res) => {
        setForm(res.data);
      })
      .catch(() => {});
  }, []);

  const selectFiles = (event) => {
    const data = [];
    const tableData = [];
    const newDate = new Date()
    const date = newDate.getDate();
    const names = fileNames + ", " + event.target.files[0].name;
    setFileNames(names );
    tableData.push({Filename: names, Uploaded_date: date, Drectory: 'upload'})
    setFileRows(tableData);
    data.push(event.target.files[0])
    setFileInfos(data);
    setFlag(fileInfos+2);
    var formdata = new FormData()
    formdata.append('file', event.target.files[0]);
    formdata.append('operation', JSON.stringify(form))
    formdata.append(
      'directory',
      `${form.catId}_${form.param1}_${form.param2}`.replace(
        '.',
        '',
      ),
    );
    axios
      .post('/analysis/uploads', formdata)
      .then((res) => {
        if (res.data.status == 0) {
          setState(40);
          // /setIsError1(true);
        } else if (res.data.status == 1) {
          setState(70);
          // setIsError2(true);
        } else if (res.data.status == 2) {
          setState(100);
          // setIsSuccess(true);
          // return <Redirect to='/app/analysis'  />
          this.props.history.push('/app/analysis')
        } else if (res.data.status == 10) {
          setState(40);
          // setIsError1(true);
        }
      })
      .catch((err) => {
        console.log(err);
        //setIsError1(true);
        //setState(0);
      });
    // console.log(fileInfos)
  };

  const handleUpload = () => {
    let formdata = new FormData();
   
    setState(0);
    setIsError1(false)
    formdata.append(
      'directory',
      `${form.catId}_${form.param1}_${form.param2}`.replace(
        '.',
        '',
      ),
    );
    formdata.append('fileRows', fileRows)
    axios
      .post('/analysis/upload', formdata)
      .then((res) => {
        if (res.data.status == 0) {
          setState(40);
          // /setIsError1(true);
        } else if (res.data.status == 1) {
          setState(70);
          // setIsError2(true);
        } else if (res.data.status == 3) {
          setState(100);
          setIsSuccess(true);
          // return <Redirect to='/app/analysis'  />
          this.props.history.push('/app/analysis')
        } else if (res.data.status == 10) {
          setState(40);
          // setIsError1(true);
        }
      })
      .catch((err) => {
        console.log("------------------------------------",err);
        //setIsError1(true);
        //setState(0);
      });
  };

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
        clearInterval(myInterval);
      }
    }, 100);
  }, [state]);

  const list = fileRows.map((file, index) => (
    <li className="list-group-item" key={index}>
      {file.Filename}
    </li>
  ))

  return (
    <Widget title='Upload Analysis File (ALLOW MULTIPLE FILE UPLOAD)' disableWidgetMenu>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <div>
            <div className="row my-3">
              <div className="col-8">
                <label className="btn btn-success btn-sm">
                  <input type="file" multiple onChange={selectFiles} />
                </label>
              </div>
            </div>

            <div className="card">
              <div className="card-header">List of Files{flag}</div>
              <ul className="list-group list-group-flush">
                {list}
              </ul>
            </div>
          </div>
        </Grid>
        <Grid item xs={8}>
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
            data={fileRows}
            columns={[
              'Filename',
              'Uploaded_date',
              'Drectory'
            ]}
            options={{
              filterType: 'checkbox',
            }}
          ></MUIDataTable>
          {/* <TableContainer component={Paper}>
            <Table aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell align='right'>Filenames</StyledTableCell>
                  <StyledTableCell align='right'>Uploaded_date</StyledTableCell>
                  <StyledTableCell align='right'>Drectory</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fileRows.map((row, key) => (
                  <StyledTableRow key={key}>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.filename}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {row.date}
                    </StyledTableCell>
                    <StyledTableCell component='td' scope='row' align='right'>
                      {'upload'}
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
    </Widget>
  );
};

export default UploadAnalysis;
