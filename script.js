// Menu Hamburguer
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Alterar atributo aria-expanded para acessibilidade
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
});

// Fechar menu ao clicar em um link
const mobileLinks = document.querySelectorAll('.mobile-nav a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// Script para o formulário
document.getElementById('form-agendamento').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Agendamento enviado com sucesso! Entraremos em contato para confirmar.');
    this.reset();
});

// Seleção automática do serviço
document.addEventListener('DOMContentLoaded', function() {
    const servicoLinks = document.querySelectorAll('.opcoes');

    servicoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const servicoSelecionado = this.getAttribute('data-servico');
            const selectServico = document.getElementById('servico');

            for (let i = 0; i < selectServico.options.length; i++) {
                if (selectServico.options[i].value === servicoSelecionado) {
                    selectServico.selectedIndex = i;
                    break;
                }
            }                
        });
    });
});