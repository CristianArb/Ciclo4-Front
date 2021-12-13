var idAse = localStorage.getItem("idUser");
var listO = [];
var listId = [];
let randCod = Math.floor(Math.random() * 899999 + 100000);

function getUser() {

    $.ajax({
        type: 'GET',
        url: serviceU + idAse,
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
            $("#contenidoPerfil").append($row);
        }
    });
}




//------------------------------------Visualizacion de ordenes-------------------------------


function getProducts() {

    $.ajax({
        type: 'GET',
        url: serviceP + 'all',
        dataType: 'json',
        success: function (data) {

            tableOrder(data)


        }
    });


}

function tableOrder(data) {

    $("#listProducts").empty();

    for (let i = 0; i < data.length; i++) {

        let filas = $('<tr>');

        listId.push(data[i].reference);

        filas.append($("<td class='text-center no-padding'>").append('<button type="button" class="btn btn-outline-success btn-block w-100" id="addP' + i + '" onclick="registerO(' + i + ')">Agregar</button>'));
        filas.append($('<td>').text(data[i].name));
        filas.append($('<td>').text(data[i].brand));
        filas.append($('<td>').text(data[i].category));
        filas.append($('<td>').text(data[i].description));
        switch (data[i].availability) {

            case true:
                filas.append($('<td>').text('Si'));
                break;
            case false: //Los administradores pueden modificar la informacion de otros administradores?
                filas.append($('<td>').text('No'));
                break;

        }
        filas.append($('<td>').text(data[i].price));
        filas.append($('<td>').append("<input type='number' id='quantityRP" + i + "' name='quantity' min='1' max='" + data[i].quantity + "' />"));
        filas.append($('<td>').text(data[i].photography));

        $("#listProducts").append(filas);

    }
}

//------------------------------------Registro de ordenes-------------------------------


function registerO(id) {


    var quantity = parseInt($("#quantityRP" + id).val());

    if (quantity != "" && quantity >= 1 && quantity <= 10) {

        $("#addP" + id).prop('disabled', true);
        listO.push([listId[id], quantity]);
        alert("Se ha añadido " + quantity + " productos con referencia " + listId[id]);
        tableProduct()

    }

    else alert("Ingrese una cantidad adecuada");

}

//------------------------------------Visualizacion ordenes a regisstrar-------------------------------


function tableProduct() {

    $("#bodyOrders").empty();

    if (listO.length == 0) {

        var $row = $('<tr>');
        $row.append($('<td colspan="9" class="text-center">').text('No hay productos registrados'));
        $("#bodyOrders").append($row);


    } else {

        for (i = 0; i < listO.length; i++) {

            let quantityO = listO[i][1];


            $.ajax({
                type: 'GET',
                url: serviceP + listO[i][0],
                dataType: 'json',
                success: function (data) {

                    var $row = $('<tr>');

                    $row.append($('<td><button class="btn btn-outline-primary" onclick="deleteO(' + i + ')">Eliminar</button></td>'));
                    $row.append($('<td>').text(data.name));
                    $row.append($('<td>').text(data.brand));
                    $row.append($('<td>').text(data.category));
                    $row.append($('<td>').text(data.description));
                    /**switch (data.availability) {
         
                        case true:
                            $row.append($('<td>').text('Si'));
                            break;
                        case false: //Los administradores pueden modificar la informacion de otros administradores?
                            $row.append($('<td>').text('No'));
                            break;
         
                    }*/
                    $row.append($('<td>').text(data.price));
                    $row.append($('<td>').text(quantityO));
                    $row.append($('<td>').text(data.photography));

                    $("#bodyOrders").append($row);

                }
            });

        }

        $("#registerO").prop('disabled', false);


    }
}


//---------------------------------------Registro de la Orden-----------------------------------------------------


$("#registerO").click(function orderSucces() {

    $("#bodyCod").empty();
    $("#bodyCod").append("<h7 align='center'>El codigo de tu orden es: " + randCod + "</h7>");
    postOrder(randCod);

});

//---------------------------------------Envio de la orden---------------------------

function postOrder(id) {

    let dataU = {};
    let dataP = {};
    let dataQ = {};


    $.ajax({
        type: 'GET',
        url: serviceU + idAse,
        dataType: 'json',
        async: false,
        success: function (data) {

            dataU = {

                id: data.id,
                identification: data.identification,
                name: data.name,
                birthDay: data.birthDay,
                monthBirthDay: data.monthBirthDay,
                address: data.address,
                cellPhone: data.cellPhone,
                email: data.email,
                password: data.password,
                zone: data.zone,
                type: data.type,
            }

        }
    });
    listO.forEach(product => {

        $.ajax({
            type: 'GET',
            url: serviceP + product[0],
            dataType: 'json',
            async: false,
            success: function (data) {

                data = {

                    reference: data.reference,
                    brand: data.brand,
                    category: data.category,
                    name: data.name,
                    description: data.description,
                    availability: data.availability,
                    price: data.price,
                    quantity: data.quantity,
                    photography: data.photography,

                }

                dataP["" + product[0] + ""] = data
                dataP = Object.assign(dataP);
               
            }
        });
        dataQ["" + product[0] + ""] = product[1]
        dataQ = Object.assign(dataQ);
       
    });


    let dataO = {

        id: id,
        registerDay: new Date(),
        status: "Pendiente",
        salesMan: dataU,
        products: dataP,
        quantities: dataQ

    };

    $.ajax({
        url: serviceO + "new",
        method: "POST",
        dataType: "json",
        data: JSON.stringify(dataO),
        contentType: "application/json",
        Headers: {
            "Content-Type": "application/json",
        },
        statusCode: {
            201: function (response) {
                listO = [];
                tableProduct();
            },
            400: function (textStatus) {
                console.log(textStatus);
            },
        },

    });

}
//---------------------------------------Eliminacion de productos de la orden-------------------------------------------------

function deleteO(i) {

    id = i - 1;
    listO.splice(id, 1);
    $("#addP" + id).prop('disabled', false);
    tableProduct();

}

//------------------------------------------Inicio del documento -----------------------------

$(document).ready(function () {
    getUser();
    getProducts();
    tableProduct();

});

//------------------------------------ Cerrar sesion ----------------------------------------------------------------$("#btnLogout").click(function() {

$("#btnLogout").click(function () {
    localStorage.clear();
    window.location.href = "../index.html";
});








