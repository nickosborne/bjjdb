
document.getElementById('hideForm').addEventListener('click',  () => {
    let form = document.getElementById('add-submission');
    console.log('success')
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
})

document.querySelector('#subs').addEventListener("change", function () {
    let variation = document.querySelector('#variation');
    while (variation.firstChild) {
        variation.removeChild(variation.lastChild);
    }
    for (let sub of subs) {
        if (sub.name === this.value) {
            console.log(sub);
            for (let v of sub.subVars) {
                let option = document.createElement("option");
                option.innerHTML = v.name;
                document.querySelector('#subVarId').value = v.id;
                variation.appendChild(option);
            }
        }
    }
});