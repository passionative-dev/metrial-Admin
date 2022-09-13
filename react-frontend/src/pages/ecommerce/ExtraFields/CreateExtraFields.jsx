import React, { useCallback, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  MenuItem,
  Switch,
  Typography,
  TextField as Input,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from 'react-material-ui-form-validator';

import Widget from '../../../components/Widget/Widget';
import toast from '../../../libs/toast';

const defaultForm = {
  name: '',
  alias: '',
  CategoryId: '',
  type: 1,
  published: true,
  allowNull: true,
  required: true,
  defaultValues: [''],
};

const CreateExtraField = () => {
  const { id } = useParams();
  const formRef = React.useRef();
  const [form, setForm] = useState(defaultForm);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [onCreate, setOnCreate] = useState(true);
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    axios.get('/category').then((res) => {
      setCategories(res.data.filter((category) => category.parent < 0));
    });
  }, []);

  const readExtraFields = useCallback(() => {
    if (id) setOnCreate(false);
    axios.get('/extra_fields').then((res) => {
      if (id) {
        setForm(res.data.find((field) => field.id === parseInt(id)));
      }
    });
  }, [id]);

  useEffect(() => {
    readExtraFields();
  }, [readExtraFields]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title={onCreate ? 'New Extra Field' : 'Edit Extra Field'}
            disableWidgetMenu
          >
            <ValidatorForm
              ref={formRef}
              onSubmit={() => {
                if (id) {
                  axios
                    .put(`/extra_fields/${id}`, form)
                    .then((res) => {
                      toast.success('Extra field was changed successfully');
                    })
                    .catch((err) => {
                      toast.error('Unknown error occured');
                    });
                } else {
                  axios
                    .post('/extra_fields', form)
                    .then((res) => {
                      toast.success(
                        'New Extra field was created successfully.',
                      );
                    })
                    .catch((err) => {
                      toast.error('Unknown error occured');
                    });
                }
              }}
              onError={() => {
                toast.error('Please enter extra field form correctly.');
              }}
            >
              <Grid item xs={12} sx={{ my: 2 }}>
                <Box display={'flex'} flexDirection='column'>
                  <Box display='flex' alignItems='center'>
                    <Box width={200}>
                      <Typography variant={'h6'}>Name</Typography>
                    </Box>
                    <Box width={300} sx={{ marginRight: 4 }}>
                      <TextValidator
                        onChange={onChange}
                        name='name'
                        fullWidth
                        value={form.name}
                        validators={['required']}
                        errorMessages={['This field is required']}
                      />
                    </Box>
                    <Box width={200}>
                      <Typography variant={'h6'}>Alias</Typography>
                    </Box>
                    <Box width={300}>
                      <TextValidator
                        onChange={onChange}
                        name='alias'
                        fullWidth
                        value={form.alias}
                      />
                    </Box>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    sx={{ marginTop: 1, marginBottom: 2 }}
                  >
                    <Box width={200}>
                      <Typography variant={'h6'}>Published</Typography>
                    </Box>
                    <Box width={500}>
                      <Switch
                        checked={form.published}
                        onChange={(e) => {
                          setForm({ ...form, published: e.target.checked });
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Box>
                  </Box>
                  <Box display='flex' alignItems='center'>
                    <Box width={200}>
                      <Typography variant={'h6'}>Group(Category)</Typography>
                    </Box>
                    <Box width={300} display='flex'>
                      <SelectValidator
                        style={{ width: 300 }}
                        fullWidth
                        value={form.CategoryId}
                        name='CategoryId'
                        onChange={onChange}
                        validators={['required']}
                        errorMessages={['This field is required']}
                      >
                        {categories.map((category, index) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.title}
                          </MenuItem>
                        ))}
                      </SelectValidator>
                    </Box>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    sx={{ marginTop: 2, marginBottom: 1 }}
                  >
                    <Box width={200}>
                      <Typography variant={'h6'}>Type</Typography>
                    </Box>
                    <Box width={300}>
                      <SelectValidator
                        fullWidth
                        value={form.type}
                        name='type'
                        onChange={onChange}
                      >
                        <MenuItem value={1}>Text Field</MenuItem>
                        <MenuItem value={2}>Dropdown</MenuItem>
                      </SelectValidator>
                    </Box>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    sx={{ marginTop: 2, marginBottom: 1 }}
                  >
                    <Box width={200}>
                      <Typography variant={'h6'}>Required</Typography>
                    </Box>
                    <Box width={300}>
                      <Switch
                        checked={form.required}
                        onChange={(e) => {
                          setForm({ ...form, required: e.target.checked });
                        }}
                      />
                    </Box>
                    <Box width={200}>
                      <Typography variant={'h6'}>Set Null Option</Typography>
                    </Box>
                    <Box width={300}>
                      <Switch
                        checked={form.allowNull}
                        onChange={(e) => {
                          setForm({ ...form, allowNull: e.target.checked });
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    display='flex'
                    alignItems='center'
                    sx={{ marginTop: 2, marginBottom: 1 }}
                  >
                    <Box width={200}>
                      <Typography variant={'h6'}>Default value(s)</Typography>
                    </Box>
                    <Box width={400} display='flex' flexDirection='column'>
                      {form.type === 1 && (
                        <React.Fragment>
                          <Input
                            fullWidth
                            value={form.defaultValues[0]}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                defaultValues: [e.target.value],
                              });
                            }}
                          ></Input>
                          <Typography>(Optional)</Typography>
                        </React.Fragment>
                      )}
                      {form.type === 2 && (
                        <React.Fragment>
                          <Button
                            fullWidth
                            variant='contained'
                            color='success'
                            style={{ color: '#ffffff' }}
                            sx={{ marginBottom: 2 }}
                            onClick={() => {
                              let tmp = form.defaultValues;
                              tmp.push('');
                              setForm({ ...form, defaultValues: tmp });
                            }}
                          >
                            Add Option
                          </Button>
                          {form.defaultValues.map((value, index) => (
                            <Box
                              color='primary'
                              display='flex'
                              alignItems='center'
                              sx={{ marginBottom: 2 }}
                              key={index}
                            >
                              <Input
                                sx={{ marginRight: 1 }}
                                width={200}
                                value={value}
                                onChange={(e) => {
                                  let tmp = form.defaultValues;
                                  tmp[index] = e.target.value;
                                  setForm({ ...form, defaultValues: tmp });
                                }}
                              ></Input>
                              {index > 0 && (
                                <Button
                                  onClick={() => {
                                    let tmp = form.defaultValues;
                                    delete tmp[index];
                                    setForm({ ...form, defaultValues: tmp });
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </Box>
                          ))}
                        </React.Fragment>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  style={{ color: 'white' }}
                  variant='contained'
                  color='success'
                  onClick={() => {
                    formRef.current.submit();
                  }}
                >
                  {onCreate ? 'Create' : 'Save'}
                </Button>
                <Button
                  style={{ marginLeft: '20px' }}
                  variant='contained'
                  color='info'
                  component={Link}
                  to={'/app/ecommerce/extra_fields'}
                >
                  Back
                </Button>
              </Grid>
            </ValidatorForm>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateExtraField;
