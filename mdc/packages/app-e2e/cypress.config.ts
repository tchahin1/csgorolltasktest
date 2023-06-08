import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: nxE2EPreset(__dirname),

  env: {
    appBaseUrl: 'http://localhost:3000/',
    appSignupUrl: 'http://localhost:3000/auth/signup',
    appLoginUrl: 'http://localhost:3000/auth/login',
  },
});
