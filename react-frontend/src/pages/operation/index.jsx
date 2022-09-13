import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import axios from 'axios';

const Operation = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('success');

  const [datatableData, setDatatableData] = useState([]);
  const [operations, setOperations] = useState([]);
  const [view, setView] = useState(true);
  const [resultTable, setResultTable] = useState([]);

  const reloadTableData = () => {
    axios.get('/operation/files').then((res) => {
      let data = [];
      res.data.forEach((i) => {
        data.push([i.filename, i.directory, i.updatedAt, i.id]);
      });
      axios.get('/operation').then((res) => {
        setDatatableData(data);
        setOperations(res.data);
      });
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
      {view ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <MUIDataTable
              title='History-List'
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
                              let data = [];

                              operations
                                .filter(
                                  (operation) =>
                                    operation.parameter ===
                                      tableMeta.rowData[1] &&
                                    operation.filename === tableMeta.rowData[0],
                                )
                                .map((operation) =>
                                  data.push([
                                    operation.catId,
                                    operation.output1,
                                    operation.output2,
                                    operation.output3,
                                    operation.output4,
                                    operation.output5,
                                    operation.output6,
                                    operation.output7,
                                  ]),
                                );
                              console.log(data);
                              setView(false);
                              setResultTable(data);
                            }}
                            style={{ marginRight: '20px' }}
                          >
                            View
                          </Button>
                          <Button
                            variant='contained'
                            color='error'
                            onClick={() => {
                              axios
                                .delete(
                                  `/operation/files/${tableMeta.rowData[3]}`,
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

export default Operation;
