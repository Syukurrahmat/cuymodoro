import { createContext, useContext } from 'react';

// type DBContext = {}

export const DBContext = createContext<DBContext>(null as any);

export default function useDB() {
    const context = useContext(DBContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}