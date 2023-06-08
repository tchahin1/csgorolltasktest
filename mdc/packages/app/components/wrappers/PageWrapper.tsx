'use client';

interface PageWrapperProps {
  children?: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => (
  <div className='overflow-y-auto h-screen w-[calc(100%_-_254px)]'>
    {children}
  </div>
);

export default PageWrapper;
