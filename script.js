// Firebase konfigürasyonunu buraya ekleyin
const firebaseConfig = {
    apiKey: "AIzaSyCGRTsXI5vKcLLsvgaZNOScNyMGWUWrgOk",
    authDomain: "teho-restaurant.firebaseapp.com",
    databaseURL: "https://teho-restaurant-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "teho-restaurant",
    storageBucket: "teho-restaurant.firebasestorage.app",
    messagingSenderId: "132354053120",
    appId: "1:132354053120:web:e06bdf04cdb45dd86cf4e5",
    measurementId: "G-XWLNBJQM8Q"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const personCountInput = document.getElementById('personCount');
    const dateTimeInput = document.getElementById('dateTime');
    const showTablesButton = document.getElementById('showTablesButton');
    const tableSelectionDiv = document.getElementById('tableSelection');
    const tablesContainer = document.getElementById('tablesContainer');
    const submitButton = document.getElementById('submitButton');
    let selectedTable;

    flatpickr("#dateTime", {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        locale: "tr",
        minDate: "today",
        minTime: "09:00",
        maxTime: "23:00"
    });

    function checkFormCompletion() {
        if (nameInput.value && phoneInput.value && personCountInput.value && dateTimeInput.value) {
            showTablesButton.classList.remove('hidden');
        } else {
            showTablesButton.classList.add('hidden');
            tableSelectionDiv.classList.add('hidden');
            submitButton.classList.add('hidden');
        }
    }

    nameInput.addEventListener('input', checkFormCompletion);
    phoneInput.addEventListener('input', checkFormCompletion);
    personCountInput.addEventListener('input', checkFormCompletion);
    dateTimeInput.addEventListener('input', checkFormCompletion);

    showTablesButton.addEventListener('click', () => { 
        const personCount = parseInt(personCountInput.value);
        tablesContainer.innerHTML = '';
        tableSelectionDiv.classList.remove('hidden');

        if (personCount <= 0) {
            tablesContainer.innerHTML = "<p class='text-red-500'>Lütfen geçerli bir kişi sayısı giriniz.</p>";
            submitButton.classList.add('hidden');
            return;
        }

        let availableTables = getAvailableTables(personCount);
        if (availableTables.length === 0) {
            tablesContainer.innerHTML = "<p class='text-red-500'>Üzgünüz, belirttiğiniz kişi sayısına uygun boş masa bulunmamaktadır.</p>";
            submitButton.classList.add('hidden');
            return;
        }

        availableTables.forEach(table => {
            const tableDiv = document.createElement('div');
            tableDiv.className = 'table-container';
            tableDiv.innerHTML = `
                <img src="${table.image}" alt="${table.alt}" class="table-image w-24 h-24 cursor-pointer rounded-lg shadow-md hover:scale-105 transition duration-300" data-table="${table.id}" data-capacity="${table.capacity}">
                <p class="mt-2 text-sm text-gray-600">${table.capacity} Kişilik</p>
            `;
            tablesContainer.appendChild(tableDiv);
        });

        const tableImages = tablesContainer.querySelectorAll('.table-image');
        tableImages.forEach(image => {
            image.addEventListener('click', () => {
                tableImages.forEach(img => img.classList.remove('selected'));
                image.classList.add('selected');
                selectedTable = image.dataset.table;
                document.getElementById('selectedTable').value = selectedTable;
                submitButton.classList.remove('hidden');
            });
        });
    });

    function getAvailableTables(personCount) {
        const tables = [
            { id: 1, capacity: 2, image: "./img/masa1.JPG", alt: "2 Kişilik Masa(Cam Kenarı)" },
            { id: 2, capacity: 2, image: "./img/masa3.JPG", alt: "2 Kişilik Masa(Duvar Kenarı)" },
            { id: 3, capacity: 4, image: "./img/masa2.JPG", alt: "4 Kişilik Masa(Cam Kenarı)" },
            { id: 4, capacity: 4, image: "https://via.placeholder.com/150/ffa500/FFF?text=duvar+kenari", alt: "4 Kişilik Masa(Duvar Kenarı)" },
            { id: 5, capacity: 6, image: "https://via.placeholder.com/150/ffa500/FFF?text=duvar+kenari", alt: "6 Kişilik Masa(Duvar Kenarı)" },
            { id: 6, capacity: 8, image: "https://via.placeholder.com/150/ffa500/FFF?text=orta", alt: "8 Kişilik Masa(Orta Taraf)" },
            { id: 7, capacity: 10, image: "https://via.placeholder.com/150/ffa500/FFF?text=duvar+kenari", alt: "10 Kişilik Masa(Duvar Kenarı)" }
        ];

        return tables.filter(table => table.capacity >= personCount);
    }

    document.getElementById('reservationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const personCount = document.getElementById('personCount').value;
        const dateTime = document.getElementById('dateTime').value;
        const selectedTable = document.getElementById('selectedTable').value;

        const reservationData = {
            name,
            phone,
            personCount,
            dateTime,
            selectedTable
        };

        database.ref('reservations').push(reservationData);

        localStorage.setItem('reservation', JSON.stringify(reservationData));
        window.location.href = "rezervasyon_detay.html";
        console.log("Rezervasyon Bilgileri:");
        console.log("Ad Soyad:", name);
        console.log("Telefon:", phone);
        console.log("Kişi Sayısı:", personCount);
        console.log("Tarih ve Saat:", dateTime);
        console.log("Seçilen Masa:", selectedTable);

        document.getElementById('reservationForm').reset();
        tablesContainer.innerHTML = '';
        tableSelectionDiv.classList.add('hidden');
        submitButton.classList.add('hidden');
        showTablesButton.classList.add('hidden');
    });
});

// Tüm rezervasyonları listeleme (opsiyonel)
// Firebase'den verileri çektikten sonra
const reservationTable = document.querySelector('.reservation-table');
let tableHTML = '<table><thead><tr><th>Ad Soyad</th><th>Tarih</th><th>Saat</th><th>Kişi Sayısı</th></tr></thead><tbody>';

newFunction();
reservationTable.innerHTML = tableHTML;
database.ref('reservations').on('value', (snapshot) => {
    const reservations = snapshot.val();
    for (let key in reservations) {
        const reservation = reservations[key];
        tableHTML += `<tr>
                        <td>${reservation.name}</td>
                        <td>${reservation.date}</td>
                        <td>${reservation.time}</td>
                        <td>${reservation.people}</td>
                      </tr>`;
    }
    tableHTML += '</tbody></table>';
    reservationTable.innerHTML = tableHTML;
});

function newFunction() {
    tableHTML += '</tbody></table>';
}