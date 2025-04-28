// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderRadicals();
    setupSearch();
    document.querySelector('.section-title')?.addEventListener('click', () => renderRadicals())
    document.querySelector('.chinese')?.addEventListener('click', () => renderRadicals())
});

// Отображение радикалов
function renderRadicals(availabelsRadicals = null) {
    const grid = document.getElementById('radicals-grid');
    grid.innerHTML = '';
    
    console.log(availabelsRadicals);     
    window.RADICALS.filter((rad) => {  
        if(!availabelsRadicals) return true;
        let flag = false;
        if(availabelsRadicals.includes(rad.char)) return true;
        rad.variants.forEach((item) => {
            if(availabelsRadicals.includes(item)) flag = true;
        })
        return flag
    }).forEach(rad => {
        const radEl = document.createElement('div');
        radEl.className = 'radical-card'; // Изменено с 'radical-item' на 'radical-card'
        radEl.innerHTML = `
            <div class="radical-char">${rad.char}</div>
            <div class="radical-info">
                <div class="radical-number">№ ${rad.id}</div>
                <div class="radical-meaning">${rad.meaning}</div>
                <div class="radical-pinyin">${rad.pinyin}</div>
                ${rad.variants.length > 1 ? 
                `<div class="radical-variants">
                    <div class="variants-list">
                        ${rad.variants.slice(1).reduce((str, value) => str + `<span class="variant-char">${value}</span>`, '')}
                        <span class="variant-char">⺌</span>
                        <span class="variant-char">⼩</span>
                    </div>
                </div>` : ''}
            </div>
        `;
        radEl.addEventListener('click', () => showWordsByRadical(rad.char));
        grid.appendChild(radEl);
    });
}

// Поиск слов
function setupSearch() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

function performSearch() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (!query) return;
    
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = '<h2 class="section-title">Результаты поиска</h2>';
    
    const foundWords = window.WORDS.filter(word => 
        word.chinese.includes(query) || 
        word.pinyin.toLowerCase().includes(query) ||
        word.translation.toLowerCase().includes(query)
    );
    
    if (foundWords.length > 0) {
        let allRadicals = []
        foundWords.forEach(word => {
            resultsSection.appendChild(createWordCard(word));
            allRadicals = allRadicals.concat(word.radicals);
        });
        renderRadicals(allRadicals);
    } else {
        resultsSection.innerHTML += '<p>Ничего не найдено. Попробуйте другой запрос.</p>';
        renderRadicals(null)
    }
}

// Создание карточки слова
function createWordCard(word) {
    const card = document.createElement('div');
    card.className = 'word-card';
    
    let html = `
        <div class="word-header">
            <div class="word-chinese">${word.chinese}</div>
            <div class="word-pinyin">${word.pinyin}</div>
        </div>
        <div class="word-translation">${word.translation}</div>
      
    `;
    
    if (word.components) {
        html += `<div class="components-list">
            ${word.components.map(c => `<span class="component-tag">${c}</span>`).join('')}
        </div>`;
    }
    
    if (word.radicals) {
        html += `<div class="breakdown-section">
            <h4>Разбор иероглифа:</h4>
            <p><strong>Ключи:</strong> ${word.radicals.join(', ')}</p>
            ${word.phonetics ? `<p><strong>Фонетики:</strong> ${word.phonetics.join(', ')}</p>` : ''}
        </div>`;
    }
    
    card.innerHTML = html;
    return card;
}

// Показать слова по радикалу
function showWordsByRadical(radical) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = `<h2 class="section-title">Слова с радикалом ${radical}</h2>`;
    
    const wordsWithRadical = window.WORDS.filter(word => 
        word.radicals && word.radicals.includes(radical)
    );
    
    if (wordsWithRadical.length > 0) {
        wordsWithRadical.forEach(word => {
            resultsSection.appendChild(createWordCard(word));
        });
    } else {
        resultsSection.innerHTML += `<p>Нет слов с этим радикалом в базе данных.</p>`;
    }
}