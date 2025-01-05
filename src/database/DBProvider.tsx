/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { DBContext } from './databaseContext';
import Database from './database';
import ScreenLoader from '../components/ScreenLoader';



export function DBProvider({ children }: any) {
	const [DB, setDB] = useState<Database>();

	useEffect(() => {
		Database.createInstance().then(setDB);
		return () => DB?.close();
	}, []);

	if (!DB) return <ScreenLoader />;

	return <DBContext.Provider value={DB} children={children} />;
}
