<?php

// Connect to the mysql server.
$mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
if ($mysqli->connect_error) 
{
    echo "Connect error: " . $mysqli->connect_error;
    exit();
}

$data = json_decode($_POST['data']);

$table = $mysqli->query("SELECT status FROM schedule WHERE id=$data->id");

if ($table->fetch_assoc()['status'] == 'todo') 
{
    echo 'todo';
    $mysqli->query("UPDATE schedule SET status='checked' WHERE id=$data->id");
}
else
{
    echo 'checked';
    $mysqli->query("UPDATE schedule SET status='todo' WHERE id=$data->id");
}

$mysqli->close();

?>