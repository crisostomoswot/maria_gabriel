// =========================================
// INICIALIZAÇÃO DO FLIPBOOK (TURN.JS)
// =========================================
$(window).on('load', function() {
    $('#flipbook').turn({
        width: window.innerWidth,
        height: window.innerHeight,
        display: 'single', // Mostra 1 página por vez ocupando toda a tela
        autoCenter: true,
        elevation: 50,
        gradients: true,
        // Impede que o usuário vire a página sem clicar nos seus botões customizados:
        disable: true, 
        duration: 1500
    });

    // Mantém o tamanho do livro dinâmico se a tela for redimensionada
    $(window).resize(function() {
        $('#flipbook').turn('size', window.innerWidth, window.innerHeight);
    });
});

// =========================================
// CONTROLE DE CENAS COM TURN.JS
// =========================================
function iniciarMusica() {
    // 1. Força o navegador a carregar o áudio DENTRO da ação de clique do usuário.
    // Isso burla os bloqueios de segurança do iOS, Safari e Chrome.
    audioFundo.load(); 
    
    // 2. Tenta tocar a música e captura qualquer erro sem quebrar o resto do site
    let playPromise = audioFundo.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Se o áudio tocar com sucesso, muda o botão para pause
            document.getElementById('btn-play').innerText = "⏸️";
        }).catch(error => {
            console.log("O navegador bloqueou o áudio temporariamente:", error);
            // Se der erro de política do navegador, mantém o ícone de play
            document.getElementById('btn-play').innerText = "▶️";
        });
    }

    // 3. Libera a interação e vira a página normalmente
    $('#flipbook').turn("disable", false);
    $('#flipbook').turn("next");
    $('#flipbook').turn("disable", true); // Trava na nova cena
}

function irParaSala() {
    $('#flipbook').turn("disable", false);
    $('#flipbook').turn("next");
    $('#flipbook').turn("disable", true);
}

function acharBenedita() {
    // Vira para o Susto (Cena 3)
    $('#flipbook').turn("disable", false);
    $('#flipbook').turn("next");
    $('#flipbook').turn("disable", true);

    setTimeout(() => {
        // Vira para a Raspadinha (Cena 4)
        $('#flipbook').turn("disable", false);
        $('#flipbook').turn("next");
        $('#flipbook').turn("disable", true);
        
        gerarChuvaEmojis();
        iniciarRaspadinha();
    }, 2000); 
}

// =========================================
// TERMOS E CONDIÇÕES (TELA DE ENTRADA)
// =========================================
function verificarTermos() {
    const checkbox = document.getElementById('aceite-termos');
    const botao = document.getElementById('btn-abrir');

    // Se o checkbox estiver marcado (true), removemos o 'disabled' (false)
    if (checkbox.checked) {
        botao.disabled = false;
    } else {
        // Se ela desmarcar a caixinha, o botão bloqueia de novo
        botao.disabled = true;
    }
}

// =========================================
// EFEITOS E CHUVA DE EMOJIS
// =========================================
function gerarChuvaEmojis() {
    const emojis = ['💖', '🐾', '🎀', '✨', '🐶']; 
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confete = document.createElement('div');
            confete.classList.add('confete');
            confete.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            
            confete.style.left = Math.random() * 100 + 'vw';
            
            const duracao = Math.random() * 3 + 2; 
            confete.style.animationDuration = duracao + 's';
            
            document.body.appendChild(confete);
            
            setTimeout(() => {
                confete.remove();
            }, duracao * 1000);
        }, i * 100); 
    }
}

// =========================================
// VARIÁVEIS DA RASPADINHA
// =========================================
let canvas, ctx, isDrawing = false;

function iniciarRaspadinha() {
    canvas = document.getElementById('raspadinha');
    ctx = canvas.getContext('2d');
    
    const container = document.querySelector('.container-raspadinha');
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    let gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradiente.addColorStop(0, "#dcb2b9"); 
    gradiente.addColorStop(0.5, "#eccfd4"); 
    gradiente.addColorStop(1, "#d1a3ac");
    
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "bold 28px Gaegu";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Raspe aqui com amor", canvas.width / 2, canvas.height / 2);
    
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 40; 
    
    ctx.globalCompositeOperation = "destination-out";

    canvas.addEventListener('mousedown', iniciarTraço);
    canvas.addEventListener('mousemove', raspar);
    canvas.addEventListener('mouseup', pararTraço);
    canvas.addEventListener('mouseout', pararTraço);

    canvas.addEventListener('touchstart', iniciarTraço, { passive: false });
    canvas.addEventListener('touchmove', raspar, { passive: false });
    canvas.addEventListener('touchend', pararTraço);
}

function obterCoordenadas(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function iniciarTraço(e) {
    e.preventDefault(); 
    isDrawing = true;
    const { x, y } = obterCoordenadas(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function raspar(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = obterCoordenadas(e);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function pararTraço() {
    isDrawing = false;
}

// =========================================
// LÓGICA DO VALE-PRESENTE
// =========================================
const listaDePremios = [
    "🎟️ Vale um jantar feito por mim!",
    "🎟️ Vale uma noite de filmes com muitos beijos e pipoca!",
    "🎟️ Vale um lanche pago (você escolhe!)",
    "🎟️ Vale uma massagem relaxante!",
    "🎟️ Vale eu te pagando um açaí do Bibi!",
    "🎟️ Vale um dia de princesa (eu faço tudo!)",
    "🎟️ Vale 500 beijos",
    "🎟️ Vale um date saudável com saladas!",
    "🎟️ Vale uma noite com o drink do Messi e muitos beijos!",
    "🎟️ Vale 1000 beijos",
    "🎟️ Vale uma ida ao Rio Sul juntos!",
    "🎟️ Vale um dia de piquenique na praia!",
    "🎟️ Vale um dia de piquenique!",
    "🎟️ Vale um cineminha com muito amor (e beijos)!",
    "🎟️ Vale um dia de museu!",
    "🎟️ Vale uma ida a praia (com muito amor)!",
    "🎟️ Vale um carro 0km!😲😲😲",
    "🎟️ Vale 1 beijo",
    "🎟️ Vale um rolê de bike juntos!",
    "🎟️ Vale uma manhã de feira juntos!",
    "🎟️ Vale um date de organizar o sono kkkk",
    "🎟️ Vale 1 beijo na boca😲",
    "🎟️ Vale um cheiro bem gostoso no pescoço!",
    "🎟️ Vale uma piada bem engraçada!",
    "🎟️ Vale eu te amando pra sempre!!",
    "🎟️ Vale um dia de estudos juntos!👎👎👎"

];

function sortearPremio() {
    const resultadoDiv = document.getElementById('resultado-sorteio');
    const botao = document.getElementById('btn-sorteio');
    
    const numeroSorteado = Math.floor(Math.random() * listaDePremios.length);
    const premioSorteado = listaDePremios[numeroSorteado];
    
    resultadoDiv.innerHTML = premioSorteado;
    resultadoDiv.classList.add('mostrar');
    
    botao.innerHTML = "Sortear outro prêmio 🎲";
    botao.style.fontSize = "1.2rem";
    botao.style.padding = "5px 15px";
}

// =========================================
// SISTEMA DE MÚSICA
// =========================================
const playlist = [
    { titulo: "Juno - Sabrina Carpenter", src: "assets/juno.mp3" },
    { titulo: "Maria - Matuê", src: "assets/maria.mp3" },
    { titulo: "Velha Infância - Tribalistas", src: "assets/velha.mp3" },
    { titulo: "333 - Matuê", src: "assets/333.mp3" }
];

let indiceMusica = 0;
const audioFundo = new Audio();

// Nova variável para controlar o relógio do LCD
let intervaloRelogio; 
let textoAtualLCD = "";

function atualizarNomeMusica() {
    const visor = document.getElementById('nome-musica');
    const titulo = playlist[indiceMusica].titulo;
    
    // 1. Limpa o letreiro anterior sempre que a música mudar
    clearInterval(intervaloRelogio);
    
    // 2. Prepara a frase com um separador. 
    // Usamos \u00A0 (espaço em branco fixo) para o HTML não "engolir" os espaços.
    let textoBase = titulo + "\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0";
    
    // 3. Multiplica o texto para garantir que ele encha a telinha do rádio
    // Isso impede que músicas com nome muito curto (ex: "333") deixem a tela vazia
    while (textoBase.length < 50) {
        textoBase += titulo + "\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0";
    }
    
    textoAtualLCD = textoBase;
    visor.textContent = textoAtualLCD;
    
    // 4. O Motor do LCD: Executa a troca de letras a cada 200 milissegundos
    intervaloRelogio = setInterval(() => {
        // Pega a primeira letra da string (posição 0)
        const primeiraLetra = textoAtualLCD.charAt(0);
        // Pega todo o resto da string (da posição 1 em diante)
        const restoDaFrase = textoAtualLCD.substring(1);
        
        // Cola a primeira letra no final da fila
        textoAtualLCD = restoDaFrase + primeiraLetra;
        
        // Imprime o resultado na tela instantaneamente
        visor.textContent = textoAtualLCD;
        
    }, 200); // Se quiser a rolagem mais rápida, diminua este valor (ex: 150)
}

function inicializarPlayer() {
    audioFundo.src = playlist[indiceMusica].src;
    atualizarNomeMusica();
    
    // Opcional: A linha abaixo foi removida pois a atualizarNomeMusica() 
    // já escreve no visor, evitando que o nome original sobrescreva o LCD.
    // document.getElementById('nome-musica').innerText = playlist[indiceMusica].titulo; 
    
    audioFundo.addEventListener('ended', () => {
        if (playlist.length === 1) {
            audioFundo.currentTime = 0;
            audioFundo.play();
        } else {
            proximaMusica();
        }
    });
}

function toggleMusica() {
    const btnPlay = document.getElementById('btn-play');
    if (audioFundo.paused) {
        audioFundo.play();
        btnPlay.innerText = "⏸️"; 
    } else {
        audioFundo.pause();
        btnPlay.innerText = "▶️"; 
    }
}

function proximaMusica() {
    if (playlist.length > 1) {
        indiceMusica = (indiceMusica + 1) % playlist.length;
        audioFundo.src = playlist[indiceMusica].src;
        atualizarNomeMusica();
        document.getElementById('nome-musica').innerText = playlist[indiceMusica].titulo;
        audioFundo.play();
        document.getElementById('btn-play').innerText = "⏸️";
    }
}

inicializarPlayer();

// =========================================
// EFEITO 3D PARALLAX (APENAS NA SALA DE ESTAR)
// =========================================

document.addEventListener("mousemove", function(e) {
    const paginasVisiveis = $('#flipbook').turn('view');
    if (!paginasVisiveis.includes(3)) return; 

    const cenario = document.getElementById('cenario-parallax');
    if (!cenario) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
    const mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);

    const elementos = cenario.querySelectorAll('[data-speed]');
    
    elementos.forEach(el => {
        const speed = el.getAttribute('data-speed');
        
        const x = mouseX * speed * -2; 
        const y = mouseY * speed * -2;

        el.style.setProperty('--parallax-x', `${x}px`);
        el.style.setProperty('--parallax-y', `${y}px`);
    });

    const bgX = mouseX * 2;
    const bgY = mouseY * 2;
    cenario.style.setProperty('--bg-x', `${bgX}px`);
    cenario.style.setProperty('--bg-y', `${bgY}px`);
});

// =========================================
// EFEITO MÁQUINA DE ESCREVER (TYPEWRITER)
// =========================================

const audioTeclado = new Audio('assets/teclado.mp3');
audioTeclado.volume = 0.4; 

let digitouEntrada = false;
let digitouCarta = false;
let digitouVitoria = false;

function datilografar(idElemento, texto, velocidade) {
    const elemento = document.getElementById(idElemento);
    elemento.innerHTML = ''; 
    let i = 0;
    
    audioTeclado.loop = true;
    audioTeclado.play().catch(() => {}); 

    function digitar() {
        if (i < texto.length) {
            elemento.innerHTML += texto.charAt(i);
            i++;
            setTimeout(digitar, velocidade);
        } else {
            audioTeclado.pause();
            audioTeclado.currentTime = 0;
            elemento.classList.add('terminou-digitar');
        }
    }
    
    digitar();
}

window.addEventListener('load', () => {
    const checkbox = document.getElementById('aceite-termos');
    const botao = document.getElementById('btn-abrir');
    
    if (checkbox && botao) {
        checkbox.checked = false; // Força a desmarcar
        botao.disabled = true;    // Força o bloqueio do botão
    }
    setTimeout(() => {
        if (!digitouEntrada) {
            datilografar('texto-entrada', '(Coloque os fones de ouvido para uma experiência melhor!)', 50);
            digitouEntrada = true;
        }
    }, 500); 
});

$('#flipbook').bind('turned', function(event, page, view) {
    
    if (page === 2 && !digitouCarta) {
        datilografar('texto-carta', 'Fiz uma surpresinha especial para você, mas a Benê pegou e se escondeu...', 60);
        digitouCarta = true;
    }
    
    if (page === 5 && !digitouVitoria) {
        datilografar('texto-vitoria', 'Você achou ela!!! 🎉', 80);
        digitouVitoria = true;
    }
});

// =========================================
// POEMA SECRETO (CÓDIGO NO TECLADO)
// =========================================

let sequenciaDigitada = "";
const codigoSecreto = "mariaegabriel";

window.addEventListener("keydown", function(e) {
    if (e.key.length === 1) {
        sequenciaDigitada += e.key.toLowerCase();
        
        if (sequenciaDigitada.length > codigoSecreto.length) {
            sequenciaDigitada = sequenciaDigitada.slice(-codigoSecreto.length);
        }

        if (sequenciaDigitada === codigoSecreto) {
            abrirPoema();
            sequenciaDigitada = ""; 
        }
    }
});

function abrirPoema() {
    const overlay = document.getElementById('overlay-poema');
    
    overlay.style.display = 'flex'; 
    
    setTimeout(() => {
        overlay.classList.add('ativo');
    }, 10);
}

function fecharPoema() {
    const overlay = document.getElementById('overlay-poema');
    
    overlay.classList.remove('ativo'); 
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}