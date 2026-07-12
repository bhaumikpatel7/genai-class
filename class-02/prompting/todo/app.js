
document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById("add-todo");
    const inputField = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");

    addButton.addEventListener("click", function() {
        const task = inputField.value;
        if (task) {
            const listItem = document.createElement("li");
            listItem.textContent = task + " - You can totally procrastinate this!";
            todoList.appendChild(listItem);
            inputField.value = "";
        } else {
            alert("Please enter a task before adding to the circus!");
        }
    });
});

