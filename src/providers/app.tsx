'use client';

import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
import { Chakra } from './chakra';
import { CustomModal } from './custom-modal';

export const AppProviders = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const [appMounted, setAppMounted] = useState(false);

	useEffect(() => {
		setAppMounted(true);
	}, []);

	return (
		<Chakra>
			<RecoilRoot>
				<CustomModal>{appMounted ? children : null}</CustomModal>
			</RecoilRoot>
		</Chakra>
	);
};
