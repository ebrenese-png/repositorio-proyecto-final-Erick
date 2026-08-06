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

    // Obtener egresados desde la API
async function obtenerEgresados() {

    try {

        const respuesta = await fetch("http://localhost:3000/egresados");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los egresados.");
        }

        listaEgresados = await respuesta.json();

        mostrarEgresados();

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los egresados.",
            confirmButtonColor: "#003366"
        });

    }

}

    // obtener registro 
    function obtenerEgresados() {

        tabla.innerHTML = "";

        listaEgresados.forEach(function (egresado, indice) {

            tabla.innerHTML += `
                <tr>
                    <td>${egresado.identificacion}</td>
                    <td>${egresado.nombreCompleto}</td>
                    <td>${egresado.correoElectronico}</td>
                    <td>${egresado.telefono}</td>
                    <td>${egresado.empresaActual}</td>

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

    obtenerEgresados();

    // Limpiar formulario
    function limpiarFormulario() {

        formulario.reset();

        indiceEditar.value = "";

        btnGuardar.textContent = "Guardar Egresado";

    }

    // Evento del formulario
    formulario.addEventListener("submit", async function (event) {

        event.preventDefault();

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexTelefono = /^[0-9]{8}$/;
        const regexIdentificacion = /^[0-9]+$/;

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

        if (!regexIdentificacion.test(identificacion.value)) {

            Swal.fire({
                icon: "error",
                title: "Identificación inválida",
                text: "La identificación solo puede contener números.",
                confirmButtonColor: "#003366"
            });

            return;

        }

        if (!regexCorreo.test(correo.value)) {

            Swal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "Ingrese un correo electrónico válido.",
                confirmButtonColor: "#003366"
            });

            return;

        }

        if (!regexTelefono.test(telefono.value)) {

            Swal.fire({
                icon: "error",
                title: "Teléfono inválido",
                text: "El teléfono debe contener exactamente 8 números.",
                confirmButtonColor: "#003366"
            });

            return;

        }

        // Objeto que espera el backend
        const egresado = {

            identificacion: identificacion.value.trim(),

            nombreCompleto: nombre.value.trim(),

            correoElectronico: correo.value.trim(),

            telefono: telefono.value.trim(),

            fechaRegistro: fecha.value,

            lugaresTrabajo: [

                {
                    empresa: trabajo.value.trim(),
                    puesto: "",
                    fechaInicio: fecha.value,
                    fechaFin: null,
                    descripcion: ""
                }

            ],

            empresaActual: trabajo.value.trim(),

            puestoActual: "",

            areaProfesional: "",

            linkedin: "",

            portafolio: ""

        };

        if (indiceEditar.value !== "") {

            Swal.fire({
                icon: "info",
                title: "Edición",
                text: "La edición se implementará más adelante.",
                confirmButtonColor: "#003366"
            });

        } else {

            try {

                const respuesta = await fetch("http://localhost:3000/egresados", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(egresado)

                });

                if (!respuesta.ok) {
                    throw new Error("No se pudo guardar el egresado.");
                }

                Swal.fire({
                    icon: "success",
                    title: "Registro exitoso",
                    text: "El egresado fue registrado correctamente.",
                    confirmButtonColor: "#003366"
                });

                limpiarFormulario();

                obtenerEgresados();

                // Más adelante llamaremos aquí al GET
                // obtenerEgresados();

            } catch (error) {

                console.error(error);

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un problema al guardar el egresado."
                });

            }

        }

    });

}

