import Database from './dbquerie';

const { admin } = process.env;
const NewAdmin = JSON.parse(admin);

const createAdmin = async () => {
  const conn = Database.dbConnection();
  const result = await conn.query(`INSERT into users (firstname, lastname, email, password, address, bio, occupation, expertise,type ) VALUES (
    '${NewAdmin.firstname}',
    '${NewAdmin.lastname}',
    '${NewAdmin.email}',
    '${NewAdmin.password}',
    '${NewAdmin.address}',
    '${NewAdmin.bio}',
    '${NewAdmin.occupation}',
    '${NewAdmin.expertise}',
    '${NewAdmin.type}') on conflict (email) do nothing
    returning *`);
  await conn.end();

  return result;
};

createAdmin();
