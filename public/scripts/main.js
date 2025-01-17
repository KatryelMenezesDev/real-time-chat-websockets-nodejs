const socket = io();

// Verifica se o nome de usuário está armazenado no cookie
if (!getCookie('username')) {
    // Exibe o modal caso não exista
    document.getElementById('usernameModal').style.display = 'flex';
}

// Função para salvar o nome de usuário e a cor no cookie/sessionStorage
function salvarUsername() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();

    if (username && username.length <= 50 && /^[a-zA-Z0-9]+$/.test(username)) {
        const color = gerarCorAleatoria();
        // Salva o nome de usuário e a cor no sessionStorage
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('color', color);
        document.getElementById('usernameModal').style.display = 'none';

        // Envia os dados para o servidor
        socket.emit('setUsername', { username: username, color: color });
    } else {
        alert('Nome de usuário inválido! Só pode ter letras e números, com no máximo 50 caracteres.');
    }
}

// Função para gerar uma cor aleatória
function gerarCorAleatoria() {
    let cor;
    do {
        // Gera uma cor aleatória em formato hexadecimal
        cor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    } while (isCorClara(cor));
    return cor;
}

// Função para verificar se a cor é muito clara (evita branco ou tons claros)
function isCorClara(cor) {
    const r = parseInt(cor.substring(1, 3), 16);
    const g = parseInt(cor.substring(3, 5), 16);
    const b = parseInt(cor.substring(5, 7), 16);
    const luminancia = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminancia > 200;
}

// Função para obter o valor do cookie/sessionStorage
function getCookie(name) {
    return sessionStorage.getItem(name) || "";
}

// Exibe/oculta o modal de emojis
function toggleEmojiModal() {
    const emojiModal = document.getElementById('emojiModal');
    emojiModal.style.display = emojiModal.style.display === 'flex' ? 'none' : 'flex';
}

// Adiciona o emoji ao campo de texto
function addEmoji(emoji) {
    const input = document.getElementById('messageInput');
    input.value += emoji;
    toggleEmojiModal();
}

// Fecha o modal de emojis ao pressionar a tecla "Esc"
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const emojiModal = document.getElementById('emojiModal');
        if (emojiModal.style.display === 'flex') {
            emojiModal.style.display = 'none';
        }
    }
});

// Escuta por mensagens e exibe no chat
socket.on('chat', data => {
    const chatBody = document.querySelector('.chat-body');
    const div = document.createElement('div');

    const userColor = data.color || '#000000'; // Padrão preto
    const usernameSpan = document.createElement('span');
    usernameSpan.style.fontWeight = 'bold';
    usernameSpan.style.color = userColor;
    usernameSpan.textContent = data.username + ": ";

    const messageSpan = document.createElement('span');
    messageSpan.textContent = data.message;

    const timeSpan = document.createElement('span');
    timeSpan.textContent = ` ${data.time}`;
    timeSpan.style.fontSize = '12px';
    timeSpan.style.color = '#999';
    timeSpan.style.position = 'absolute';
    timeSpan.style.bottom = '5px';
    timeSpan.style.right = '10px';

    div.classList.add('message', 'received');
    div.style.position = 'relative';
    div.appendChild(usernameSpan);
    div.appendChild(messageSpan);
    div.appendChild(timeSpan);

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Toca o som de notificação
    document.getElementById('messageSound').play();
});

// Função para enviar a mensagem
function enviar() {
    const input = document.querySelector('#messageInput');
    const message = input.value.trim();

    if (message === '' || message.length > 85) {
        alert('A mensagem não pode estar vazia e deve ter no máximo 85 caracteres.');
        return;
    }

    input.value = '';
    
    socket.emit('chat', {
        username: sessionStorage.getItem('username'),
        message: message,
        time: new Date().toLocaleTimeString().slice(0, 5),
        color: sessionStorage.getItem('color')
    });
}

document.querySelector('#messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        enviar();
    }
});