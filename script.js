
let usuarios = [];
let livros = [];
let emprestimos = [];



// Quando a página carregar, executa estas funções
window.onload = function() {
    carregarDados();
    mostrarUsuarios();
    mostrarLivros();
    mostrarEmprestimos();
    atualizarNumeros();
};


// Troca entre as páginas do sistema
function mudarPagina(nomePagina) {
    // Esconde todas as páginas
    let paginas = document.querySelectorAll('.pagina');
    for(let i = 0; i < paginas.length; i++) {
        paginas[i].classList.add('escondido');
    }
    
    // Mostra só a página escolhida
    document.getElementById('pagina-' + nomePagina).classList.remove('escondido');
    
    // Se for página de empréstimos, preenche os selects
    if(nomePagina === 'emprestimos') {
        preencherSelects();
    }
    
    // Se for página inicial, atualiza os números
    if(nomePagina === 'inicio') {
        atualizarNumeros();
    }
}

// Pega os dados salvos do localStorage
function carregarDados() {
    let dadosUsuarios = localStorage.getItem('usuarios');
    let dadosLivros = localStorage.getItem('livros');
    let dadosEmprestimos = localStorage.getItem('emprestimos');
    
    if(dadosUsuarios) {
        usuarios = JSON.parse(dadosUsuarios);
    }
    if(dadosLivros) {
        livros = JSON.parse(dadosLivros);
    }
    if(dadosEmprestimos) {
        emprestimos = JSON.parse(dadosEmprestimos);
    }
}

// Salva os dados no localStorage
function salvarDados() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('livros', JSON.stringify(livros));
    localStorage.setItem('emprestimos', JSON.stringify(emprestimos));
}

// Cria um ID único usando data e número aleatório
function gerarId() {
    return Date.now() + '-' + Math.floor(Math.random() * 1000);
}


// Processa o formulário de cadastro de usuário
document.getElementById('formUsuario').onsubmit = function(e) {
    e.preventDefault();
    
    let id = document.getElementById('idUsuario').value;
    let nome = document.getElementById('nomeUsuario').value;
    let email = document.getElementById('emailUsuario').value;
    
    // Valida se os campos estão preenchidos
    if(nome === '' || email === '') {
        alert('Preencha todos os campos!');
        return;
    }
    
    // Se não tem ID, é cadastro novo
    if(id === '') {
        let novoUsuario = {
            id: gerarId(),
            nome: nome,
            email: email
        };
        usuarios.push(novoUsuario);
    } else {
        // Se tem ID, é edição
        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].id === id) {
                usuarios[i].nome = nome;
                usuarios[i].email = email;
                break;
            }
        }
    }
    
    salvarDados();
    mostrarUsuarios();
    limparFormUsuario();
};

// Mostra todos os usuários na tela
function mostrarUsuarios() {
    let lista = document.getElementById('listaUsuarios');
    lista.innerHTML = '';
    
    if(usuarios.length === 0) {
        lista.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
        return;
    }
    
    // Percorre o array e cria um item para cada usuário
    for(let i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        
        let div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = '<h4>' + usuario.nome + '</h4>' +
                       '<p>E-mail: ' + usuario.email + '</p>' +
                       '<p>ID: ' + usuario.id + '</p>' +
                       '<div class="botoes">' +
                       '<button class="btn-editar" onclick="editarUsuario(\'' + usuario.id + '\')">Editar</button>' +
                       '<button class="btn-excluir" onclick="excluirUsuario(\'' + usuario.id + '\')">Excluir</button>' +
                       '</div>';
        
        lista.appendChild(div);
    }
}

// Carrega os dados do usuário no formulário para editar
function editarUsuario(id) {
    for(let i = 0; i < usuarios.length; i++) {
        if(usuarios[i].id === id) {
            document.getElementById('idUsuario').value = usuarios[i].id;
            document.getElementById('nomeUsuario').value = usuarios[i].nome;
            document.getElementById('emailUsuario').value = usuarios[i].email;
            break;
        }
    }
}

// Remove um usuário da lista
function excluirUsuario(id) {
    if(confirm('Deseja realmente excluir este usuário?')) {
        let novaLista = [];
        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].id !== id) {
                novaLista.push(usuarios[i]);
            }
        }
        usuarios = novaLista;
        salvarDados();
        mostrarUsuarios();
    }
}

// Limpa o formulário de usuário
function limparFormUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('idUsuario').value = '';
}


// Processa o formulário de cadastro de livro
document.getElementById('formLivro').onsubmit = function(e) {
    e.preventDefault();
    
    let id = document.getElementById('idLivro').value;
    let titulo = document.getElementById('tituloLivro').value;
    let autor = document.getElementById('autorLivro').value;
    let ano = document.getElementById('anoLivro').value;
    let genero = document.getElementById('generoLivro').value;
    
    // Valida se os campos estão preenchidos
    if(titulo === '' || autor === '' || ano === '' || genero === '') {
        alert('Preencha todos os campos!');
        return;
    }
    
    // Se não tem ID, é cadastro novo
    if(id === '') {
        let novoLivro = {
            id: gerarId(),
            titulo: titulo,
            autor: autor,
            ano: ano,
            genero: genero,
            disponivel: true
        };
        livros.push(novoLivro);
    } else {
        // Se tem ID, é edição
        for(let i = 0; i < livros.length; i++) {
            if(livros[i].id === id) {
                livros[i].titulo = titulo;
                livros[i].autor = autor;
                livros[i].ano = ano;
                livros[i].genero = genero;
                break;
            }
        }
    }
    
    salvarDados();
    mostrarLivros();
    limparFormLivro();
};

// Mostra todos os livros na tela
function mostrarLivros() {
    let lista = document.getElementById('listaLivros');
    lista.innerHTML = '';
    
    if(livros.length === 0) {
        lista.innerHTML = '<p>Nenhum livro cadastrado.</p>';
        return;
    }
    
    // Percorre o array e cria um item para cada livro
    for(let i = 0; i < livros.length; i++) {
        let livro = livros[i];
        
        // Define se está disponível ou emprestado
        let status = livro.disponivel ? '<span class="disponivel">Disponível</span>' : '<span class="emprestado">Emprestado</span>';
        
        let div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = '<h4>' + livro.titulo + ' ' + status + '</h4>' +
                       '<p>Autor: ' + livro.autor + '</p>' +
                       '<p>Ano: ' + livro.ano + '</p>' +
                       '<p>Gênero: ' + livro.genero + '</p>' +
                       '<p>ID: ' + livro.id + '</p>' +
                       '<div class="botoes">' +
                       '<button class="btn-editar" onclick="editarLivro(\'' + livro.id + '\')">Editar</button>' +
                       '<button class="btn-excluir" onclick="excluirLivro(\'' + livro.id + '\')">Excluir</button>' +
                       '</div>';
        
        lista.appendChild(div);
    }
}

// Carrega os dados do livro no formulário para editar
function editarLivro(id) {
    for(let i = 0; i < livros.length; i++) {
        if(livros[i].id === id) {
            document.getElementById('idLivro').value = livros[i].id;
            document.getElementById('tituloLivro').value = livros[i].titulo;
            document.getElementById('autorLivro').value = livros[i].autor;
            document.getElementById('anoLivro').value = livros[i].ano;
            document.getElementById('generoLivro').value = livros[i].genero;
            break;
        }
    }
}

// Remove um livro da lista
function excluirLivro(id) {
    if(confirm('Deseja realmente excluir este livro?')) {
        let novaLista = [];
        for(let i = 0; i < livros.length; i++) {
            if(livros[i].id !== id) {
                novaLista.push(livros[i]);
            }
        }
        livros = novaLista;
        salvarDados();
        mostrarLivros();
    }
}

// Limpa o formulário de livro
function limparFormLivro() {
    document.getElementById('formLivro').reset();
    document.getElementById('idLivro').value = '';
}



// Processa o formulário de empréstimo
document.getElementById('formEmprestimo').onsubmit = function(e) {
    e.preventDefault();
    
    let idUsuario = document.getElementById('selectUsuario').value;
    let idLivro = document.getElementById('selectLivro').value;
    
    // Valida se foi selecionado usuário e livro
    if(idUsuario === '' || idLivro === '') {
        alert('Selecione usuário e livro!');
        return;
    }
    
    // Verifica se o livro está disponível
    let livroDisponivel = false;
    for(let i = 0; i < livros.length; i++) {
        if(livros[i].id === idLivro && livros[i].disponivel) {
            livroDisponivel = true;
            livros[i].disponivel = false; // Marca como emprestado
            break;
        }
    }
    
    if(!livroDisponivel) {
        alert('Este livro não está disponível!');
        return;
    }
    
    // Cria o empréstimo
    let novoEmprestimo = {
        id: gerarId(),
        idUsuario: idUsuario,
        idLivro: idLivro,
        data: new Date().toLocaleDateString('pt-BR'),
        ativo: true
    };
    
    emprestimos.push(novoEmprestimo);
    salvarDados();
    mostrarEmprestimos();
    mostrarLivros();
    preencherSelects();
    document.getElementById('formEmprestimo').reset();
};

// Mostra todos os empréstimos na tela
function mostrarEmprestimos() {
    let lista = document.getElementById('listaEmprestimos');
    lista.innerHTML = '';
    
    if(emprestimos.length === 0) {
        lista.innerHTML = '<p>Nenhum empréstimo registrado.</p>';
        return;
    }
    
    // Percorre o array e cria um item para cada empréstimo
    for(let i = 0; i < emprestimos.length; i++) {
        let emprestimo = emprestimos[i];
        
        // Busca o nome do usuário
        let nomeUsuario = '';
        for(let j = 0; j < usuarios.length; j++) {
            if(usuarios[j].id === emprestimo.idUsuario) {
                nomeUsuario = usuarios[j].nome;
                break;
            }
        }
        
        // Busca o título do livro
        let tituloLivro = '';
        for(let k = 0; k < livros.length; k++) {
            if(livros[k].id === emprestimo.idLivro) {
                tituloLivro = livros[k].titulo;
                break;
            }
        }
        
        // Define o status e botão de devolução
        let status = emprestimo.ativo ? 'Ativo' : 'Devolvido';
        let botaoDevolver = emprestimo.ativo ? '<button class="btn-devolver" onclick="devolverLivro(\'' + emprestimo.id + '\')">Devolver</button>' : '';
        
        let div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = '<h4>Empréstimo - ' + status + '</h4>' +
                       '<p>Usuário: ' + nomeUsuario + '</p>' +
                       '<p>Livro: ' + tituloLivro + '</p>' +
                       '<p>Data: ' + emprestimo.data + '</p>' +
                       '<div class="botoes">' + botaoDevolver + '</div>';
        
        lista.appendChild(div);
    }
}

// Registra a devolução de um livro
function devolverLivro(idEmprestimo) {
    // Busca o empréstimo e marca como devolvido
    for(let i = 0; i < emprestimos.length; i++) {
        if(emprestimos[i].id === idEmprestimo && emprestimos[i].ativo) {
            emprestimos[i].ativo = false;
            
            // Marca o livro como disponível novamente
            let idLivro = emprestimos[i].idLivro;
            for(let j = 0; j < livros.length; j++) {
                if(livros[j].id === idLivro) {
                    livros[j].disponivel = true;
                    break;
                }
            }
            break;
        }
    }
    
    salvarDados();
    mostrarEmprestimos();
    mostrarLivros();
}

// Preenche os selects de usuário e livro
function preencherSelects() {
    let selectUsuario = document.getElementById('selectUsuario');
    let selectLivro = document.getElementById('selectLivro');
    
    // Preenche select de usuários
    selectUsuario.innerHTML = '<option value="">Escolha um usuário</option>';
    for(let i = 0; i < usuarios.length; i++) {
        let option = document.createElement('option');
        option.value = usuarios[i].id;
        option.textContent = usuarios[i].nome;
        selectUsuario.appendChild(option);
    }
    
    // Preenche select de livros (somente disponíveis)
    selectLivro.innerHTML = '<option value="">Escolha um livro</option>';
    for(let i = 0; i < livros.length; i++) {
        if(livros[i].disponivel) {
            let option = document.createElement('option');
            option.value = livros[i].id;
            option.textContent = livros[i].titulo + ' - ' + livros[i].autor;
            selectLivro.appendChild(option);
        }
    }
}


// ==================== TELA INICIAL ====================

// Atualiza os números da tela inicial
function atualizarNumeros() {
    document.getElementById('contarUsuarios').textContent = usuarios.length;
    document.getElementById('contarLivros').textContent = livros.length;
    
    // Conta quantos empréstimos estão ativos
    let emprestimosAtivos = 0;
    for(let i = 0; i < emprestimos.length; i++) {
        if(emprestimos[i].ativo) {
            emprestimosAtivos++;
        }
    }
    document.getElementById('contarEmprestimos').textContent = emprestimosAtivos;
}
