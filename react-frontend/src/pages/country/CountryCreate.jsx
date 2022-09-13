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

const CountryCreate = () => {
  const { id } = useParams();
  const [isCreateCountry, setIsCreateCountry] = useState(true);
  const [title, setTitle] = useState('');
  const [parent, setParent] = useState(-1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError1, setIsError1] = useState(false);

  const [countries, setCategories] = useState([]);

  const vertical = 'top';
  const horizontal = 'right';

  const readCategories = useCallback(() => {
    if (id) setIsCreateCountry(false);
    axios.get('/country').then((res) => {
      setCategories(res.data);
      const cat = res.data.find((country) => country.id === parseInt(id));
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
      .post('/country/create', { title, parent })
      .then((res) => {
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsError1(true);
      });
  };

  const handleEdit = () => {
    axios
      .put('/country/edit/' + id, { title, parent })
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
            title={isCreateCountry ? 'New Country' : 'Edit Country'}
            disableWidgetMenu
          >
            <Grid item xs={12} sx={{ my: 2 }}>
              <Box width={150}>
                <Typography variant='h5'>Country / State</Typography>
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
                <Typography variant='h5'>Parent</Typography>
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
                  {countries
                    .filter((country) => country.parent === -1)
                    .map((country, index) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.title}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {isCreateCountry ? (
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
                to={'/app/country'}
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
              Country is created successfully.
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
              Country creating is error.
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </>
  );
};

export default CountryCreate;
