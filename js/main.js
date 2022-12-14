///////  Elementos del DOM
const ganadores=document.getElementById('ganadores');

const datosInicio = document.getElementById('datos'); // este es el div donde se cargan los datos
const nombre = document.getElementById('nombre');
const wapp = document.getElementById('wapp');
const email = document.getElementById('email');
const btnNombre = document.getElementById('btnNombre');

const nombreGuardado = document.getElementById('nombreGuardado');
const modificarNombre = document.getElementById('modificarNombre');

const rifas = document.getElementById('rifas');
const btnRifa = document.getElementById('btnRifa');

const referencias = document.getElementById('referencias');

const grillaDeRifas = document.getElementById("grillaDeNumeros");

const aComprar = document.getElementById('aComprar');
const cajaReserva = document.getElementById('cajaReserva');
const reservar = document.getElementById('reservar');

const compraFinalizada = document.getElementById('compraFinalizada');

const { DateTime } = luxon;

//Clase Constructora de los Sorteos
class Sorteos {
    constructor(nombre, cantNumeros, fechaSorteo, precio, ganador) {
        this.nombre = nombre;
        this.cantNumeros = cantNumeros;
        this.fechaSorteo = fechaSorteo;
        this.precio = precio;
        this.ganador = ganador;
    }
    abierto() {
        if (new Date() < this.fechaSorteo) {
            return true;
        } else {
            return false;
        }
    }
}

// Clase constructora de bonos individuales
class Bono {
    constructor(id) {
        this.id = id;
        this.reservado = false; //serán los que reserva el usuario en la sesión actual
        this.pagado = false; //serán los pagados con anterioridad
        this.comprador = null;
    }
}

//Inicializo todos los arrays que necesito

const sorteosActivos = [];
const rifasCompradas = [];
const disponibles = [];
const numeros = [];
let ganadoresAnteriores = [];

//Inicializo los Objetos que necesito
const usuario = {};
const sorteoActualObjeto = {};
const ganadorObjeto = {};

//Inicializo las variables que necesito

let sorteoActual = 0; ////Índice del Sorteo Actual, toma índice numero
let totalNumeros = 0;



//Construyo los sorteos y los agrego al array sorteosActivos

const sorteoSeleccione = new Sorteos('Seleccione Sorteo', 10, DateTime.local(2022, 12, 01).toLocaleString(), 10, 2);
sorteoSeleccione.enVenta = sorteoSeleccione.abierto();
sorteosActivos.push(sorteoSeleccione);

const sorteoBaudi = new Sorteos('Bono Colaboración Baudizzone', 100, DateTime.local(2022, 12, 16).toLocaleString(), 300, null);
sorteoBaudi.enVenta = sorteoBaudi.abierto();
sorteosActivos.push(sorteoBaudi);

const sorteoTercer = new Sorteos('El Gordo de Navidad', 150, DateTime.local(2022, 12, 25).toLocaleString(), 1000, null);
sorteoTercer.enVenta = sorteoTercer.abierto();
sorteosActivos.push(sorteoTercer);


//Inicializo las funciones que necesito

//Función para borrar líneas de nombre si no hay guardado nada
const construirDatosInicio = () => {
    nombreGuardado.innerText = ``;
    modificarNombre.innerHTML = ``;
}

//Conexión con archivo JSON para recuperar los ganadores de premios anteriores

const mostrarGanadoresAnteriores = () => {
    ganadores.innerHTML = `<h3>¿Querés saber si ganaste? Revisemos ganadores de Sorteos Anteriores:</h3>`;
    console.log(ganadoresAnteriores.length);
    ganadoresAnteriores.forEach( i => {
        ganadores.innerHTML += `<p>${i.fechaSorteo} - ${i.nombre} <i class="fa-solid fa-angles-right"></i> Ganador: ${i.ganador}</p>`;
    }
    )
}


const sorteosCerrados = async () => {
    const datos = await fetch('./json/sorteoscerrados.json')
    const ganadoresAnt = await datos.json();
    console.log(ganadoresAnt);
    return ganadoresAnt;
}
//{nombre, cantNumeros, fechaSorteo, precio, ganador}
sorteosCerrados().then( g => {
    console.log("acá reviso g",g);
    //let unaVariable = g;
    ganadoresAnteriores=ganadoresAnteriores.concat(g);
    console.log("acá estoy revisando el async",ganadoresAnteriores);
    mostrarGanadoresAnteriores();
}
)







//Función para que enliste en el Select los sorteos
const construirSorteos = () => {
    let primerElemento = true;
    sorteosActivos.forEach(e => {
        const optionSorteo = document.createElement('option');
        if (primerElemento) { optionSorteo.innerText = `${e.nombre}`; primerElemento = false; } else {
            optionSorteo.innerText = `${e.nombre} : sortea el ${e.fechaSorteo}`
        }
        rifas.append(optionSorteo);
    });
}

//llamo a la función de construcción de sorteos
construirSorteos();

//Función para revisar si hay un nombre guardado
const nombreStorage = () => {
    const userJSON = JSON.parse(localStorage.getItem('user'));
    console.log(userJSON);
    usuario.nombre = userJSON ? userJSON.nombre : null;
    usuario.wapp = userJSON ? userJSON.wapp : null;
    usuario.email = userJSON ? userJSON.email : null;
    nombreGuardado.innerText = usuario.nombre ? `Sus números se comprarán a nombre de ${usuario.nombre}` : ``;
    modificarNombre.innerHTML = usuario.nombre ? `<button style="font-size: 10px;">Modificar Nombre</button>` : `<button class="ocultar" style="font-size: 10px;">Modificar Nombre</button>`;
}

//Esta función actualiza el DIV con el total a Pagar
const actualizarPagar = () => {
    aComprar.innerHTML = ``;
    cajaReserva.innerHTML = ``;
    reservar.innerText = ``;
    if (rifasCompradas.length > 0 && usuario.nombre) {
        let N = rifasCompradas.length;
        aComprar.innerHTML += `<p>${usuario.nombre}, has elegido ${N} números.</p><p>Los números elegidos son: ${rifasCompradas.join(', ')}.</p><p>El total de la compra es $${N * sorteoActualObjeto.precio}.</p><p>Si hace click en el botón, va a reservar los números por 24hs.\nPara finalizar su compra, debe transferir el dinero al alias bgauna.mp</p><p>¡Gracias por confiar en nuestros servicios y apoyar a las ONG que trabajan con nosotros!</p>`;
        reservar.innerText += `Reservar los ${N} números y avanzar a la plataforma de pagos ($${N * sorteoActualObjeto.precio})`;
        cajaReserva.innerHTML = `Si está todo OK, dale click en Reservar. <i class="fa-solid fa-arrow-right fa-2x"></i>`;
    }
}

//Reviso si hay un nombre guardado
nombreStorage();



//Función para guardar un nombre
const guardaNombre = () => {
    console.log(`entró a guarda nombre`);
    usuario.nombre = nombre.value;
    usuario.wapp = wapp.value;
    usuario.email = email.value;
    localStorage.setItem('user', JSON.stringify(usuario));
    console.log(usuario.nombre, usuario.wapp, usuario.email, localStorage.getItem('user'));
    (usuario.nombre && usuario.wapp && usuario.email)
        ? (
            nombreGuardado.innerText = `Sus números se comprarán a nombre de ${usuario.nombre}`,
            modificarNombre.innerHTML = `<button style="font-size: 10px;">Modificar Nombre</button>`,
            Toastify({
                text: 'Nombre Actualizado',
                style: {
                    background: "linear-gradient(to right, tomato, black)",
                },
            }).showToast()
        )
        : (construirDatosInicio(), Toastify({
            text: 'Algún dato es erróneo, revise',
            style: {
                background: "linear-gradient(to right, tomato, black)",
            },
        }).showToast());
    actualizarPagar();
}


//Función para armar las grillas de números, empieza borrando la información anterior
const construirNumeros = () => {
    if (numeros.length !== 0) {
        const longFor = numeros.length;
        for (let i = 0; i < longFor; i++) {
            numeros.pop();
        }
    }
    if (disponibles.length !== 0) {
        const longFor = disponibles.length;
        for (let i = 0; i < longFor; i++) {
            disponibles.pop();
        }
    }
    if (rifasCompradas.length !== 0) {
        const longFor = rifasCompradas.length;
        for (let i = 0; i < longFor; i++) {
            rifasCompradas.pop();
        }
    }
    for (let i = 0; i < sorteoActualObjeto.cantNumeros; i++) {
        const bonocolaboracion = new Bono(i);
        numeros.push(bonocolaboracion);
    }
    //Voy a inventar un estado de disponibilidad, según una regla tonta: múltiplos de 3 pagados
    numeros.forEach(
        e => {
            if (e.id % 3 === 0) {
                e.pagado = true;
                e.reservado = true;
                e.comprador = `La Mona Jimenez`;
            }
        }
    );
    grillaDeRifas.innerHTML = ``;
    if (sorteoActual !== 0) {
        numeros.forEach(
            e => {
                if (e.pagado && e.reservado) {
                    grillaDeRifas.innerHTML += `<div id="n${e.id}"> <div class="estiloDeNumero pagado d-flex align-items-center justify-content-center">
                <p>${e.id}</p>
                </div></div>`;
                    const estado = false;
                    disponibles.push(estado);
                } else if (e.reservado && !e.pagado) {
                    grillaDeRifas.innerHTML += `<div id="n${e.id}"> <div class="estiloDeNumero reservado d-flex align-items-center justify-content-center">
                <p>${e.id}</p>
                </div></div>`;
                    const estado = false;
                    disponibles.push(estado);
                } else {
                    grillaDeRifas.innerHTML += `<div id="n${e.id}"> <div class="estiloDeNumero disponible d-flex align-items-center justify-content-center">
                <p>${e.id}</p>
                </div></div>`;
                    const estado = true;
                    disponibles.push(estado);
                }
            }
        );
        Toastify({
            text: '¡Talonario cargado!',
        }).showToast();
    } else {
        grillaDeRifas.innerHTML += `<div id="sinNumeros" class="d-flex align-items-center justify-content-center">
                <p>Seleccione un Sorteo y haga click en Cargar Números</p>
                </div>`
    }
    actualizarPagar();
};

//Inicializo la función para escojer el Sorteo
const guardaRifa = () => {
    sorteoActual = rifas.selectedIndex;
    if (sorteoActual !== 0) {
        sorteoActualObjeto.cantNumeros = sorteosActivos[sorteoActual].cantNumeros;
        sorteoActualObjeto.enVenta = sorteosActivos[sorteoActual].enVenta;
        sorteoActualObjeto.fechaSorteo = sorteosActivos[sorteoActual].fechaSorteo;
        sorteoActualObjeto.ganador = sorteosActivos[sorteoActual].ganador;
        sorteoActualObjeto.nombre = sorteosActivos[sorteoActual].nombre;
        sorteoActualObjeto.precio = sorteosActivos[sorteoActual].precio;
    } else {
        sorteoActualObjeto.cantNumeros = sorteoSeleccione.cantNumeros;
        sorteoActualObjeto.enVenta = sorteoSeleccione.enVenta;
        sorteoActualObjeto.fechaSorteo = sorteoSeleccione.fechaSorteo;
        sorteoActualObjeto.ganador = sorteoSeleccione.ganador;
        sorteoActualObjeto.nombre = sorteoSeleccione.nombre;
        sorteoActualObjeto.precio = sorteoSeleccione.precio;
    }

    console.log(sorteoActualObjeto);
    construirNumeros();
}

construirNumeros();


/////////// EVENTOS

btnNombre.onclick = guardaNombre;
nombre.onkeydown = (evento) => {
    if (evento.key === 'Enter' && wapp.value && email.value) {
        guardaNombre();
    }
}

wapp.onkeydown = (evento) => {
    if (evento.key === 'Enter' && nombre.value && email.value) {
        guardaNombre();
    }
}

email.onkeydown = (evento) => {
    if (evento.key === 'Enter' && wapp.value && nombre.value) {
        guardaNombre();
    }
}

modificarNombre.onclick = construirDatosInicio;

btnRifa.onclick = guardaRifa;

grillaDeRifas.onclick = (evento) => {
    let indice = -4;
    console.log(evento, evento.target.innerText, evento.target.innerText.length);
    let seleccionado = parseInt(evento.target.innerText);
    if (evento.target.innerText.length > 4) { seleccionado = null; }
    indice = rifasCompradas.indexOf(seleccionado); //si este valor es -1, debo SELECCIONAR, sino DESELECC
    console.log(seleccionado, indice, rifasCompradas.indexOf(seleccionado));
    if (disponibles[seleccionado] && indice >= 0) {
        rifasCompradas.splice(indice, 1);    //SACAR el elemento de los comprados, DESELECCIONARLO
        const numeroSeleccionado = document.getElementById(`n${seleccionado}`)
        numeroSeleccionado.innerHTML = `<div class="estiloDeNumero disponible d-flex align-items-center justify-content-center">
                <p>${seleccionado}</p>
                </div></div>`;
        Toastify({
            text: `Se ha quitado el número ${seleccionado} de la lista`,
            style: {
                background: "linear-gradient(to right, red, orange)",
            },
        }).showToast();
    } else if (disponibles[seleccionado] && seleccionado !== null) {
        rifasCompradas.push(seleccionado);    //AGREGAR el elemento a los comprador, seleccionarlo
        const numeroSeleccionado = document.getElementById(`n${seleccionado}`)
        numeroSeleccionado.innerHTML = `<div class="estiloDeNumero seleccionado d-flex align-items-center justify-content-center">
                <p>${seleccionado}</p>
                </div></div>`;
        Toastify({
            text: `Se ha añadido el número ${seleccionado} de la lista`,
            style: {
                background: "linear-gradient(to right, green, greenyellow)",
            },
        }).showToast();
    }
    console.log(rifasCompradas);
    actualizarPagar();
}

reservar.onclick = () => {
    rifasCompradas.forEach((i) => {
        numeros.forEach((j) => {
            if (i === j.id) {
                j.reservado=true;
                disponibles[i]=false;
            }
        })
    });
    grillaDeRifas.innerHTML = ``;
    numeros.forEach(
        e => {
            if (e.pagado && e.reservado) {
                grillaDeRifas.innerHTML += `<div id="n${e.id}"> <div class="estiloDeNumero pagado d-flex align-items-center justify-content-center">
                <p>${e.id}</p>
                </div></div>`;
            } else if (e.reservado && !e.pagado) {
                grillaDeRifas.innerHTML += `<div id="n${e.id}"> <div class="estiloDeNumero reservado d-flex align-items-center justify-content-center">
                <p>${e.id}</p>
                </div></div>`;
            } else {
                grillaDeRifas.innerHTML += `<div id="n${e.id}"> <div class="estiloDeNumero circuloBlanco d-flex align-items-center justify-content-center">
                <p>${e.id}</p>
                </div></div>`;
                const estado = true;
                disponibles.push(estado);
            }
        }
    );
    Toastify({
        text: '¡Sus números han sido reservados!',
        style: {
            background: "linear-gradient(to right, orange, blue)",
        },
    }).showToast();
    grillaDeRifas.onclick = () => {};
    reservar.innerText =`Reservado`;
    compraFinalizada.innerHTML=`
    <h4 class="centrarTexto">Muchas gracias ${usuario.nombre} por estar colaborando con ${sorteoActualObjeto.nombre}. </h4>
        <p class="centrarTexto">El beneficiario ya recibió un mail con la compra, así que se estará comunicando con vos para comentarte si ganaste.</p>
        <p class="centrarTexto">¡Gracias por tu solidaridad!</p>
    `
}