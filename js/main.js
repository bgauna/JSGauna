///////  Elementos del DOM

const nombre = document.getElementById('nombre');
const btnNombre = document.getElementById('btnNombre');
const nombreGuardado = document.getElementById('nombreGuardado');

const rifas = document.getElementById('rifas');
const btnRifa = document.getElementById('btnRifa');

const grillaDeRifas = document.getElementById("grillaDeNumeros");

const aComprar = document.getElementById('aComprar');



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

//Inicializo los Objetos que necesito
const usuario = {};
const sorteoActualObjeto = {};

//Inicializo las variables que necesito

let sorteoActual = 0; ////Índice del Sorteo Actual, toma índice numero
let totalNumeros = 0;


//Construyo los sorteos y los agrego al array sorteosActivos

const sorteoSeleccione = new Sorteos('Seleccione Sorteo', 10, new Date('11/01/2022'), 10, 2);
sorteoSeleccione.enVenta = sorteoSeleccione.abierto();
sorteosActivos.push(sorteoSeleccione);

const sorteoBaudi = new Sorteos('baudi', 100, new Date('12/16/2022'), 300, null);
sorteoBaudi.enVenta = sorteoBaudi.abierto();
sorteosActivos.push(sorteoBaudi);

const sorteoTercer = new Sorteos('tercer', 25, new Date('12/25/2022'), 100, null);
sorteoTercer.enVenta = sorteoTercer.abierto();
sorteosActivos.push(sorteoTercer);


//Inicializo las funciones que necesito

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
    usuario.nombre = userJSON ? userJSON.nombre : null;
    nombreGuardado.innerText = `Sus números se comprarán a nombre de ${usuario.nombre}`;
}

//Esta función actualiza el DIV con el total a Pagar
const actualizarPagar = () => {
    aComprar.innerHTML = ``;
    if (rifasCompradas.length > 0 && usuario.nombre) {
        let N = rifasCompradas.length;
        aComprar.innerHTML += `<p>${usuario.nombre}, has elegido ${N} números.</p><p>Los números elegidos son: ${rifasCompradas.join(', ')}.</p><p>El total de la compra es $${N * sorteoActualObjeto.precio}.</p><p>Si hace click en el botón, va a reservar los números por 24hs.\nPara finalizar su compra, debe transferir el dinero al alias bgauna.mp</p><p>¡Gracias por confiar en nuestros servicios y apoyar a las ONG que trabajan con nosotros!</p>`;
        aComprar.innerHTML += `<button id="btnPago">Reservar los ${N} números y avanzar a la plataforma de pagos ($${N * sorteoActualObjeto.precio})</button>`;
    }
}

//Reviso si hay un nombre guardado
nombreStorage();

//Función para guardar un nombre
const guardaNombre = () => {
    usuario.nombre = nombre.value;
    localStorage.setItem('user', JSON.stringify(usuario));
    console.log(usuario.nombre, localStorage.getItem('user'));
    nombreGuardado.innerText = `Sus números se comprarán a nombre de ${usuario.nombre}`;
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
    if (evento.key === 'Enter') {
        guardaNombre();
    }
}

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
    } else if (disponibles[seleccionado] && seleccionado !== null) {
        rifasCompradas.push(seleccionado);    //AGREGAR el elemento a los comprador, seleccionarlo
        const numeroSeleccionado = document.getElementById(`n${seleccionado}`)
        numeroSeleccionado.innerHTML = `<div class="estiloDeNumero seleccionado d-flex align-items-center justify-content-center">
                <p>${seleccionado}</p>
                </div></div>`;
    }
    console.log(rifasCompradas);
    actualizarPagar();
}