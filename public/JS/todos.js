// функция изменения статуса todo
function toggleTodoStatus(checkboxElem) {
	// let xhttp = new XMLHttpRequest(); // создание XMLHttpRequest
	// xhttp.open("GET", "/setTodoStatus?id="+checkboxElem.dataset.id+"&status="+checkboxElem.checked, true);
	// xhttp.send(); // отправка AJAX запроса
	// location.reload(); // перезагрузка страницы, чтобы увидеть изменения
	window.location.href = "/setTodoStatus?id="+checkboxElem.dataset.id+"&status="+checkboxElem.checked; // переход на url для изменения статуса todo
}

// функция для удаления todo
function deleteTodo(id) {
	window.location.href = "/deleteTodo?id="+id; // переход на url для удаления todo
}