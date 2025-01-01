import { useEffect, useState } from 'react';
import Database from './model';
import { DBContext } from './databaseContext';

const DB_NAME = 'cuymodoro-db';
const DB_VERSION = 1;

export function DBProvider({ children }: any) {
	const [DB, setDB] = useState<Database>();
	
	useEffect(() => {
		Database.createInstance(DB_NAME, DB_VERSION).then((e) => {
			setDB(e);
		});

		return () => DB?.close();
	}, [DB]);

	if (!DB) return 'loading .... ';

	return <DBContext.Provider value={DB} children={children} />;
}
