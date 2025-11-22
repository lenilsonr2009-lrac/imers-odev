document.addEventListener('DOMContentLoaded', () => {
    // --- SELETORES DO DOM ---
    const cardContainer = document.querySelector('.card-conteiner');
    const buscaInput = document.getElementById('buscaInput');
    const buscaBotao = document.getElementById('buscaBotao');
    const limparBuscaBotao = document.getElementById('limparBuscaBotao');
    const ordenarNomeBotao = document.getElementById('ordenarNomeBotao');
    const ordenarReferenciaBotao = document.getElementById('ordenarReferenciaBotao');
    const filtroLivroSelect = document.getElementById('filtroLivroSelect');
    const paginationContainer = document.getElementById('pagination-container');

    // Elementos do conteúdo diário
    const curiosidadeTexto = document.getElementById('curiosidade-texto'); // Mantido, pois já estava correto no script
    const curiosidadeReferencia = document.getElementById('curiosidade-referencia'); // Mantido, pois já estava correto no script
    const versiculoTexto = document.getElementById('versiculo-texto');
    const versiculoReferencia = document.getElementById('versiculo-referencia');
    const hinoTitulo = document.getElementById('hino-titulo');
    const hinoLetra = document.getElementById('hino-letra');

    let todasCuriosidades = [];
    let curiosidadesFiltradas = [];

    // --- ESTADO DA APLICAÇÃO ---
    let currentPage = 1;
    const itemsPerPage = 15;

    // Ordem canônica dos livros da Bíblia para ordenação correta
    const ordemLivrosBiblicos = [
        'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute',
        '1 Samuel', '2 Samuel', '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester',
        'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cantares de Salomão',
        'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel',
        'Oséias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miqueias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
        'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos',
        '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses',
        '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom',
        'Hebreus', 'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João', 'Judas', 'Apocalipse',
        'Arqueologia Bíblica', 'História da Bíblia', 'Contexto Histórico', 'Evangelhos'
    ];

    // --- CARREGAMENTO DOS DADOS ---
    async function carregarCuriosidades() {
        mostrarSpinner(true);
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            todasCuriosidades = await response.json();
            curiosidadesFiltradas = [...todasCuriosidades];
            popularFiltroLivros();
            atualizarExibicao();
            exibirConteudoDiario();
        } catch (error) {
            console.error("Erro ao carregar as curiosidades:", error);
            cardContainer.innerHTML = "<p class='card-aviso'>Não foi possível carregar as curiosidades. Tente recarregar a página.</p>";
        } finally {
            mostrarSpinner(false);
        }
    }

    function mostrarSpinner(mostrar) {
        if (mostrar) {
            cardContainer.innerHTML = '<div class="spinner"></div>';
        } else {
            const spinner = cardContainer.querySelector('.spinner');
            if (spinner) {
                spinner.remove();
            }
        }
    }
    // --- EXIBIÇÃO ---
    function exibirCards(curiosidades, pagina) {
        cardContainer.innerHTML = '';
        pagina--; // Ajusta para o índice do array (base 0)

        if (curiosidades.length === 0) {
            cardContainer.innerHTML = "<p class='card-aviso'>Nenhuma curiosidade encontrada.</p>";
            return;
        }

        const inicio = itemsPerPage * pagina;
        const fim = inicio + itemsPerPage;
        const itensPaginados = curiosidades.slice(inicio, fim);

        if (itensPaginados.length === 0 && curiosidades.length > 0) {
            currentPage = 1;
            exibirCards(curiosidades, currentPage);
            return;
        }

        itensPaginados.forEach(curiosidade => {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <h2>${curiosidade.nome}</h2>
                <p><strong>Referência:</strong> ${curiosidade.referencia}</p>
                <p>${curiosidade.descricao}</p>
                <a href="${curiosidade.link}" target="_blank" rel="noopener noreferrer">Leia na Bíblia</a>
            `;
            cardContainer.appendChild(card);
        });
    }

    function setupPagination(curiosidades) {
        paginationContainer.innerHTML = "";
        const pageCount = Math.ceil(curiosidades.length / itemsPerPage);

        if (pageCount <= 1) return;

        for (let i = 1; i < pageCount + 1; i++) {
            const btn = criarBotaoPaginacao(i);
            paginationContainer.appendChild(btn);
        }
    }

    function criarBotaoPaginacao(pagina) {
        const button = document.createElement('button');
        button.innerText = pagina;

        if (currentPage == pagina) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            currentPage = pagina;
            exibirCards(curiosidadesFiltradas, currentPage);

            let current_btn = document.querySelector('.pagination-container button.active');
            current_btn.classList.remove('active');
            button.classList.add('active');
        });
        return button;
    }

    function exibirConteudoDiario() {
        // Curiosidade do Dia (usa uma curiosidade aleatória)
        if (todasCuriosidades.length > 0) {
            const curiosidadeDoDia = todasCuriosidades[Math.floor(Math.random() * todasCuriosidades.length)];
            // Verifica se os elementos existem antes de tentar usá-los
            if (curiosidadeTexto && curiosidadeReferencia) {
                curiosidadeTexto.textContent = `"${curiosidadeDoDia.descricao}"`;
                curiosidadeReferencia.textContent = `- ${curiosidadeDoDia.nome} (${curiosidadeDoDia.referencia})`;
            }
        }

        // Versículo do Dia (dados estáticos)
        const versiculosDiarios = [
            { texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", referencia: "João 3:16" },
            { texto: "O Senhor é o meu pastor; nada me faltará.", referencia: "Salmos 23:1" },
            { texto: "Posso todas as coisas naquele que me fortalece.", referencia: "Filipenses 4:13" },
            { texto: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.", referencia: "Salmos 119:105" },
            { texto: "O temor do Senhor é o princípio da sabedoria.", referencia: "Provérbios 9:10" }
        ];
        const versiculoDoDia = versiculosDiarios[Math.floor(Math.random() * versiculosDiarios.length)];
        if (versiculoTexto && versiculoReferencia) {
            versiculoTexto.textContent = `"${versiculoDoDia.texto}"`;
            versiculoReferencia.textContent = `- ${versiculoDoDia.referencia}`;
        }

        // Hino do Dia (dados estáticos)
        const hinosHarpa = [
            { titulo: "Nº 545 - Porque Ele Vive", letra: "Porque Ele vive, posso crer no amanhã. Porque Ele vive, temor não há..." },
            { titulo: "Nº 187 - Mais Perto Quero Estar", letra: "Mais perto quero estar, meu Deus, de Ti! Inda que seja a dor que me una a Ti..." },
            { titulo: "Nº 291 - A Mensagem da Cruz", letra: "Sim, eu amo a mensagem da cruz, 'té morrer eu a vou proclamar..." }
        ];
        const hinoDoDia = hinosHarpa[Math.floor(Math.random() * hinosHarpa.length)];
        if (hinoTitulo && hinoLetra) {
            hinoTitulo.textContent = hinoDoDia.titulo;
            hinoLetra.innerHTML = `"${hinoDoDia.letra}"`;
        }
    }

    function atualizarExibicao() {
        exibirCards(curiosidadesFiltradas, currentPage);
        setupPagination(curiosidadesFiltradas);
    }

    // --- FILTROS E ORDENAÇÃO ---
    function aplicarFiltros() {
        const termo = buscaInput.value.toLowerCase().trim();
        const livroSelecionado = filtroLivroSelect.value;

        let resultado = todasCuriosidades.filter(c => {
            const correspondeBusca = termo === '' ||
                c.nome.toLowerCase().includes(termo) ||
                c.descricao.toLowerCase().includes(termo) ||
                c.referencia.toLowerCase().includes(termo);

            const livroCuriosidade = extrairDadosReferencia(c.referencia).livro;
            const correspondeFiltro = livroSelecionado === 'todos' || livroCuriosidade === livroSelecionado;

            return correspondeBusca && correspondeFiltro;
        });

        curiosidadesFiltradas = resultado;
        currentPage = 1; // Reseta para a primeira página após filtrar
        atualizarExibicao();
    }

    function limparBusca() {
        buscaInput.value = '';
        filtroLivroSelect.value = 'todos';
        curiosidadesFiltradas = [...todasCuriosidades];
        currentPage = 1;
        atualizarExibicao();
    }

    function ordenarPorNome() {
        curiosidadesFiltradas.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        currentPage = 1;
        atualizarExibicao();
    }

    function extrairDadosReferencia(referencia) {
        // Tenta encontrar um padrão de livro que pode conter números e espaços,
        // seguido por um número de capítulo. Ex: "1 Samuel 10", "Gênesis 2", "Cantares de Salomão 1".
        const match = referencia.match(/^([1-3]?\s?[a-zA-Zçã\s]+?)\s*(\d+)/);

        if (!match) {
            // Se não encontrar, trata como referência não-padrão (ex: "Arqueologia Bíblica")
            const indexLivro = ordemLivrosBiblicos.indexOf(referencia);
            return { livro: referencia, capitulo: 0, indexLivro: indexLivro !== -1 ? indexLivro : ordemLivrosBiblicos.length };
        }

        const livro = match[1].trim();
        const capitulo = parseInt(match[2], 10) || 0;
        const indexLivro = ordemLivrosBiblicos.indexOf(livro);

        return {
            livro,
            capitulo,
            // Joga livros não encontrados no array para o final da ordenação
            indexLivro: indexLivro !== -1 ? indexLivro : ordemLivrosBiblicos.length
        };
    }

    function ordenarPorReferencia() {
        curiosidadesFiltradas.sort((a, b) => {
            const refA = extrairDadosReferencia(a.referencia);
            const refB = extrairDadosReferencia(b.referencia);

            // Compara primeiro pelo índice do livro na ordem canônica
            if (refA.indexLivro !== refB.indexLivro) {
                return refA.indexLivro - refB.indexLivro;
            }
            // Se for o mesmo livro, compara pelo capítulo
            return refA.capitulo - refB.capitulo;
        });
        currentPage = 1;
        atualizarExibicao();
    }

    function popularFiltroLivros() {
        const livros = new Set();
        todasCuriosidades.forEach(c => {
            const livro = extrairDadosReferencia(c.referencia).livro;
            livros.add(livro);
        });

        const livrosOrdenados = Array.from(livros).sort((a, b) => {
            // Garante que a ordem seja exatamente a do array 'ordemLivrosBiblicos'
            let indexA = ordemLivrosBiblicos.indexOf(a);
            let indexB = ordemLivrosBiblicos.indexOf(b);

            // Joga livros não encontrados no array para o final da lista
            if (indexA === -1) indexA = Infinity;
            if (indexB === -1) indexB = Infinity;

            return indexA - indexB;
        });

        livrosOrdenados.forEach(livro => {
            const option = document.createElement('option');
            option.value = livro;
            option.textContent = livro;
            filtroLivroSelect.appendChild(option);
        });
    }

    // --- EVENT LISTENERS ---
    buscaBotao.addEventListener('click', aplicarFiltros);
    limparBuscaBotao.addEventListener('click', limparBusca);
    ordenarNomeBotao.addEventListener('click', ordenarPorNome);
    ordenarReferenciaBotao.addEventListener('click', ordenarPorReferencia);
    filtroLivroSelect.addEventListener('change', aplicarFiltros);

    // Busca ao pressionar Enter
    buscaInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            aplicarFiltros();
        }
    });

    // --- INICIALIZAÇÃO ---
    carregarCuriosidades();
});