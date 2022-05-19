<?php

// Connect to the mysql server.
$mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
if ($mysqli->connect_error) 
{
    echo "Connect error: " . $mysqli->connect_error;
    exit();
}

$data = json_decode($_POST['data']);

$result = $mysqli->query("DELETE FROM books_review WHERE id=$data->id");
if (!$result)
{
    echo false;
}
else
{
    echo true;    
}

$mysqli->close();

?>