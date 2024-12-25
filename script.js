let currentSpeed = 1; // Velocidade padrão
let currentUtterance = null; // Variável para armazenar a leitura em andamento

// Função para lidar com o upload de arquivo Word
function handleFile() {
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecione um arquivo Word.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {
        const arrayBuffer = reader.result;

        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function (result) {
                const htmlContent = result.value;
                generateFlashcardsFromHtml(htmlContent);
            })
            .catch(function (err) {
                console.error("Erro ao converter o documento Word:", err);
            });
    };

    reader.readAsArrayBuffer(file);
}

// Função para gerar flashcards a partir do conteúdo HTML
function generateFlashcardsFromHtml(htmlContent) {
    const flashcardsContainer = document.getElementById('flashcards');
    flashcardsContainer.innerHTML = ''; // Limpa qualquer conteúdo anterior

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const paragraphs = doc.body.querySelectorAll('p');

    paragraphs.forEach((para) => {
        const flashcard = createFlashcard(para.innerHTML);
        flashcardsContainer.appendChild(flashcard);
    });
}

// Função para criar flashcards (deck)
function createFlashcard(content) {
    const flashcard = document.createElement('div');
    flashcard.classList.add('flashcard');

    const flashcardContent = document.createElement('div');
    flashcardContent.classList.add('flashcard-content');

    const flashcardText = document.createElement('p');
    flashcardText.contentEditable = true;
    flashcardText.innerHTML = content;

    flashcardContent.appendChild(flashcardText);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flashcard-actions');

    // Criando os ícones e atribuindo ações
    const audioButton = document.createElement('button');
    audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    audioButton.onclick = () => readAloud(flashcard);

    const pauseButton = document.createElement('button');
    pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    pauseButton.onclick = pauseReading;

    const attachButton = document.createElement('button');
    attachButton.innerHTML = '<i class="fas fa-paperclip"></i>';
    attachButton.onclick = () => attachImage(flashcard);

    const deleteDeckButton = document.createElement('button');
    deleteDeckButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteDeckButton.onclick = () => deleteDeck(flashcard);

    const saveButton = document.createElement('button');
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    saveButton.onclick = () => saveFlashcard(flashcard);

    const addButton = document.createElement('button');
    addButton.innerHTML = '<i class="fas fa-plus"></i>';
    addButton.onclick = () => addNewDeck(flashcard);

    // Adicionando todos os botões ao container
    buttonContainer.appendChild(audioButton);
    buttonContainer.appendChild(pauseButton);
    buttonContainer.appendChild(attachButton);
    buttonContainer.appendChild(deleteDeckButton);
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(addButton); // Adicionando o botão de adicionar novo deck

    flashcard.appendChild(flashcardContent);
    flashcard.appendChild(buttonContainer);

    return flashcard;
}

// Função para adicionar um novo deck após o atual
function addNewDeck(currentFlashcard) {
    const flashcardsContainer = document.getElementById('flashcards');
    const newFlashcard = createFlashcard("Novo conteúdo do deck");

    // Insere o novo flashcard abaixo do atual
    flashcardsContainer.insertBefore(newFlashcard, currentFlashcard.nextSibling);
}

// Função para ler o texto do flashcard em voz alta com a velocidade atual
function readAloud(flashcard) {
    const textElement = flashcard.querySelector('.flashcard-content p');
    if (textElement) {
        const text = textElement.innerText.trim();
        if (text.length > 0) {
            // Interrompe qualquer leitura anterior antes de iniciar uma nova
            if (currentUtterance) {
                speechSynthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = currentSpeed; // Aplica a velocidade selecionada

            utterance.onstart = () => {
                currentUtterance = utterance; // Salva a leitura em andamento
                console.log(`Iniciando leitura em ${currentSpeed}x`);

                // Marca o parágrafo como "lendo" e ativa a linha lilás
                textElement.classList.add('reading');
                highlightCurrentWord(utterance, textElement);
            };

            utterance.onend = () => {
                // Remove a marcação de leitura e a linha lilás ao terminar
                textElement.classList.remove('reading');
            };

            utterance.onerror = () => console.error("Erro durante a leitura.");
            speechSynthesis.speak(utterance);
        } else {
            alert("Nenhum texto para ler neste deck.");
        }
    } else {
        alert("Erro: Não foi possível localizar o texto no deck.");
    }
}

// Função para destacar a palavra que está sendo lida
function highlightCurrentWord(utterance, textElement) {
    const words = textElement.innerText.split(" ");
    let currentWordIndex = 0;

    // Função para destacar as palavras enquanto elas são lidas
    utterance.onboundary = function(event) {
        if (event.name === 'word') {
            // Remove o destaque anterior
            textElement.innerHTML = textElement.innerText; 
            const word = words[currentWordIndex];

            // Destaca a palavra que está sendo lida
            const highlightedText = textElement.innerText.replace(word, `<span class="highlight">${word}</span>`);
            textElement.innerHTML = highlightedText;

            // Aumenta o índice para a próxima palavra
            currentWordIndex++;
        }
    };
}

// Função para mudar a velocidade da leitura
function changeSpeed(speed) {
    currentSpeed = speed;
    console.log(`Velocidade alterada para: ${speed}x`);
}

// Função para pausar a leitura
function pauseReading() {
    if (currentUtterance) {
        speechSynthesis.pause();
        console.log("Leitura pausada.");
    }
}

// Função para anexar uma imagem ao flashcard
function attachImage(flashcard) {
    alert("Anexando uma imagem...");
    // Lógica para anexar uma imagem pode ser implementada aqui
}

// Função para excluir um deck de flashcards
function deleteDeck(flashcard) {
    flashcard.remove();
}
