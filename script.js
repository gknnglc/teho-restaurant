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
window.onload = function() {
    const reservationForm = document.getElementById('reservationForm');


    reservationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const people = document.getElementById('people').value;

        database.ref('reservations').push({
            name,
            date,
            time,
            people
        });

        reservationForm.reset();
    });
}

// Tüm rezervasyonları listeleme (opsiyonel)
// Firebase'den verileri çektikten sonra
const reservationTable = document.querySelector('.reservation-table');
let tableHTML = '<table><thead><tr><th>Ad Soyad</th><th>Tarih</th><th>Saat</th><th>Kişi Sayısı</th></tr></thead><tbody>';



newFunction();
reservationTable.innerHTML = tableHTML;
database.ref('reservations').on('value', (snapshot) => {
    // Verileri işleyip HTML'e ekleme
    reservations.forEach(reservation => {
        tableHTML += `<tr>
                        <td>${reservation.name}</td>
                        <td>${reservation.date}</td>
                        <td>${reservation.time}</td>
                        <td>${reservation.people}</td>
                      </tr>`;
    });

});

function newFunction() {
    tableHTML += '</tbody></table>';
}
// Flatpickr'ı başlat
flatpickr("#datetime", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today"
});

function showTables() {
    // Form verilerini al
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const people = document.getElementById("people").value;
    const datetime = document.getElementById("datetime").value;

    // Burada uygun masaları belirlemek için sunucuya bir istek gönderilir (örneğin, AJAX ile)
    // ve dönen verilere göre tableChoices div'i güncellenir.

    // Örnek olarak, uygun masaların görsellerini içeren bir dizi oluşturalım:
    const tableImages = ["masa1.jpg", "masa2.jpg"];

    // tableChoices div'ini göster ve içini uygun masaların görselleriyle doldur
    const tableChoicesDiv = document.getElementById("tableChoices");
    tableChoicesDiv.style.display = "block";
    tableChoicesDiv.innerHTML = "";
    tableImages.forEach(image => {
        const img = document.createElement("img");
        img.src = image;
        tableChoicesDiv.appendChild(img);
    });
}
