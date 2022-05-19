<?php

// Connect to the mysql server.
$mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
if ($mysqli->connect_error) 
{
    echo "Connect error: " . $mysqli->connect_error;
    exit();
}

$id = $_GET["id"];

switch ($_GET['what'])
{
    case 'date':
        echo $mysqli->query("SELECT date FROM books_review WHERE id=$id")->fetch_assoc()['date'];
        break;
    case 'rating':
        echo $mysqli->query("SELECT rating FROM books_review WHERE id=$id")->fetch_assoc()['rating'];
        break;
    case 'title':
        echo $mysqli->query("SELECT book_title FROM books_review WHERE id=$id")->fetch_assoc()['book_title'];
        break;
    case 'review':
        echo $mysqli->query("SELECT review FROM books_review WHERE id=$id")->fetch_assoc()['review'];
        break;
}  

$mysqli->close();

?>