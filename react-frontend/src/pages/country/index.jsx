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
  const [isModal, setIsModal] = useState(false);
  const [deleteId, setDeleteId] = useState(-1);
  const history = useHistory();
  const [tableData, setTableData] = useState([]);

  const readCategories = () => {
    axios.get('/country').then((res) => {
      let tmpCats = res.data.filter((country) => parseInt(country.parent) < 0);
      let resultCats = [];
      for (const cat of tmpCats) {
        resultCats.push(cat);
        resultCats = resultCats.concat(
          res.data
            .filter((country) => country.parent === cat.id)
            .map((country) => ({
              ...country,
              title: '| - - - - - ' + country.title,
            })),
        );
      }
      let tmpData = [];
      for (const country of resultCats) {
        tmpData.push({
          title: country.title,
          parent:
            country.parent >= 0
              ? resultCats.find((c) => c.id === country.parent).title
              : '',
          id: country.id,
        });
      }
      setTableData(tmpData);
      // let cat = res.data.filter((i) => {
      //   return i.parent === 'none';
      // });
      // cat.map((item, index) => {
      //   let subcat = res.data.filter((i) => {
      //     return i.parent === item.title;
      //   });
      //   cat[index] = { ...cat[index], subcat: subcat };
      //   return null;
      // });
      // setCountry(cat);
    });
  };

  useEffect(() => {
    readCategories();
  }, []);

  const handleEdit = (id) => {
    history.push(`/app/country/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (id < 0) return;
    axios.delete(`/country/${id}`).then((res) => {
      console.log(res);
      readCategories();
    });
  };

  // const handleDelete = (e) => {
  //   let sli;
  //   if (e.lastIndexOf('____|-') != -1)
  //     sli = e.slice(e.lastIndexOf('____|-') + 6);
  //   else sli = e;
  //   let choose = response.filter((item) => item.title == sli);
  //   axios.post('/country/delete/' + choose[0].id).then((res) => {
  //     console.log(res);
  //   });
  // };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={
              <>
                <h2>Country</h2>
                <Button
                  variant='contained'
                  color='success'
                  style={{ color: 'white', marginBottom: '20px' }}
                  component={Link}
                  to={'/app/country/create'}
                >
                  Create Country
                </Button>
              </>
            }
            data={tableData}
            columns={[
              {
                name: 'title',
                label: 'Title',
              },
              {
                name: 'parent',
                label: 'Parent',
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
                            handleEdit(tableMeta.rowData[2]);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
                          onClick={() => {
                            setDeleteId(tableMeta.rowData[0]);
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
