import { ConfigList } from '@ankora/ui-library';
import { FeatureConfig } from '@prisma/client';
import React from 'react';

interface FeatureConfigCardProps {
  featureConfig: FeatureConfig;
}

const FeatureConfigCard = ({ featureConfig }: FeatureConfigCardProps) => {
  const { feature, config } = featureConfig;
  return (
    <div className='max-w-[300px] w-full h-[200px] rounded-md shadow-lg bg-white p-4 overflow-auto'>
      <h2 className='text-2xl mb-4'>{feature}</h2>
      <ConfigList config={config as Record<string, unknown>} />
    </div>
  );
};

export default FeatureConfigCard;
