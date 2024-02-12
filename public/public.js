(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!validateLink() || !form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()


const noteForms = document.querySelectorAll('.note-form')
Array.from(noteForms).forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault()
        if (form.querySelector("textarea").value) {
            const formData = new FormData(form);
            const journal = Object.fromEntries(formData);
            axios.post('/users/journal', journal, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    })
})


let btn = document.getElementById('addTechnique')
if (btn) {
    btn.addEventListener('click', () => {
        let form = document.getElementById('add-technique');
        if (form.hidden) {
            form.hidden = false;
        } else {
            form.hidden = true;
        }
    })
}

const form = document.querySelector('#searchForm');
form.addEventListener('input', async function (e) {
    e.preventDefault();
    const query = form.elements.query.value;
    let list = document.querySelector('#searchResults')
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    if (query.length) {
        const res = await axios.get(`/search/${query}`)
        let list = document.querySelector('#searchResults')
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        res.data.results.forEach((result) => {
            const node = document.createElement("a");
            node.innerHTML = `${result.name} : <i>${result.type.toLowerCase()}</i>`
            node.className = "list-group-item list-group-item-action list-group-item-dark"
            node.href = `${result.link}`
            document.querySelector('#searchResults').appendChild(node);
        })
    }
})

const validateLink = () => {
    const link = document.getElementById('video');
    if (link) {
        const url = link.value
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if (url.match(p) && url.match(p)[1]) {
            link.setCustomValidity("");
            return true;
        }
        else {
            link.setCustomValidity("Invalid field.");
            return false;
        }
    }
    else {
        return true;
    }
}

