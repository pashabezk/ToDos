SET GLOBAL log_bin_trust_function_creators = 1; # разрешаем создавать функции

# создаём базу данных
drop database if exists todos;
create database todos default charset utf8;
use todos;

# табличка с пользователями
# идентификатор, логин, пароль (в зашифрованном виде)
create table users (id int primary key auto_increment, login varchar(50), password varbinary(50)) engine=MyISAM;

# табличка с задачами
# идентификатор, логин, пароль (в зашифрованном виде)
create table todos (id int primary key auto_increment, owner int, task varchar(300), completed bool, foreign key (owner) references users(id)) engine=MyISAM;


# Создание функций и процедур

drop function if exists auth;
DELIMITER //
create function auth (llogin varchar(50), pswd varchar(50))
returns int
begin
	declare count_users int;

    # делаем запрос, чтобы посчитать сколько пользователей есть с таким логином и паролем (должно быть 1)
    select count(*) into count_users from users where login = llogin and password = AES_ENCRYPT(pswd, "key") ;

    # если не нашлось ни одного пользователя с заданным логином и паролем, то возвращаем -1
    if count_users!=1
 		then select -1 into count_users;
	else # иначе возвращаем идентификатор пользователя
        select id into count_users from users where login = llogin and password = AES_ENCRYPT(pswd, "key") ;
 	end if;

    return count_users;
end; //
DELIMITER ;

drop procedure if exists getTodos;
DELIMITER //
create procedure getTodos (userid int, startFrom int, finishAt int)
begin
	select * from todos where owner=userid limit startFrom, finishAt;
end; //
DELIMITER ;

drop procedure if exists insertTodos;
DELIMITER //
create procedure insertTodos (userid int, todoText varchar(300))
begin
	insert into todos values (default, userid, todoText, false);
end; //
DELIMITER ;

drop procedure if exists setTodoStatus;
DELIMITER //
create procedure setTodoStatus (userid int, todoid int, todostatus bool)
begin
	update todos set completed=todostatus where owner=userid and id=todoid;
end; //
DELIMITER ;

drop procedure if exists deleteTodo;
DELIMITER //
create procedure deleteTodo (userid int, todoid int)
begin
	delete from todos where owner=userid and id=todoid;
end; //
DELIMITER ;


# Примеры вызова функций и процедур:
# select auth("user" , "password") as id;
# call getTodos(2, 5, 10);
# call insertTodos(3, "new todo");
# call setTodoStatus(3, 10, true);
# call setTodoStatus(3, 10, false);
# call deleteTodo(2, 11);