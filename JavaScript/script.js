

// Obtener el formulario
const formulario = document.querySelector("#formularioEgresado");

// Verificar que exista el formulario
if (formulario) {

    // Campos del formulario
    const identificacion = document.getElementById("identificacion");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const fecha = document.getElementById("fecha");
    const trabajo = document.getElementById("trabajo");

    // Campo oculto para editar
    const indiceEditar = document.getElementById("indiceEditar");

    // Botón
    const btnGuardar = document.getElementById("btnGuardar");

    // Tabla
    const tabla = document.getElementById("tablaEgresados");

    // Lista de egresados
    let listaEgresados = [];

    // Leer Local Storage
    if (localStorage.getItem("egresados")) {

        listaEgresados = JSON.parse(localStorage.getItem("egresados"));

    }
    
    // MOSTRAR REGISTROS
    
    function mostrarEgresados() {

        tabla.innerHTML = "";

        listaEgresados.forEach(function (egresado, indice) {

            tabla.innerHTML += `
                <tr>

                    <td>${egresado.identificacion}</td>
                    <td>${egresado.nombre}</td>
                    <td>${egresado.correo}</td>
                    <td>${egresado.telefono}</td>
                    <td>${egresado.trabajo}</td>

                    <td>

                        <button onclick="editarEgresado(${indice})">
                            Editar
                        </button>

                        <button onclick="eliminarEgresado(${indice})">
                            Eliminar
                        </button>

                    </td>

                </tr>
            `;

        });

    }

    // Mostrar registros al abrir la página
    mostrarEgresados();

   
    // LIMPIAR FORMULARIO
    

    function limpiarFormulario() {

        formulario.reset();

        indiceEditar.value = "";

        btnGuardar.textContent = "Guardar Egresado";

    }

   
    // GUARDAR O ACTUALIZAR EGRESADO
   

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        // Expresiones regulares
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexTelefono = /^[0-9]{8}$/;
        const regexIdentificacion = /^[0-9]+$/;

        // Validar campos vacíos
        if (
            identificacion.value.trim() === "" ||
            nombre.value.trim() === "" ||
            correo.value.trim() === "" ||
            telefono.value.trim() === "" ||
            fecha.value === ""
        ) {

            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Todos los campos obligatorios deben completarse.",
                confirmButtonColor: "#003366"
            });

            return;
        }

        // Validar identificación
        if (!regexIdentificacion.test(identificacion.value)) {

            Swal.fire({
                icon: "error",
                title: "Identificación inválida",
                text: "La identificación solo puede contener números.",
                confirmButtonColor: "#003366"
            });

            return;
        }

        // Validar correo
        if (!regexCorreo.test(correo.value)) {

            Swal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "Ingrese un correo electrónico válido.",
                confirmButtonColor: "#003366"
            });

            return;
        }

        // Validar teléfono
        if (!regexTelefono.test(telefono.value)) {

            Swal.fire({
                icon: "error",
                title: "Teléfono inválido",
                text: "El teléfono debe contener exactamente 8 números.",
                confirmButtonColor: "#003366"
            });

            return;
        }

        // Crear objeto
        const egresado = {

            identificacion: identificacion.value.trim(),
            nombre: nombre.value.trim(),
            correo: correo.value.trim(),
            telefono: telefono.value.trim(),
            fecha: fecha.value,
            trabajo: trabajo.value.trim()

        };

        
        // ACTUALIZAR O GUARDAR REGISTRO
        if (indiceEditar.value !== "") {

            listaEgresados[indiceEditar.value] = egresado;

            Swal.fire({
                icon: "success",
                title: "Registro actualizado",
                text: "Los datos del egresado fueron actualizados correctamente.",
                confirmButtonColor: "#003366"
            });

        } else {

            // Guardar nuevo registro
            listaEgresados.push(egresado);

            Swal.fire({
                icon: "success",
                title: "Registro exitoso",
                text: "El egresado fue registrado correctamente.",
                confirmButtonColor: "#003366"
            });

        }

        // Guardar en Local Storage
        localStorage.setItem(
            "egresados",
            JSON.stringify(listaEgresados)
        );

        // Mostrar registros
        mostrarEgresados();

        // Limpiar formulario
        limpiarFormulario();

    });

    
    // EDITAR REGISTRO
    window.editarEgresado = function (indice) {

        const egresado = listaEgresados[indice];

        identificacion.value = egresado.identificacion;
        nombre.value = egresado.nombre;
        correo.value = egresado.correo;
        telefono.value = egresado.telefono;
        fecha.value = egresado.fecha;
        trabajo.value = egresado.trabajo;

        indiceEditar.value = indice;

        btnGuardar.textContent = "Actualizar Egresado";

    };  

    
    // ELIMINAR REGISTRO
    window.eliminarEgresado = function (indice) {

        Swal.fire({

            title: "¿Está seguro?",
            text: "El registro será eliminado permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#003366",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"

        }).then((result) => {

            if (result.isConfirmed) {

                // Eliminar del arreglo
                listaEgresados.splice(indice, 1);

                // Actualizar Local Storage
                localStorage.setItem(
                    "egresados",
                    JSON.stringify(listaEgresados)
                );

                // Actualizar tabla
                mostrarEgresados();

                // Limpiar formulario
                limpiarFormulario();

                Swal.fire({

                    icon: "success",
                    title: "Registro eliminado",
                    text: "El egresado fue eliminado correctamente.",
                    confirmButtonColor: "#003366"

                });

            }

        });

    };

}