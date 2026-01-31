/* input */
const apiKeyInput = document.getElementById('apiKey'); //seleciona o campo onde será inserido a chave da API
const gameSelect = document.getElementById('gameSelect'); //seleciona o campo de seleção do jogo
const questionInput = document.getElementById('questionInput'); //seleciona o campo de input string para inserir a pergunta feita para IA
const askButton = document.getElementById('askButton'); //seleciona o botão 'PERGUNTAR'
const aiResponse = document.getElementById('aiResponse') //seleciona o campo de resposta da IA
const form = document.getElementById('form'); //seleciona o elemento formulario TODO

const markdownToHTML = (text) => { //função que vai receber um texto
  /*o que a funlçao vai processar: */
  const converter = new showdown.Converter() /*dentro da variável converter, ela vai receber um objeto (nova criação de objeto)*/
  return converter.makeHtml(text);
}

//AIzaSyDOHlS1FV6f5G3C_FwicbC5-Us8IpgtgAQ
const perguntarAI = async(question, game, apiKey) => { /* função async(assíncrona == esperar uma resposta) aqui diz que, existe algum passo dentro desta função que será presciso sair da aplicação e ir para uma outra aplicação em algum lugar, esperar uma resposta, e receber aqui */

  const model = "gemini-2.5-flash" //modelo da IA
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}` //URL base para chamar a API a cada vez que for preciso falar com o GEMINI
  const pergunta = `
  ## Especialidade
  Você é um assistente especialista de meta para o jogo ${game}.

  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds e dicas.

  ## Regras
  - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
  - Considere a data atual ${new Date().toLocaleDateString()}.
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual para dar uma resposta coerente.
  - Nunca responda itens que você não tenha certeza de que exista no patch atual.

  ## Resposta
  - Economize na resposta, seja direto e responda no máximo 500 caracteres. 
  - Responda em Markdown.
  - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

  ## Exemplo de resposta
  Pergunta do usuário: Melhor build rengar jungle
  Resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

  ---
  Aqui está a pergunta do usuário: ${question}
  `;

  /*json*/
  const contents = [{ /*lista de OBJETOS, onde não há nome, não é o mesmo que o POO*/
    role: "user",
    parts: [{ /*não será reutilizado esta parte do código*/
      text: pergunta
    }]
  }];

  const tools = [{
    google_search:{}
  }]

  /* 1 chamada API*/
    /*fetch == estou querendo receber uma resposta de volta*/
  const response = await fetch(geminiURL, {
    method: 'POST', //metodo HTTP
    headers: {
      'Content-Type': 'application/json' //o conteúdo especifico é JSON
    },
    body: JSON.stringify({ /*função do JSON que pega um objeto JS e vai torná-lo em JSON*/
      contents,
      tools
    })
  })

  /* 2 chamada API*/
  const data = await response.json()
  return data.candidates[0].content.parts[0].text;
}

/* process */
const enviarFormulario = async(event) => {
  event.preventDefault(); /*função evita o reload na página, pois haverá mais informações após o envio do formulário*/

  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apiKey == '' || game == '' || question == '') {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  askButton.disabled = true; //desativa o botão 'PERGUNTAR' ao enviar o formulario
  askButton.textContent = 'Perguntando...';
  askButton.classList.add('loading'); //insere uma classe denominada 'loading' no elemento button

  try { //tentar fazer algo
    //PERGUNTAR PARA A IA
    const text = await perguntarAI(question, game, apiKey); //executar a função
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text);
    aiResponse.classList.remove('hidden');

  } catch (error) { //se tiver um erro
    console.log('Erro: ', error);
  } finally { //se der certo ou errado, ele finalmente . . . 
    askButton.disabled = false;
    askButton.textContent = 'Perguntar';
    askButton.classList.remove('loading');
  }
}

// form aqui é um OBJETO | o '.' faz com que acessamos o objeto, e, ou, faremos algo com ele | submit É UM TIPO DE EVENTO, não é uma variável, por isso está em aspas | enviarFormulario É uma função!
form.addEventListener('submit', enviarFormulario);

/* output */