function showMessage() {
    alert('Operação concluida com sucesso')
}

function btnEntrada() {
    return confirm("Deseja fazer entrada do produto?");
}

function btnSaida() {
    return confirm("Deseja fazer saída do produto?");
}

function btnCriar() {
    return confirm("Deseja criar este produto?");
}

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}