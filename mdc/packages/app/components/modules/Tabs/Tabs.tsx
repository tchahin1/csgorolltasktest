'use client';

import classNames from 'classnames';
import { useEffect, useState } from 'react';

interface TabsProps {
  tabs: {
    title: string;
    content: JSX.Element;
    disabled?: boolean;
    key: string;
    dataCy?: string;
  }[];
  itemClassNames?: string;
  secondaryVariant?: boolean;
}

export const Tabs = ({ tabs, itemClassNames, secondaryVariant }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState<string>();

  const keys = tabs.map((el) => el.key);
  useEffect(() => {
    if (!selectedTab) setSelectedTab(keys[0]);
  }, [keys, selectedTab]);

  return (
    <div>
      <div
        className={classNames('rounded-lg flex w-full mb-4 overflow-auto', {
          'justify-between': !secondaryVariant,
        })}
      >
        {tabs.map((tab, index) => (
          <div
            data-cy={tab.dataCy}
            onClick={() => setSelectedTab(tab.key)}
            key={tab.title}
            className={classNames(
              'min-w-[170px] flex justify-center items-center transition-all cursor-pointer py-4',
              {
                ['border-gray-600 border-r border-solid']:
                  tabs.length !== index + 1 && !secondaryVariant,
              },
              {
                ['hover:rounded-r-lg']:
                  tabs.length == index + 1 && !secondaryVariant,
              },
              {
                ['hover:rounded-l-lg']: index === 0 && !secondaryVariant,
              },
              {
                ['bg-gray-700']: selectedTab === tab.key && !secondaryVariant,
              },

              {
                [`${itemClassNames}`]: itemClassNames,
              },
              {
                ['w-full bg-gray-800 hover:bg-gray-700']: !secondaryVariant,
              },
              {
                ['border-b border-gray-600']: secondaryVariant,
              },

              {
                ['border-primary-600']:
                  secondaryVariant && selectedTab === tab.key,
              },
            )}
          >
            <p
              className={classNames('text-sm', {
                ['text-gray-400']: !secondaryVariant,
                ['text-gray-300']: secondaryVariant,
                ['!text-white']: selectedTab === tab.key && !secondaryVariant,
                ['!text-primary-600 font-semibold transition-all']:
                  selectedTab === tab.key && secondaryVariant,
              })}
            >
              {tab.title}
            </p>
          </div>
        ))}
      </div>
      {tabs.find((tab) => tab.key === selectedTab)?.content}
    </div>
  );
};
