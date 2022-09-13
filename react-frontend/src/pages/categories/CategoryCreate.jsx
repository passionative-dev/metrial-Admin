import React, { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  OutlinedInput,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import Widget from '../../components/Widget/Widget';
import { useEffect } from 'react';
import { Box } from '@mui/system';

const CategoryCreate = () => {
  const { id } = useParams();
  const [isCreateCategory, setIsCreateCategory] = useState(true);
  const [title, setTitle] = useState('');
  const [parent, setParent] = useState(-1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError1, setIsError1] = useState(false);

  const [categories, setCategories] = useState([]);

  const vertical = 'top';
  const horizontal = 'right';

  const readCategories = useCallback(() => {
    if (id) setIsCreateCategory(false);
    axios.get('/category').then((res) => {
      let tmpCats = res.data.filter(
        (category) => parseInt(category.parent) < 0,
      );
      let resultCats = [];
      tmpCats.forEach((cat) => {
        resultCats.push(cat);
        resultCats = resultCats.concat(
          res.data
            .filter((category) => category.parent === cat.id)
            .map((category) => ({
              ...category,
              title: '| - - - - - ' + category.title,
            })),
        );
      });
      if (id)
        setCategories(resultCats.filter((cat) => cat.id !== parseInt(id)));
      else setCategories(resultCats);

      const cat = res.data.find((category) => category.id === parseInt(id));
      if (cat) {
        setTitle(cat.title);
        setParent(cat.parent);
      }
    });
  }, [id]);

  useEffect(() => {
    readCategories();
  }, [readCategories]);

  const handleSave = () => {
    axios
      .post('/category/create', { title, parent })
      .then((res) => {
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsError1(true);
      });
  };

  const handleEdit = () => {
    axios
      .put('/category/edit/' + id, { title, parent })
      .then((res) => {
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsError1(true);
      });
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title={isCreateCategory ? 'New Category' : 'Edit Category'}
            disableWidgetMenu
          >
            <Grid item xs={12} sx={{ my: 2 }}>
              <Box width={150}>
                <Typography variant='h5'>Title</Typography>
              </Box>
              <Box width={300}>
                <OutlinedInput
                  style={{ minWidth: '356px' }}
                  id='outlined-adornment-weight'
                  // value={values.weight}
                  // onChange={handleChange('weight')}
                  aria-describedby='outlined-weight-helper-text'
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Box width={150}>
                <Typography variant='h5'>Parent category</Typography>
              </Box>
              <Box width={300}>
                <Select
                  fullWidth
                  value={parent}
                  onChange={(e) => {
                    setParent(e.target.value);
                  }}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value='-1'>- None -</MenuItem>
                  {categories.map((category, index) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.title}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {isCreateCategory ? (
                <Button
                  style={{ color: 'white' }}
                  variant='contained'
                  color='success'
                  onClick={handleSave}
                >
                  Save
                </Button>
              ) : (
                <Button
                  style={{ color: 'white' }}
                  variant='contained'
                  color='success'
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}
              <Button
                style={{ marginLeft: '20px' }}
                variant='contained'
                color='info'
                component={Link}
                to={'/app/categories'}
              >
                Back
              </Button>
            </Grid>
          </Widget>
          <Snackbar
            open={isSuccess}
            anchorOrigin={{ vertical, horizontal }}
            autoHideDuration={4000}
            onClose={() => {
              setIsSuccess(false);
            }}
          >
            <Alert
              onClose={() => {
                setIsSuccess(false);
              }}
              size={'large'}
              elevation={6}
              severity='success'
              sx={{ width: '100%' }}
              variant='filled'
            >
              Category is created successfully.
            </Alert>
          </Snackbar>
          <Snackbar
            open={isError1}
            anchorOrigin={{ vertical, horizontal }}
            autoHideDuration={4000}
            onClose={() => {
              setIsError1(false);
            }}
          >
            <Alert
              onClose={() => {
                setIsError1(false);
              }}
              elevation={6}
              severity='error'
              sx={{ width: '100%' }}
              variant='filled'
            >
              Category creating is error.
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </>
  );
};

export default CategoryCreate;
