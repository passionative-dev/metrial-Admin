import React, { useEffect, useState } from 'react';
import { Grid, Paper } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Widget from "../../components/Widget";

// styles
import useStyles from './styles';

//components
import { Button, Typography } from '../../components/Wrappers';

// logo
import logo from './logo.svg';

export default function Error() {
  
  const [errLog, setErrlog] = useState('');

  let classes = useStyles();

  useEffect(() => {
    async function loadData() {
      let res = await axios.get('/error/error');
      setErrlog(res.data)
      console.log(res.data);
    }
    loadData();
  }, []); //eslint-disable-line

  return (
    <Grid style={{color: "red"}} container>
      {errLog}
    </Grid>
  );
}
