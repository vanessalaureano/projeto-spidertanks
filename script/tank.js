// 1. Capturar elementos do DOM
const formTank = document.getElementById("tank-formulario");
const tankCapitaoReceber = document.getElementById("tank-capitao-receber");
const tankRaridadeReceber = document.getElementById("tank-raridade-receber");
const tankNomeReceber = document.getElementById("tank-nome-receber");
const tankAdicionar = document.getElementById("tank-adicionar");
const tankLista = document.getElementById("tanks-lista");
const tankListaBody = document.getElementById("tank-lista-body");
const tankBotaoRemoverTodos = document.getElementById("tank-botao-remover-todos");

// 2. Função para adicionar um novo tank
function adicionarTank(event) {
  event.preventDefault(); // Evitar o comportamento padrão do formulário

  // Recuperar os dados dos campos do formulário
  const capitao = tankCapitaoReceber.value;
  const raridade = tankRaridadeReceber.value;
  const nome = tankNomeReceber.value;

  if (capitao.trim() === "" || nome.trim() === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Restaurar o estado dos checkboxes ao carregar a página
  recuperarDadosDoLocalStorage();

  // Criar a estrutura HTML para adicionar o tank na tabela
  const tr = document.createElement("tr");
  tr.classList.add("tabela-conteudo");

  const tdCheck = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = false;
  tdCheck.appendChild(checkbox);
  tr.appendChild(tdCheck);

  const tdCapitao = document.createElement("td");
  tdCapitao.textContent = capitao;
  tr.appendChild(tdCapitao);

  const tdRaridade = document.createElement("td");
  tdRaridade.textContent = raridade;
  tr.appendChild(tdRaridade);

  const tdNome = document.createElement("td");
  tdNome.textContent = nome;
  tr.appendChild(tdNome);

  const tdVitorias = document.createElement("td");
  tdVitorias.innerHTML = `
    <button class="botao-subtrair botao">-</button>
    <span class="vitorias-quantidade">0</span>
    <button class="botao-somar botao">+</button>
  `;
  tr.appendChild(tdVitorias);

  const tdPontos = document.createElement("td");
  const pontosInput = document.createElement("input");
  pontosInput.type = "number";
  pontosInput.value = "0";
  tdPontos.appendChild(pontosInput);
  tr.appendChild(tdPontos);

  const tdBotaoRemover = document.createElement("td");
  const botaoRemover = document.createElement("button");
  botaoRemover.classList.add("botao-remover", "botao");
  botaoRemover.textContent = "Excluir";
  botaoRemover.setAttribute("title", "Remover tank");
  tdBotaoRemover.appendChild(botaoRemover);
  tr.appendChild(tdBotaoRemover);

  tankListaBody.appendChild(tr);

  // Limpar os campos de inserção
  tankCapitaoReceber.value = "";
  tankNomeReceber.value = "";

  // Salvar os dados no LocalStorage
  salvarDadosNoLocalStorage();
}

// 3. Associar evento de clique ao botão "Adicionar tank"
tankAdicionar.addEventListener("click", adicionarTank);

// 4. Função para atualizar o contador de vitórias
function atualizarContador(event) {
  const botaoClicado = event.target;
  const vitoriasSpan = botaoClicado.parentNode.querySelector(".vitorias-quantidade");

  // Verificar se o elemento com a classe "vitorias-quantidade" existe
  if (!vitoriasSpan) {
    return; // Se não existir, sair da função
  }

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

// 5. Função para marcar/desmarcar o checkbox e alterar o background
function marcarCheckbox(event) {
  const checkboxClicado = event.target;
  const tr = checkboxClicado.closest("tr");
  const pontosInput = tr.querySelector("td:nth-child(6) input[type='number']");

  if (checkboxClicado.checked) {
    tr.style.backgroundColor = "var(--cor-de-fundo-secundaria)";
    pontosInput.style.backgroundColor = "var(--cor-de-fundo-secundaria)";
  } else {
    tr.style.backgroundColor = "";
    pontosInput.style.backgroundColor = "";
  }

  // Salvar o estado do checkbox no LocalStorage
  salvarCheckboxNoLocalStorage();
}

// 6. Função para remover um tank
function removerTank(event) {
  const botaoRemover = event.target;
  if (botaoRemover.classList.contains("botao-remover")) {
    const tr = botaoRemover.closest(".tabela-conteudo");
    tr.remove();

    // Salvar os dados no LocalStorage
    salvarDadosNoLocalStorage();
  }
}

// 7. Função para remover todos os tanks
function removerTodosTanks() {
  tankListaBody.innerHTML = "";

  // Salvar os dados no LocalStorage
  salvarDadosNoLocalStorage();
}

// 8. Função para salvar os dados da tabela no LocalStorage
function salvarDadosNoLocalStorage() {
  const tabelaHTML = tankListaBody.innerHTML;
  localStorage.setItem("tanksData", tabelaHTML);

  const pontosInputs = document.querySelectorAll("#tanks-lista tbody td:nth-child(6) input[type='number']");
  const pontosArray = Array.from(pontosInputs).map((input) => input.value);
  localStorage.setItem("tanksPontos", JSON.stringify(pontosArray));

  const checkboxes = document.querySelectorAll("#tanks-lista tbody td:first-child input[type='checkbox']");
  const checkboxState = Array.from(checkboxes).map((checkbox) => checkbox.checked);
  localStorage.setItem("tanksCheckboxState", JSON.stringify(checkboxState));
}

// 9. Função para recuperar os dados da tabela do LocalStorage
function recuperarDadosDoLocalStorage() {
  const dadosSalvos = localStorage.getItem("tanksData");
  if (dadosSalvos) {
    tankListaBody.innerHTML = dadosSalvos;
  }

  const pontosArray = JSON.parse(localStorage.getItem("tanksPontos"));
  if (pontosArray) {
    const pontosInputs = document.querySelectorAll("#tanks-lista tbody td:nth-child(6) input[type='number']");
    pontosArray.forEach((pontos, index) => {
      pontosInputs[index].value = pontos;
    });
  }

  const checkboxState = JSON.parse(localStorage.getItem("tanksCheckboxState"));
  if (checkboxState) {
    const checkboxes = document.querySelectorAll("#tanks-lista tbody td:first-child input[type='checkbox']");
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = checkboxState[index];
      const tr = checkbox.closest("tr");
      if (checkbox.checked) {
        tr.style.backgroundColor = "var(--cor-de-fundo-secundaria)";
      } else {
        tr.style.backgroundColor = "";
      }
    });
  }
}

// 10. Inicialização do site ao carregar a página
function iniciarSite() {
  formTank.addEventListener("submit", adicionarTank);
  tankListaBody.addEventListener("click", atualizarContador);
  tankListaBody.addEventListener("change", marcarCheckbox);
  tankListaBody.addEventListener("click", removerTank);
  tankBotaoRemoverTodos.addEventListener("click", removerTodosTanks);

  recuperarDadosDoLocalStorage();
}

// 11. Inicialização do site
iniciarSite();