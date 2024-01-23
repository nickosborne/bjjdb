
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
    const url = document.getElementById('video').value;
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p) && url.match(p)[1]) {
        link.classList.remove("is-invalid");
        link.classList.add('is-valid');
        return true;
    }
    else {
        link.classList.add("is-invalid");
        link.classList.remove('is-valid');
        return false;
    }
}
