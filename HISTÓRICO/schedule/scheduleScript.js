function reset() {
    // Load todo list
    requestServer('GET', '/schedule/get_todo.php', fillTodo); 
    // Load history list
    requestServer('GET', '/schedule/get_history.php', fillHistory);
}

document.body.onload = reset();

function requestServer(method, url, callback, data) {
    const request = new XMLHttpRequest();

    // GET request doesn't need to set a RequestHeader nor send data.
    if (method === 'GET') {
        request.open('GET', url, true);
        request.send();     
        
        request.onreadystatechange = function() {
            // if request readyState is DONE and request status is OK then return the response.
            if (this.readyState === 4 && this.status === 200) {
                // Call the callback function and send the response text.
                callback(this.responseText);
            } else {                
                console.error(request.statusText);
            }
        }    
    } else if (method === 'POST') {
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send('data=' + encodeURIComponent(JSON.stringify(data)));
    }    
}

//Update todo list view
function fillTodo(items) {
    if (items === undefined) return;

    // Get the todo display div
    const todoList = document.getElementsByClassName('todo-list')[0];

    // Clear the display
    while (todoList.firstChild) {
        todoList.firstChild.remove();
    }

    if (!items.length) return;
    
    // Convert the items string (jsonified) to JSON object.
    items = JSON.parse(items);  
    
    // 'Items' is an array of arrays. First item is id, second is date, third is task, fourth  
    // is status.    
    items.forEach(function(i) {        
        const id = document.createElement('span');
        id.className = 'item-id';
        id.innerText = i[0]       

        const date = document.createElement('span');
        date.className = 'item-date';
        date.innerText = new Date(Number(i[1])).toLocaleString();

        const task = document.createElement('span');
        task.innerText = i[2];

        const item = document.createElement('li');
        item.className = 'todo-item';
        if (i[3] === 'checked') {
            item.className += ' checked';     
        }
        item.appendChild(id);
        item.appendChild(task);
        item.appendChild(date);

        todoList.appendChild(item);

        // If a user click on the item, toggle item class to 'checked'.
        item.addEventListener('click', function() {
            requestServer('POST', '/schedule/toggle_status.php', null, {id: Number(id.innerText)});
            this.classList.toggle('checked');
        }); 
    });
}

//Update history list
function fillHistory(items) {
    if (items === undefined) return;

    // Get the history display div
    const historyList = document.getElementsByClassName('history-list')[0];

    // Clear the display
    while (historyList.firstChild) {
        historyList.firstChild.remove();
    }

    if (!items.length) return;

    // Convert the items string (jsonified) to JSON object.
    items = JSON.parse(items);
    
    // Items is an array of arrays. First item is id, second is date, third is task.
    items.forEach(function(i) {
        const id = document.createElement('span');
        id.className = 'item-id';
        id.innerText = i[0]

        const date = document.createElement('span');
        date.className = 'item-date';
        date.innerText = new Date(Number(i[1])).toLocaleString();

        const task = document.createElement('span');
        task.innerText = i[2];

        const item = document.createElement('li');
        item.className = 'history-item';
        item.appendChild(id);
        item.appendChild(task);
        item.appendChild(date);

        historyList.appendChild(item);
    });
}

//Save new item on server
document.getElementsByTagName('form')[0].addEventListener("submit", function(e) {     
    e.preventDefault();
    taskInput = document.getElementsByClassName('input-default')[0];
    if (taskInput.value == '') return;

    const item = {
        "date": new Date().getTime(),
        "status": 'todo',
        "task": taskInput.value   
    }

    requestServer('POST', '/schedule/new_item.php', null, item);     
    setTimeout(requestServer, 50, 'GET', '/schedule/get_todo.php', fillTodo);

    taskInput.value = '';
});

// Delete unfinished items
document.getElementsByName("delete-unfinished")[0].addEventListener("click", function() {
    // POST to server, delete unclosed TO DO items.
    const todoItems = Array.from(document.getElementsByClassName("todo-item")); 

    if (!todoItems.length) return;

    const unclosedItems = new Array();
    todoItems.forEach(element => {
        if (!element.className.includes('checked')) {
            unclosedItems.push(Number(element.firstElementChild.innerText));
        }
    });

    requestServer('POST', '/schedule/del_unfinished.php', null, unclosedItems);

    setTimeout(reset, 50);
});

// Move finished items to history
document.getElementsByName("move-history")[0].addEventListener("click", function() {
    // POST to server, move closed items from TODO list to history.
    const closedItems = Array.from(document.getElementsByClassName("checked")); 

    if (!closedItems.length) return;

    const items = new Array();
    closedItems.forEach(function(i) {
        items.push(Number(i.firstElementChild.innerText));
    }) 

    requestServer('POST', '/schedule/move_history.php', null, items);

    setTimeout(reset, 50);
});

/* *********************************RESPONSIVE MENU********************************************* */
{
    const topNav = document.getElementsByClassName('top-nav')[0];
    topNav.lastElementChild.addEventListener('click', function () {
        if (topNav.className === 'top-nav') {
            topNav.className += ' responsive';
        } else {
            topNav.className = 'top-nav';
        }
    });
}
/* *********************************RESPONSIVE MENU********************************************* */
