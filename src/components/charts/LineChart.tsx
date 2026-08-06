import React from 'react';
import { ResponsiveLine } from '@nivo/line';
export const LineChart = ({ data, xLabel, yLabel }: any) => (
  <div style={{ height: 300 }}><ResponsiveLine data={data} margin={{ top: 20, right: 20, bottom: 50, left: 50 }} xScale={{ type: 'point' }} yScale={{ type: 'linear', min: 'auto', max: 'auto' }} axisBottom={{ legend: xLabel, legendOffset: 36, legendPosition: 'middle' }} axisLeft={{ legend: yLabel, legendOffset: -40, legendPosition: 'middle' }} colors={['var(--primary-500)']} enableArea={true} areaOpacity={0.1} useMesh={true} /></div>
);