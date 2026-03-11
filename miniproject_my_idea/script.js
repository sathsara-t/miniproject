// Constants & State
const state = {
    array: [],
    arraySize: 50,
    speed: 50,
    isRunning: false,
    isPaused: false,
    currentAlgo: 'bubble',
    comparisons: 0,
    swaps: 0,
    startTime: null,
    pausePromiseResolve: null
};

// DOM Elements
const container = document.getElementById('visualizerContainer');
const algoSelect = document.getElementById('algoSelect');
const sizeSlider = document.getElementById('sizeSlider');
const speedSlider = document.getElementById('speedSlider');
const sizeValueDisplay = document.getElementById('sizeValue');
const speedValueDisplay = document.getElementById('speedValue');
const startBtn = document.getElementById('startBtn');
const randomBtn = document.getElementById('randomBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const themeToggle = document.getElementById('themeToggle');
const compCountDisplay = document.getElementById('compCount');
const swapCountDisplay = document.getElementById('swapCount');
const algoDescription = document.getElementById('algoDescription');
const timeCompDisplay = document.getElementById('timeComplexity');
const spaceCompDisplay = document.getElementById('spaceComplexity');

// Algorithm Meta Information
const algoInfo = {
    bubble: {
        description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        time: "O(n²)",
        space: "O(1)"
    },
    selection: {
        description: "Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. it repeatedly finds the smallest element in the unsorted sublist and moves it to the sorted sublist.",
        time: "O(n²)",
        space: "O(1)"
    },
    insertion: {
        description: "Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.",
        time: "O(n²)",
        space: "O(1)"
    },
    merge: {
        description: "Merge Sort is a divide and conquer algorithm that was invented by John von Neumann in 1945. It divides the unsorted list into n sublists, each containing one element, and then repeatedly merges sublists to produce new sorted sublists until there is only one sublist remaining.",
        time: "O(n log n)",
        space: "O(n)"
    },
    quick: {
        description: "Quick Sort is an efficient sorting algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.",
        time: "O(n log n)",
        space: "O(log n)"
    },
    linear: {
        description: "Linear Search or sequential search is a method for finding an element within a list. It sequentially checks each element of the list until a match is found or the whole list has been searched.",
        time: "O(n)",
        space: "O(1)"
    },
    binary: {
        description: "Binary Search is a search algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array.",
        time: "O(log n)",
        space: "O(1)"
    }
};

// Initialize
function init() {
    generateArray();
    addEventListeners();
    updateAlgoInfo();
}

function addEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    sizeSlider.addEventListener('input', (e) => {
        state.arraySize = e.target.value;
        sizeValueDisplay.textContent = state.arraySize;
        if (!state.isRunning) generateArray();
    });
    speedSlider.addEventListener('input', (e) => {
        state.speed = e.target.value;
        const labels = ['Snail', 'Slow', 'Medium', 'Fast', 'Sonic'];
        const index = Math.floor((state.speed - 1) / 25);
        speedValueDisplay.textContent = labels[index] || 'Fast';
    });
    algoSelect.addEventListener('change', (e) => {
        state.currentAlgo = e.target.value;
        updateAlgoInfo();
    });
    randomBtn.addEventListener('click', () => {
        if (!state.isRunning) generateArray();
    });
    startBtn.addEventListener('click', startAlgorithm);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetApp);
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}

function generateArray() {
    state.array = [];
    container.innerHTML = '';
    const maxHeight = container.offsetHeight - 40;
    
    for (let i = 0; i < state.arraySize; i++) {
        const value = Math.floor(Math.random() * 90) + 10;
        state.array.push(value);
        
        const bar = document.createElement('div');
        bar.style.height = `${(value / 100) * maxHeight}px`;
        bar.classList.add('array-bar');
        bar.id = `bar-${i}`;
        container.appendChild(bar);
    }
    resetStats();
}

function updateAlgoInfo() {
    const info = algoInfo[state.currentAlgo];
    algoDescription.textContent = info.description;
    timeCompDisplay.textContent = info.time;
    spaceCompDisplay.textContent = info.space;
}

function resetStats() {
    state.comparisons = 0;
    state.swaps = 0;
    compCountDisplay.textContent = '0';
    swapCountDisplay.textContent = '0';
}

function resetApp() {
    location.reload();
}

// Helper: Delay and Pause
async function delay() {
    if (state.isPaused) {
        await new Promise(resolve => {
            state.pausePromiseResolve = resolve;
        });
    }
    const ms = 1000 - (state.speed * 9.8); // Scale speed slider to ms
    return new Promise(resolve => setTimeout(resolve, ms));
}

function togglePause() {
    state.isPaused = !state.isPaused;
    pauseBtn.textContent = state.isPaused ? 'Resume' : 'Pause';
    if (!state.isPaused && state.pausePromiseResolve) {
        state.pausePromiseResolve();
        state.pausePromiseResolve = null;
    }
}

// Visual Helpers
function setStatus(index, status) {
    const bar = document.getElementById(`bar-${index}`);
    if (!bar) return;
    bar.className = 'array-bar ' + status;
}

function updateBarHeight(index, value) {
    const bar = document.getElementById(`bar-${index}`);
    if (!bar) return;
    const maxHeight = container.offsetHeight - 40;
    bar.style.height = `${(value / 100) * maxHeight}px`;
}

// Algorithm Implementation Start
async function startAlgorithm() {
    if (state.isRunning) return;
    state.isRunning = true;
    startBtn.disabled = true;
    randomBtn.disabled = true;
    sizeSlider.disabled = true;
    algoSelect.disabled = true;
    pauseBtn.disabled = false;
    
    resetStats();
    
    switch(state.currentAlgo) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSort(0, state.array.length - 1); break;
        case 'quick': await quickSort(0, state.array.length - 1); break;
        case 'linear': await linearSearch(); break;
        case 'binary': await binarySearch(); break;
    }
    
    // Mark all as sorted
    for(let i = 0; i < state.array.length; i++) {
        setStatus(i, 'sorted');
    }
    
    state.isRunning = false;
    startBtn.disabled = false;
    randomBtn.disabled = false;
    sizeSlider.disabled = false;
    algoSelect.disabled = false;
    pauseBtn.disabled = true;
}

// --- Sorting Algorithms ---

async function bubbleSort() {
    const n = state.array.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            setStatus(j, 'comparing');
            setStatus(j + 1, 'comparing');
            state.comparisons++;
            compCountDisplay.textContent = state.comparisons;
            await delay();
            
            if (state.array[j] > state.array[j + 1]) {
                setStatus(j, 'swapping');
                setStatus(j + 1, 'swapping');
                state.swaps++;
                swapCountDisplay.textContent = state.swaps;
                
                // Swap values
                [state.array[j], state.array[j + 1]] = [state.array[j + 1], state.array[j]];
                updateBarHeight(j, state.array[j]);
                updateBarHeight(j + 1, state.array[j + 1]);
                await delay();
            }
            setStatus(j, '');
            setStatus(j + 1, '');
        }
        setStatus(n - i - 1, 'sorted');
    }
}

async function selectionSort() {
    const n = state.array.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        setStatus(minIdx, 'pivot');
        
        for (let j = i + 1; j < n; j++) {
            setStatus(j, 'comparing');
            state.comparisons++;
            compCountDisplay.textContent = state.comparisons;
            await delay();
            
            if (state.array[j] < state.array[minIdx]) {
                if (minIdx !== i) setStatus(minIdx, '');
                minIdx = j;
                setStatus(minIdx, 'pivot');
            } else {
                setStatus(j, '');
            }
        }
        
        if (minIdx !== i) {
            state.swaps++;
            swapCountDisplay.textContent = state.swaps;
            [state.array[i], state.array[minIdx]] = [state.array[minIdx], state.array[i]];
            updateBarHeight(i, state.array[i]);
            updateBarHeight(minIdx, state.array[minIdx]);
            setStatus(minIdx, 'swapping');
            await delay();
            setStatus(minIdx, '');
        }
        setStatus(i, 'sorted');
    }
}

async function insertionSort() {
    const n = state.array.length;
    setStatus(0, 'sorted');
    for (let i = 1; i < n; i++) {
        let key = state.array[i];
        let j = i - 1;
        
        setStatus(i, 'swapping');
        await delay();
        
        while (j >= 0 && state.array[j] > key) {
            state.comparisons++;
            state.swaps++;
            compCountDisplay.textContent = state.comparisons;
            swapCountDisplay.textContent = state.swaps;
            
            state.array[j + 1] = state.array[j];
            updateBarHeight(j + 1, state.array[j + 1]);
            setStatus(j, 'comparing');
            await delay();
            setStatus(j, 'sorted');
            j--;
        }
        state.array[j + 1] = key;
        updateBarHeight(j + 1, key);
        setStatus(j + 1, 'sorted');
    }
}

// Merge Sort Implementation
async function mergeSort(l, r) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}

async function merge(l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = state.array.slice(l, m + 1);
    const R = state.array.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        state.comparisons++;
        compCountDisplay.textContent = state.comparisons;
        setStatus(k, 'comparing');
        await delay();
        
        if (L[i] <= R[j]) {
            state.array[k] = L[i];
            i++;
        } else {
            state.array[k] = R[j];
            j++;
        }
        updateBarHeight(k, state.array[k]);
        setStatus(k, 'swapping');
        await delay();
        setStatus(k, '');
        k++;
    }

    while (i < n1) {
        state.array[k] = L[i];
        updateBarHeight(k, state.array[k]);
        setStatus(k, 'swapping');
        await delay();
        setStatus(k, '');
        i++; k++;
    }
    while (j < n2) {
        state.array[k] = R[j];
        updateBarHeight(k, state.array[k]);
        setStatus(k, 'swapping');
        await delay();
        setStatus(k, '');
        j++; k++;
    }
}

// Quick Sort Implementation
async function quickSort(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    const pivot = state.array[high];
    setStatus(high, 'pivot');
    let i = (low - 1);

    for (let j = low; j < high; j++) {
        setStatus(j, 'comparing');
        state.comparisons++;
        compCountDisplay.textContent = state.comparisons;
        await delay();

        if (state.array[j] < pivot) {
            i++;
            state.swaps++;
            swapCountDisplay.textContent = state.swaps;
            [state.array[i], state.array[j]] = [state.array[j], state.array[i]];
            updateBarHeight(i, state.array[i]);
            updateBarHeight(j, state.array[j]);
            setStatus(i, 'swapping');
            setStatus(j, 'swapping');
            await delay();
            setStatus(i, '');
        }
        setStatus(j, '');
    }
    state.swaps++;
    swapCountDisplay.textContent = state.swaps;
    [state.array[i + 1], state.array[high]] = [state.array[high], state.array[i + 1]];
    updateBarHeight(i + 1, state.array[i + 1]);
    updateBarHeight(high, state.array[high]);
    setStatus(high, '');
    setStatus(i + 1, 'sorted');
    return i + 1;
}

// --- Searching Algorithms ---

async function linearSearch() {
    const target = state.array[Math.floor(Math.random() * state.array.length)];
    // In search, swap count used for "Target Found" visual or just access
    for(let i = 0; i < state.array.length; i++) {
        setStatus(i, 'comparing');
        state.comparisons++;
        compCountDisplay.textContent = state.comparisons;
        await delay();
        if(state.array[i] === target) {
            setStatus(i, 'sorted');
            return;
        }
        setStatus(i, '');
    }
}

async function binarySearch() {
    // Binary search requires sorted array
    // Automatically sort first for visualization
    state.array.sort((a, b) => a - b);
    for(let i = 0; i < state.array.length; i++) updateBarHeight(i, state.array[i]);
    
    const target = state.array[Math.floor(Math.random() * state.array.length)];
    let l = 0, r = state.array.length - 1;
    
    while(l <= r) {
        let m = Math.floor(l + (r - l) / 2);
        setStatus(m, 'pivot');
        state.comparisons++;
        compCountDisplay.textContent = state.comparisons;
        await delay();
        
        if(state.array[m] === target) {
            setStatus(m, 'sorted');
            return;
        }
        
        if(state.array[m] < target) {
            for(let i = l; i <= m; i++) setStatus(i, 'swapping');
            await delay();
            for(let i = l; i <= m; i++) setStatus(i, '');
            l = m + 1;
        } else {
            for(let i = m; i <= r; i++) setStatus(i, 'swapping');
            await delay();
            for(let i = m; i <= r; i++) setStatus(i, '');
            r = m - 1;
        }
    }
}

// Run init
init();
