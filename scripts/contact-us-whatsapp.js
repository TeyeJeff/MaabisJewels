const waSelect = document.getElementById('wa-subject');
const waLink = document.getElementById('wa-link');

if (waSelect && waLink) {
    waSelect.addEventListener('change', (e) => {
        const subject = encodeURIComponent(e.target.value);
        waLink.href = `https://wa.me/233204721265?text=Hello%20MaabisJewels,%20I%20am%20contacting%20you%20regarding:%20${subject}`;
    });
}