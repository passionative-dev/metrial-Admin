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

const Categories = () => {
  const history = useHistory();
  const [isModal, setIsModal] = useState(false);
  const [deleteId, setDeleteId] = useState(-1);
  const [brands, setBrands] = useState([]);

  const readBrands = () => {
    axios.get('/brand').then((res) => {
      setBrands(res.data);
    });
  };

  useEffect(() => {
    readBrands();
  }, []);

  const handleEdit = (id) => history.push(`/app/ecommerce/brands/edit/${id}`);

  const handleDelete = (id) => {
    if (id < 0) return;
    axios.delete(`/brands/${id}`).then((res) => {
      readBrands();
    });
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={
              <>
                <h2>Brands</h2>
                <Button
                  variant='contained'
                  color='success'
                  style={{ color: 'white', marginBottom: '20px' }}
                  component={Link}
                  to={'/app/ecommerce/brands/create'}
                >
                  Create Brand
                </Button>
              </>
            }
            data={brands}
            columns={[
              {
                name: 'title',
                label: 'Title',
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
                            handleEdit(tableMeta.rowData[1]);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          onClick={() => {
                            setDeleteId(tableMeta.rowData[1]);
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

export default Categories;
