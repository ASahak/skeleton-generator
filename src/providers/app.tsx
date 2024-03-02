'use client';

import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
import { Chakra } from './chakra';

export const AppProviders = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [appMounted, setAppMounted] = useState(false);


  useEffect(() => {
    setAppMounted(true);
  }, []);

  return (
    <Chakra>
      <RecoilRoot>
        {appMounted ? children : null}
      </RecoilRoot>
    </Chakra>
  )
}
