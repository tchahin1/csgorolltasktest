import { v4 as uuid } from 'uuid';

const environment = (process.env.REACT_APP_ENV || 'development') as string;

const configs = {
  common: {
    environment,
    run: uuid(), // Unique ID for the duration of this app run
    endpoints: {},
    keys: {},
  },
  development: {
    environment,
    endpoints: {
      api: 'http://localhost:4000/api',
    },
    keys: {},
  },
};

const config = {
  ...configs.common,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...configs[environment],
};

export default config;
