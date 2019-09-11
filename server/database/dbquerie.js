import Environment from '../config/database';

class Database extends Environment {
  static dbConnection() {
    return Environment.dbConnection();
  }

  static createTables() {
    const conn = this.dbConnection();
    const result = conn.query(`
      CREATE TABLE IF NOT EXISTS users( 
        id SERIAL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(50) NOT NULL,
        bio VARCHAR(500) NOT NULL,
        occupation VARCHAR(500) NOT NULL,
        expertise VARCHAR(500) NOT NULL,
        type VARCHAR(50) NOT NULL,
        PRIMARY KEY (id));

    CREATE TABLE IF NOT EXISTs sessions(
        id SERIAL,
        mentorId INT references users(id) ON DELETE CASCADE,
        menteeId INT references users(id) ON DELETE CASCADE,
        questions VARCHAR(500) NOT NULL,
        menteeEmail VARCHAR(50) NOT NULL,
        status VARCHAR(500) NOT NULL,
        PRIMARY KEY(id));

    CREATE TABLE IF NOT EXISTs sessionReview(
        id SERIAL,
        sessionId INT references sessions(id) ON DELETE CASCADE,
        mentorId INT references users(id) ON DELETE CASCADE,
        menteeId INT references users(id) ON DELETE CASCADE,
        score INT,
        remark VARCHAR(500) NOT NULL,
        status VARCHAR(50) NOT NULL,
        PRIMARY KEY(id));
    `);
    return result;
  }

  static async createUser(data) {
    const conn = this.dbConnection();
    const result = await conn.query(`INSERT INTO users(firstName, lastName, email, password, address, bio, occupation, expertise,type) VALUES(
      '${data.firstName}',
      '${data.lastName}',
      '${data.email}',
      '${data.password}',
      '${data.address}',
      '${data.bio}',
      '${data.occupation}',
      '${data.expertise}',
      '${data.type}'
      ) returning *;`);
    await conn.end();
    return result;
  }

  static async createSesion(data) {
    const conn = this.dbConnection();
    const result = await conn.query(`INSERT INTO sessions(mentorid,menteeid,questions,menteeemail,status) VALUES(
      ${data.mentorId},
      ${data.menteeId},
      '${data.questions}',
      '${data.menteeEmail}',
      '${data.status}'
     ) returning * `);
    await conn.end();
    return result;
  }
  
  static async selectBy(table, column, value) {
    const conn = this.dbConnection();
    const result = await conn.query(`SELECT * FROM ${table} WHERE ${column}='${value}'`);
    await conn.end();
    return result;
  }

  static async selectBy2colum(table, column1, value1, column2, value2, logGate) {
    const conn = this.dbConnection();
    const result = await conn.query(`SELECT * FROM ${table} WHERE ${column1}='${value1}' ${logGate} ${column2}='${value2}'`);
    await conn.end();
    return result;
  }

  static async selectAll(tableName) {
    const conn = this.dbConnection();
    const result = await conn.query(`SELECT * FROM ${tableName};`);
    await conn.end();
    return result;
  }
  
  static async update(tableName, column, value, type2, value2) {
    const conn = this.dbConnection();
    const result = await conn.query(`update ${tableName} set ${column}='${value}' WHERE ${type2} = '${value2}' returning *`);
    await conn.end();
    return result;
  }

  static async selectBy3colum(table, column1, value1, column2, value2, column3, value3, logGate1, logGet2) {
    const conn = this.dbConnection();
    const result = await conn.query(`SELECT * FROM ${table} WHERE ${column1}='${value1}' ${logGate1} (${column2}='${value2}' ${logGet2} ${column3} = '${value3}')`);
    await conn.end();
    return result;
  }
}

export default Database;
