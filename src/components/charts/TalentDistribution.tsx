import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
export const TalentDistribution = ({ data, keys, indexBy }: any) => (
  <div style={{ height: 300 }}><ResponsiveBar data={data} keys={keys} indexBy={indexBy} margin={{ top: 20, right: 20, bottom: 50, left: 50 }} padding={0.3} colors={{ scheme: 'blues' }} axisBottom={{ tickRotation: -45 }} /></div>
);