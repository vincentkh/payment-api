const secrets = {
  dbUri: process.env.DB_URI || 'mongodb://ujx109dlvufgblc2ryme:uUVnLxfFnkIg00oKOjp2@bj27hinyoztkbqg-mongodb.services.clever-cloud.com:27017/bj27hinyoztkbqg',
};

module.exports = { 
	getSecret: (key) => secrets[key]
};