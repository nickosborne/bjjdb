
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

// Example starter JavaScript for disabling form submissions if there are invalid fields
// (function () {
//     'use strict';
//     window.addEventListener('load', function () {
//         // Fetch all the forms we want to apply custom Bootstrap validation styles to
//         const forms = document.getElementsByClassName('validated-form');
//         // Loop over them and prevent submission
//         var validation = Array.prototype.filter.call(forms, function (form) {
//             form.addEventListener('submit', function (event) {
//                 if (form.checkValidity() === false) {
//                     event.preventDefault();
//                     event.stopPropagation();
//                 }
//                 form.classList.add('was-validated');
//             }, false);
//         });
//     }, false);
// })();

