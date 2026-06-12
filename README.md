# NLW eSports - Assistente de Meta 🎮🤖

Este projeto foi desenvolvido com base na trilha da **Imersão NLW #9 da Rocketseat**. Trata-se de um Assistente de Inteligência Artificial voltado para o universo gamer. A aplicação permite que o usuário tire dúvidas sobre estratégias, builds e dicas para jogos competitivos (como Valorant, CS:GO e League of Legends), utilizando a tecnologia do Google Gemini.

## 🎯 O que o projeto faz?

A aplicação fornece uma interface web simples onde o usuário:
1. Insere sua própria **API Key** do Google Gemini.
2. Seleciona o **jogo** sobre o qual deseja perguntar.
3. Digita a sua **dúvida** (ex: "Qual a melhor build para ADC neste patch?").
4. Recebe uma resposta direta e formatada gerada pela IA, baseada no meta e patch atuais do jogo.

## 🚀 Tecnologias Utilizadas

* **HTML5 & CSS3:** Estrutura e estilização da interface.
* **JavaScript (Vanilla):** Lógica de consumo de API e manipulação do DOM.
* **Google Gemini API (`gemini-2.5-flash`):** Modelo de IA generativa responsável por processar as perguntas e formular as respostas.
* **Showdown.js:** Biblioteca externa utilizada para converter a resposta da IA (em formato Markdown) para HTML puro na tela.

## 🧠 Como o Código Funciona (Documentação Técnica)

O núcleo da aplicação reside no arquivo JavaScript, que gerencia o fluxo de envio e resposta. Aqui está o passo a passo do que acontece:

### 1. Captura de Dados (DOM)
O script começa mapeando todos os elementos interativos do HTML usando `getElementById`. Isso inclui os campos de input (Chave da API, Jogo e Pergunta), o botão de envio e a área onde a resposta será renderizada.

### 2. Tratamento do Formulário (`enviarFormulario`)
Quando o usuário clica em "Perguntar", o evento de `submit` do formulário é interceptado (`event.preventDefault()`) para evitar que a página recarregue. O script valida se todos os campos estão preenchidos e altera o estado do botão para "Perguntando..." (adicionando também um efeito visual de *loading*).

### 3. Integração com a IA (`perguntarAI`)
Esta é uma função assíncrona (`async/await`) que se comunica com o Google Gemini. 
* **O Prompt:** O sistema não apenas envia a pergunta do usuário, mas "envelopa" essa pergunta dentro de um prompt complexo. Ele define regras estritas para a IA: agir como um especialista de meta, responder apenas sobre o jogo selecionado, pesquisar informações do patch na data atual e formatar a resposta em Markdown com no máximo 500 caracteres.
* **A Requisição:** O código faz um `fetch` via método `POST` para a URL do Gemini, enviando a chave da API e as regras estruturadas em formato JSON.

### 4. Renderização da Resposta (`markdownToHTML`)
Após receber a resposta bruta em texto da API, o script utiliza a biblioteca `Showdown.js` para converter as tags de Markdown (como `**negrito**` ou listas `\n`) em elementos HTML válidos. Essa resposta formatada é então injetada e exibida na tela dentro da `div` de resposta.