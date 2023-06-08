import { FeatureConfig } from '@prisma/client';
import React from 'react';
import FeatureConfigCard from '../FeatureConfigCard/FeatureConfigCard';

interface FeaturesListProps {
  featureConfigs: FeatureConfig[];
}

const FeatureConfigsList = ({ featureConfigs }: FeaturesListProps) => (
  <div className='flex gap-8 flex-wrap'>
    {featureConfigs.map((config: FeatureConfig) => (
      <FeatureConfigCard key={config.feature} featureConfig={config} />
    ))}
  </div>
);

export default FeatureConfigsList;
