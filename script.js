
let usuarios = [];
let livros = [];
let emprestimos = [];

document.addEventListener('DOMContentLoaded', initApp);
function initApp() {
    carregarDados();
    mostrarUsuarios();
    mostrarLivros();
    mostrarEmprestimos();
    atualizarNumeros();
    console.log('initApp: aplicação inicializada');
}


function mudarPagina(nomePagina) {
    let paginas = document.querySelectorAll('.pagina');
    for(let i = 0; i < paginas.length; i++) {
        paginas[i].classList.add('escondido');
    }
    
    document.getElementById('pagina-' + nomePagina).classList.remove('escondido');
    
    if(nomePagina === 'emprestimos') {
        preencherSelects();
    }
    
    if(nomePagina === 'inicio') {
        atualizarNumeros();
    }
}

function carregarDados() {
    try {
        let dadosUsuarios = localStorage.getItem('usuarios');
        let dadosLivros = localStorage.getItem('livros');
        let dadosEmprestimos = localStorage.getItem('emprestimos');

        if (dadosUsuarios) usuarios = JSON.parse(dadosUsuarios);
        if (dadosLivros) livros = JSON.parse(dadosLivros);
        if (dadosEmprestimos) emprestimos = JSON.parse(dadosEmprestimos);
    } catch (err) {
        console.warn('carregarDados: falha ao ler localStorage, resetando dados', err);
        usuarios = [];
        livros = [];
        emprestimos = [];
    }
}

function salvarDados() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('livros', JSON.stringify(livros));
    localStorage.setItem('emprestimos', JSON.stringify(emprestimos));
    console.log('salvarDados: estado salvo (usuarios:%d, livros:%d, emprestimos:%d)', usuarios.length, livros.length, emprestimos.length);
}

function gerarIdRegistro() {
    return Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function mostrarAviso(msg) {
    alert(msg);
}


document.getElementById('formUsuario').onsubmit = function(e) {
    e.preventDefault();
    
    let id = document.getElementById('idUsuario').value;
    let nome = document.getElementById('nomeUsuario').value;
    let email = document.getElementById('emailUsuario').value;
    
    if (nome === '' || email === '') {
        mostrarAviso('Erro ao salvar usuário: preencha nome e e-mail.');
        return;
    }
    
    if (id === '') {
        let novoUsuario = {
            id: gerarIdRegistro(),
            nome: nome,
            email: email
        };
        usuarios.push(novoUsuario);
    } else {
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

function mostrarUsuarios() {
    let lista = document.getElementById('listaUsuarios');
    lista.innerHTML = '';
    
    if(usuarios.length === 0) {
        lista.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
        return;
    }
    
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

function limparFormUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('idUsuario').value = '';
}


document.getElementById('formLivro').onsubmit = function(e) {
    e.preventDefault();
    
    let id = document.getElementById('idLivro').value;
    let titulo = document.getElementById('tituloLivro').value;
    let autor = document.getElementById('autorLivro').value;
    let ano = document.getElementById('anoLivro').value;
    let genero = document.getElementById('generoLivro').value;
    
        if (titulo === '' || autor === '' || ano === '' || genero === '') {
            mostrarAviso('Erro ao salvar livro: revise título, autor, ano e gênero.');
            return;
        }
    
    if (id === '') {
        let novoLivro = {
            id: gerarIdRegistro(),
            titulo: titulo,
            autor: autor,
            ano: ano,
            genero: genero,
            disponivel: true
        };
        livros.push(novoLivro);
    } else {

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

function mostrarLivros() {
    let lista = document.getElementById('listaLivros');
    lista.innerHTML = '';
    
    if(livros.length === 0) {
        lista.innerHTML = '<p>Nenhum livro cadastrado.</p>';
        return;
    }
    
    for(let i = 0; i < livros.length; i++) {
        let livro = livros[i];
        
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

function limparFormLivro() {
    document.getElementById('formLivro').reset();
    document.getElementById('idLivro').value = '';
}



document.getElementById('formEmprestimo').onsubmit = function(e) {
    e.preventDefault();
    
    let idUsuario = document.getElementById('selectUsuario').value;
    let idLivro = document.getElementById('selectLivro').value;
    
    if (idUsuario === '' || idLivro === '') {
        mostrarAviso('Selecione um usuário e um livro antes de emprestar.');
        return;
    }
    
    let livroDisponivel = false;
    for(let i = 0; i < livros.length; i++) {
        if(livros[i].id === idLivro && livros[i].disponivel) {
            livroDisponivel = true;
            livros[i].disponivel = false; // Marca como emprestado
            break;
        }
    }
    
    if (!livroDisponivel) {
        mostrarAviso('Operação cancelada: o livro selecionado não está disponível no momento.');
        return;
    }
    
    let novoEmprestimo = {
        id: gerarIdRegistro(),
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

function mostrarEmprestimos() {
    let lista = document.getElementById('listaEmprestimos');
    lista.innerHTML = '';
    
    if(emprestimos.length === 0) {
        lista.innerHTML = '<p>Nenhum empréstimo registrado.</p>';
        return;
    }
    
    for(let i = 0; i < emprestimos.length; i++) {
        let emprestimo = emprestimos[i];
        
        let nomeUsuario = '';
        for(let j = 0; j < usuarios.length; j++) {
            if(usuarios[j].id === emprestimo.idUsuario) {
                nomeUsuario = usuarios[j].nome;
                break;
            }
        }
        
        let tituloLivro = '';
        for(let k = 0; k < livros.length; k++) {
            if(livros[k].id === emprestimo.idLivro) {
                tituloLivro = livros[k].titulo;
                break;
            }
        }
        
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

function devolverLivro(idEmprestimo) {

    for(let i = 0; i < emprestimos.length; i++) {
        if(emprestimos[i].id === idEmprestimo && emprestimos[i].ativo) {
            emprestimos[i].ativo = false;
            
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

function preencherSelects() {
    let selectUsuario = document.getElementById('selectUsuario');
    let selectLivro = document.getElementById('selectLivro');
    
    selectUsuario.innerHTML = '<option value="">Escolha um usuário</option>';
    for(let i = 0; i < usuarios.length; i++) {
        let option = document.createElement('option');
        option.value = usuarios[i].id;
        option.textContent = usuarios[i].nome;
        selectUsuario.appendChild(option);
    }
    
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



function atualizarNumeros() {
    document.getElementById('contarUsuarios').textContent = usuarios.length;
    document.getElementById('contarLivros').textContent = livros.length;
    
    let emprestimosAtivos = 0;
    for(let i = 0; i < emprestimos.length; i++) {
        if(emprestimos[i].ativo) {
            emprestimosAtivos++;
        }
    }
    document.getElementById('contarEmprestimos').textContent = emprestimosAtivos;
}
