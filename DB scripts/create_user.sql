# создание пользователя
DROP USER if exists 'todosuser'@'%';
CREATE USER 'todosuser'@'%' IDENTIFIED with mysql_native_password BY '1234';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON todos.* TO 'todosuser'@'%';
FLUSH PRIVILEGES;

# SELECT host, user, password_expired FROM mysql.user; # посмотреть созданных пользователей