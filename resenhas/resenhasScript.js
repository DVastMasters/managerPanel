// Ao carregar o corpo da página, faz uma requisição pra buscar todas as resenhas no backend
document.body.onload = requisicaoBackend("GET", "php/get_resenhas.php", listarResenhas);

function requisicaoBackend(metodo, url, funcaoResposta, dados) {
    // Objeto que cria e envia a requisição
    // Para saber mais: https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
    const requisicao = new XMLHttpRequest();

    // Se o método for GET, eu só preciso abrir a requisição e enviar, pois as informações já
    // estarão contidas na 'url' (Veja os exemplos a partir da linha 174).
    if (metodo === "GET") {
        // Abre uma nova requisição para a 'url'. Esse 'true' indica que a requisição será ASSÍNCRONA
        // Para entender sobre processamento síncrono e assíncrono: https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#tipos_de_requisições
        requisicao.open("GET", url, true);
        // Para saber mais sobre o método: https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest/open

        //Envia a requisição
        requisicao.send();
        // Para saber mais sobre o método: https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest/send

        // Se o método for POST, eu preciso configurar o header 'Content-Type' pra indicar
        // qual o formato do corpo da requisição.
    } else if (metodo === "POST") {
        // Abre uma nova requisição para a 'url'. Esse 'true' indica que a requisição será ASSÍNCRONA
        requisicao.open("POST", url, true);

        // Registra o cabeçalho 'Content-Type' e define que o corpo da requisição será um JSON.
        requisicao.setRequestHeader("Content-Type", "application/json");
        // Para saber mais sobre o método: https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest/setRequestHeader

        // Envia a requisição.
        // Eu não tenho como enviar o objeto do javascript na requisição. Assim, preciso transformar
        // esse objeto em uma string (um simples texto que vai estar seguindo o padrão JSON e poderá
        // ser transformado em objeto de novo quando chegar no backend). Para isso, utilizo o método
        // stringfy do objeto JSON (um objeto nativo do javascript).
        requisicao.send(JSON.stringify(dados));
    }

    // Quando a estado da requisição mudar, essa função será executada:
    // Para saber mais sobre o método: https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest/readystatechange_event
    requisicao.onreadystatechange = function () {
        // Se o estado da requisição for DONE e o status foi OK, faça:
        // Para conhecer os 'readyState': https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest/readyState
        // Para conhecer os códigos de Status de requisições WEB: https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status
        if (requisicao.readyState === 4 && requisicao.status === 200) {
            // Pega a resposta da requisição (que foi mandada pelo backend) e envia para a funcaoRespota (callback).
            // Para entender sobre callback: https://developer.mozilla.org/pt-BR/docs/Glossary/Callback_function
            funcaoResposta(requisicao.responseText);

            // Caso contrário, informe o erro no console.
        } else {
            console.error(requisicao.statusText);
        }
    };
}

function listarResenhas(resenhas) {
    console.log("Resenhas" + resenhas);
    // Se por algum motivo 'resenhas' for 'undefined', encerramos a função para não ter problemas
    // com os próximos códigos.
    if (resenhas === undefined) return;
    // Para entender sobre undefined: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/undefined

    // Pega a div que vai ficar todas as resenhas.
    const resenhasDiv = document.getElementsByClassName("resenhas-lista")[0];

    // Limpa todas as resenhas que estiverem na div. Sem isso, a gente pode ter resenhas duplicadas.
    while (resenhasDiv.firstChild) {
        resenhasDiv.firstChild.remove();
    }

    // Se o 'resennhas' for uma estring vazia, significa que não há nada no banco de dados, então encerramos a função.
    if (resenhas === "") return;

    // O backend envia, como resposta, uma String que representa um array de objetos. Por outro lado, precisamos
    // fazer com que o javascript entenda essa resposta como uma array de objetos, não como uma string.
    // Por isso, usamos o 'JSON.parse' para converter a string em uma array.

    // Como o JS não é uma linguagem tipada (não é necessário definir o tipo da variável), eu
    // estou usando a mesma variável (resenhas) que estava armazenando a string para, agora,
    // armazernar um objeto JSON.
    resenhas = JSON.parse(resenhas);
    // Para conhecer o objeto JSON: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON

    // Se o backend passou 0 resenhas, isso significa que provavelmente não há nada no banco de dados.
    // Então encerramos a função por aqui.
    if (!resenhas.length) return;

    // Para cada objeto dentro da array 'resenhas', faça:
    // Para saber mais sobre o forEach: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    resenhas.forEach((resenha) => {
        // Cria um elemento 'span' e aloca ele na variável 'id'.
        const id = document.createElement("span");
        // Para saber mais sobre o método: https://developer.mozilla.org/pt-BR/docs/Web/API/Document/createElement

        // Define a classe desse elemento como sendo 'resenha-id';
        id.className = "resenha-id";

        // Define o conteúdo desse elemento como sendo o atributo 'id' do objeto 'resenha'
        id.innerText = resenha.id;

        // Cria um elemento 'span' e aloca ele na variável 'data'.
        const data = document.createElement("span");

        // Define a classe desse elemento como sendo 'resenha-data';
        data.className = "resenha-data";

        // Define o conteúdo desse elemento como sendo o atributo 'data' do objeto 'resenha'.
        // Obs: No meu caso, meu banco de dados está configurado para armazenar a data em milisegundos.
        // Assim, eu preciso converter pra data e depois pra string. Entretanto, como eu expliquei antes,
        // o backend envia tudo como sendo string, então ele também envia a data (em milisegundos) como sendo
        // uma string. Por isso, eu preciso converter essa string para número (Number(resenha.data)).
        // Em seguida, basta instanciar um novo objeto 'Date' (objeto pra trabalhar com datas no javascript)
        // passando, para o construtor, os milisegundos. Por fim, faço a chamada do método 'toLocaleString'
        // pra converter esse objeto Date em uma string formatada como uma data no formato local de quem
        // está acessando a página (no formato do seu PC).
        data.innerText = new Date(Number(resenha.data)).toLocaleString();
        // Para saber mais sobre o Date: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date

        // Cria um elemento 'span' e aloca ele na variável 'titulo'.
        const tituloLivro = document.createElement("span");

        // Define a classe desse elemento como sendo 'resenha-titulo-livro';
        tituloLivro.className = "resenha-title";

        // Define o conteúdo desse elemento como sendo o atributo 'titulo_livro' do objeto 'resenha'
        tituloLivro.innerText = resenha.titulo_livro;

        // Cria um elemento 'div' e aloca ele na variável 'resenhaDiv'.
        const resenhaDiv = document.createElement("div");

        // Define a classe desse elemento como sendo 'resenhaDiv'.
        resenhaDiv.className = "resenha";

        // Coloca o elemento 'id' (criado lá na linha 86) como sendo filho do elemento resenha
        // (div criada na linha 121).
        resenhaDiv.appendChild(id);
        // Para saber mais sobre o método: https://developer.mozilla.org/pt-BR/docs/Web/API/Node/appendChild

        // Coloca o elemento 'tituloLivro' (criado lá na linha 86) como sendo filho do elemento 'resenhaDiv'
        // (div criada na linha 121).
        resenhaDiv.appendChild(tituloLivro);

        // Coloca o elemento 'data' (criado lá na linha 86) como sendo filho do elemento 'resenhaDiv'
        // (div criada na linha 121).
        resenhaDiv.appendChild(data);

        // Adiciona um 'EventListener' nessa div. Esse listener vai ficar esperando um 'click' na div
        // pra executar a função que foi passada como segundo parâmentro. No meu caso, é uma função arrow
        // que simplemente executa outra função (verResenha) passando o id da resenha (clicada) como parâmetro.
        // Se eu fizesse assim: resenha.addEventListener("click", verResenha(id.innerText)), não iria
        // funcionar. Pois o listener iria tentar exectuar o RETORNO da 'verResenha' como sendo uma
        // função. Por exemplo, suponha que a 'verResenha' retorne 'teste'. O listener, ao perceber
        // que alguém clicou na div, iria fazer essa chamada: teste(event). Assim, a função verResenha
        // não seria executada.
        resenhaDiv.addEventListener("click", () => verResenha(id.innerText));
        // Sobre funções arrow: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        // Sobre EventListener: https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget/addEventListener

        // Coloca o elemento 'resenha' (criado lá na linha 121) como sendo filho do elemento 'resenhasDiv'
        // (div buscada na linha 62).
        resenhasDiv.appendChild(resenhaDiv);
    });
}

/*----------------------------------------- MODAL PARA A CRIAÇÃO DE RESENHAS -----------------------------------------*/
{
    // Pega a div que representa o modal de criação e aloca na variável modal.
    const modal = document.getElementsByClassName("criar-resenha")[0];

    // Pega o form de criação e aloca na variável form.
    const form = document.getElementsByName("form-criacao-resenha")[0];

    // Pega o input que representa o titulo do livro e aloca na variável inputTituloLivro.
    const inputTituloLivro = document.getElementsByName("input-titulo-livro")[0];

    // Pega o input que representa a nota que será dada ao livro e aloca na variável inputNota.
    const inputNota = document.getElementsByName("input-nota")[0];

    // Pega o input que representa a resenha que está sendo criada e aloca na variável inputResenha.
    const inputResenha = document.getElementsByName("input-resenha")[0];

    // Pega o input que representa a data de criação da resenha e aloca na variável inputData.
    const inputData = document.getElementsByName("input-data")[0];

    // Cria uma variável, inicialmente nula, que representa a data e hora atual. Será usada posteriormente.
    let dateNow = null;

    // Pega o botão 'Nova Resenha'.
    const botaoNovaResenha = document.getElementsByName("criar")[0];

    // Quando o usuário clica no botão 'Nova Resenha', abra o modal de criação.
    botaoNovaResenha.addEventListener("click", () => {
        // Como o modal está com o display = none por padrão, basta setar o display para block e ele irá aparecer
        // na tela.
        modal.style.display = "block";

        // Instancia um objeto Date sem passsar nenhum parâmetro ao construtor, retornando a data e hora atual.
        // Em seguida, colocar esse objeto dentro da variável criada anteriormente, o 'dateNow'.
        dateNow = new Date();

        // Converte a data para string e coloca no input de data (O input não é modificado pelo usuário, no meu caso).
        // Esse input só fica ali para registro. Assim, quando o usuário abre o modal, o JS define essa data sozinho
        // utilizando esse código das linhas 194-207.
        inputData.value = dateNow.toLocaleString();
    });

    // Adiciona um 'EventListener' no formulário de criação. Esse listener irá esperar o formulário ser enviado
    // e irá executa a função arrow abaixo:
    form.addEventListener("submit", (evento) => {
        // Obs: Quando o listener executa a função, caso a função solicite um parâmetro, ele passa o evento pra função.
        // Nesse meu caso, eu estou solicitando um parâmetro (o 'e' dento dos parênteses indica isso). Então, quando
        // o formulário for enviado, o listener vai passar o evento de envio para essa função.
        // Para entender sobre eventos: https://developer.mozilla.org/pt-BR/docs/Web/Events

        // Ao receber o evento, eu executo o método 'preventDefault' para evitar que o evento cumpra sua função padrão,
        // que seria enviar o formulário ao backend.
        evento.preventDefault();
        // Para saber mais sobre o método: https://developer.mozilla.org/pt-BR/docs/Web/API/Event/preventDefault

        // Criando um objeto JSON com os dados que o usuário digitou nos inputs:
        const resenha = {
            // Eu não estou pegando a data diretamente do input, estou pegando do 'dateNow' que criei na linha 188.
            // Faço isso porque o input está em formato de string, enquanto eu preciso do objeto 'Date' para poder utilizar a
            // função 'getTime' que me retorna a data e hora em milisegundos. Se for utilizar o input do tipo date, faça
            // algumas adptações.
            data: dateNow.getTime(),
            nota: inputNota.value,
            titulo_livro: inputTituloLivro.value,
            resenha: inputResenha.value,
        };

        // Enviando o objeto ao backend.
        requisicaoBackend("POST", "php/nova_resenha.php", feedbackCriacao, resenha);
    });

    // Função para a qual eu vou enviar a resposta que o backend me der. Aí essa função vai informar o usuário (dar o
    // feedback) se a resenha foi criada ou não.
    function feedbackCriacao(criou) {
        if (criou) {
            // Perceba que eu estou usando um alert aqui, mas você pode personalizar da forma que quiser. Por exemplo, poderia
            // criar um outro modal (como se fosse um popup) para que a mensagem fosse informada de forma mais amigável para o usuário.
            window.alert("Resenha criada com sucesso!");

            // Limpo todos os campos do formulário.
            form.reset();

            // "Fecho" o modal.
            modal.style.display = "none";

            // Por fim, faço a chamada no backend pra buscar, novamente, todas as resenhas (pra que o item que acabou de se criado apareça na tela).
            requisicaoBackend("GET", "php/get_resenhas.php", listarResenhas);
        } else {
            // Se o backend não puder inserir no BD, informo ao usuário que algo deu errado e não faço mais nada. Você pode fazer com que o backend
            // envie mensagens de erros personalizadas. Aí, de acordo com essas mensagens, você pode informar o usuário o que deu errado.
            // Como eu não fiz isso, qualquer erro que aparecer, eu irei informar ao usuário a mensagem abaxio:
            window.alert("Ops! Alguma coisa deu errado, tente novamente.");
        }
    }

    // Pega o ícone-botão que deve fechar o modal (o X no canto superior direito) e armazena na variável btnFecharModalCriacao.
    const btnFecharModalCriacao = document.getElementsByClassName("icone-modal-criacao-fechar")[0];

    // Quando o usuário clicar nesse ícone, a função arrow abaixo será executada.
    btnFecharModalCriacao.onclick = () => {
        // Eu abro uma janela de confirmação pra que o usuário não acabe fechando o modal por engano e perdendo tudo que escreveu.
        if (window.confirm("Tem certeza que deseja fechar? \nTodas as mudanças serão perdidas.")) {
            // Se o usuário confirmar que deseja fechar, eu "fecho" o modal e reseto o formulário.
            modal.style.display = "none";
            form.reset();
        }
    };
}
/*----------------------------------------- MODAL PARA A CRIAÇÃO DE RESENHAS -----------------------------------------*/

/*--------------------------------------- MODAL PARA A VISUALIZÇÃO DE RESENHAS ---------------------------------------*/
{
    // Pega a div que representa o modal de visualizacao e aloca na variável modal.
    const modal = document.getElementsByClassName("ver-resenha")[0];

    // Pega o h2 que representa o titulo do livro e aloca na variável labelTituloLivro.
    const labelTituloLivro = document.getElementsByClassName("modal-resenha-titulo")[0];

    // Pega o input que representa a nota dada ao livro e aloca na variável inputNota.
    const labelNota = document.getElementsByClassName("modal-resenha-nota")[0];

    // Pega o input que representa a resenha e aloca na variável labelResenha.
    const labelResenha = document.getElementsByClassName("modal-resenha-conteudo")[0];

    // Pega o input que representa a data da criação da resenha e aloca na variável labelData.
    const labelData = document.getElementsByClassName("modal-resenha-data")[0];

    // Pega o input que representa a data da criação da resenha e aloca na variável labelData.
    const labelId = document.getElementsByName("resenha-id")[0];

    // Essa é a função que será chamada quando o usuário clicar na resenha para visualizá-la. Essa é a função que foi
    // referenciada na linha 153.
    function verResenha(id) {
        //"Abre" o modal.
        modal.style.display = "block";

        // Faz a requisição ao backend para buscar as informações da resenha selecionada.
        requisicaoBackend("GET", `php/get_resenha_info.php?id=${id}`, preencherModal);

        function preencherModal(resenha) {
            // Como dito anteriormente, o backend envia a resposta como uma string, mas eu quero um objeto. Portanto, preciso
            // converter essa string para um objeto:
            resenha = JSON.parse(resenha);

            // Define o conteúdo desse elemento como sendo o atributo 'id' do objeto 'resenha'.
            labelId.innerText = resenha.id;

            // Define o conteúdo desse elemento como sendo o atributo 'data' do objeto 'resenha'.
            // A explicação sobre a conversão está nas linhas 105-113.
            labelData.innerText = new Date(Number(resenha.data)).toLocaleString();

            // Define o conteúdo desse elemento como sendo o atributo 'titulo' do objeto 'resenha'
            console.log(resenha);
            labelTituloLivro.innerText = resenha.titulo_livro;

            // Define o conteúdo desse elemento como sendo o atributo 'nota' do objeto 'resenha'
            labelNota.innerText = resenha.nota;

            // Define o conteúdo desse elemento como sendo o atributo 'resenha' do objeto 'resenha'
            labelResenha.innerText = resenha.resenha;
        }
    }

    // Pega o ícone-botão que deve fechar o modal (o X no canto superior direito) e armazena na variável btnFecharModalVisualizacao.
    const btnFecharModalVisualizacao = document.getElementsByClassName("icone-modal-ver-fechar")[0];

    // Quando o usuário clicar no ícone-botão, a função arrow abaixo será executada.
    btnFecharModalVisualizacao.onclick = () => {
        // Eu "fecho" o modal.
        modal.style.display = "none";
    };

    // Quando o usuário clicar em qualquer lugar fora da caixa branca do modal (naquela região escura ao redor), quero que o
    // modal seja fechado. Para isso, vou adicionar uma função pra ser executada quando o usuário clicar na janela (window).
    window.onclick = (evento) => {
        // Como ele pode clicar a qualquer momento (mesmo quando não há um modal aberto), eu estou verificando se o evento
        // foi disparado quando o 'modal' estava visível. Esse atributo 'target' me informa de onde partiu o evento.
        if (evento.target == modal) {
            // Eu "fecho" o modal.
            modal.style.display = "none";
        }
    };

    // Pega o botão de apagar a resenha e armazena na variável btnApagar.
    const btnApagar = document.getElementsByName("apagar")[0];

    // Adiciona um EventListener nesse botão. Quando o botão for clicado, a função 'confirmarApagar' será chamada.
    btnApagar.addEventListener("click", confirmarApagar);

    // Função que abre uma janela de confirmação para saber se o usuário quer realmente apagar a resenha ou se
    // clicou por engano.
    function confirmarApagar() {
        if (confirm("Tem certeza que deseja apagar essa resenha?")) {
            // Se ele confirmar, então eu envio uma requisição POST para apagar a resenha.
            // Perceba que seria mais interessante utilizar uma requisição DELETE.
            requisicaoBackend("POST", "php/apagar_resenha.php", feedbackDeletar, {
                id: Number(labelId.innerText),
            });
        }
    }

    // Função para a qual eu vou enviar a resposta que o backend me der. Aí essa função vai informar o usuário (dar o
    // feedback) se a resenha foi deletada ou não.
    function feedbackDeletar(deletou) {
        if (deletou) {
            // Usando um alert pra informar.
            window.alert("Resenha deletada com sucesso!");

            // "Fechando" o modal.
            modal.style.display = "none";

            // Por fim, faço a chamada no backend pra buscar, novamente, todas as resenhas.
            requisicaoBackend("GET", "php/get_resenhas.php", listarResenhas);
        } else {
            window.alert("Ops! Alguma coisa deu errado, tente novamente.");
        }
    }
}

/*--------------------------------------- MODAL PARA A VISUALIZÇÃO DE RESENHAS ---------------------------------------*/

/*----------------------------------------------- SISTEMA DE PESQUISA -----------------------------------------------*/

{
    // Pega o form de pesquisar resenhas.
    const formPesquisar = document.getElementsByName("form-pesquisar-resenhas")[0];

    // Adiciona um EventListener que vai esperar o form ser submitado e irá executar a função arrow abaixo:
    formPesquisar.addEventListener("submit", (evento) => {
        // Evita que o formulário seja enviado
        evento.preventDefault();

        // Pega o valor que foi digitado no input de pesquisa.
        const input = formPesquisar.firstElementChild.value;

        // Envia a requisição ao servidor que irá retornar os resultados que batem com o critério digitado.
        requisicaoBackend("GET", `php/pesquisar.php?criterio=${input}`, listarResenhas);
    });

    formPesquisar.addEventListener("reset", () => {
        requisicaoBackend("GET", "php/get_resenhas.php", listarResenhas);
    });
}

/*----------------------------------------------- SISTEMA DE PESQUISA -----------------------------------------------*/

/*------------------------------------------------ MENU RESPONSIVO --------------------------------------------------*/

// Para entender essa parte, veja também o CSS a partir da linha 87.

{
    // Pega a barra de navegação superior.
    const topNav = document.getElementsByClassName("top-nav")[0];

    // Adiciona um EventListener no último elemento filho da barra de navegação (o ícone de abrir o menu).
    // Isso daqui é um belo exemplo de gambiarra, não use. Pegue o elemento pelo id, class ou name e depois
    // insira o EventListener.
    topNav.lastElementChild.addEventListener("click", () => {
        // Basicamente, esse if else vai ficar adicionando e removendo a classe 'responsive' na barra de navegação
        // superior. A responsividade é dada justamente por essa classe. Quando a classe 'responsive' está adicionada,
        // o menu de opções fica aberto. Caso contrário, o menu fica fechado. Para visualizar e entender, abra o menu
        // de desenvolvedor do navegador e depois fica clicando no botão de abrir o menu. Fique olhando as classes no
        // html do item 'topNav'.
        if (topNav.className === "top-nav") {
            topNav.className += " responsivo";
        } else {
            topNav.className = "top-nav";
        }
    });
}

/*------------------------------------------------ MENU RESPONSIVO --------------------------------------------------*/
