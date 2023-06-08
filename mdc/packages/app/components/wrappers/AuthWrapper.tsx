'use client';

import AuthProvider from '../../providers/auth.provider';
import ProtectedRoutesWrapper from './ProtectedRoutesWrapper';

interface AuthWrapperProps {
  children?: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => (
  <AuthProvider>
    <ProtectedRoutesWrapper>{children}</ProtectedRoutesWrapper>
  </AuthProvider>
);

export default AuthWrapper;
