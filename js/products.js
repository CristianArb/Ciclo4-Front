var idPrUp;
var listId = [];

//------------------------------------Visualizacion de productos-------------------------------
function getProducts() {

    $.ajax({
        type: 'GET',
        url: serviceP + "all",
        dataType: 'json',
        success: function (data) {
            console.log(data)
            tableProduct(data);

        }

    });
}

function tableProduct(respuesta) {

    $("#tableProduct>tbody").empty();
    
    if(respuesta.length == 0){
        
        var $row = $('<tr>');
            $row.append($('<td colspan="9" class="text-center">').text('No hay productos'));
            $("#tableProduct>tbody").append($row);
    
    
    }else{

        for (i = 0; i < respuesta.length; i++) {

            listId.push(respuesta[i].reference);
    
    
            var $row = $('<tr>');
            //$row.append($("<td>" + '<button onclick="Agregar(this)">Agregar</button>' + "</td>"));
            $row.append($('<td><button type="button" class="btn btn-outline-primary"' +
                'data-bs-toggle="modal" data-bs-target="#modalRegisterP" onclick="modalRegisterP(' + i + ')">Editar</button></td>'));
            $row.append($('<td><button class="btn btn-outline-primary" onclick="deleteP(' + i + ')">Eliminar</button></td>'));
            $row.append($('<td>').text(respuesta[i].name));
            $row.append($('<td>').text(respuesta[i].brand));
            $row.append($('<td>').text(respuesta[i].category));
            $row.append($('<td>').text(respuesta[i].description));
            switch (respuesta[i].availability) {
    
                case true:
                    $row.append($('<td>').text('Si'));
                    break;
                case false: //Los administradores pueden modificar la informacion de otros administradores?
                    $row.append($('<td>').text('No'));
                    break;
    
            }
            $row.append($('<td>').text(respuesta[i].price));
            $row.append($('<td>').text(respuesta[i].quantity));
            $row.append($('<td>').text(respuesta[i].photography));
    
            $("#tableProduct>tbody").append($row);
        }
    }
}

$(document).ready(function () {

    getProducts();

});

//------------------------------------Registro Producto-------------------------------------------

function selectorAvailability(availability) {


    let opsA = [{
        value: null,
        text: "Seleccionar..."
    },

    {
        value: true,
        text: "Si"
    },

    {
        value: false,
        text: "No"
    }
    ];

    $("#" + availability).empty();

    $.each(opsA, function (c) {

        $("#" + availability).append('<option value=' + opsA[c].value + '>' + opsA[c].text + '</option>');

    });

}

function postP() {

    let datos = {
        reference: $("#reference").val(),
        brand: $("#brand").val(),
        category: $("#category").val(),
        name: $("#nameP").val(),
        description: $("#description").val(),
        availability: $("#availability").val(),
        price: $("#price").val(),
        quantity: $("#quantity").val(),
        photography: $("#photography").val(),
    };
    $.ajax({
        url: serviceP + "new",
        method: "POST",
        dataType: "json",
        data: JSON.stringify(datos),
        contentType: "application/json",
        Headers: {
            "Content-Type": "application/json",
        },
        statusCode: {
            201: function (response) {
                alert("Producto creado de forma correcta");
                getProducts();
            },
            400: function (response) {
                console.log("Bad Request");
            },
        },

    });

}



$("#registerP").click(

    selectorAvailability("availability")

);


$("#createP").click(function () {

    switch (true) {

        case dataVoid("modalProduct"):

            alert("Por favor complete todos los campos");
            break;




        default:

            postP();
            $('#btnCerrarP').click();
            dataClean("modalProduct");
        
    }

});



//-------------------------------------------Edicion de usuarios------------------------------------------------------

function putP(id) {

    let datos = {
        reference: id,
        brand: $("#brandUp").val(),
        category: $("#categoryUp").val(),
        name: $("#namePUp").val(),
        description: $("#descriptionUp").val(),
        availability: $("#availabilityUp").val(),
        price: $("#priceUp").val(),
        quantity: $("#quantityUp").val(),
        photography: $("#photographyUp").val(),
    };
    let dataToSend = JSON.stringify(datos);

    $.ajax({
        dataType: 'json',
        data: dataToSend,
        url: serviceP + "update",
        type: "PUT",
        contentType: 'application/json',

        success: function (response) {

            alert("Producto editado");
            getProducts();
           

        },
    });
}



function modalRegisterP(id) {

    idPrUp = listId[id];

    $.ajax({
        type: 'GET',
        url: serviceP + 'all',
        dataType: 'json',
        success: function (data) {

            for (i = 0; i < data.length; i++) {

                if (data[i].reference == idPrUp) {

                    $("#tableRegisterP>tbody").empty();

                    var $row = $('<tr>');
                    $row.append($('<td><input type="text" id="namePUp" value="' + data[i].name + '"></td>'));
                    $row.append($('<td><input type="text" id="categoryUp" value="' + data[i].category + '"></td>'));
                    $row.append($('<td><input type="text" id="brandUp" value="' + data[i].brand + '"></td>'));
                    $row.append($('<td><input type="email" id="descriptionUp" value="' + data[i].description + '"></td>'));
                    /**switch (data[i].availability) {

                        case true:
                            $row.append($('<td><select id="availabiltyUp"><option value=' + data[i].availability + '>Si</option></select></td>'));
                            break;
                        case false: //Los administradores pueden modificar la informacion de otros administradores?
                            $row.append($('<td><select id="availabiltyUp"><option value=' + data[i].availability + '>No</option></select></td>'));
                            break;

                    }*/
                    $row.append($('<td><select id="availabilityUp"></select></td>'));
                    $row.append($('<td><input type="email" id="priceUp" value="' + data[i].price + '"></td>'));
                    $row.append($('<td><input type="email" id="quantityUp" value="' + data[i].quantity + '"></td>'));
                    $row.append($('<td><input type="email" id="photographyUp" value="' + data[i].photography + '">  </td>'));

                    $("#tableRegisterP>tbody").append($row);

                    selectorAvailability("availabilityUp");

                }
            }

        }
    });

}



$("#updateP").click(function () {


    switch (true) {

        case $("#categoryUp").val() == "" || $("#namePUp").val() == "" ||
            $("#descriptionUp").val() == "" || $("#availabilityUp").val() == "null" ||
            $("#priceUp").val() == "" || $("#quantityUp").val() == "" ||
            $("#photographyUp").val() == "":

            alert("Por favor complete todos los campos");
            break;

        default:


            putP(idPrUp);
            $('#btnCerrarRP').click();
    }

});



//---------------------------------------Eliminacion de productos-------------------------------------------------

function deleteP(code) {


    $.ajax({
        url: serviceP + listId[code],
        type: "DELETE",
        dataType: 'JSON',
        contentType: 'application/json',
        success: function () {

            getProducts();

        }
    });

}