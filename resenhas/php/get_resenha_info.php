<?php

    $mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
    if ($mysqli->connect_error) 
    {
        echo "Connect error: " . $mysqli->connect_error;
        exit();
    }

    // Ao fazer uma requisição GET, normalmente passa-se os parâmetros através da url.
    // No meu caso, eu só passei o parâmetro id (veja a linha 303 do JS).
    // Todos os parâmentros que forem passados ficam armazenados nessa variável '$_GET'.
    $id = $_GET["id"];

    // Faço o delete usando a função 'query' do objeto '$mysqli' e uso a função fetch_assoc()
    // para trasnformar o resultado (da query) em uma array. Em seguida, uso o 'json_encode' para
    // converter essa array em um objeto JSON e enviar para o frontend.
    echo json_encode($mysqli->query("SELECT * FROM resenhas WHERE id=$id")->fetch_assoc());

    $mysqli->close();

?>