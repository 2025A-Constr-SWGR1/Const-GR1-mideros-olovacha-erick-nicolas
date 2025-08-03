const paqueteSuma = require('2025a-swgr1-mapc-suma');
const paqueteMultiplicacion = require('2025a-swgr1-enmo-multiplicacion');

const respuestaSuma = paqueteSuma.suma(1, 2);
const respuestaMult = paqueteMultiplicacion.multiplicacion(3, 5);

console.log('La respuesta de la suma es: ', respuestaSuma);
console.log('La respuesta de la multiplicacion es: ', respuestaMult);