# пример вставки данных в таблицу users
insert into users values (default, "login", AES_ENCRYPT("pswd", "key"));
insert into users values (default, "ann", AES_ENCRYPT("july12", "key"));
insert into users values (default, "pavel", AES_ENCRYPT("1234", "key"));

# пример вставки данных в таблицу users
insert into todos values (default, 0, "Задачка№1", false);
insert into todos values (default, 0, "Задачка№2", false);
insert into todos values (default, 1, "Задачка№3", false);
insert into todos values (default, 0, "Задачка№4", true);
insert into todos values (default, 0, "Задачка№5", true);
insert into todos values (default, 2, "Задачка№6", true);
insert into todos values (default, 2, "Задачка№7", true);
insert into todos values (default, 3, "Задачка№8", false);
insert into todos values (default, 3, "Задачка№9", false);