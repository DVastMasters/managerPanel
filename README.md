# managerPanel

Para testar, clone o repositório direto na pasta htdocs do XAMP (Normalmente, C:\xampp\htdocs), altere os dados de conexão com o mysql nos arquivos PHP e ligue o apache.

Crie o banco de dados:

<code>DROP DATABASE IF EXISTS dvmstudio;</code>

<code>CREATE DATABASE dvmstudio;</code>

<code>USE dvmstudio;</code>

<code>CREATE TABLE resenhas(id INT PRIMARY KEY, data BIGINT, nota TINYINT, titulo_livro VARCHAR(50), resenha TEXT);</code>

OBS: Clique nas imagens para melhor visualização.

Navegue até resenhas.html:
![image](https://user-images.githubusercontent.com/49616553/173188569-c781f035-36af-466e-bc29-95ba3b86c21f.png)

Pesquisando:
![image](https://user-images.githubusercontent.com/49616553/173188586-03716514-3603-4ead-b76c-33c6dc3d108e.png)

Modal de criação:
![image](https://user-images.githubusercontent.com/49616553/173188581-07a628e5-7645-4c46-ab12-ada3d98fb947.png)

Modal de visualização:
![image](https://user-images.githubusercontent.com/49616553/173188594-39927be3-e2bd-4aa2-9dfb-6e52fc949806.png)
