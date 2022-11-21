const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const DB = require("./dbHandler/dbHandler");
const {tokenConfig} = require('./config');


const app = express(); // создаем приложение с помощью express
app.set("view engine", "pug"); // подключаем движок Pug
app.use(express.static(__dirname + "/public")); // подключение статичных файлов

// для поддержки параметров, передаваемых через post-запросы
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

// подключение возможности использования сессий
// https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
	secret: tokenConfig.tokenKey,
	saveUninitialized: true,
	cookie: {maxAge: oneDay},
	resave: false
}));

// middleware функция для проверки является ли пользователь авторизованным
const withAuth = (request, response, next) => {
	let session = request.session;
	// если внутри сессии уже есть идентификатор пользователя, значит он уже авторизован
	// в таком случае переходим к следующей функции
	// иначе редиректим на страничку авторизации
	if (session.userid)
		next();
	else
		response.redirect('/login');
}

app.get("/login", (request, response) => {
	let session = request.session;
	if (session.userid) // если пользователь уже авторизован, то редирект на главную страницу
		response.redirect('/');
	else // иначе рендеринг странички авторизации
		response.render("login", {
			isAuth: false,
			title: "ToDos: Авторизация"
		});
});

app.post("/login", async (request, response) => {
	let session = request.session;
	const id = await DB.auth(request.body.login, request.body.password); // попытка обнаружить пользователя с таким логином и паролем
	if (id >= 0) { // если пользователь с таким логином и паролем существует, то редиректим его на главную страницу
		session.userid = id;
		response.redirect('/');
	} else // иначе делаем ререндеринг странички с выводом ошибки
		response.render("login", {
			isAuth: false,
			message: "Некорректный логин или пароль",
			title: "ToDos: Авторизация"
		});
});

app.get("/logout", (request, response) => {
	request.session.destroy();
	response.redirect('/login');
});

app.get("/newTodo", withAuth, (request, response) => {
	response.render("new-todo", {
		isAuth: true,
		title: "ToDos: Добавление задания"
	});
});

app.get("/setTodoStatus", withAuth, async (request, response) => {
	await DB.setTodoStatus(request.session.userid, request.query.id, request.query.status); // установка статуса todo
	response.redirect('/'); // перенаправление на главную страницу
});

app.get("/deleteTodo", withAuth, async (request, response) => {
	await DB.deleteTodo(request.session.userid, request.query.id); // удаление todo
	response.redirect('/'); // перенаправление на главную страницу
});

app.post("/newTodo", withAuth, async (request, response) => {
	let session = request.session;
	try {
		await DB.insertTodos(session.userid, request.body.text); // попытка вставить запись в базу данных
		response.redirect('/'); // перенаправление на главную страницу
	} catch (err) {
		response.render("new-todo", {
			isAuth: true,
			message: "Возникла какая-то ошибка, повторите позднее",
			title: "ToDos: Добавление задания"
		});
	}
});

app.get("/", withAuth, async (request, response) => {
	let session = request.session;
	const todos = await DB.getTodos(session.userid);
	response.render("index", {
		isAuth: true,
		title: "ToDos: Главная",
		todos: todos
	});
});

// функция старта приложения
async function start() {
	try {
		await DB.createDBConnection(); // подключение к базе данных
		app.listen(3000); // запуск прослушивания сервера
	} catch (e) {
		console.log(e);
	}
}

start();
