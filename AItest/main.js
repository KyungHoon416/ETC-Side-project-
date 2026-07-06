document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const generateBtn = document.getElementById('generate-btn');
    const numberSpans = document.querySelectorAll('.lotto-numbers .number');
    const bonusNumberSpan = document.querySelector('.lotto-numbers .bonus-number');
    const loader = document.getElementById('loader');
    
    // History elements
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');



    // --- Initial Setup ---
    loadHistory();

    // --- Event Listeners ---
    generateBtn.addEventListener('click', handleGenerateClick);
    clearHistoryBtn.addEventListener('click', clearHistory);


    // --- Lotto Number Generation ---
    async function handleGenerateClick() {
        // Reset UI and show loader
        numberSpans.forEach(span => {
            span.textContent = '';
            span.style.backgroundColor = '#eee';
        });
        bonusNumberSpan.textContent = '';
        bonusNumberSpan.style.backgroundColor = '#eee';

        loader.style.display = 'block';
        generateBtn.disabled = true;

        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const lottoNumbers = generateLottoNumbers();
            displayLottoNumbers(lottoNumbers);
            saveAndDisplayHistory(lottoNumbers);
        } catch (error) {
            console.error('Error generating lotto numbers:', error);
            alert('번호 생성 중 오류가 발생했습니다.');
        } finally {
            loader.style.display = 'none';
            generateBtn.disabled = false;
        }
    }
    
    function generateLottoNumbers() {
        // This logic remains on the frontend as per the rollback
        const historicalData = [
            [1, 10, 23, 29, 33, 45], [5, 12, 20, 25, 31, 38], [8, 11, 19, 21, 30, 44],
            [2, 13, 22, 28, 35, 42], [7, 15, 18, 24, 32, 40], [3, 9, 16, 26, 37, 43],
        ];
        const numberFrequency = new Array(46).fill(0);
        historicalData.flat().forEach(num => { numberFrequency[num]++; });
        const weights = numberFrequency.map(freq => freq + 1);

        const numbers = new Set();
        const weightedNumbers = [];
        for (let i = 1; i <= 45; i++) {
            for (let j = 0; j < weights[i]; j++) {
                weightedNumbers.push(i);
            }
        }

        // Generate 7 unique numbers (6 + 1 bonus)
        while (numbers.size < 7) {
            const randomIndex = Math.floor(Math.random() * weightedNumbers.length);
            numbers.add(weightedNumbers[randomIndex]);
        }

        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayLottoNumbers(numbers) {
        // First 6 numbers
        for (let i = 0; i < 6; i++) {
            if (numberSpans[i] && numbers[i]) {
                const span = numberSpans[i];
                span.textContent = numbers[i];
                span.style.backgroundColor = getNumberColor(numbers[i]);
            }
        }
        // bonus number
        if (bonusNumberSpan && numbers[6]) {
            bonusNumberSpan.textContent = numbers[6];
            bonusNumberSpan.style.backgroundColor = getNumberColor(numbers[6]);
        }
    }



    // --- History Management ---
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('lottoHistory')) || [];
        historyList.innerHTML = history.length ? '' : '<li>아직 생성된 번호가 없습니다.</li>';
        history.forEach(entry => addToHistoryDisplay(entry));
    }

    function saveAndDisplayHistory(numbers) {
        const history = JSON.parse(localStorage.getItem('lottoHistory')) || [];
        const newEntry = { numbers: numbers, date: new Date().toLocaleString('ko-KR') };
        history.unshift(newEntry);
        localStorage.setItem('lottoHistory', JSON.stringify(history));
        
        if (history.length === 1) historyList.innerHTML = '';
        addToHistoryDisplay(newEntry);
    }

    function addToHistoryDisplay(entry) {
        const li = document.createElement('li');
        const dateSpan = document.createElement('span');
        dateSpan.className = 'history-date';
        dateSpan.textContent = entry.date;

        const numbersDiv = document.createElement('div');
        numbersDiv.className = 'history-numbers';
        
        // Display 6 main numbers
        const mainNumbers = entry.numbers.slice(0, 6).map(num => 
            `<span class="history-number" style="background-color: ${getNumberColor(num)};">${num}</span>`
        ).join('');
        
        // Display bonus number
        const bonusNumber = `<span class="history-number bonus-display" style="background-color: ${getNumberColor(entry.numbers[6])};">${entry.numbers[6]}</span>`;

        numbersDiv.innerHTML = `${mainNumbers} <span class="plus-sign-history">+</span> ${bonusNumber}`;
        
        li.appendChild(dateSpan);
        li.appendChild(numbersDiv);
        historyList.prepend(li);
    }

    function clearHistory() {
        localStorage.removeItem('lottoHistory');
        loadHistory();
    }

    // --- Utility Functions ---
    function getNumberColor(number) {
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaa';    // Gray
        return '#b0d840';                   // Green
    }
});

// Deployment trigger comment