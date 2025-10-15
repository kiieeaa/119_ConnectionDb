const apiUrl = 'http://localhost:3000/biodata';
const dataContainer = document.getElementById('data-mahasiswa');

const addForm = document.getElementById('add-form');
const editForm = document.getElementById('edit-form');
const editModal = document.getElementById('edit-modal');

// Fungsi untuk mengambil dan menampilkan data (READ)
async function fetchAndDisplayData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        dataContainer.innerHTML = ''; // Kosongkan container
        
        if (data.length === 0) {
            dataContainer.innerHTML = '<p>Belum ada data mahasiswa.</p>';
            return;
        }

        data.forEach(mhs => {
            const card = `
                <div class="mhs-card">
                    <div>
                        <h3>${mhs.nama}</h3>
                        <p><strong>NIM:</strong> ${mhs.nim}</p>
                        <p><strong>Kelas:</strong> ${mhs.kelas}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="openEditModal(${mhs.id},'${mhs.nama}','${mhs.nim}','${mhs.kelas}')">Edit</button>
                        <button class="btn btn-delete" onclick="deleteData(${mhs.id})">Delete</button>
                    </div>
                </div>
            `;
            dataContainer.innerHTML += card;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        dataContainer.innerHTML = '<p>Gagal memuat data.</p>';
    }
}

// frontend/script.js

addForm.addEventListener('submit', async (e) => {
    console.log('Tombol Simpan diklik!'); // <-- TAMBAHKAN BARIS INI
    e.preventDefault();
    const nama = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const kelas = document.getElementById('kelas').value;
});


// Event listener untuk form tambah data (CREATE)
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nama = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const kelas = document.getElementById('kelas').value;

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, nim, kelas })
        });
        addForm.reset();
        fetchAndDisplayData(); // Refresh data
    } catch (error) {
        console.error('Error adding data:', error);
    }
});

// Fungsi untuk membuka modal edit dan mengisi datanya
function openEditModal(id, nama, nim, kelas) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-nama').value = nama;
    document.getElementById('edit-nim').value = nim;
    document.getElementById('edit-kelas').value = kelas;
    editModal.classList.remove('hidden');
}

// Fungsi untuk menutup modal edit
function closeEditModal() {
    editModal.classList.add('hidden');
}

// Event listener untuk form edit data (UPDATE)
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const nama = document.getElementById('edit-nama').value;
    const nim = document.getElementById('edit-nim').value;
    const kelas = document.getElementById('edit-kelas').value;

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, nim, kelas })
        });
        closeEditModal();
        fetchAndDisplayData(); // Refresh data
    } catch (error) {
        console.error('Error updating data:', error);
    }
});

// Fungsi untuk menghapus data (DELETE)
async function deleteData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            fetchAndDisplayData(); // Refresh data
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }
}


// Panggil fungsi untuk pertama kali saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);