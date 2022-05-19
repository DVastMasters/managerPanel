// Load reviews
document.body.onload = requestServer('GET', '/books/get_books.php', fillDisplay); 

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
    const booksDiv = document.getElementsByClassName('books-list')[0];

    // Clear the display
    while (booksDiv.firstChild) {
        booksDiv.firstChild.remove();
    }      

    if (!items.length) return;

    // Convert the items string (jsonified) to JSON object.
    items = JSON.parse(items);    

    // Items is an array of arrays. First item is id, second is date, and third is title.
    items.forEach(function(item) {
        const id = document.createElement('span');
        id.className = 'book-id';
        id.innerText = item[0];

        const date = document.createElement('span');
        date.className = 'book-date';
        date.innerText = new Date(Number(item[1])).toLocaleString();

        const title = document.createElement('span');
        title.className = 'book-title';
        title.innerText = item[2];

        const book = document.createElement('div');
        book.className = 'book';
        book.appendChild(id);
        book.appendChild(title);
        book.appendChild(date);

        book.addEventListener('click', () => bookView(id.innerText)); 
        
        booksDiv.appendChild(book);
    });
} 

/* ******************************MODAL FOR REVIEW CREATION***************************************** */
{
    // Get modal window.
    const modal = document.getElementsByName('create-review')[0];
    // Get creation form
    const form = document.getElementsByName('form-create-review')[0];
    // Get title input.
    const inputTitle = document.getElementsByName('input-title')[0];
    // Get rating input.
    const inputRating = document.getElementsByName('input-rating')[0];
    // Get content input.
    const inputReview = document.getElementsByName('input-review')[0];

    // When user click on "New Review" button, open the "modalCreateReview" modal.
    document.getElementsByName("create")[0].addEventListener("click", function() {
        modal.style.display = "block";
        // Creation date 
        const inputDate = new Date();
        document.getElementById('input-date').value = inputDate.toLocaleString(); 
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Create a book object.     
        const book = {
            "date": inputDate.getTime(),
            "rating": inputRating.value,
            "title": inputTitle.value, 
            "review": inputReview.value
        };

        // Send the object to server.            
        requestServer('POST', '/books/new_book.php', feedbackCreation, book);

    });  

    // Function to receive the server response and give a feedback to user. 
    function feedbackCreation(created) {
        if (created) {
            window.alert('Review created successfully!');
            form.reset();

            // Close the creation modal.
            modal.style.display = "none";

            // Reset the thoughts display.
            requestServer('GET', '/books/get_books.php', fillDisplay);
        } else {
            window.alert('Something wrong happened.');
        }        
    }
    
    // When user click on close button of "modalCreateBook" modal, verify the decision and close it.
    document.getElementsByClassName("m-creation-close")[0].onclick = function() {
        if (confirm("Are you sure you want to close?\nAll the changes will be lost.")) {
            modal.style.display = "none";
        }
    }
}
/* ******************************MODAL FOR THOUGHT CREATION***************************************** */

/* *******************************MODAL FOR THOUGHT VIEW****************************************** */
{
    // Get modal window.
    const modal = document.getElementsByClassName("review-view")[0];
    // Get modal id label.
    const idLabel = document.getElementsByClassName('review-id')[0];
    // Get modal date.
    const fieldDate = document.getElementsByClassName("m-review-date")[0];
    // Get modal title.
    const fieldTitle = document.getElementsByClassName("m-book-title")[0];
    // Get modal rating.
    const fieldRating = document.getElementsByClassName("m-book-rating")[0];
    // Get modal review.
    const fieldReview = document.getElementsByClassName("m-review-content")[0];

    function bookView(id) {

        //Show the modal.
        modal.style.display = "block";

        idLabel.innerText = id;

        // Set modal date to date of book clicked .
        requestServer('GET', `/books/get_book_info.php?what=date&id=${id}`, function(responseText) {
            fieldDate.innerText = new Date(Number(responseText)).toLocaleString();
        });

        // Set modal title to title of book clicked.
        requestServer('GET', `/books/get_book_info.php?what=title&id=${id}`, function(responseText) {
            fieldTitle.innerText = responseText;
        });

        // Set modal rating to rating of book clicked.
        requestServer('GET', `/books/get_book_info.php?what=rating&id=${id}`, function(responseText) {
            fieldRating.innerText = responseText;
        });

        // Set modal content to content of book clicked.
        requestServer('GET', `/books/get_book_info.php?what=review&id=${id}`, function(responseText) {
            fieldReview.innerText = responseText;
        }); 
    }

    // When user click on close button of "review-view" modal, close it.
    document.getElementsByClassName("m-view-close")[0].onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it.
    window.onclick = function(e) {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementsByName('delete')[0].addEventListener('click', function(e) {
        if (confirm('Are you sure you want to delete this review?')) {
            requestServer('POST', '/books/del_book.php', feedbackDeletion, {id: Number(idLabel.innerText)});
        }
    })

    // Function to receive the server response and give a feedback to user. 
    function feedbackDeletion(deleted) {
        if (deleted) {
            window.alert('Review deleted successfully!');

            // Close the view modal.
            modal.style.display = "none";

            // Reset the books display.
            requestServer('GET', '/books/get_books.php', fillDisplay);
        } else {
            window.alert('Something wrong happened.');
        }        
    }
}
/* *******************************MODAL FOR THOUGHT VIEW****************************************** */

/* *********************************SEARCH SYSTEM********************************************* */
{
    const searchForm = document.getElementsByName('form-search-books')[0];
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Verify if the input is valid
        const input = searchForm.firstElementChild.value;

        // GET the items who match the search criteria from server and display the results. 
        requestServer('GET', `/books/search.php?param=${input}`, fillDisplay);
    });

    searchForm.addEventListener('reset', function() {
        requestServer('GET', '/books/get_books.php', fillDisplay);
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