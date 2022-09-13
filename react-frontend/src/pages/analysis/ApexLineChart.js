import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { Scatter, G2 } from '@ant-design/charts';

import { uniq, findIndex } from '@antv/util';
import { isNumber } from 'lodash';
G2.registerShape('point', 'big-point', {
  draw(cfg, container) {
    const data = cfg.data;
    const point = {
      x: cfg.x,
      y: cfg.y,
    };
    const group = container.addGroup();

      const decorator1 = group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 10,
          fill: cfg.color,
          opacity: 0.5,
        },
      });
      const decorator2 = group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 10,
          fill: cfg.color,
          opacity: 0.5,
        },
      });
      const decorator3 = group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 10,
          fill: cfg.color,
          opacity: 0.5,
        },
      });
      decorator1.animate(
        {
          r: 20,
          opacity: 0,
        },
        {
          duration: 1800,
          easing: 'easeLinear',
          repeat: true,
        },
      );
      decorator2.animate(
        {
          r: 20,
          opacity: 0,
        },
        {
          duration: 1800,
          easing: 'easeLinear',
          repeat: true,
          delay: 600,
        },
      );
      decorator3.animate(
        {
          r: 20,
          opacity: 0,
        },
        {
          duration: 1800,
          easing: 'easeLinear',
          repeat: true,
          delay: 1200,
        },
      );
      group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 6,
          fill: cfg.color,
          opacity: 0.7,
        },
      });
      group.addShape('circle', {
        attrs: {
          x: point.x,
          y: point.y,
          r: 1.5,
          fill: cfg.color,
        },
      });
    return group;
  },
});
const DemoLine = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);
  let flag = '';
  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const COLOR_PLATE_10 = [
    '#F6BD16',
    '#9270CA',
    '#FF9D4D',
    '#5AD8A6',
    '#5D7092',
    '#6DC8EC',
    '#FF99C3',
    '#5B8FF9',
    '#269A99',
    '#E8684A',
  ];
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    colorField: 'colorname', 
    limitInPlot: false,
    autoFit: true,
    isStack:false,
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'Axis Center Positioning'
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
        },
        y: {
          min: 0,
          max: 100,
        }
      }
    },
    yAxis: {
      label: {
        formatter: (v) => {if(v%2==0){return v;}},
      },
    },
    // xAxis: false,
    xAxis: {
      label: { formatter:(v) =>  {
          if(parseInt(v)%2 == 0 ){
            if(flag !== parseInt(v) && (v - parseInt(v))>0.02 ){
              // console.log(parseInt(v))
              flag = parseInt(v); 
              return parseInt(v);
            }
          }
        }
      }
    },
    color: COLOR_PLATE_10,
    point: {
      shape: ( { category }) => {
        if (isNumber(category))
          return 'big-point';
        return '';
      },
      style: ({ category }) => {
        return {
          r: isNumber(category) ? 0 : 1, // 4 个数据示一个点标记
        };
      },
    },
  }
  if  ( props.series.line1 !== undefined ){
    var line1 = props.series.line1[0];
    var line2 = props.series.line2[0];
    var y_value1 = line1.y_value;
    var x_time_min1 = line1.x_time_min;
    var peaks_position1 = line1.peaks_position;
    var y_value2 = line2.y_value;
    var x_time_min2 = line2.x_time_min;
    var peaks_position2 = line2.peaks_position;
    var dat = [];
    var result = [];
    for(var j=0;j<y_value1.length;j++){
      for(var i=0;i<peaks_position1.length;i++){
        if(y_value1[j] == peaks_position1[i]){
          dat.push({ year: x_time_min1[j], value: y_value1[j], category: x_time_min1[j]});
        }
      }
      dat.push({ year: x_time_min1[j], value: y_value1[j], category: line1.label});
    }
    // for(var i=0;i<peaks_position1.length;i++){
    //   for(var j=0;j<y_value1.length;j++)
    //   dat.push({ year: x_time_min1[j], value: y_value1[j], category: line1.label});
    // }
    var dat1 = [];
    for(var j=0;j<y_value2.length;j++){
      for(var i=0;i<peaks_position1.length;i++){
        if(peaks_position2[j] !== undefined && y_value2[j] == peaks_position2[i]){
          dat.push({ year: x_time_min2[j], value: y_value2[j], category: x_time_min1[j]});
          break;
        }
      }
      dat.push({ year: x_time_min2[j], value: y_value2[j], category: line2.label});
    }

    config.data = dat;
  }
  // console.log(dat);

  return <Line {...config} />;
};

export default DemoLine;