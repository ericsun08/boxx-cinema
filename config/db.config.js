module.exports = {
    HOST: "database-1.cdk0qz7xfz4x.ap-southeast-2.rds.amazonaws.com",
    PORT: "1433",
    USER: "admin",
    PASSWORD: "Ashwioon12!",
    DB: "Boxx_db",
    dialect: "mssql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}