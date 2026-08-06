import React from 'react';
import { ResponsivePie } from '@nivo/pie';
export const DonutChart = ({ data, innerRadius = 0.5 }: any) => (
  <div style={{ height: 300 }}><ResponsivePie data={data} innerRadius={innerRadius} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} padAngle={1} cornerRadius={3} activeOuterRadiusOffset={8} colors={{ scheme: 'blues' }} borderWidth={1} borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }} enableArcLinkLabels={false} /></div>
);