import React from 'react';
import PlansCollection from '../../components/modules/Plans/PlansCollection';
import { getCurrentCoach } from '../../lib/auth.utils';
import prisma from '../../lib/prisma';
import { PlanRepository, PracticeRepository } from '@ankora/repository';

interface PageProps {
  searchParams: {
    search: string;
    'search-practice': string;
  };
}

const Plans = async ({ searchParams }: PageProps) => {
  const coach = await getCurrentCoach();
  const plans = await PlanRepository.getAll(prisma, coach, {
    search: searchParams.search,
  });
  const flag = plans.length === 0 && !searchParams.search ? false : true;
  const practices = await PracticeRepository.getAllForCoach(prisma, coach, {
    search: searchParams['search-practice'],
  });
  return (
    <PlansCollection
      plans={JSON.parse(JSON.stringify(plans))}
      practices={JSON.parse(JSON.stringify(practices))}
      flag={flag}
    />
  );
};
export default Plans;
