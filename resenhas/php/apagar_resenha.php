<?php

    $mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
    if ($mysqli->connect_error) 
    {
        echo "Connect error: " . $mysqli->connect_error;
        exit();
    }

    // php://input é uma coleção de dados que recebe todos os dados da requisição depois dos
    // cabeçalhos, ou seja, o corpo da requisição fica armazenado nessa coleção.

    // file_get_contents é uma função que lê um arquivo e passa a informação lida para uma string.
    // Para saber mais: https://www.php.net/manual/en/function.file-get-contents.php

    // Pega o corpo da requisição
    $corpoRequisicao = file_get_contents('php://input');
    
    // Transforma o corpo da requisição em um objeto PHP.
    $objetoJson = json_decode($corpoRequisicao);

    $resultado = $mysqli->query("DELETE FROM resenhas WHERE id=$objetoJson->id");

    echo $resultado;

    $mysqli->close();

?>