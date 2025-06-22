# Calculadora Clean Code con TypeScript

## Descripción del proyecto

Esta calculadora fue desarrollada con HTML, TypeScript y CSS, enfocándose en aplicar los principios del documento *Clean Code JavaScript*. Realiza únicamente operaciones básicas: suma, resta, multiplicación y división, con una interfaz web clara y una lógica desacoplada de la vista.

## Objetivo

Demostrar la aplicación de principios de código limpio y buenas prácticas de desarrollo en una aplicación funcional, sencilla y mantenible.

## Principios de Clean Code aplicados y su implementación

A continuación se listan los principales principios aplicados, acompañados del archivo y ejemplo concreto donde se observaron:

### 1. Nombres significativos y pronunciables

- Archivo: `calculadora.ts`  
- Ejemplo:  

  ```ts
  const resultadoElemento = document.getElementById("resultado") as HTMLElement;
  ```

Se usaron nombres como `operar`, `calcular`, `valor1` y `resultadoElemento`, que permiten entender su propósito sin necesidad de comentarios adicionales.

### 2. Funciones con una sola responsabilidad (SRP)

- Archivo: `calculadora.ts`
- Ejemplo:

  ```ts
  function operar(operacion: string): void { /* captura, valida y muestra */ }
  function calcular(a: number, b: number, operador: string): number { /* lógica matemática */ }
  ```

  `operar()` se encarga de capturar y validar entradas y mostrar resultados; `calcular()` contiene únicamente la lógica matemática.

### 3. Validación temprana de errores (fail fast)

- Archivo: `calculadora.ts`
- Ejemplo:

  ```ts
  if (isNaN(valor1) || isNaN(valor2)) {
    resultadoElemento.innerText = "Por favor ingresa números válidos.";
    return;
  }
  if (b === 0) throw new Error("No se puede dividir por cero.");
  ```

  Se verifica que las entradas sean números válidos y se lanza un error controlado al intentar dividir por cero.

### 4. Evitar efectos secundarios

- Archivo: `calculadora.ts`
- Explicación: Las funciones no modifican variables globales; todo acceso al DOM está encapsulado en `operar()` y los errores se manejan dentro de un bloque `try/catch`.

### 5. Separación de responsabilidades

- Archivos: `index.html`, `style.css`, `calculadora.ts`
- Explicación:

  - HTML define la estructura de la interfaz.
  - CSS define el estilo visual.
  - TypeScript encapsula la lógica de negocio.

### 6. Evitar código duplicado

- Archivo: `calculadora.ts`
- Explicación: La función `calcular()` centraliza toda la lógica de operaciones, evitando repetir el mismo bloque condicional en distintos lugares.

### 7. Código autoexplicativo

- Todos los archivos
- Justificación: No se requieren comentarios explicativos innecesarios. Cada bloque cumple una tarea clara y los nombres descriptivos hacen evidente la funcionalidad.

### 8. Evitar condicionales negativos y minimizar lógica compleja

- Archivo: `calculadora.ts`
- Justificación: Se utilizaron expresiones afirmativas y claras en el `switch` para cada operación, evitando lógica enrevesada.

## Ejecución

### Compilación del código TypeScript

```bash
tsc calculadora.ts
```

---

Aplicar principios de Clean Code mejora la legibilidad, mantenibilidad y extensibilidad del código. Separar las responsabilidades, funciones con una sola responsabilidad, validación temprana y uso de nombres significativos sientan una base para futuras mejoras y facilitan la colaboración y el control de calidad.
