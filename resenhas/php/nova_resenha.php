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

    // Como eu não estou usando auto increment no banco de dados, preciso pegar o último id e incrementar.

    // Essa query retorna 0 se a tabela de resenhas estiver vazia. Caso contrário, retorna
    // o último id adicionado na tabela. 
    $last_id = $mysqli->query("SELECT CASE 
                                        WHEN EXISTS(SELECT 1 FROM resenhas) 
                                            THEN(SELECT id FROM resenhas ORDER BY id DESC LIMIT 1)
                                        ELSE 0
                                    END AS id")->fetch_assoc()['id'];  

    // Insere a nova resenha que foi enviada pra cá.    
    $result = $mysqli->query("INSERT INTO resenhas VALUE ($last_id+1, $objetoJson->data, $objetoJson->nota, '$objetoJson->titulo_livro', '$objetoJson->resenha')");

    // Essa '->' indica que eu estou acessando uma função ou propriedade dentro do objeto. Assim, 
    // 'objetoJson->titulo' indica que estou acessando a propriedade 'titulo' do objeto 'objetoJson. 

    // Se a query não funcionar, o 'mysqli' irá armazenar 'false' no 'result'. Se funcionar, irá armazenar
    // true.    
    echo json_encode($objetoJson);

    $mysqli->close();

?>