import { createContext, useContext } from 'react';
import Database from './database';

export const DBContext = createContext<Database>(null as any);

export default function useDB() {
    const context = useContext(DBContext);

    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}