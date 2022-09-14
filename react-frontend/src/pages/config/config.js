import React, { useEffect, useState } from 'react';
import { Grid, Paper } from '@mui/material';
import axios from 'axios';
import { Input } from 'antd';
import classnames from 'classnames';
import Widget from "../../components/Widget";
//components
import { Button, Typography } from '../../components/Wrappers';
import success from '../../themes/success';
const { TextArea } = Input;
export default function Error() {

    const [config, setConfig] = useState('');

    useEffect(() => {
        async function loadData() {
        let res = await axios.get('/country/config');
        setConfig(JSON.stringify(res.data, null, "\t"))
        console.log(res.data);
        }
        loadData();
    }, []); //eslint-disable-line

    const onChange = (e) => {
        setConfig(e.target.value);
    }

    const saveChange = (e) => {
        if(!isJsonString(config)){
            // console.log('\\asdf')
            alert('type error')
        }else{
            var data = config;
            data = data.replace("\\n", "");
            data = data.replace("\\t", "");
            axios.post('/country/configSave', {config: data})
            .then((res) => {
                alert('success');
            })
        }
    }

    const isJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    return (
        <Grid style={{color: "red"}} container>
            <Button
                variant='contained'
                style={{
                float: 'right',
                color: ''
                }}
                onClick={saveChange}
            >
                save changes
            </Button><br /><br />
            <TextArea rows={30} onChange={onChange}  style={{color: "", fontSize: "20px"}} value={config} />
        </Grid>
    );
}
