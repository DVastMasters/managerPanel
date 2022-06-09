<?php

// Connect to the mysql server.
$mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
if ($mysqli->connect_error) 
{
    echo "Connect error: " . $mysqli->connect_error;
    exit();
}

$param = $_GET['param'];

$table = $mysqli->query("SELECT * FROM thoughts WHERE title LIKE '%$param%'");

$items = [];
for ($i = 0, $last_row = $table->num_rows; $i < $last_row; $i++)
{
    $row = $table->fetch_assoc();
    $item = array($row['id'],$row['date'],$row['title']);
    array_push($items, $item);
}

if (count($items))
{
    echo json_encode($items);
}
else
{
    echo "";
}

$mysqli->close();

?>