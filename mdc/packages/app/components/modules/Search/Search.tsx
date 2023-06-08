'use client';

import { SearchInput } from '@ankora/ui-library';
import { useState } from 'react';

const Search = () => {
  const [value, setValue] = useState<string>('');
  const onSubmit = () => console.log('TODO: Handle search', value);
  return (
    <SearchInput
      onSubmit={onSubmit}
      value={value}
      onChange={(value: string) => setValue(value)}
      placeholder='Search for players ...'
    />
  );
};

export default Search;
