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

function openNavInventario(id,nome,obs,estado) {
    document.getElementById("id").value=id;
    document.getElementById("nome").innerText=nome;
    document.getElementById("observacoes").value = obs;
    if(estado==0){
        document.getElementById("estado").checked =false;
    }else{
        document.getElementById("estado").checked =true;
    }
    document.getElementById("myNav").style.width = "100%";
}

function btnGuardar() {
    document.getElementById("myNav").style.width = "0%";
}