import { apiConfig } from '@ankora/config';

export const organizationId = apiConfig.isProd
  ? '00000000-0000-1000-o000-000000000008'
  : '00000000-0000-1000-o000-000000000000';
