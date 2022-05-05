import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import apis from 'apis';
import { doAnalysis, initChart, initData } from './utils';

export const MetricCharts = ({
  metricAccuracy,
  name,
  poly,
  height = '300px'
}) => {

  const [baseData, setBaseData] = useState(() => []);
  const [resources, setResources] = useState(() => (initData()));
  const [chart, setChart] = useState(() => (initChart()))

  useEffect(() => {
    setResources(doAnalysis({
      data: JSON.parse(JSON.stringify(baseData)),
      poly,
      step: metricAccuracy
    }))
  }, [baseData, metricAccuracy, poly])

  useEffect(() => {
    if (!name) return;
    apis.adminFetchMetric({ metricAccuracy, name }).then(res => {
      if (res.status === 0) {
        setBaseData(res.data)
      }
    }).catch(e => console.log(e));
  }, [metricAccuracy, name])

  useEffect(() => {
    let c = initChart()
    c.xAxis.data = resources.x
    c.series = resources.y.map((l, index) => ({
      name: { '0': 'value', '1': 'max', '2': 'total' }[index],
      data: l,
      type: 'line',
      symbol: 'none'
    }))
    setChart(c)
  }, [resources])

  return (
    <div style={{ textAlign: 'center' }}>
      <ReactEcharts
        option={chart}
        style={{ width: '100%', height }} />
    </div>
  );

};
