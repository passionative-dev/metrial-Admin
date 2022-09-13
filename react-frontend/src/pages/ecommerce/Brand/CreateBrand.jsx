import React, { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  OutlinedInput,
  Button,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import Widget from '../../../components/Widget/Widget';
import { useEffect } from 'react';
import { Box } from '@mui/system';

const CreateBrand = () => {
  const { id } = useParams();
  const [isCreateBrand, setIsCreateBrand] = useState(true);
  const [title, setTitle] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError1, setIsError1] = useState(false);

  const vertical = 'top';
  const horizontal = 'right';

  const readBrands = useCallback(() => {
    if (id) setIsCreateBrand(false);
    axios.get('/brand').then((res) => {
      if (id)
        setTitle(
          res.data.find((brand) => parseInt(brand.id) === parseInt(id))?.title,
        );
    });
  }, [id]);

  useEffect(() => {
    readBrands();
  }, [readBrands]);

  const handleSave = () => {
    axios
      .post('/brand', { title })
      .then((res) => {
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsError1(true);
      });
  };

  const handleEdit = () => {
    axios
      .put(`/brand/${id}`, { title })
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
            title={isCreateBrand ? 'New Brand' : 'Edit Brand'}
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
            <Grid item xs={12}>
              {isCreateBrand ? (
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
                to={'/app/ecommerce/brands'}
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
              Brand is created successfully.
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
              Brand creating is error.
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateBrand;
