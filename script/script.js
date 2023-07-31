// 1. Capturar elementos do DOM
const formTime = document.getElementById("time-formulario");
const timeReceberInput = document.getElementById("time-receber");
const timesLista = document.getElementById("times-lista");

// 2. Definir uma função para adicionar um novo time
function adicionarTime(event) {
  event.preventDefault(); // Evitar o comportamento padrão do formulário

  const nomeTime = timeReceberInput.value;
  if (nomeTime.trim() === "") {
    // Verificar se o campo está vazio
    alert("Por favor, digite o nome do time.");
    return;
  }

  // Criar a estrutura HTML para adicionar o time na tabela
  const tr = document.createElement("tr");
  tr.classList.add("tabela-conteudo");

  const tdHorario = document.createElement("td");
  tdHorario.textContent = new Date().toLocaleTimeString("pt-BR");
  tr.appendChild(tdHorario);

  const tdNomeTime = document.createElement("td");
  tdNomeTime.textContent = nomeTime;
  tr.appendChild(tdNomeTime);

  const tdVitorias = document.createElement("td");
  tdVitorias.innerHTML = `
    <button class="botao-subtrair botao">-</button>
    <span class="vitorias-quantidade">0</span>
    <button class="botao-somar botao">+</button>
  `;
  tr.appendChild(tdVitorias);

  const tdBotaoRemover = document.createElement("td");
  const botaoRemover = document.createElement("button");
  botaoRemover.classList.add("botao-remover", "botao");
  botaoRemover.textContent = "Excluir";
  botaoRemover.setAttribute("title", "Remover time");
  tdBotaoRemover.appendChild(botaoRemover);
  tr.appendChild(tdBotaoRemover);

  timesLista.querySelector("tbody").appendChild(tr);

  // Limpar o campo de inserção do nome do time
  timeReceberInput.value = "";

  // Salvar os dados no LocalStorage
  salvarDadosNoLocalStorage();
}

// 3. Definir uma função para atualizar o contador de vitórias
function atualizarContador(event) {
  const botaoClicado = event.target;
  const vitoriasSpan = botaoClicado.parentNode.querySelector(".vitorias-quantidade");
  let vitorias = parseInt(vitoriasSpan.textContent);

  if (botaoClicado.classList.contains("botao-subtrair")) {
    vitorias = Math.max(0, vitorias - 1);
  } else if (botaoClicado.classList.contains("botao-somar")) {
    vitorias++;
  }

  vitoriasSpan.textContent = vitorias;

  // Salvar os dados no LocalStorage
  salvarDadosNoLocalStorage();
}

// 4. Definir uma função para remover um time
function removerTime(event) {
  const botaoRemover = event.target;
  if (botaoRemover.classList.contains("botao-remover")) {
    const tr = botaoRemover.closest(".tabela-conteudo");
    tr.remove();

    // Salvar os dados no LocalStorage
    salvarDadosNoLocalStorage();
  }
}

// 5. Definir uma função para remover todos os times
function removerTodosTimes() {
  timesLista.querySelector("tbody").innerHTML = "";

  // Salvar os dados no LocalStorage
  salvarDadosNoLocalStorage();
}

// 6. Inicialização do site ao carregar a página
function iniciarSite() {
  // Adicionar os event listeners aos botões
  formTime.addEventListener("submit", adicionarTime);
  timesLista.addEventListener("click", atualizarContador);
  timesLista.addEventListener("click", removerTime);
  const botaoRemoverTodos = document.getElementById("botao-remover-todos");
  botaoRemoverTodos.addEventListener("click", removerTodosTimes);

  // Recuperar dados do LocalStorage e preencher a tabela
  const dadosSalvos = localStorage.getItem("timesData");
  if (dadosSalvos) {
    timesLista.querySelector("tbody").innerHTML = dadosSalvos;
  }
}

// Salvar os dados da tabela no LocalStorage
function salvarDadosNoLocalStorage() {
  const tabelaHTML = timesLista.querySelector("tbody").innerHTML;
  localStorage.setItem("timesData", tabelaHTML);
}

// Chamada para iniciar o site ao carregar a página
iniciarSite();

