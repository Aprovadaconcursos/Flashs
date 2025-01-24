function criarMapaMental() {
  // Pega o texto inserido
  const texto = document.getElementById('textoInput').value;
  
  // Se o texto estiver vazio, não faz nada
  if (!texto) {
    alert('Por favor, insira um texto!');
    return;
  }

  // Estrutura que será criada no mapa mental
  const mapaMental = document.getElementById('mapaMental');
  mapaMental.innerHTML = ''; // Limpa o mapa mental anterior

  // Organizar o texto em tópicos
  const topicos = [
    {
      titulo: "Definição e Função Principal",
      frases: [
        "Responsável Técnico: Define quem é o responsável pelo empreendimento.",
        "Garantias: Garante direitos autorais, comprova a existência de um contrato e assegura o direito à remuneração."
      ]
    },
    {
      titulo: "Atenção",
      frases: [
        "A Lei 6.496/1977 não detalha outros aspectos da ART, apenas define o responsável técnico."
      ]
    }
  ];

  // Função para criar um nodo com uma frase
  function criarNodo(texto, classe = 'nodo') {
    const nodo = document.createElement('div');
    nodo.classList.add(classe);
    const paragrafo = document.createElement('p');
    paragrafo.textContent = texto;
    nodo.appendChild(paragrafo);
    return nodo;
  }

  // Função para criar setas de ramificação
  function criarSeta() {
    const seta = document.createElement('div');
    seta.classList.add('seta');
    return seta;
  }

  // Adicionando tópicos e suas frases ao mapa mental
  topicos.forEach(topico => {
    // Criar o nodo principal (tópico)
    const nodoTopico = criarNodo(topico.titulo);
    mapaMental.appendChild(nodoTopico);

    // Para cada frase no tópico, criar um sub-nodo
    topico.frases.forEach(frase => {
      const subNodo = criarNodo(frase, 'subNodo');
      nodoTopico.appendChild(criarSeta()); // Adiciona seta entre o tópico e o sub-tópico
      nodoTopico.appendChild(subNodo); // Adiciona sub-nodo ao tópico
    });
  });
}
