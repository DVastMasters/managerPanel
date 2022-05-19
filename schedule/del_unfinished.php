<?php

// Connect to the mysql server.
$mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
if ($mysqli->connect_error) 
{
    echo "Connect error: " . $mysqli->connect_error;
    exit();
}

$ids = json_decode($_POST['data']);

$mysqli->query("DELETE FROM schedule WHERE id IN (" . implode(",",$ids) . ")");

$mysqli->close();

?>