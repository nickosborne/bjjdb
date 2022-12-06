console.log(subs)
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
                variation.appendChild(option);
            }
        }
    }
});