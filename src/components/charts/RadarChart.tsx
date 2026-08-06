import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
export const RadarChart = ({ data, maxValue = 100 }: any) => (
  <div style={{ height: 300 }}><ResponsiveRadar data={data} keys={['score']} indexBy="label" maxValue={maxValue} margin={{ top: 40, right: 40, bottom: 40, left: 40 }} colors={['var(--primary-500)']} fillOpacity={0.4} blendMode="multiply" /></div>
);