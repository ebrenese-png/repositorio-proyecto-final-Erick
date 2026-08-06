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
    const puesto = document.getElementById("puesto");

    // Campo oculto para editar
    const indiceEditar = document.getElementById("indiceEditar");

    // Botón
    const btnGuardar = document.getElementById("btnGuardar");

    // Tabla
    const tabla = document.getElementById("tablaEgresados");

    // Lista
    let listaEgresados = [];

    // ============================
    // GET
    // ============================
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

    // ============================
    // MOSTRAR TABLA
    // ============================
    function mostrarEgresados() {

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

    // Cargar registros al abrir
    obtenerEgresados();

    // ============================
    // LIMPIAR FORMULARIO
    // ============================
    function limpiarFormulario() {

        formulario.reset();

        indiceEditar.value = "";

        btnGuardar.textContent = "Guardar Egresado";

    }

    // ============================
    // GUARDAR / ACTUALIZAR
    // ============================
    formulario.addEventListener("submit", async function (event) {

        event.preventDefault();

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexTelefono = /^[0-9]{8}$/;
        const regexIdentificacion = /^[0-9]+$/;

        // Validar campos

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
                text: "Ingrese un correo válido.",
                confirmButtonColor: "#003366"
            });

            return;

        }

        if (!regexTelefono.test(telefono.value)) {

            Swal.fire({
                icon: "error",
                title: "Teléfono inválido",
                text: "Debe contener exactamente 8 números.",
                confirmButtonColor: "#003366"
            });

            return;

        }

        // Objeto para el backend

        const egresado = {

            identificacion: identificacion.value.trim(),

            nombreCompleto: nombre.value.trim(),

            correoElectronico: correo.value.trim(),

            telefono: telefono.value.trim(),

            fechaRegistro: fecha.value,

            lugaresTrabajo: [
            {
            empresa: trabajo.value.trim(),
            puesto: puesto.value.trim(),
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

        // ¿Estamos editando?
        const editando = indiceEditar.value !== "";

        // Si editamos, usamos el _id que guardamos al hacer click en "Editar"
        const url = editando
            ? `http://localhost:3000/egresados/${indiceEditar.value}`
            : "http://localhost:3000/egresados";

        const metodo = editando ? "PUT" : "POST";

        try {

            const respuesta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(egresado)
            });

            const datos = await respuesta.json();

            console.log(datos);

            if (!respuesta.ok) {

                throw new Error(datos.message || "Error al guardar");

            }

            Swal.fire({

                icon: "success",

                title: editando ? "Actualización exitosa" : "Registro exitoso",

                text: editando
                    ? "El egresado fue actualizado correctamente."
                    : "El egresado fue registrado correctamente.",

                confirmButtonColor: "#003366"

            });

            limpiarFormulario();

            obtenerEgresados();

        } catch (error) {

            console.error("Error al guardar el egresado", error);

            if (error.response) {
                console.log(error.response);
            }

            Swal.fire({

                icon: "error",

                title: "Error",

                text: editando
                    ? "No fue posible actualizar el egresado."
                    : "No fue posible guardar el egresado.",

                confirmButtonColor: "#003366"

            });

        }

    });

    // ============================
    // EDITAR
    // ============================
    window.editarEgresado = function (indice) {

        // Aquí está la corrección de alcance:
        // "egresado" se obtiene aquí mismo, dentro de esta función,
        // a partir de listaEgresados (que sí es accesible por closure).
        const egresado = listaEgresados[indice];

        if (!egresado) {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se encontró el egresado a editar.",
                confirmButtonColor: "#003366"
            });

            return;

        }

        // Rellenar el formulario con los datos del egresado
        identificacion.value = egresado.identificacion;
        nombre.value = egresado.nombreCompleto;
        correo.value = egresado.correoElectronico;
        telefono.value = egresado.telefono;
        fecha.value = egresado.fechaRegistro ? egresado.fechaRegistro.substring(0, 10) : "";
        trabajo.value = egresado.empresaActual;

        // Guardamos el identificador real del registro (ajusta si tu backend usa _id)
        indiceEditar.value = egresado._id || egresado.identificacion;

        btnGuardar.textContent = "Actualizar Egresado";

        // Llevar al usuario al formulario
        formulario.scrollIntoView({ behavior: "smooth" });

    };

    // ============================
    // ELIMINAR
    // ============================
    window.eliminarEgresado = function (indice) {

        // Igual que en editarEgresado: "egresado" se obtiene aquí mismo.
        const egresado = listaEgresados[indice];

        if (!egresado) {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se encontró el egresado a eliminar.",
                confirmButtonColor: "#003366"
            });

            return;

        }

        Swal.fire({

            icon: "warning",
            title: "¿Eliminar egresado?",
            text: `Esta acción eliminará a ${egresado.nombreCompleto}.`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#003366"

        }).then(async function (resultado) {

            if (!resultado.isConfirmed) {
                return;
            }

            try {

                const id = egresado._id || egresado.identificacion;

                const respuesta = await fetch(`http://localhost:3000/egresados/${id}`, {
                    method: "DELETE"
                });

                if (!respuesta.ok) {
                    throw new Error("No se pudo eliminar el egresado.");
                }

                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "El egresado fue eliminado correctamente.",
                    confirmButtonColor: "#003366"
                });

                obtenerEgresados();

            } catch (error) {

                console.error("Error al eliminar el egresado", error);

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No fue posible eliminar el egresado.",
                    confirmButtonColor: "#003366"
                });

            }

        });

    };

}