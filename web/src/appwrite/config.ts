import { ID, Client, Account, Storage, TablesDB, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_AW_ENDPOINT)
  .setProject(import.meta.env.VITE_AW_PROJECT_ID);

const account = new Account(client);

const storage = new Storage(client);
const BUCKET_ID = '68d06be40023ec9d2fc8';

const tables = new TablesDB(client);

export { account, storage, tables, Query, BUCKET_ID, ID };
