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


const favorites = document.querySelectorAll('.favorite')
Array.from(favorites).forEach(favorite => {
    favorite.addEventListener("click", event => {
        const selected = "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
        const unselected = "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"
        const el = favorite.querySelector("svg").querySelector('path')
        let fav = false;
        if (el.getAttribute('d') === selected) {
            el.setAttribute('d', unselected)
        }
        else {
            fav = true;
            el.setAttribute('d', selected)
        }
        const selectElement = favorite.querySelector('input[name="technique"]');

        fetch("/users/favorites", {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                technique: selectElement.value,
                favorite: fav
            })
        })
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

