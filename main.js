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

const sorteoFraterno = new Sorteos('fraterno', 100, new Date('11/01/2022'),200, 12);
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
for(let i=0; i<sorteoActualObjeto[0].cantNumeros;i++){
    let bonocolaboracion = new Bono (i);
    numeros.push(bonocolaboracion);
}
console.log(numeros);

//Voy a inventar un estado de disponibilidad, según una regla tonta: múltiplos de 3 pagados

numeros.forEach(
    i => { 
        if(i.id%3===0) {
            i.pagado=true;
            i.reservado=true;
            i.comprador=`La Mona Jimenez`;
        }
    }
);
console.log(numeros);

if(sorteoActualObjeto[0].enVenta){
    alert(`Este sorteo se encuentra Abierto, pase a escojer sus números`);

} else {
    alert(`Este sorteo se encuentra Cerrado, y el ganador ha sido el ${sorteoActualObjeto[0].ganador}`);
}
