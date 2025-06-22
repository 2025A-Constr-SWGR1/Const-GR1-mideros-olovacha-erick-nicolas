function operar(operacion) {
    var valor1 = parseFloat(document.getElementById("input1").value);
    var valor2 = parseFloat(document.getElementById("input2").value);
    var resultadoElemento = document.getElementById("resultado");
    if (isNaN(valor1) || isNaN(valor2)) {
        resultadoElemento.innerText = "Por favor ingresa números válidos.";
        return;
    }
    try {
        var resultado = calcular(valor1, valor2, operacion);
        resultadoElemento.innerText = "Resultado: ".concat(resultado);
    }
    catch (error) {
        resultadoElemento.innerText = error.message;
    }
}
function calcular(a, b, operador) {
    switch (operador) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0)
                throw new Error("No se puede dividir por cero.");
            return a / b;
        default:
            throw new Error("Operación no válida.");
    }
}
