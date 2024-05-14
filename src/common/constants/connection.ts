export const connection: Connection = {
    CONNECTION_STRING: 'postgresql://localost:5432/education',
    DB: 'POSTGRESQL',
    DBNAME: 'education'
}
export type Connection = {
    CONNECTION_STRING: string;
    DB: string;
    DBNAME: string
}