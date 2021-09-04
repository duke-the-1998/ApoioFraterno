function btnCriar() {
    return confirm("Deseja criar este produto?");
}

function openCriarAlimento() {
    document.getElementById("criarAlimento").style.width = "100%";
}

function openEditarAlimento() {
    document.getElementById("editarAlimento").style.width = "100%";
}

function closeCriarAlimento() {
    document.getElementById("criarAlimento").style.width = "0%";
}

function closeEditarAlimento() {
    document.getElementById("editarAlimento").style.width = "0%";
}

function openNavInventario(id, nome, obs, estado) {
    document.getElementById("id").value = id;
    document.getElementById("nome").innerText = nome;
    document.getElementById("observacoes").value = obs;
    if(estado == 0){
        document.getElementById("estado").checked = false;
    }else{
        document.getElementById("estado").checked = true;
    }
    document.getElementById("editarAlimento").style.width = "100%";
    document.getElementById("delete").href="/admin/deleteAlimento/"+id;
}