<?php

    $mysqli = new mysqli("localhost", "root", "toor", "dvmstudio");
    if ($mysqli->connect_error) 
    {
        echo "Connect error: " . $mysqli->connect_error;
        exit();
    }

    // Ao fazer uma requisição GET, normalmente passa-se os parâmetros através da url.
    // No meu caso, eu só passei o parâmetro criterio (veja a linha 398 do JS).
    // Todos os parâmentros que forem passados ficam armazenados nessa variável '$_GET'.
    $criterio = $_GET['criterio'];

    $tabela = $mysqli->query("SELECT * FROM resenhas WHERE titulo_livro LIKE '%$criterio%'");

    $resenhas = array();
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