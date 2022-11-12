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
        if (new Date()<this.fechaSorteo) {
            return true;
        } else {
            return false;
        }
    }
}

//Construyo los sorteos y los agrego al array sorteosActivos
const sorteoBaudi = new Sorteos('baudi', 100, new Date('12/16/2022'), 300, null);
sorteoBaudi.enVenta=sorteoBaudi.abierto();
sorteosActivos.push(sorteoBaudi);

const sorteoFraterno = new Sorteos('fraterno', 100, new Date('11/01/2022'),200, 11);
sorteoFraterno.enVenta=sorteoFraterno.abierto();
sorteosActivos.push(sorteoFraterno);

console.log(sorteosActivos);

//Construyo la función para escojer el Sorteo
const escojaSorteo = () => {
    let participarSorteo, indice, repetir = false;
    participarSorteo = prompt(`¿De qué sorteo quiere participar?`);
    do {
        while (!participarSorteo || repetir === true) {
            participarSorteo = prompt(`No ingresaste un valor válido.\n\n¿De qué sorteo quiere participar?`);
            repetir = false;
        }
        participarSorteo=participarSorteo.toLowerCase();
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

//llamo la función para escojer el sorteo

alert(`Por favor, ingrese baudi o fraterno para acceder al sorteo`);

const sorteoActual = escojaSorteo();
console.log(sorteoActual);

//Voy a crear el array con todos los números, y sus atributos

const sorteoActualObjeto=sorteosActivos.filter(i=>i.nombre===sorteoActual);
console.log(sorteoActualObjeto);

//Inicialmente, voy a inventar un for para ir creando elementos dentro del array, y su estado de disponibilidad

class Bono {
    constructor (id){
        this.id=id;
        this.reservado=false; //serán los que reserva el usuario en la sesión actual
        this.pagado=false; //serán los pagados con anterioridad
        this.comprador=null;
    }
}

const numeros=[];

const construirNumeros = (arrayDeNumeros,largo) => {
    for(let i=0; i<largo;i++){
        let bonocolaboracion = new Bono (i);
        arrayDeNumeros.push(bonocolaboracion);
    }
    console.log(arrayDeNumeros);

    //Voy a inventar un estado de disponibilidad, según una regla tonta: múltiplos de 3 pagados

    arrayDeNumeros.forEach(
        e => { 
            if(e.id%3===0) {
                e.pagado=true;
                e.reservado=true;
                e.comprador=`La Mona Jimenez`;
            }
        }
    );
    console.log(arrayDeNumeros);
};

construirNumeros(numeros,sorteoActualObjeto[0].cantNumeros);

if(sorteoActualObjeto[0].enVenta){
    alert(`Este sorteo se encuentra Abierto, pase a escojer sus números`);
} else {
    alert(`Este sorteo se encuentra Cerrado, y el ganador ha sido el ${sorteoActualObjeto[0].ganador}`);
    idGanador=sorteoActualObjeto[0].ganador;
    if(numeros[idGanador].pagado){
        alert(`El número ha sido vendido a ${numeros[idGanador].comprador}`);
    } else {
        alert(`El premio ha quedado vacante.`)
    }
}

alert(`Gracias por participar con nosotros.`)