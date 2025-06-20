# appCuarenta

Aplicación desarrollada en NestJS + HTML/JS que simula el tradicional juego ecuatoriano "Cuarenta".  
Incluye lógica completa del juego, turnos para el jugador y la máquina, condiciones de victoria, puntos por caída y conteo, así como una interfaz visual simple.

---

## Requisitos

- Node.js >= 18.x
- Docker (opcional, para ejecución en contenedor)
- npm (gestor de paquetes)

---

## Scripts disponibles

### Compilar TypeScript

```bash
npx tsc
```

> Usa `tsconfig.json` para compilar el código fuente en `dist/`.

---

### 2. Lint del código

```bash
npx eslint .
```

> Ejecuta análisis estático de calidad del código fuente con ESLint.

---

### 3. Pruebas unitarias

```bash
npm run test
```

> Ejecuta los tests definidos con Jest dentro de la carpeta `test/`.

---

## 4. Despliegue con Docker

### 1. Construir imagen Docker

```bash
docker build -t appcuarenta .
```

### 2. Ejecutar contenedor

```bash
docker run -p 3000:3000 appcuarenta
```

### 3. Abrir la aplicación

Visita en el navegador:  
[http://localhost:3000](http://localhost:3000)

---

## Estructura del proyecto

```
.
├── frontend/              # index.html, juego.js, cartas/
├── src/                   # Controladores, servicios y lógica NestJS
├── test/                  # Pruebas unitarias Jest
├── Dockerfile             # Imagen lista para producción
├── package.json           # Dependencias
├── tsconfig.json          # Configuración de compilación
├── .gitignore             # Exclusión de node_modules, dist/
```

---

## Autores

**Erick Mideros y Martín Posso**  
Construcción de Software – Escuela Politécnica Nacional  
Semestre: 2025A