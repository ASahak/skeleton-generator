'use client';

import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
import { Chakra } from './chakra';
import { CustomModal } from './custom-modal';
import { Toast } from './toast';

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
			<Toast>
				<RecoilRoot>
					<CustomModal>{appMounted ? children : null}</CustomModal>
				</RecoilRoot>
			</Toast>
		</Chakra>
	);
};
