

document.getElementById("submission-search").addEventListener("submit", function (event) {
    event.preventDefault()
    console.log(this.query.value)
});

const btn = document.getElementById('hideForm');

btn.addEventListener('click', () => {
    const form = document.getElementById('submission-search');

    if (form.style.display === 'none') {
        // 👇️ this SHOWS the form
        form.style.display = 'block';
    } else {
        // 👇️ this HIDES the form
        form.style.display = 'none';
    }
});