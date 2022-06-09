// Load thoughts
document.body.onload = requestServer('GET', '/thoughts/get_thoughts.php', fillDisplay); 

function requestServer(method, url, callback, data) {
    const request = new XMLHttpRequest();

    // GET request doesn't need to set a RequestHeader nor send data.
    if (method === 'GET') {
        request.open('GET', url, true);
        request.send();
    } else if (method === 'POST') {
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send('data=' + encodeURIComponent(JSON.stringify(data)));
    }   

    request.onreadystatechange = function() {
        // if request readyState is DONE and request status is OK then return the response.
        if (request.readyState === 4 && request.status === 200) {
            // Call the callback function and send the response text.
            callback(this.responseText);
        } else {
            console.error(request.statusText);
        }
    }
}

function fillDisplay(items) {
    if (items === undefined) return;

    // Get the display div
    const thoughtsDiv = document.getElementsByClassName('thoughts-list')[0];

    // Clear the display    
    while (thoughtsDiv.firstChild) {
        thoughtsDiv.firstChild.remove();
    }  

    if (!items.length) return;

    // Convert the items string (jsonified) to JSON object.
    items = JSON.parse(items);        

    // Items is an array of arrays. First item is id, second is date, and third is title.
    items.forEach(function(item) {
        const id = document.createElement('span');
        id.className = 'thought-id';
        id.innerText = item[0];

        const date = document.createElement('span');
        date.className = 'thought-date';
        databaseDate = new Date(Number(item[1]));
        date.innerText = databaseDate.toLocaleString();

        const title = document.createElement('span');
        title.className = 'thought-title';
        title.innerText = item[2];

        const thought = document.createElement('div');
        thought.className = 'thought';
        thought.appendChild(id);
        thought.appendChild(title);
        thought.appendChild(date);

        thought.addEventListener('click', () => thoughtView(id.innerText)); 
        
        thoughtsDiv.appendChild(thought);
    });
} 

/* ******************************MODAL FOR THOUGHT CREATION***************************************** */
{
    let dateInput = null;
    // When user click on "New Thought" button, open the "modalCreateThought" modal.
    document.getElementsByName('create')[0].addEventListener('click', function() {
        modal.style.display = 'block';
        // Creation date 
        dateInput = new Date();
        document.getElementsByName('input-date')[0].value = dateInput.toLocaleString(); 
    });

    // Get modal window.
    const modal = document.getElementsByName('create-thought')[0];
    // Get creation form
    const form = document.getElementsByName('form-create-thought')[0];
    // Get title input.
    const titleInput = document.getElementsByName('input-title');
    // Get content input.
    const contentInput = document.getElementsByName('input-content');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Create a thought object.     
        const thought = {
            'date': dateInput.getTime(),
            'title': titleInput.value, 
            'content': contentInput.value
        };

        // Send the object to server.            
        requestServer('POST', '/thoughts/new_thought.php', feedbackCreation, thought);

    });  

    // Function to receive the server response and give a feedback to user. 
    function feedbackCreation(created) {
        if (created) {
            window.alert('Thought created successfully!');
            form.reset();

            // Close the creation modal.
            modal.style.display = 'none';

            // Reset the thoughts display.
            requestServer('GET', '/thoughts/get_thoughts.php', fillDisplay);
        } else {
            window.alert('Something wrong happened.');
        }        
    }
    
    // When user click on close button of "modalCreateThought" modal, verify the decision and close it.
    document.getElementsByClassName('m-creation-close')[0].onclick = function() {
        if (confirm('Are you sure you want to close?\nAll the changes will be lost.')) {
            modal.style.display = 'none';
        }
    }
}
/* ******************************MODAL FOR THOUGHT CREATION***************************************** */

/* *******************************MODAL FOR THOUGHT VIEW****************************************** */
{
    // Get modal window.
    const modal = document.getElementsByClassName('thought-view')[0];
    // Get modal id label.
    const idLabel = document.getElementsByName('m-thought-id')[0];
    // Get modal date.
    const dateField = document.getElementsByClassName('m-thought-date')[0];
    // Get modal title.
    const titleField = document.getElementsByClassName('m-thought-title')[0];
    // Get modal content.
    const contentField = document.getElementsByClassName('m-thought-content');

    function thoughtView(id) {

        //Show the modal.
        modal.style.display = 'block';

        idLabel.innerText = id;

        // Set modal date to date of thought clicked .
        requestServer('GET', `/thoughts/get_thought_info.php?what=date&id=${id}`, function(responseText) {
            dateField.innerText = new Date(Number(responseText)).toLocaleString();
        });

        // Set modal title to title of thought clicked.
        requestServer('GET', `/thoughts/get_thought_info.php?what=title&id=${id}`, function(responseText) {
            titleField.innerText = responseText;
        });

        // Set modal content to content of thought clicked.
        requestServer('GET', `/thoughts/get_thought_info.php?what=content&id=${id}`, function(responseText) {
            contentField.innerText = responseText;
        }); 
    }

    // When user click on close button of "m-thought-view" modal, close it.
    document.getElementsByClassName('m-view-close')[0].onclick = function() {
        modal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it.
    window.onclick = function(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }

    document.getElementsByName('delete')[0].addEventListener('click', function(e) {
        if (confirm('Are you sure you want to delete this thought?')) {
            requestServer('POST', '/thoughts/del-thought.php', feedbackDeletion, {id: Number(idLabel.innerText)});
        }
    })

    // Function to receive the server response and give a feedback to user. 
    function feedbackDeletion(deleted) {
        if (deleted) {
            window.alert('Thought deleted successfully!');

            // Close the view modal.
            modal.style.display = 'none';

            // Reset the thoughts display.
            setTimeout(requestServer, 20, 'GET', '/thoughts/get_toughts.php', fillDisplay);
        } else {
            window.alert('Something wrong happened.');
        }        
    }
}
/* *******************************MODAL FOR THOUGHT VIEW****************************************** */

/* *********************************SEARCH SYSTEM********************************************* */
{
    const searchForm = document.getElementsByName('form-search-thoughts')[0];
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Verify if the input is valid
        const input = searchForm.firstElementChild.value;

        if (input == '') return; 

        // GET the items who match the search criteria from server and display the results. 
        setTimeout(requestServer, 20, 'GET', '/thoughts/get_thoughts.php', fillDisplay);
    })

    searchForm.addEventListener('reset', function() {
        requestServer('GET', '/thoughts/get_thoughts.php', fillDisplay);
    });
}
/* *********************************SEARCH SYSTEM********************************************* */

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