class Config {
    constructor() {
       this.db_username = process.env.DB_USERNAME
       this.db_password = process.env.DB_PASSWORD
       this.db_host = process.env.DB_HOST
       this.db_port = process.env.DB_PORT
       this.db_options =  process.env.DB_OPTIONS
    } 
}

module.exports = Config

