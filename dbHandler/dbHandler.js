const mysql = require('mysql2/promise');
const {dbConfig} = require('../config');

let DB; // переменная с подключением к БД

exports.createDBConnection = async () => {
	try {
		DB = await mysql.createConnection({
			host: dbConfig.host,
			user: dbConfig.user,
			password: dbConfig.password,
			database: dbConfig.database,
			port: dbConfig.port
		});
		return true;
	}
	catch (err) {
		return false;
	}
}

exports.checkConnection = () => {
	DB.connect(function (err) {
		if (err) throw err;
		console.log("Connected!");
	});
};

// возвращает идентификатор в случае успешной авторизации
// в случае неудачи возвращает -1
exports.auth = async (login, password) => {
	const [rows, fields] = await DB.execute(`select auth("${login}", "${password}") as id`);
	return rows[0].id;
};

// возвращает список todos по идентификатору пользователя
// startFrom, finishAT - численные значения для pagination
exports.getTodos = async (userId, startFrom = 0, finishAT = 10) => {
	const [rows, fields] = await DB.execute(`call getTodos(${userId}, ${startFrom}, ${finishAT})`);
	return rows[0];
};

exports.insertTodos = async (userId, text) => {
	await DB.execute(`call insertTodos(${userId}, "${text}")`);
};

exports.setTodoStatus = async (userId, todoId, status) => {
	await DB.execute(`call setTodoStatus(${userId}, ${todoId}, ${status})`);
};

exports.deleteTodo = async (userId, todoId) => {
	await DB.execute(`call deleteTodo(${userId}, ${todoId})`);
};