import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import axios from 'axios';

const ExtraFieldsList = () => {
  const history = useHistory();
  const [isModal, setIsModal] = useState(false);
  const [deleteId, setDeleteId] = useState(-1);
  const [extra_fields, setExtraFields] = useState([]);
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    axios.get('/category').then((res) => {
      setCategories(res.data);
    });
  }, []);

  const readExtraFields = () => {
    axios.get('/extra_fields').then((res) => {
      setExtraFields(res.data);
    });
  };

  useEffect(() => {
    readExtraFields();
  }, []);

  const handleEdit = (id) =>
    history.push(`/app/ecommerce/extra_fields/edit/${id}`);

  const handleDelete = (id) => {
    if (id < 0) return;
    axios.delete(`/extra_fields/${id}`).then((res) => {
      readExtraFields();
    });
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={
              <>
                <h2>Extra Fields</h2>
                <Button
                  variant='contained'
                  color='success'
                  style={{ color: 'white', marginBottom: '20px' }}
                  component={Link}
                  to={'/app/ecommerce/extra_fields/create'}
                >
                  Create Extra Field
                </Button>
              </>
            }
            data={extra_fields}
            columns={[
              {
                name: 'name',
                label: 'Name',
              },
              {
                name: 'alias',
                label: 'Alias',
              },
              {
                name: 'CategoryId',
                label: 'Category',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return categories.find(
                      (category) => category.id === parseInt(tableMeta.rowData[2]),
                    )?.title;
                  },
                },
              },
              {
                name: 'type',
                label: 'Type',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return tableMeta.rowData[3] === 1
                      ? 'Text Field'
                      : 'Drop Down';
                  },
                },
              },
              {
                name: 'published',
                label: 'Published',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return tableMeta.rowData[4] ? 'Yes' : 'No';
                  },
                },
              },
              {
                name: 'required',
                label: 'Required',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return tableMeta.rowData[5] ? 'Yes' : 'No';
                  },
                },
              },
              {
                name: 'allowNull',
                label: 'Set Null Option',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return tableMeta.rowData[6] ? 'Yes' : 'No';
                  },
                },
              },
              {
                name: 'defaultValues',
                label: 'Default Values',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return tableMeta.rowData[7].join(',');
                  },
                },
              },
              {
                label: 'Action',
                name: 'id',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                      <>
                        <Button
                          variant='contained'
                          color='primary'
                          style={{ marginRight: '20px' }}
                          onClick={() => {
                            handleEdit(tableMeta.rowData[8]);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          onClick={() => {
                            setDeleteId(tableMeta.rowData[8]);
                            setIsModal(true);
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
              sort: false,
              filterType: 'checkbox',
            }}
          />
        </Grid>
      </Grid>
      <Dialog
        open={isModal}
        onClose={() => {
          setIsModal(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Do you want to delete this record?'}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              handleDelete(deleteId);
              setIsModal(false);
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              setIsModal(false);
            }}
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExtraFieldsList;
