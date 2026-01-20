// -----------------------------------------------------------
// 1. Dynamic List (Daftar Dinamis)
// Fungsi yang diuji: document.createElement(), appendChild(), remove()
// -----------------------------------------------------------
const itemInput = document.getElementById('itemInput');
const addItemButton = document.getElementById('addItemButton');
const dynamicList = document.getElementById('dynamicList');

addItemButton.addEventListener('click', () => {
    const itemText = itemInput.value.trim();

    if (itemText !== "") {
        // 1. Buat elemen <li> baru
        const listItem = document.createElement('li');
        listItem.textContent = itemText + " ";

        // 2. Buat tombol Hapus
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.classList.add('delete-btn');

        // 3. Event listener untuk tombol Hapus
        deleteButton.addEventListener('click', () => {
            // Hapus elemen induknya (listItem) dari DOM menggunakan remove()
            listItem.remove(); 
        });

        // 4. Gabungkan tombol Hapus ke dalam <li> menggunakan appendChild()
        listItem.appendChild(deleteButton); 

        // 5. Tambahkan <li> ke dalam <ul> menggunakan appendChild()
        dynamicList.appendChild(listItem);

        // Bersihkan input
        itemInput.value = '';
        itemInput.focus();
    }
});

// -----------------------------------------------------------
// 2. Ubah Warna Background Secara Dinamis
// Fungsi yang diuji: style.backgroundColor, Event onclick
// -----------------------------------------------------------
const redBtn = document.getElementById('redBtn');
const greenBtn = document.getElementById('greenBtn');
const blueBtn = document.getElementById('blueBtn');
const body = document.body; // Mengambil elemen <body>

// Menggunakan properti onclick
redBtn.onclick = function() {
    body.style.backgroundColor = 'red'; // Menggunakan style.backgroundColor
};

greenBtn.onclick = function() {
    body.style.backgroundColor = 'green';
};

blueBtn.onclick = function() {
    body.style.backgroundColor = 'blue';
};


// -----------------------------------------------------------
// 3. Counter dengan DOM Manipulation
// Fungsi yang diuji: innerText atau textContent
// -----------------------------------------------------------
const counterDisplay = document.getElementById('counterDisplay');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');

let count = 0;

function updateCounterDisplay() {
    // Memperbarui tampilan menggunakan innerText
    counterDisplay.innerText = count; 
}

incrementBtn.addEventListener('click', () => {
    count++;
    updateCounterDisplay();
});

decrementBtn.addEventListener('click', () => {
    count--;
    updateCounterDisplay();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    updateCounterDisplay();
});

// -----------------------------------------------------------
// 4. Toggle Show/Hide Element
// -----------------------------------------------------------
const toggleBtn = document.getElementById('toggleBtn');
const toggleParagraph = document.getElementById('toggleParagraph');

// Inisialisasi: Pastikan paragraf defaultnya ditampilkan
// dan tombolnya bertuliskan "Sembunyikan" dengan ikon yang benar
toggleBtn.textContent = '🙈 Sembunyikan';


toggleBtn.addEventListener('click', () => {
    // Menggunakan classList.toggle()
    toggleParagraph.classList.toggle('hidden'); 

    // Mengubah teks dan ikon tombol
    if (toggleParagraph.classList.contains('hidden')) {
        toggleBtn.textContent = '👁️ Tampilkan'; // Ikon mata terbuka saat menampilkan
    } else {
        toggleBtn.textContent = '🙈 Sembunyikan'; // Ikon monyet menutup mata saat menyembunyikan
    }
});