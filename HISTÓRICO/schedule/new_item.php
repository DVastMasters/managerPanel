<?php

// Connect to the mysql server.
$mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
if ($mysqli->connect_error) 
{
    echo "Connect error: " . $mysqli->connect_error;
    exit();
}

// Create a JSON object.
$data = json_decode($_POST['data']);

// Get 0 if schedule tables is empty, otherwise get the last id in the table.
$last_id = $mysqli->query("SELECT CASE 
                                      WHEN EXISTS(SELECT 1 FROM schedule) 
                                        THEN(SELECT id FROM schedule ORDER BY id DESC LIMIT 1)
                                      ELSE 0
                                  END AS id")->fetch_assoc()['id'];  

// Insert a new item into the database with the last id + 1.
$mysqli->query("INSERT INTO schedule VALUES ($last_id+1,$data->date,'$data->task','$data->status')");

$mysqli->close();

?>