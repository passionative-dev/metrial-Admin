import React from 'react';
import PropTypes from 'prop-types';
import FormErrors from 'components/FormItems/formErrors';
import { FastField } from 'formik';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';

const SwitchFormItem = (props) => {
  const { name, schema, hint, errorMessage } =
    props;

  const { label } = schema[name];

  return (
    <FastField name={name}>
      kk
    </FastField>
  );
};



export default SwitchFormItem;
