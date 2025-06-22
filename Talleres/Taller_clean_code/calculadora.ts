function operar(operacion: string): void {
    const valor1 = parseFloat((document.getElementById("input1") as HTMLInputElement).value);
    const valor2 = parseFloat((document.getElementById("input2") as HTMLInputElement).value);
    const resultadoElemento = document.getElementById("resultado") as HTMLElement;

    if (isNaN(valor1) || isNaN(valor2)) {
        resultadoElemento.innerText = "Por favor ingresa números válidos.";
        return;
    }

    try {
        const resultado = calcular(valor1, valor2, operacion);
        resultadoElemento.innerText = `Resultado: ${resultado}`;
    } catch (error) {
        resultadoElemento.innerText = (error as Error).message;
    }
}

function calcular(a: number, b: number, operador: string): number {
    switch (operador) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) throw new Error("No se puede dividir por cero.");
            return a / b;
        default:
            throw new Error("Operación no válida.");
    }
}
