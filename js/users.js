//------------------------------------------Visualizacion de perfil activo-------------------------------
var idAdmin = localStorage.getItem("idUser");
var idUsUp;

function getUser() {

    $.ajax({
        type: 'GET',
        url: serviceU + idAdmin,
        dataType: 'json',
        success: function (data) {
            var $row = $('<tr>');
            $row.append($('<td>').text(data.identification));
            $row.append($('<td>').text(data.name));
            $row.append($('<td>').text(data.email));
            switch (data.type) {
                case 'COORD':
                    $row.append($('<td>').text('Cordinador comercial'));
                    break;
                case 'ADM':
                    $row.append($('<td>').text('Administrador'));
                    break;
                case 'ASE':
                    $row.append($('<td>').text('Asesor de zona'));
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

/**
 * getUsers()
 * Función trae todos los registros de las cuatrimotos con petición GET
 */
function getUsers() {
    $.ajax({
        url: serviceU + "all",
        type: "GET",
        datatype: "JSON",
        async: true,
        success: function (data) {
            console.log(data)
            tableUser(data);
        },

        error: function (xhr, status) {
            alert("Ha sucedido un problema al consultar los usuarios.");
        }

    });
}

/**
 * tableUser(respuesta)
 * Función que dibuja la tabla completa de registros de las reservaciones
 * @param {JSON con todos los registros de las reservaciones} respuesta 
 */
function tableUser(respuesta) {

    $("#tableUser>tbody").empty();

    if (respuesta.length == 1) {

        if (respuesta[0].id == idAdmin) {

            var $row = $('<tr>');
            $row.append($('<td colspan="7" class="text-center">').text('No hay usuarios registrados'));
            $("#tableUser>tbody").append($row);
        }


    } else {

        for (i = 0; i < respuesta.length; i++) {


            if (respuesta[i].id != idAdmin) {

                var $row = $('<tr>');

                //$row.append($("<td>" + '<button onclick="Agregar(this)">Agregar</button>' + "</td>"));
                $row.append($('<td><button type="button" class="btn btn-outline-primary"' +
                    'data-bs-toggle="modal" data-bs-target="#modalRegisterU" onclick="modalRegisterU(' + respuesta[i].id + ')">Editar</button></td>'));
                $row.append($('<td><button class="btn btn-outline-primary" onclick="deleteU(' + respuesta[i].id + ')">Eliminar</button></td>'));
                $row.append($('<td>').text(respuesta[i].identification));
                $row.append($('<td>').text(respuesta[i].name));
                $row.append($('<td>').text(respuesta[i].email));
                switch (respuesta[i].type) {

                    case 'COORD':
                        $row.append($('<td>').text('Cordinador de zona'));
                        break;
                    case 'ADM': //Los administradores pueden modificar la informacion de otros administradores
                        $row.append($('<td>').text('Administrador'));
                        break;
                    case 'ASE':
                        $row.append($('<td>').text('Asesor comercial'));
                        break;
                    default:
                        $row.append($('<td>').text('Perfil no definido'));
                        break;

                }
                $row.append($('<td>').text(respuesta[i].zone));

                $("#tableUser>tbody").append($row);
            }
        }

    }
}

//-----------------------------------------Registro Usuario--------------------------------------------

function selectorZoneU(zone) {

    let opsZ = [{
        value: null,
        text: "Seleccionar..."
    },

    {
        value: "Usaquén",
        text: "Usaquén"
    },

    {
        value: "Chapinero",
        text: "Chapinero"
    },

    {
        value: "Santa Fe",
        text: "Santa Fe"
    },

    {
        value: "San Cristobal",
        text: "San Cristobal"
    },

    {
        value: "Usme",
        text: "Usme"
    },

    {
        value: "Tunjuelito",
        text: "Tunjuelito"
    },

    {
        value: "Bosa",
        text: "Bosa"
    },

    {
        value: "Kennedy",
        text: "Kennedy"
    },

    {
        value: "Fontibón",
        text: "Fontibón"
    },

    {
        value: "Engativá",
        text: "Engativá"
    },

    {
        value: "Suba",
        text: "Suba"
    },

    {
        value: "Barrios Unidos",
        text: "Barrios Unidos"
    },

    {
        value: "Teusaquillo",
        text: "Teusaquillo"
    },

    {
        value: "Los Mártires",
        text: "Los Mártires"
    },

    {
        value: "Antonio Nariño",
        text: "Antonio Nariño"
    },

    {
        value: "Puente Aranda",
        text: "Puente Aranda"
    },

    {
        value: "La candelaria",
        text: "La candelaria"
    },

    {
        value: "Rafael Uribe Uribe",
        text: "Rafael Uribe Uribe"
    },

    {
        value: "Ciudad Bolívar",
        text: "Ciudad Bolívar"
    },

    {
        value: "Sumapaz",
        text: "Sumapaz"
    },


    ];

    $("#" + zone).empty();

    $.each(opsZ, function (a) {

        $("#" + zone).append('<option value=' + opsZ[a].value + '>' + opsZ[a].text + '</option>');

    });


}

function selectorTypeU(type) {



    let opsT = [{
        value: null,
        text: "Seleccionar..."
    },

    {
        value: "COORD",
        text: "Coordinador Comercial"
    },

    {
        value: "ASE",
        text: "Asesor de zona"
    },

    ];

    $("#" + type).empty();

    $.each(opsT, function (b) {

        $("#" + type).append('<option value=' + opsT[b].value + '>' + opsT[b].text + '</option>');

    });


}


$("#registerU").click(
    selectorZoneU("zone"),
    selectorTypeU("type")
);



function postU() {


    let datos = {

        identification: $("#idUser").val(),
        name: $("#nameU").val(),
        birthDay: $("#birthDay"),
        monthBirthDay: $("#monthBirh").val(),
        address: $("#address").val(),
        cellPhone: $("#cellPhone").val(),
        email: $("#email").val(),
        password: $("#contrasena").val(),
        zone: $("#zone").val(),
        type: $("#type").val(),
    };


    $.ajax({
        url: serviceU + "new",
        method: "POST",
        dataType: "json",
        data: JSON.stringify(datos),
        contentType: "application/json",
        Headers: {
            "Content-Type": "application/json",
        },
        statusCode: {
            201: function (response) {
                console.log(response);

                if (response.id == null)
                    alert("No fue posible crear la cuenta");

                else {


                    $.ajax({
                        url: serviceU + datos.email + "/" + datos.password,
                        method: "GET",
                        dataType: "json",
                        success: function (response) {

                            if (response.id == null)
                                alert("No fue posible crear la cuenta");
                            else {

                                alert("Cuenta creada de forma correcta");
                                getUsers();

                            }
                        }

                    });
                }
            },
            400: function (response) {
                alert("Cuenta creada de forma correcta");
            },
        },

    });




}

$("#createU").click(function () {



    switch (true) {

        case dataVoid("modalUser"):

            alert("Por favor complete todos los campos");
            break;

        case isEmail($("#email").val()) == false:

            alert("La dirección de email es incorrecta.");
            break;

        case $("#contrasena").val() != $("#contrasena2").val():

            alert("Las contraseñas no coinciden");
            break;

        case existEmail($("#email").val()):

            alert("No fue posible crear la cuenta");
            break;

        default:

            postU();
            $('#btnCerrarU').click();
            dataClean("modalUser");



    }

});

$("#contrasena2").change(function () {
    if ($("#contrasena").val() != $("#contrasena2").val()) {
        $("#contrasena2").css("border-color", "red");
        $("#contrasena").css("border-color", "red");
    } else {
        $("#contrasena2").css("border-color", "green");
        $("#contrasena").css("border-color", "green");
    }
});


//-------------------------------------------Edicion de usuarios------------------------------------------------------

function putU(id) {

    let datos = {
        id: id,
        identification: $("#idUserUp").val(),
        name: $("#nameUUp").val(),
        //birthDay: $("#birthDay"),
        //monthBirthDay: $("#monthBirh").val(),
        //address: $("#address").val(),
        //cellPhone: $("#cellPhone").val(),
        email: $("#emailUp").val(),
        //password: $("#contrasena").val(),
        zone: $("#zoneUp").val(),
        type: $("#typeUp").val(),
    };
    let dataToSend = JSON.stringify(datos);

    $.ajax({
        dataType: 'json',
        data: dataToSend,
        url: serviceU + "update",
        type: "PUT",
        contentType: 'application/json',

        success: function (response) {

            getUsers();
            alert("Usuario editado");

        },
    });
}



function modalRegisterU(id) {

    idUsUp = id;
    $.ajax({
        type: 'GET',
        url: serviceU + 'all',
        dataType: 'json',
        success: function (data) {

            for (i = 0; i < data.length; i++) {
                if (data[i].id == id) {

                    $("#tableRegisterU>tbody").empty();

                    var $row = $('<tr>');
                    $row.append($('<td><input type="text" id="idUserUp" value="' + data[i].identification + '"> </td>'));
                    $row.append($('<td><input type="text"  id="nameUUp" value="' + data[i].name + '"> </td>'));
                    $row.append($('<td><input type="email" id="emailUp" value="' + data[i].email + '"> </td>'));
                    $row.append($('<td><select id="typeUp" ></select></td>'));
                    $row.append($('<td><select id="zoneUp" ></select></td>'));

                    $("#tableRegisterU>tbody").append($row);

                    selectorTypeU("typeUp");
                    selectorZoneU("zoneUp");


                    $("#typeUp").value = data[i].type;
                    $("#zoneUp").value = data[i].zone;
                }
            }

        }
    });

}



$("#updateU").click(function () {

    switch (true) {

        case $("#idUserUp").val() == "" || $("#nameUUp").val() == "" ||
            $("#emailUp").val() == "" || $("#zoneUp").val() == "null" ||
            $("#typeUp") == "null":

            alert("Por favor complete todos los campos");
            break;

        case isEmail($("#emailUp").val()) == false:

            alert("La dirección de email es incorrecta.");
            break;


        default:

            putU(idUsUp);
            $('#btnCerrarRU').click();
    }

});



//---------------------------------------Eliminacion de usuarios-------------------------------------------------

function deleteU(code) {


    $.ajax({
        url: serviceU + code,
        type: "DELETE",
        dataType: 'JSON',
        contentType: 'application/json',
        success: function () {
            getUsers();
            alert("Usuario borrado de la BD");
        }
    });

}


//------------------------------------ Cerrar sesion ----------------------------------------------------------------$("#btnLogout").click(function() {

$("#btnLogout").click(function () {
    localStorage.clear();
    window.location.href = "../index.html";
});

//---------------------------------------------Inicio del documento -------------------------------

$(document).ready(function () {

    getUser();
    getUsers();

});