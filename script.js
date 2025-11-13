// A função principal que envolve todo o nosso código.
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO MENU HAMBURGUER ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
        const mobileLinks = document.querySelectorAll('.mobile-nav a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- LÓGICA PARA ATUALIZAR O MENU DE NAVEGAÇÃO (Login/Sair) ---
    const token = localStorage.getItem('jwt_token');
    const userRole = localStorage.getItem('user_role'); // Pega o perfil guardado
    const desktopNavUl = document.querySelector('.desktop-nav ul');
    const mobileNavUl = document.querySelector('.mobile-nav ul');

    if (desktopNavUl && mobileNavUl) {
        if (token && userRole === 'ADMIN') {
            // INÍCIO DA ALTERAÇÃO: Menu do Admin agora tem apenas "Sair"
            desktopNavUl.innerHTML = `
                <li><a href="#" id="btn-sair" class="btn-agendar">Sair</a></li>
            `;
            mobileNavUl.innerHTML = `
                <li><a href="#" id="btn-sair-mobile" class="btn-agendar">Sair</a></li>
            `;
            // FIM DA ALTERAÇÃO

        } else if (token) {
            // Se estiver logado mas for CLIENTE
            desktopNavUl.innerHTML = `
                <li><a href="index.html">Início</a></li>
                <li><a href="index.html#servicos">Serviços</a></li>
                <li><a href="index.html#sobre">Sobre</a></li>
                <li><a href="agendamentos.html">Meus Agendamentos</a></li>
                <li><a href="#" id="btn-sair" class="btn-agendar">Sair</a></li>
            `;
            mobileNavUl.innerHTML = `
                <li><a href="index.html">Início</a></li>
                <li><a href="index.html#servicos">Serviços</a></li>
                <li><a href="index.html#sobre">Sobre</a></li>
                <li><a href="agendamentos.html">Meus Agendamentos</a></li>
                <li><a href="#" id="btn-sair-mobile" class="btn-agendar">Sair</a></li>
            `;
        }
        // Se não estiver logado, o menu padrão do HTML é usado.

        // Lógica de Logout (agora remove também o perfil)
        const btnSair = document.getElementById('btn-sair');
        const btnSairMobile = document.getElementById('btn-sair-mobile');
        if (btnSair || btnSairMobile) {
            function logout(event) {
                event.preventDefault();
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user_role');
                alert('Você saiu da sua conta.');
                window.location.href = 'login.html';
            }
            if(btnSair) btnSair.addEventListener('click', logout);
            if(btnSairMobile) btnSairMobile.addEventListener('click', logout);
        }
    }
    
    // --- LÓGICA PARA O FORMULÁRIO DE LOGIN ---
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const dadosParaEnviar = { email, senha };

            fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            })
            .then(response => {
                if (!response.ok) throw new Error('E-mail ou senha inválidos.');
                return response.json();
            })
            .then(data => {
                localStorage.setItem('jwt_token', data.token);
                localStorage.setItem('user_role', data.role);
                alert('Login realizado com sucesso!');
                if (data.role === 'ADMIN') {
                    window.location.href = 'adm.html';
                } else {
                    window.location.href = 'index.html';
                }
            })
            .catch(error => alert(error.message));
        });
    }

    // --- LÓGICA PARA CARREGAR OS SERVIÇOS NA PÁGINA INICIAL ---
    const servicosGrid = document.querySelector('.servicos-grid');
    if (servicosGrid) {
        fetch('http://localhost:8080/api/servicos')
            .then(response => response.json())
            .then(servicos => {
                let cardsHtml = '';
                servicos.forEach(servico => {
                    cardsHtml += `
                        <div class="servico-card">
                            <div class="servico-info">
                                <a class="opcoes" href="#agendamento" data-servico-id="${servico.id}">
                                    <h3>${servico.nome}</h3>
                                    <p>${servico.descricao}</p>
                                    <p class="servico-preco">R$ ${servico.preco.toFixed(2).replace('.', ',')}</p>
                                </a>
                            </div>
                        </div>`;
                });
                servicosGrid.innerHTML = cardsHtml;
                servicosGrid.addEventListener('click', function(event) {
                    const linkOpcao = event.target.closest('a.opcoes');
                    if (linkOpcao) {
                        event.preventDefault();
                        const servicoId = linkOpcao.getAttribute('data-servico-id');
                        const selectServico = document.getElementById('servico');
                        if (selectServico) {
                            selectServico.value = servicoId;
                        }
                        document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' });
                    }
                });
            })
            .catch(error => console.error('Falha ao carregar serviços:', error));
    }

    // --- LÓGICA PARA O FORMULÁRIO DE CADASTRO ---
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', (event) => {
            event.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmaSenha = document.getElementById('confirma-senha').value;
            const telefone = document.getElementById('telefone').value;
            if (senha !== confirmaSenha) {
                alert('As senhas não coincidem!');
                return;
            }
            const dadosParaEnviar = { nome, email, senha, telefone };
            fetch('http://localhost:8080/api/usuarios/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            })
            .then(response => {
                if (!response.ok) throw new Error('E-mail já cadastrado ou erro no servidor.');
                return response.json();
            })
            .then(() => {
                alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
                window.location.href = 'login.html';
            })
            .catch(error => alert(error.message));
        });
    }

    // --- LÓGICA DO FORMULÁRIO DE AGENDAMENTO ---
    const formAgendamento = document.getElementById('form-agendamento');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', function(event) {
            event.preventDefault();
            const tokenAgendamento = localStorage.getItem('jwt_token');
            if (!tokenAgendamento) {
                alert('Você precisa estar logado para fazer um agendamento.');
                window.location.href = 'login.html';
                return;
            }
            const servicoId = document.getElementById('servico').value;
            const data = document.getElementById('data').value;
            const hora = document.getElementById('hora').value;
            const observacoes = document.getElementById('observacoes').value;
            const dadosParaEnviar = { servicoId, data, hora, observacoes };
            fetch('http://localhost:8080/api/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenAgendamento}`
                },
                body: JSON.stringify(dadosParaEnviar)
            })
            .then(response => {
                if (response.status === 400) {
                    return response.json().then(err => { throw new Error(err.erro); });
                }
                if (!response.ok) {
                    throw new Error('Não foi possível realizar o agendamento.');
                }
                return response.json();
            })
            .then(() => {
                alert('Agendamento realizado com sucesso!');
                formAgendamento.reset();
                document.dispatchEvent(new Event('agendamentoRealizado'));
            })
            .catch(error => alert(error.message));
        });
    }

    // --- LÓGICA PARA A PÁGINA "MEUS AGENDAMENTOS" (CLIENTE) ---
    const listaAgendamentos = document.getElementById('lista-agendamentos');
    if (listaAgendamentos) {
        const tokenCliente = localStorage.getItem('jwt_token');
        if (!tokenCliente) {
            window.location.href = 'login.html';
        } else {
            fetch('http://localhost:8080/api/agendamentos/meus', {
                headers: { 'Authorization': `Bearer ${tokenCliente}` }
            })
            .then(response => response.json())
            .then(agendamentos => {
                const semAgendamentosDiv = document.getElementById('sem-agendamentos');
                if (agendamentos.length === 0) {
                    if(semAgendamentosDiv) semAgendamentosDiv.style.display = 'block';
                } else {
                    let cardsHtml = '';
                    agendamentos.forEach(ag => {
                        const dataFormatada = new Date(ag.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                        cardsHtml += `
                            <div class="agendamento-card">
                                <div class="agendamento-info">
                                    <h3>${ag.servico.nome}</h3>
                                    <p><i class="far fa-calendar-alt"></i> ${dataFormatada}</p>
                                    <p><i class="far fa-clock"></i> ${ag.hora}</p>
                                </div>
                                <div class="agendamento-status">
                                    <span class="status-badge status-${ag.status.toLowerCase()}">${ag.status}</span>
                                </div>
                            </div>`;
                    });
                    listaAgendamentos.innerHTML = cardsHtml;
                }
            }).catch(err => console.error('Falha ao buscar agendamentos', err));
        }
    }

    // --- LÓGICA PARA ATUALIZAR HORÁRIOS DISPONÍVEIS ---
    const inputData = document.getElementById('data');
    const selectHora = document.getElementById('hora');
    if (inputData && selectHora) {
        const hoje = new Date().toISOString().split('T')[0];
        inputData.setAttribute('min', hoje);

        function atualizarHorariosDisponiveis() {
            const dataSelecionada = inputData.value;
            const tokenHorarios = localStorage.getItem('jwt_token');

            for (const option of selectHora.options) {
                if (option.value) {
                    option.disabled = false;
                    option.textContent = option.value;
                }
            }
            
            if (!dataSelecionada || !tokenHorarios) return;

            fetch(`http://localhost:8080/api/agendamentos/horarios-ocupados?data=${dataSelecionada}`, {
                headers: { 'Authorization': `Bearer ${tokenHorarios}` }
            })
            .then(response => response.json())
            .then(horariosOcupados => {
                const agora = new Date();
                const dataDeHojeString = agora.toISOString().split('T')[0];
                const horaAtualString = agora.toTimeString().substring(0, 5);

                for (const option of selectHora.options) {
                    if (option.value === "") continue;

                    const horarioDaOpcao = option.value;
                    let indisponivel = false;
                    let motivo = "";

                    if (horariosOcupados.includes(horarioDaOpcao)) {
                        indisponivel = true;
                        motivo = " - Agendado";
                    }
                    
                    if (dataSelecionada === dataDeHojeString && horarioDaOpcao < horaAtualString) {
                        indisponivel = true;
                        motivo = " - Expirado";
                    }

                    option.disabled = indisponivel;
                    option.textContent = indisponivel ? `${horarioDaOpcao}${motivo}` : horarioDaOpcao;
                }
            })
            .catch(error => console.error('Erro ao buscar horários:', error));
        }

        inputData.addEventListener('change', atualizarHorariosDisponiveis);
        document.addEventListener('agendamentoRealizado', atualizarHorariosDisponiveis);
    }
});