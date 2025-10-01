import { tables, ID } from '@/appwrite/config';
import { type Fundraiser } from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DB {
  [key: string]: {
    createRow: (
      payload: Fundraiser,
      permissions: string[],
      id?: string,
    ) => Promise<any>;
    readRow: (id: string, queries: string[]) => Promise<any>;
    updateRow: (
      payload: Fundraiser,
      permissions: string[],
      id: string,
    ) => Promise<any>;
    deleteRow: (id: string) => Promise<any>;
    listRows: (queries: string[]) => Promise<any>;
  };
}

const db = {} as DB;

const tablesIndex = [
  {
    dbId: import.meta.env.VITE_AW_DATABASE_ID as string,
    id: 'fundraisers',
    name: 'Fundraisers',
  },
];

tablesIndex.forEach((table) => {
  db[table.id] = {
    createRow: (payload: Fundraiser, permissions: string[], id = ID.unique()) =>
      tables.createRow({
        databaseId: table.dbId,
        tableId: table.id,
        rowId: id,
        data: payload,
        permissions,
      }),
    readRow: (id: string, queries: string[]) =>
      tables.getRow({
        databaseId: table.dbId,
        tableId: table.id,
        rowId: id,
        queries,
      }),
    updateRow: (payload: Fundraiser, permissions: string[], id: string) =>
      tables.updateRow({
        databaseId: table.dbId,
        tableId: table.id,
        rowId: id,
        data: payload,
        permissions,
      }),
    deleteRow: (id: string) =>
      tables.deleteRow({
        databaseId: table.dbId,
        tableId: table.id,
        rowId: id,
      }),
    listRows: (queries: string[]) =>
      tables.listRows({
        databaseId: table.dbId,
        tableId: table.id,
        queries,
      }),
  };
});

export default db;
