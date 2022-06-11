<?php

    $mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
    if ($mysqli->connect_error) 
    {
        echo "Connect error: " . $mysqli->connect_error;
        exit();
    }

    // Criando uma array para armazenar todas as resenhas
    $resenhas = array();

    // Fazendo uma consulta pra retornar uma tabela com todas as resenhas
    $tabela = $mysqli->query("SELECT * FROM resenhas");

    // Percorrendo todas as linhas da tabela retornada anteriormente.
    for ($i = 0, $ultima_linha = $tabela->num_rows; $i < $ultima_linha; $i++)
    {
        // Usando o o 'fetch_assoc()' pra retornar a próxima linha da tabela como uma array e 
        // armazenando isso na variável '$linha'.
        $linha = $tabela->fetch_assoc();

        // Convertendo a array '$linha' pra um objeto e armazenando na variável '$resenha'.
        $resenha = (object) $linha;

        // Adicionando o objeto '$resenha' na array '$resenhas.'
        array_push($resenhas, $resenha);
    }

    // Se o total de resenhas for > 0, faça:
    if (count($resenhas))
    {
        echo json_encode($resenhas);
    }
    // Caso contrário:
    else
    {
        echo "";
    }


    $mysqli->close();

?>