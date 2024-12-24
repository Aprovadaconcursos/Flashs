let currentSpeed = 1; // Velocidade padrão

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

// Função para criar flashcards
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
    buttonContainer.classList.add('button-container');

    const audioButton = document.createElement('button');
    audioButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    audioButton.onclick = () => readAloud(flashcard);

    const attachButton = document.createElement('button');
    attachButton.innerHTML = '<i class="fas fa-paperclip"></i>';
    attachButton.onclick = () => attachImage(flashcard);

    const deleteDeckButton = document.createElement('button');
    deleteDeckButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteDeckButton.onclick = () => deleteDeck(flashcard);

    const saveButton = document.createElement('button');
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    saveButton.onclick = () => saveFlashcard(flashcard);

    buttonContainer.appendChild(audioButton);
    buttonContainer.appendChild(attachButton);
    buttonContainer.appendChild(deleteDeckButton);
    buttonContainer.appendChild(saveButton);

    flashcard.appendChild(flashcardContent);
    flashcard.appendChild(buttonContainer);

    return flashcard;
}

// Função para ler o texto do flashcard em voz alta com a velocidade atual
function readAloud(flashcard) {
    const textElement = flashcard.querySelector('.flashcard-content p');
    if (textElement) {
        const text = textElement.innerText.trim();
        if (text.length > 0) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = currentSpeed; // Aplica a velocidade selecionada
            utterance.onstart = () => console.log(`Iniciando leitura em ${currentSpeed}x`);
            utterance.onerror = () => console.error("Erro durante a leitura.");
            speechSynthesis.speak(utterance);
        } else {
            alert("Nenhum texto para ler neste deck.");
        }
    } else {
        alert("Erro: Não foi possível localizar o texto no deck.");
    }
}

// Função para anexar uma imagem ao flashcard
function attachImage(flashcard) {
    const newImageInput = document.createElement('input');
    newImageInput.type = 'file';
    newImageInput.accept = 'image/*';
    newImageInput.style.display = 'none';

    newImageInput.onchange = function () {
        const file = newImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '8px';

                img.onclick = () => {
                    if (confirm("Deseja excluir esta imagem?")) {
                        img.remove();
                    }
                };

                flashcard.querySelector('.flashcard-content').appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };

    newImageInput.click();
}

// Função para excluir o flashcard
function deleteDeck(flashcard) {
    flashcard.remove();
}

// Função para salvar o conteúdo do flashcard
function saveFlashcard(flashcard) {
    const content = flashcard.querySelector('.flashcard-content').innerHTML;
    console.log("Conteúdo salvo:", content);
    alert("Alterações no deck foram salvas!");
}

// Função para atualizar a velocidade de leitura
function updateSpeed(speed) {
    currentSpeed = speed;
    console.log(`Velocidade alterada para: ${currentSpeed}x`);
}

// Função para alterar a velocidade, chamada pelos botões
function changeSpeed(speed) {
    updateSpeed(speed); // Atualiza a velocidade com o valor do botão
}