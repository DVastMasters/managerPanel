<?php

// Connect to the mysql server.
$mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
if ($mysqli->connect_error) 
{
    echo "Connect error: " . $mysqli->connect_error;
    exit();
}

$id = $_GET["id"];

if ($_GET['what'] == 'date') 
{
    echo $mysqli->query("SELECT date FROM thoughts WHERE id=$id")->fetch_assoc()['date'];     
}

if ($_GET['what'] == 'title') 
{
    echo $mysqli->query("SELECT title FROM thoughts WHERE id=$id")->fetch_assoc()['title'];     
}

if ($_GET['what'] == 'content') 
{
    echo $mysqli->query("SELECT content FROM thoughts WHERE id=$id")->fetch_assoc()['content'];     
}

$mysqli->close();

?>