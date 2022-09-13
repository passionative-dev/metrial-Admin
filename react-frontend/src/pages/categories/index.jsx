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
    axios.get('/category').then((res) => {
      let resultCats = [];
      res.data
        .filter((category) => parseInt(category.parent) < 0)
        .forEach((cat) => {
          resultCats.push(cat);
          res.data
            .filter((category) => category.parent === cat.id)
            .forEach((secondary) => {
              resultCats.push({
                ...secondary,
                title: '| - - - - - ' + secondary.title,
              });
              resultCats = resultCats.concat(
                res.data
                  .filter((sub) => sub.parent === secondary.id)
                  .map((sub) => ({
                    ...sub,
                    title: '| - - - - - | - - - - - ' + sub.title,
                  })),
              );
            });
        });
      let tmpData = [];
      for (const category of resultCats) {
        tmpData.push({
          title: category.title,
          parent:
            category.parent >= 0
              ? resultCats.find((c) => c.id === category.parent).title
              : '',
          id: category.id,
        });
      }
      setTableData(tmpData);
    });
  };

  useEffect(() => {
    readCategories();
  }, []);

  const handleEdit = (id) => {
    history.push(`/app/categories/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (id < 0) return;
    axios.delete(`/categories/${id}`).then((res) => {
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
  //   axios.post('/category/delete/' + choose[0].id).then((res) => {
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
                <h2>Category</h2>
                <Button
                  variant='contained'
                  color='success'
                  style={{ color: 'white', marginBottom: '20px' }}
                  component={Link}
                  to={'/app/categories/create'}
                >
                  Create Category
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
