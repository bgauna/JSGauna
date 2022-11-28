///////  DOM DOM DOM

const nombre = document.getElementById('nombre');
const btnNombre = document.getElementById('btnNombre');
const nombreGuardado = document.getElementById('nombreGuardado');

const rifas = document.getElementById('rifas');
const btnRifa = document.getElementById('btnRifa');

const grillaDeRifas = document.getElementById("grillaDeNumeros");


//Ingrese el sorteo que participará
let sorteoActual = 0; //puede tomar índice numero
const sorteosActivos = [];

//Creo la clase Sorteos, así construyo los objetos, revisar el método abierto, porque no usé la clase Date
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

class Bono {
    constructor(id) {
        this.id = id;
        this.reservado = false; //serán los que reserva el usuario en la sesión actual
        this.pagado = false; //serán los pagados con anterioridad
        this.comprador = null;
    }
}



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

console.log(sorteosActivos);



const construirSorteos = () => {
    let primerElemento = true;
    sorteosActivos.forEach(e => {
        const optionSorteo = document.createElement('option');
        if (primerElemento) { optionSorteo.innerText = `${e.nombre}`; primerElemento = false; } else {
            optionSorteo.innerText = `${e.nombre} : sortea el ${e.fechaSorteo}`
        }
        rifas.append(optionSorteo);
        //console.log(sorteosActivos);
    });
}

construirSorteos();
//console.log(sorteosActivos);


//Construto el objeto Usuario  >>>>>> NO FUNCA EL STORAGE
const usuario = {};
let usuari; ////////REVISAR

const guardaNombre = () => {
    usuario.nombre = nombre.value;
    localStorage.setItem('user',JSON.stringify(usuario)); /////// REVISAR
    console.log(usuario.nombre,localStorage.getItem('user'));
}

/* usuari = JSON.parse(localStorage.getItem('user'));
if(usuario.nombre){
    nombreGuardado.innerText=`Estás comprando tus números como ${usuario.nombre}`;
} else {
    nombreGuardado.innerText=``;
} */

const disponibles=[];

const construirNumeros = () => {
    console.log(numeros.length);
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
    //console.log(sorteosActivos);
    for (let i = 0; i < sorteoActualObjeto.cantNumeros; i++) {
        const bonocolaboracion = new Bono(i);
        numeros.push(bonocolaboracion);
    }
    ////////////console.log(arrayDeNumeros);
    //Voy a inventar un estado de disponibilidad, según una regla tonta: múltiplos de 3 pagados
    numeros.forEach(
        e => {
            if (e.id % 3 !== 0) {
                e.pagado = true;
                e.reservado = true;
                e.comprador = `La Mona Jimenez`;
            }
        }
    );
    grillaDeRifas.innerHTML = ``;
    if(sorteoActual!==0){
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
    console.log(disponibles);
    } else {
        grillaDeRifas.innerHTML += `<div id="sinNumeros" class="d-flex align-items-center justify-content-center">
                <p>Seleccione un Sorteo y haga click en Cargar Números</p>
                </div>`
    }
    //console.log(sorteosActivos);
    ////////////console.log(arrayDeNumeros);
};

//Construyo la función para escojer el Sorteo
const guardaRifa = () => {
    //console.log(sorteosActivos);
    sorteoActual = rifas.selectedIndex;
    //console.log(sorteoActual, sorteosActivos, sorteosActivos[sorteoActual]);
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



//llamo la función para escojer el sorteo

//alert(`Por favor, ingrese baudi o fraterno para acceder al sorteo`);


console.log(sorteoActual);

//Voy a crear el array con todos los números, y sus atributos
const sorteoActualObjeto = sorteosActivos[sorteoActual]; //OK, no borrar
//console.log(sorteosActivos);
console.log(sorteoActualObjeto);

//Inicialmente, voy a inventar un for para ir creando elementos dentro del array, y su estado de disponibilidad



const numeros = [];

let totalNumeros = 0;
construirNumeros();

const rifasCompradas=[];

/////////// EVENTOS

btnNombre.onclick = guardaNombre;
nombre.onkeydown = (evento) => {
    if (evento.key === 'Enter') {
        guardaNombre();
    }
}

btnRifa.onclick = guardaRifa;

grillaDeRifas.onclick = (evento) => {
    let indice=-4;
    console.log(evento, evento.target.innerText, evento.target.innerText.length);
    let seleccionado = parseInt(evento.target.innerText);
    if(evento.target.innerText.length>4) {seleccionado = null;}
    indice=rifasCompradas.indexOf(seleccionado); //si este valor es -1, debo SELECCIONAR, sino DESELECC
    console.log(seleccionado, indice,rifasCompradas.indexOf(seleccionado));
    if(indice>=0){
        rifasCompradas.splice(indice,1);    //SACAR el elemento de los comprados, DESELECCIONARLO

    } else if (seleccionado!==null) {
        rifasCompradas.push(seleccionado);    //AGREGAR el elemento a los comprador, seleccionarlo
        
    }
    console.log(rifasCompradas);
}


/* grillaDeRifas.innerHTML = `<div class="estiloDeNumero disponible d-flex align-items-center justify-content-center">
                <p>${e.id}</p>
                </div></div>`;
                const estado = true;
                disponibles.push(estado); */


