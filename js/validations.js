function isEmail(valor) {

    expr = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
    return expr.test(valor);

}


function existEmail(valor) {

    return $.ajax({
        url: serviceU + "emailexist/" + valor,
        method: "GET",
        dataType: "json",
        async: false,
    }).responseJSON;
}

function dataVoid(idModal) {


    //Buscar elementos con un for tal que tengan la propieda value
    var $modal = $("#" + idModal + " > div.modal-dialog > div.modal-content > div.modal-body > div.row.justify-content-center > div.mb-3 > .form-control ")

    //Coger elelmentos y meterlos en el for para verificar que no tenga valores nulos
    for (i = 0; i < $modal.length; i++) {

        if ($modal[i].value == "null" || $modal[i].value == null || $modal[i].value == "") {

            return true;

        }

    }
}



function dataClean(idModal) {


    //Buscar elementos con un for tal que tengan la propieda value
    var $modal = $("#" + idModal + " > div.modal-dialog > div.modal-content > div.modal-body > div.row.justify-content-center > div.mb-3 > .form-control ")

    //Coger elelmentos y meterlos en el for para verificar que no tenga valores nulos
    for (i = 0; i < $modal.length; i++) {

        if ($modal[i].value != "") {

            $modal[i].value = null;

        }
    }
}