import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
export const HeatmapChart = ({ data }: any) => (
  <div style={{ height: 300 }}><ResponsiveHeatMap data={data} margin={{ top: 60, right: 20, bottom: 20, left: 60 }} colors={{ type: 'sequential', scheme: 'blues' }} axisTop={{ tickSize: 5, tickPadding: 5, tickRotation: -45, legend: '', legendOffset: 36 }} /></div>
);