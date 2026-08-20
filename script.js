// ============================================================
// 1. BASE DE PERGUNTAS
// ============================================================

const questions = {
    // ----- TESTE PARA VÍTIMA -----
    victim: [
        "Sinto que ando pisando em ovos perto dessa pessoa.",
        "Essa pessoa frequentemente invalida meus sentimentos.",
        "Minhas conquistas são minimizadas ou ignoradas por ela.",
        "Eu me sinto culpado mesmo quando não fiz nada de errado.",
        "Essa pessoa só me procura quando precisa de algo.",
        "Minhas opiniões são frequentemente desconsideradas.",
        "Sinto que perco minha identidade nesse relacionamento.",
        "Essa pessoa usa minha vulnerabilidade contra mim.",
        "Tenho medo de expressar minhas emoções por causa da reação dela.",
        "Sinto que nada do que faço é bom o bastante.",
        "Essa pessoa distorce fatos para parecer que estou errado.",
        "Frequentemente me sinto confuso após conversar com ela.",
        "Minhas necessidades sempre ficam em segundo plano.",
        "Essa pessoa se irrita quando não consigo atender a uma demanda.",
        "Sinto que estou sempre me desculpando por coisas que não fiz."
    ],

    // ----- TESTE PARA NARCISISTA (NPI-16 adaptado) -----
    narcissist: [
        "Sou bom em influenciar as pessoas naturalmente.",
        "Quando me elogiam, acho que é apenas o reconhecimento que mereço.",
        "Gosto de ser o centro das atenções.",
        "Sou uma pessoa especial e única.",
        "Gosto de ter autoridade sobre os outros.",
        "Acho fácil fazer as pessoas fazerem o que quero.",
        "Exijo que me respeitem sempre.",
        "Aproveito oportunidades para aparecer e ser notado.",
        "Sei sempre o que estou fazendo.",
        "Todo mundo gosta de ouvir minhas histórias.",
        "Espero muito das outras pessoas.",
        "As pessoas sempre reconhecem minha autoridade.",
        "Tenho certeza de que serei bem-sucedido.",
        "Consigo convencer qualquer um a acreditar no que quero.",
        "Sou mais capaz do que a maioria das pessoas.",
        "Sou uma pessoa extraordinária."
    ]
};

// ============================================================
// 2. FUNÇÃO PARA CALCULAR RESULTADO
// ============================================================

function calculateResult(testType, answers) {
    const total = answers.length;
    const agreed = answers.filter(a => a === true).length;

    const percentage = Math.round((agreed / total) * 100);

    let level, description, badgeClass, suggestion;

    if (testType === 'victim') {
        if (percentage >= 70) {
            level = 'Alto';
            description = 'Você apresenta muitos sinais de estar em um relacionamento com traços narcisistas. É importante buscar apoio psicológico para entender essa dinâmica e se proteger.';
            badgeClass = 'badge-high';
            suggestion = 'Procure um psicólogo para avaliar a situação e fortalecer sua autoestima.';
        } else if (percentage >= 40) {
            level = 'Moderado';
            description = 'Há comportamentos de alerta no relacionamento. Vale a pena observar mais de perto e considerar conversar com um profissional.';
            badgeClass = 'badge-moderate';
            suggestion = 'Reflita sobre os padrões da relação e estabeleça limites claros.';
        } else {
            level = 'Baixo';
            description = 'Os sinais indicam que você provavelmente não está em um relacionamento com dinâmica narcisista. Continue cuidando de si e das suas relações.';
            badgeClass = 'badge-low';
            suggestion = 'Mantenha uma comunicação saudável e observe os sinais de alerta em qualquer relação.';
        }
    } else { // narcisist
        if (percentage >= 70) {
            level = 'Alto';
            description = 'Suas respostas indicam uma forte presença de traços narcisistas. Isso pode estar afetando seus relacionamentos e sua vida. Uma avaliação profissional é altamente recomendada.';
            badgeClass = 'badge-high';
            suggestion = 'Considere procurar um psicólogo para uma avaliação completa. O autoconhecimento é o primeiro passo.';
        } else if (percentage >= 40) {
            level = 'Moderado';
            description = 'Você apresenta alguns traços de narcisismo, o que é comum em certa medida. Fique atento a como isso afeta seus relacionamentos.';
            badgeClass = 'badge-moderate';
            suggestion = 'A terapia pode ajudar a equilibrar esses traços e melhorar sua convivência com os outros.';
        } else {
            level = 'Baixo';
            description = 'Suas respostas mostram poucos traços narcisistas. Isso não significa que você não possa ter outros desafios, mas o narcisismo não parece ser predominante.';
            badgeClass = 'badge-low';
            suggestion = 'Continue cultivando empatia e autocrítica saudável.';
        }
    }

    return {
        percentage,
        level,
        description,
        badgeClass,
        suggestion,
        total,
        agreed
    };
}

// ============================================================
// 3. RENDERIZAÇÃO DO TESTE
// ============================================================

let currentTestType = null;

function renderTest(testType) {
    currentTestType = testType;
    const content = document.getElementById('testContent');
    const area = document.getElementById('testArea');

    const qs = questions[testType];
    const title = testType === 'victim' ? '🛡️ Teste para Vítima de Narcisismo' : '🪞 Teste para Narcisista';
    const badge = testType === 'victim' ? 'Identificação de Padrões' : 'Autoavaliação';

    let html = `
        <div class="test-header">
            <h2>${title}</h2>
            <span class="badge">${badge}</span>
        </div>
        <form id="testForm">
    `;

    qs.forEach((q, index) => {
        html += `
            <div class="question">
                <p>${index + 1}. ${q}</p>
                <div class="options" data-q="${index}">
                    <label>
                        <input type="radio" name="q${index}" value="yes" />
                        Sim
                    </label>
                    <label>
                        <input type="radio" name="q${index}" value="no" checked />
                        Não
                    </label>
                </div>
            </div>
        `;
    });

    html += `
            <div style="text-align: center; margin-top: 28px;">
                <button type="button" class="btn btn-result" id="submitTest">📊 Ver Resultado</button>
            </div>
        </form>
        <div id="resultContainer"></div>
    `;

    content.innerHTML = html;
    area.classList.add('visible');

    // Scroll suave até o teste
    area.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Adicionar eventos para destacar opção selecionada
    document.querySelectorAll('.options').forEach(optGroup => {
        optGroup.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function () {
                const parent = this.closest('.options');
                parent.querySelectorAll('label').forEach(l => l.classList.remove('selected'));
                if (this.checked) {
                    this.closest('label').classList.add('selected');
                }
            });
        });
    });

    // Evento do botão de resultado
    document.getElementById('submitTest').addEventListener('click', function () {
        submitTest(testType);
    });
}

// ============================================================
// 4. SUBMISSÃO E CÁLCULO
// ============================================================

function submitTest(testType) {
    const form = document.getElementById('testForm');
    const qs = questions[testType];
    const answers = [];

    for (let i = 0; i < qs.length; i++) {
        const selected = form.querySelector(`input[name="q${i}"]:checked`);
        if (selected) {
            answers.push(selected.value === 'yes');
        } else {
            answers.push(false);
        }
    }

    const result = calculateResult(testType, answers);
    showResult(result, testType);
}

function showResult(result, testType) {
    const container = document.getElementById('resultContainer');
    const label = testType === 'victim' ? 'Indicadores de Vitimização' : 'Traços Narcisistas';

    const levelMap = {
        'Baixo': '✅ Baixo',
        'Moderado': '⚠️ Moderado',
        'Alto': '🔴 Alto'
    };

    container.innerHTML = `
        <div class="result-box">
            <div class="label">${label}</div>
            <div class="score">${result.percentage}%</div>
            <div class="badge-result ${result.badgeClass}">${levelMap[result.level] || result.level}</div>
            <div class="description">
                <p><strong>${result.description}</strong></p>
                <p style="margin-top:12px; font-size:0.95rem; color:#555;">
                    💡 <strong>Recomendação:</strong> ${result.suggestion}
                </p>
                <p style="margin-top:8px; font-size:0.85rem; color:#777;">
                    Você respondeu <strong>${result.agreed}</strong> de ${result.total} perguntas com "Sim".
                </p>
            </div>
            <button class="btn-restart" onclick="restartTest()">↺ Refazer Teste</button>
        </div>
    `;

    // Rolagem até o resultado
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================================
// 5. REINICIAR
// ============================================================

function restartTest() {
    const area = document.getElementById('testArea');
    area.classList.remove('visible');
    document.getElementById('testContent').innerHTML = '';
    document.querySelector('.selector').scrollIntoView({ behavior: 'smooth' });

    // Remover active dos cards
    document.querySelectorAll('.select-card').forEach(c => c.classList.remove('active'));
}

// ============================================================
// 6. EVENTOS DOS CARDS
// ============================================================

document.querySelectorAll('.select-card').forEach(card => {
    card.addEventListener('click', function () {
        const testType = this.dataset.test;
        document.querySelectorAll('.select-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        renderTest(testType);
    });

    // Botões dentro dos cards também disparam
    card.querySelector('button')?.addEventListener('click', function (e) {
        e.stopPropagation();
        card.click();
    });
});

// ============================================================
// 7. EXPOR FUNÇÕES PARA O GLOBAL (para usar no onclick do HTML)
// ============================================================

window.restartTest = restartTest;
window.renderTest = renderTest;
window.submitTest = submitTest;
window.calculateResult = calculateResult;

console.log('🧠 Teste sobre Narcisismo carregado com sucesso!');
console.log('📋 Desenvolvido por CAL - 2026');
console.log('⚕️ Lembre-se: este é um recurso informativo, não diagnóstico.');
