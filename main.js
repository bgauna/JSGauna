//Ingrese el sorteo que participará
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

//Construyo los sorteos y los agrego al array sorteosActivos
const sorteoBaudi = new Sorteos('baudi', 100, new Date('12/16/2022'), 300, null);
sorteoBaudi.enVenta = sorteoBaudi.abierto();
sorteosActivos.push(sorteoBaudi);

const sorteoFraterno = new Sorteos('fraterno', 100, new Date('11/01/2022'), 200, 12);
sorteoFraterno.enVenta = sorteoFraterno.abierto();
sorteosActivos.push(sorteoFraterno);

////////////console.log(sorteosActivos);

//Construyo la función para escojer el Sorteo
const escojaSorteo = () => {
    let participarSorteo, indice, repetir = false;
    participarSorteo = prompt(`¿De qué sorteo quiere participar?`);
    do {
        while (!participarSorteo || repetir === true) {
            participarSorteo = prompt(`No ingresaste un valor válido.\n\n¿De qué sorteo quiere participar?`);
            repetir = false;
        }
        participarSorteo = participarSorteo.toLowerCase();
        console.log(participarSorteo);
        indice = sorteosActivos.find(n => n.nombre === participarSorteo);
        if (indice == undefined) {
            repetir = true;
        } else {
            repetir = false;
        }
    } while (repetir);
    return participarSorteo;
}


let nombre, seguro='';
do{
    nombre=prompt(`Ingrese su nombre`);
    seguro = prompt(`Tu nombre es ${nombre}, ¿lo confirmás? Ingrese SI para continuar`)
    seguro = seguro.toLowerCase();
} while (seguro!=='si');

//llamo la función para escojer el sorteo

alert(`Por favor, ingrese baudi o fraterno para acceder al sorteo`);

const sorteoActual = escojaSorteo();
////////////console.log(sorteoActual);



//Voy a crear el array con todos los números, y sus atributos

const sorteoActualObjeto = sorteosActivos.filter(i => i.nombre === sorteoActual);
////////////console.log(sorteoActualObjeto);

//Inicialmente, voy a inventar un for para ir creando elementos dentro del array, y su estado de disponibilidad

class Bono {
    constructor(id) {
        this.id = id;
        this.reservado = false; //serán los que reserva el usuario en la sesión actual
        this.pagado = false; //serán los pagados con anterioridad
        this.comprador = null;
    }
}

const numeros = [];

const construirNumeros = (arrayDeNumeros, largo) => {
    for (let i = 0; i < largo; i++) {
        let bonocolaboracion = new Bono(i);
        arrayDeNumeros.push(bonocolaboracion);
    }
    ////////////console.log(arrayDeNumeros);

    //Voy a inventar un estado de disponibilidad, según una regla tonta: múltiplos de 3 pagados

    arrayDeNumeros.forEach(
        e => {
            if (e.id % 3 === 0) {
                e.pagado = true;
                e.reservado = true;
                e.comprador = `La Mona Jimenez`;
            }
        }
    );
    
    let grillaDeRifas=document.getElementById("grillaDeNumeros");
    arrayDeNumeros.forEach(
        e => {
            grillaDeRifas.innerHTML += `
            
            `
        }
    );

    ////////////console.log(arrayDeNumeros);
};

const elijaSusNumeros = (array) => {
    let arraylimpio = [];
    arraylimpio = array.filter(e => e.reservado === false)
    let textoArray='', numeroReservado, respuesta;
    for (let contador=0;contador<arraylimpio.length;contador++){
        textoArray += arraylimpio[contador].id;
        if(contador !== arraylimpio.length){
            textoArray += ', ';
        }
    }
    let textoCuadro = `Los números disponibles son \n` + textoArray;
    numeroReservado = parseInt(prompt(textoCuadro));
    while (isNaN(numeroReservado) || numeroReservado == undefined || !(numeroReservado>=0 && numeroReservado<sorteoActualObjeto[0].cantNumeros) || array[numeroReservado].reservado) {
        numeroReservado = parseInt(prompt(`Revise el valor ingresado \n\n` + textoCuadro));
    }
    array[numeroReservado].reservado = true;
    array[numeroReservado].comprador = nombre;
    totalNumeros = totalNumeros + 1;
    respuesta = prompt(`Desea escoger otro número? Ingrese SI o NO`)
    respuesta = respuesta.toLowerCase()
    while (!(respuesta==='si'||respuesta==='no')){
        respuesta = prompt(`Ingresó una opción incorrecta.\nDesea escoger otro número? Ingrese SI o NO`)
        respuesta = respuesta.toLowerCase()
    }
    if (respuesta === 'si') {
        elijaSusNumeros(array);
    } else if (respuesta === 'no') {
        return;
    }
}

let totalNumeros=0;
construirNumeros(numeros, sorteoActualObjeto[0].cantNumeros);

if (sorteoActualObjeto[0].enVenta) {
    alert(`Este sorteo se encuentra Abierto, pase a escojer sus números`);
    elijaSusNumeros(numeros);
    alert(`Ha escogido ${totalNumeros} números, por lo que debe abonar $${totalNumeros*sorteoActualObjeto[0].precio}.- Realice una transferencia por MP a bgauna.mp e informe al nro 3764580514.-`)
} else {
    alert(`Este sorteo se encuentra Cerrado, y el ganador ha sido el ${sorteoActualObjeto[0].ganador}`);
    idGanador = sorteoActualObjeto[0].ganador;
    if (numeros[idGanador].pagado) {
        alert(`El número ha sido vendido a ${numeros[idGanador].comprador}`);
    } else {
        alert(`El premio ha quedado vacante.`)
    }
}

alert(`Gracias por participar con nosotros.`)