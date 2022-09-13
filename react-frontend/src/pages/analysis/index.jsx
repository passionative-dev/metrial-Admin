import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import {
  InputLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import ApexLineChart from "./ApexLineChart";
import Widget from "../../components/Widget/Widget";

const Analysis = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('success');

  const [format, setFormat] = useState([]);
  const [datatableData, setDatatableData] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [view, setView] = useState(true);
  const [resultTable, setResultTable] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalChart, setModalChart] = useState(false);
  const [form, setForm] = React.useState({ catId: 1,csvformat: 0, param1: 0.1, param2: 10 });

  const onFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form, '--------------formachange')
  };

  const handleSubscribe = () => {
    console.log(form);
    axios
      .post('/analysis/saveOption', form)
      .then((res) => {
        setForm(res.data);
        // setMessageType('success');
        // setMessage(res.data.message);
        // setShowAlert(true);
        // setModal(false);
      })
  };

  React.useEffect(() => {
    axios
      .get('/analysis/config', {})
      .then((res) => {
        console.log(res.data, 'ddddddddstart')
        setForm(res.data);
      })
      .catch(() => {});
  }, []);

  const reloadTableData = () => {
    axios.get('/analysis/files').then((res) => {
      let data = [];
      res.data.forEach((i) => {
        data.push([i.filename, i.directory, i.updatedAt, i.id]);
      });
        setDatatableData(data);
        console.log(data, 'datatbaleData-------------')
      // axios.get('/operation').then((res) => {
      //   setDatatableData(data);
      //   setAnalyses(res.data);
      // });
    });
  };

  useEffect(() => {
    reloadTableData();
  }, []);

  return (
    <div>
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
              <FormControl
                variant='standard'
                sx={{ minWidth: '100%' }}
                className='dialog-content'
              >
                <InputLabel id='demo-simple-select-standard-label'>
                  Select CSV Format
                </InputLabel>
                <Select
                  labelId='demo-simple-select-standard-label'
                  name='csvformat'
                  label='Select CSV Format'
                  value={form.csvformat}
                  onChange={onFormChange}
                >
                  <MenuItem value={1}>Format 1</MenuItem>
                  <MenuItem value={2}>Format 2</MenuItem>
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
      <Dialog
        open={modalChart}
        onClose={() => setModal(false)}
        fullWidth={true}
        maxWidth={'lg'}
      >
        <DialogTitle
          sx={{ fontSize: 20 }}
          style={{ textAlign: 'center', marginTop: '50px' }}
        >
          Peak Detection Chart
        </DialogTitle>
        <DialogContent>
          {format.map((row, i) => (
            <div key={i}>
              <Widget title="Sample Name Line Chart" noBodyPadding>
                <ApexLineChart series={row}/>
              </Widget>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalChart(false);
            }}
            sx={{ fontSize: 20 }}
          >
            Cancel
          </Button>

        </DialogActions>
      </Dialog>
      {view ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <MUIDataTable
              title='Show Known-Unknown analyses'
              data={datatableData}
              columns={[
                'File Name',
                'Directory Name',
                'Uploaded date',
                {
                  label: 'Button',
                  options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                      return (
                        <>
                          <Button
                            variant='contained'
                            color='primary'
                            onClick={() => {
                              axios
                              .post('/analysis/finalResult', {form: form, fileName: tableMeta.rowData[0], directory: tableMeta.rowData[1]})
                              .then((res) => { 
                                let data = []; 
                                // setAnalyses(res.data)
                                res.data.map((analysis) => 
                                  data.push([
                                    analysis.catId,
                                    analysis.output1,
                                    analysis.output2,
                                    analysis.output3,
                                    analysis.output4,
                                    analysis.output5,
                                    analysis.output6,
                                    analysis.output7
                                  ])
                                );
                                setView(false);
                                setResultTable(data);
                                console.log(data)
                              })
                              // .catch((err) => {
                              //   setMessageType('error');
                              //   setMessage(err.response.data.message);
                              //   setShowAlert(true);
                              // });
                            }}
                            style={{ marginRight: '20px' }}
                          >
                            Final Results
                          </Button>
                          <Button
                            variant='contained'
                            color='success'
                            onClick={() => {
                              console.log('ddddddddddddddddddddd')
                              axios
                                .post('/analysis/chartData', {form: form, format: 0})
                                .then((res) => {
                                  let data = res.data.data;
                                  console.log(data, 'chat data------------------');
                                  let temp = [];
                                  temp.push(data.results.charts[0]);
                                  temp.push(data.results.charts[1]);
                                  temp.push(data.results.charts[2]);
                                  temp.push(data.results.charts[3]);
                                  temp.push(data.results.charts[0]);
                                  temp.push(data.results.charts[1]);
                                  temp.push(data.results.charts[2]);
                                  temp.push(data.results.charts[3]);
                                  temp.push(data.results.charts[0]);
                                  temp.push(data.results.charts[1]);
                                  temp.push(data.results.charts[2]);
                                  temp.push(data.results.charts[3]);
                                  setFormat(temp)
                                  setModalChart(true);
                                })
                                .catch((err) => {
                                  setMessageType('error');
                                  setMessage(err.response.data.message);
                                  setShowAlert(true);
                                });
                            }}
                          > Chart 1 
                          </Button>
                          <Button
                            variant='contained'
                            color='success'
                            onClick={() => {
                              console.log('ddddddddddddddddddddd')
                              axios
                                .post('/analysis/chartData', {form: form, format: 0})
                                .then((res) => {
                                  let data = res.data.data;
                                  console.log(data, 'chat data------------------');
                                  let temp = [];
                                  temp.push(data.results.charts[0]);
                                  temp.push(data.results.charts[1]);
                                  temp.push(data.results.charts[2]);
                                  temp.push(data.results.charts[3]);
                                  temp.push(data.results.charts[0]);
                                  temp.push(data.results.charts[1]);
                                  temp.push(data.results.charts[2]);
                                  temp.push(data.results.charts[3]);
                                  temp.push(data.results.charts[0]);
                                  temp.push(data.results.charts[1]);
                                  temp.push(data.results.charts[2]);
                                  temp.push(data.results.charts[3]);
                                  setFormat(temp)
                                  setModalChart(true);
                                })
                                .catch((err) => {
                                  setMessageType('error');
                                  setMessage(err.response.data.message);
                                  setShowAlert(true);
                                });
                            }}
                          > Chart 2 
                          </Button>
                          <Button>
                          <SettingsApplicationsIcon
                            onClick={() => {
                              setModal(true);
                            }}
                            color='primary'
                            sx={{ fontSize: 60 }}
                            style={{ marginBottom: '10px', cursor: 'pointer' }}
                          />
                          </Button>
                          <Button
                            variant='contained'
                            color='error'
                            onClick={() => {
                              axios
                                .delete(
                                  `/analysis/files/${tableMeta.rowData[3]}`,
                                )
                                .then(() => {
                                  setMessage(
                                    'File was deleted was successfully.',
                                  );
                                  setMessageType('success');
                                  setShowAlert(true);
                                  reloadTableData();
                                })
                                .catch(() => {
                                  setMessage('Unknown error occured');
                                  setMessageType('error');
                                  setShowAlert(true);
                                  reloadTableData();
                                });
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      );
                    },
                  },
                },
              ]}
              options={{
                filterType: 'checkbox',
              }}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div className='flex justify-content-end'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setView(true);
                  // setResultTable([]);
                }}
                style={{ marginBottom: 16 }}
              >
                Back
              </Button>
            </div>
            <MUIDataTable
              title='View Result'
              data={resultTable}
              columns={[
                'CatId',
                'Parameter 1',
                'Parameter 2',
                'Parameter 3',
                'Parameter 4',
                'Parameter 5',
                'Parameter 6',
                'Parameter 7',
              ]}
              options={{
                filterType: 'checkbox',
              }}
            ></MUIDataTable>
          </Grid>
        </Grid>
      )}
    </div>
    
  );
};

export default Analysis;
