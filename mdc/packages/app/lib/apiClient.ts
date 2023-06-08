import { ApiClient } from '@ankora/api-client';
import { appConfig } from '@ankora/config';
import TOKEN from './token';

export const apiClient = new ApiClient({
  BASE: appConfig.apiUrl.replace('/api', ''),
  TOKEN: async () => TOKEN.get() ?? '',
});
