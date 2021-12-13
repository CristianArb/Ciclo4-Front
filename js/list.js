var idCoord = localStorage.getItem("idUser");
var listSalesMan = [];

/**
 * arreglarFecha(fecha)
 * Función que toma la fecha y la devuelve un string con la fecha en
 * formato yyyy/MM/dd
 * @param {Fecha a modificar} fecha 
 * @returns Fecha con formato yyyy/MM/dd
 */
 function arreglarFecha(fecha) {
    let yyyy = fecha.substring(0, 4);
    let MM = fecha.substring(5, 7);
    let dd = fecha.substring(8, 10);
    return fechaNueva = yyyy + '/' + MM + '/' + dd;
}

//------------------------------------------Visualizacion de perfil activo-------------------------------

function getUser() {

    $("#contenidoPerfil").empty();

    $.ajax({
        type: 'GET',
        url: serviceU + idCoord,
        dataType: 'json',
        success: function (data) {
            var $row = $('<tr>');
            $row.append($('<td>').text(data.identification));
            $row.append($('<td>').text(data.name));
            $row.append($('<td>').text(data.email));
            switch (data.type) {
                case 'COORD':
                    $row.append($('<td>').text('Cordinador de zona'));
                    break;
                case 'ADM':
                    $row.append($('<td>').text('Administrador'));
                    break;
                case 'ASE':
                    $row.append($('<td>').text('Asesor comercial'));
                    break;
                default:
                    $row.append($('<td>').text('Perfil no definido'));
                    break;
            }
            $row.append($('<td>').text(data.zone));
            getOrders(data.zone);
            $("#contenidoPerfil").append($row);
        }
    });
}




//------------------------------------Visualizacion de Ordenes de Pedido -------------------------------



function getOrders(zone) {

   
    $.ajax({
        type: 'GET',
        url: serviceO + 'zona/' + zone,
        dataType: 'json',
        success: function (data) {

            tableOrders(data);

        }
    });


}

function tableOrders(data) {

    $("#ordersPT>tbody").empty();

    if (data.length == 0) {

        var $row = $('<tr>');
        $row.append($('<td colspan="9" class="text-center">').text('No se ha realizado ningun pedido'));
        $("#ordersPT>tbody").append($row);


    } else {

        for (i = 0; i < data.length; i++) {

            let filas = $('<tr>');

            listSalesMan.push(data[i].salesMan.id);

            filas.append($('<td>').text(data[i].salesMan.identification));
            filas.append($('<td>').text(data[i].salesMan.name));
            filas.append($('<td>').text(data[i].salesMan.email));
            filas.append($('<td>').text(arreglarFecha(data[i].registerDay)));
            filas.append($('<td>').text(data[i].id));
            filas.append($('<td>').text(data[i].status));
            filas.append($('<td><button class="btn btn-outline-primary" onclick="detailO(' + i + ')">Ver Pedido</button></td>'));



            $("#ordersPT>tbody").append(filas);

        }
    }
}

//------------------------------------Visualizacion de Detalle Ordenes -------------------------------

function selectorStatus() {



    let opsS = [{
        value: null,
        text: "Seleccionar..."
    },

    {
        value: "Aprobada",
        text: "Aprobada"
    },

    {
        value: "Rechazada",
        text: "Rechazada"
    },

    ];

    $("#statusUp").empty();

    $.each(opsS, function (b) {

        $("#statusUp").append('<option value=' + opsS[b].value + '>' + opsS[b].text + '</option>');

    });


}


function detailO(i) {


    $(".ordersP").hide();
    $(".perfilO").show();
    $(".ordersD").show();
    getOrder(i);


}


function getOrder(i) {

    

    $.ajax({
        type: 'GET',
        url: serviceO +"salesman/"+ listSalesMan[i],
        dataType: 'json',
        success: function (data) {

            tablePerfilO(data[i]);
            tableOrdersD(data[i]);

        }
    });


}

function tablePerfilO(data) {

    $("#bodyPO").empty();

    let row = $('<tr>');

    row.append($('<td>').text(arreglarFecha(data.registerDay)));
    row.append($('<td>').text(data.id));
    row.append($('<td>').text(data.status));
    row.append($('<td><select id="statusUp" ></select></td>'));
    row.append($('<td><button class="btn btn-outline-primary" onclick="saveO(' + data.id + ')"  id = "saveStatus" >Guardar Estado</button></td>'));

    $("#bodyPO").append(row);

    selectorStatus();

}


function tableOrdersD(data) {


    $("#bodyOrderD").empty();

    products = data.products;

    var i = 1;
    for (x in products) {

        product = products[x]
        let filas = $('<tr>');

        filas.append($('<td>').text(product.photography));
        filas.append($('<td>').text(product.name));
        filas.append($('<td>').text(product.category));
        filas.append($('<td>').text(product.description));
        filas.append($('<td>').text(product.price));
        filas.append($('<td>').text(data.quantities[x]));
        filas.append($('<td>').text(product.quantity));

        $("#bodyOrderD").append(filas);


    }
}



function saveO(id) {

    if ($("#statusUp").val() != "null") {

        $("#saveStatus").prop('disabled', false);
        putOrder(id)
    }
    else alert("Seleccione un estado")

}

function putOrder(id) {

    let dataO = {
        id: id,
        //registerDay: new Date(),
        status: $("#statusUp").val(),
        //salesMan: JSON.stringify(dataU),
        //products: JSON.stringify(dataP),
        //quantities: JSON.stringify(dataQ)

    };

    $.ajax({
        url: serviceO + "update",
        method: "PUT",
        dataType: "json",
        data: JSON.stringify(dataO),
        contentType: "application/json",
        Headers: {
            "Content-Type": "application/json",
        },
        statusCode: {
            201: function (response) {

                getUser();
                $(".ordersP").show();
                $(".perfilO").hide();
                $(".ordersD").hide();
            },
            400: function (response) {
                console.log("Bad Request");
            },
        },

    });


}


//------------------------------------------Inicio del documento -----------------------------

$(document).ready(function () {
    
    getUser();

});


//------------------------------------ Cerrar sesion ----------------------------------------------------------------$("#btnLogout").click(function() {

$("#btnLogout").click(function () {
    localStorage.clear();
    window.location.href = "../index.html";
});

