/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { DBContext } from './databaseContext';
import Database from './database';

const DB_NAME = 'cuymodoro-db';
const DB_VERSION = 1;

export function DBProvider({ children }: any) {
	const [DB, setDB] = useState<Database>();

	useEffect(() => {
		Database.createInstance(DB_NAME, DB_VERSION).then(setDB);
		return () => DB?.close();
	}, []);

	if (!DB) return 'loading .... ';

	return <DBContext.Provider value={DB} children={children} />;
}
