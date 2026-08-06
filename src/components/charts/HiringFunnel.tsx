import React from 'react';
import { ResponsiveFunnel } from '@nivo/funnel';
export const HiringFunnel = ({ data }: any) => (
  <div style={{ height: 300 }}><ResponsiveFunnel data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} direction="vertical" colors={{ scheme: 'blues' }} borderOpacity={0} /></div>
);