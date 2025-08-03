exports.suma = (numeroUno, numeroDos) => {
    const numeroUnoCasteado = Number(numeroUno);
    const numeroDosCasteado = Number(numeroDos);
    if (isNaN(numeroUno) || isNaN(numeroDos)) {
        throw new Error('No son numeros validos')
    }
    return numeroUnoCasteado + numeroDosCasteado;
}