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
    pauseButton.onclick = () => pauseReading();

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
        const originalHTML = textElement.innerHTML; // Salva a formatação original
        const words = textElement.innerText.split(" ");
        let currentWordIndex = 0;

        if (words.length > 0) {
            // Interrompe qualquer leitura anterior antes de iniciar uma nova
            if (currentUtterance) {
                speechSynthesis.cancel();
            }

            currentUtterance = new SpeechSynthesisUtterance(textElement.innerText);
            currentUtterance.rate = currentSpeed; // Aplica a velocidade selecionada

            currentUtterance.onboundary = (event) => {
                if (event.name === "word" && currentWordIndex < words.length) {
                    textElement.innerHTML = words
                        .map((word, index) => {
                            if (index === currentWordIndex) {
                                return `<span class='highlight'>${word}</span>`;
                            }
                            return word;
                        })
                        .join(" ");
                    currentWordIndex++;
                }
            };

            currentUtterance.onend = () => {
                textElement.innerHTML = originalHTML; // Restaura a formatação original
                currentUtterance = null; // Reseta o utterance
                console.log("Leitura finalizada.");
            };

            currentUtterance.onerror = () => console.error("Erro durante a leitura.");
            speechSynthesis.speak(currentUtterance);
        } else {
            alert("Nenhum texto para ler neste deck.");
        }
    } else {
        alert("Erro: Não foi possível localizar o texto no deck.");
    }
}

// Função para mudar a velocidade da leitura
function changeSpeed(speed) {
    currentSpeed = speed;
    console.log(`Velocidade alterada para: ${speed}x`);
}

// Função para pausar a leitura
function pauseReading() {
    if (currentUtterance && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        currentUtterance = null;
        console.log("Leitura pausada.");
    } else {
        console.log("Não há leitura em andamento para pausar.");
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
