//------------------------Inicio de Sesion--------------------------------------------------------



function typeU(data) {

    $.ajax({
        url: serviceU + data.email + "/" + data.password,
        method: "GET",
        dataType: "json",
        success: function (response) {

            if (response.id == null)
                alert("Correo o contraseña incorrectos");

            else {

                alert("Bienvenido " + response.name);
                localStorage.setItem("idUser", response.id);
                console.log(response.type);

                switch (response.type) {

                    case 'ADM': //Los administradores pueden modificar la informacion de otros administradores
                        window.location.href = "/pages/users.html";
                        break;

                    case 'COORD':
                        window.location.href = "/pages/list.html";
                        break;
                        
                    case 'ASE':
                        window.location.href = "/pages/orders.html";
                        break;


                }
            }

        }
    });


}

$("#login").click(function () {

    switch (true) {

        case ($("#emailInicio").val() == "" || $.trim($("#contrasenaInicio").val()) == ""):

            alert("Por favor ingrese el correo y/o la contraseña");
            break;

        case isEmail($("#emailInicio").val()) == false:

            alert("La dirección de email es incorrecta.");
            break;

        case existEmail($("#emailInicio").val()) == false:

            alert("No existe un usuario asociado al correo");
            break;

        default:

            let data = {
                email: $("#emailInicio").val(),
                password: $("#contrasenaInicio").val(),
            };

            typeU(data);
    }

});