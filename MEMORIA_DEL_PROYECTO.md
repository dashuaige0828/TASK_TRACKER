# 🧠 MEMORIA DEL PROYECTO — TASK TRACKER

> **Propósito:** proyecto de práctica para aprender el ciclo de vida completo de una app
> **Stack:** Java 17 + Spring Boot 4.1.0 (backend) · Angular 22 (frontend) · H2 (BD en memoria)

---

## 🔑 CÓMO USAR ESTA MEMORIA (importante)

1. **Al empezar una sesión nueva**, dile al agente: *"Lee `MEMORIA_DEL_PROYECTO.md` y dime el estado del proyecto"*.
   Si el agente no conoce el proyecto, apunta la carpeta: `F:\TASK_TRACKER`.
2. **Al terminar cada sesión**, pide: *"Actualiza la memoria del proyecto"* para que refleje el nuevo estado.
3. La **fuente de verdad técnica** son el código y el historial de git. Este archivo es la guía rápida de estado y contexto.

---

## 🧰 STACK Y VERSIONES

| Componente | Versión | Dónde |
|---|---|---|
| Java (JDK) | **17.0.20+8 Temurin** | `C:\Users\27944\.jdks\jdk-17.0.20+8` |
| Spring Boot | **4.1.0** (Maven Wrapper incluido) | `BACKEND/` |
| Swagger / OpenAPI | **springdoc-openapi 3.1.1** (⚠️ la 2.x es para Boot 3 — ver peculiaridad #13) | `BACKEND/pom.xml` |
| Base de datos | **H2** en memoria (`jdbc:h2:mem:taskdb`) | — |
| Node.js | **24.16.0** | `F:\NODEJS\` |
| npm | **11.13.0** | — |
| Angular CLI | **22.1.5** (global) | `C:\Users\27944\AppData\Roaming\npm` |
| Angular (core) | **22.1.0** | `FRONTEND/` |
| Git | 2.33.0 | repo en `F:\TASK_TRACKER` |

> 💡 También existen en `~/.jdks`: `openjdk-21.0.1` y `corretto-22.0.2` (funcionan, por si se necesitan).

---

## 🗂️ ESTRUCTURA

```
F:\TASK_TRACKER\
├── BACKEND\                  → Spring Boot (Maven, puerto 8080)
│   └── src\main\java\com\tasktracker\backend\
│       ├── BackendApplication.java        (punto de entrada)
│       ├── model\Task.java                (entidad JPA: id, title, description)
│       ├── repository\TaskRepository.java (JpaRepository<Task, Long> + existsByTitleIgnoreCase)
│       ├── service\TaskService.java       (CRUD + validación de título único → 409)
│       ├── controller\TaskController.java (REST /api/tasks, 5 endpoints)
│       ├── config\CorsConfig.java         (⚠️ CORS: obligatorio en Boot 4, ver peculiaridad #10)
│       └── exception\DuplicateTitleException.java  (→ HTTP 409)
│   └── src\main\resources\application.properties   (H2, JPA, consola H2 — SIN propiedades CORS)
├── FRONTEND\                 → Angular 22 (puerto 4200) — COMPLETO ✅ (VS Code)
│   └── src\
│       ├── index.html        (cascarón con <app-root>)
│       └── app\
│           ├── app.ts/html/config.ts/routes.ts   (config + conexión)
│           └── Task\
│               ├── task.model.ts       ✅ (interfaz Task)
│               ├── task.service.ts     ✅ (HTTP: listar/crear/actualizar/eliminar)
│               ├── task.component.ts   ✅ (signals + cargar/crear/eliminar/alEscribir)
│               └── task.component.html ✅ ([value], (input), @if, @for/@empty)
├── tools\                    → scripts de ayuda con Node (ejecutar desde F:\TASK_TRACKER)
│   ├── download.js           (descargar archivos — ver peculiaridad #1)
│   ├── estado-servidores.js  (¿están activos backend y frontend?)
│   ├── test-api.js           (prueba las 10 operaciones de la API)
│   ├── verificar-frontend.js (comprueba el frontend + crea tareas de ejemplo)
│   ├── diagnostico.js        (diagnostica backend, CORS y puertos)
│   └── diagnostico-swagger.js (comprueba Swagger + prueba POST con/sin título)
└── MEMORIA_DEL_PROYECTO.md   → este archivo
```

---

## ⚙️ PECULIARIDADES DE ESTE EQUIPO (léelas, ahorran tiempo)

1. **TLS roto en PowerShell/curl**: `Invoke-WebRequest` y `curl.exe` fallan en HTTPS (certificados del sistema).
   **Sí funcionan**: `npm`, `git`, y **Node.js** (`https`). → Para descargar archivos usar: `node tools\download.js <url> <destino>`.
2. **Sandbox de DSH**: los comandos que escriben fuera de `F:\TASK_TRACKER` (`~/.m2`, `~/.jdks`, `AppData`, registro de Windows) o que lanzan subprocesos con pipes (`ng`, `npm` con pipes) requieren `danger-full-access`. Ejecutar `ng`/`npm`/`mvnw` con permisos completos.
3. **JAVA_HOME ya configurado** a nivel de usuario (`C:\Users\27944\.jdks\jdk-17.0.20+8`); el `java` del PATH por defecto del sistema está roto (javapath apunta a un JDK inexistente).
4. start.spring.io generó el pom con `4.1.0.RELEASE`, **que NO existe en Maven Central**; la versión correcta es `4.1.0` (ya corregido en `pom.xml`).
5. **IntelliJ**: si no aparece "New → Java Class" o no compila, es que `BACKEND/pom.xml` no está importado como módulo Maven. Solución: clic derecho sobre `pom.xml` → "Add as Maven Project" (o File → New → Module from Existing Sources). El proyecto IntelliJ usa `.idea/` de la raíz.
6. **IntelliJ Community NO soporta TypeScript** ("New → TypeScript File" es de Ultimate). Para el frontend el usuario usa **VS Code** (instalado en `C:\Program Files\Microsoft VS Code`). Abrir `FRONTEND/` con VS Code.
7. **Spring Boot 4 renombró propiedades**: `server.error.*` → `spring.web.error.*` (ej: `server.error.include-message` ya NO existe; usar **`spring.web.error.include-message=always`**). Verificado en `spring-boot-autoconfigure-4.1.0.jar` (~/.m2).
8. **Las plantillas de Angular NO soportan el cast `as`** (dan error NG5002 al compilar). Para acceder a `$event.target.value`, crear un método en el `.ts`:
   ```ts
   alEscribir(evento: Event) {
     const input = evento.target as HTMLInputElement;
     this.nuevoTitulo.set(input.value);
   }
   ```
   y en el HTML: `(input)="alEscribir($event)"`.
9. **Guardar archivos (Ctrl+S)**: el agente lee el estado del **disco**, no lo que está abierto sin guardar en el editor. Si algo "no aparece", comprobar que esté guardado.
10. **⚠️ CORS en Spring Boot 4 — CRÍTICO**: las propiedades `spring.web.cors.allowed-origins` / `spring.web.cors.allowed-methods` **NO EXISTEN** en Spring Boot 4.1 (buscar "cors" en el metadata de todos los jars de Boot 4.1 devuelve 0 resultados). Se ignoran **en silencio** (sin error) → el navegador bloquea las respuestas y la app Angular muestra "Error al cargar las tareas".
    **Solución (clase Java)**: `config/CorsConfig.java`:
    ```java
    @Configuration
    public class CorsConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*");
        }
    }
    ```
    **Cómo comprobarlo**: `curl.exe -s -D - -o NUL -H "Origin: http://localhost:4200" http://localhost:8080/api/tasks` → debe aparecer `Access-Control-Allow-Origin: http://localhost:4200`.
11. **Usar `http://localhost:4200` (no `127.0.0.1`)** en el navegador: la config CORS permite exactamente el origen `localhost:4200`; con `127.0.0.1` se bloquea igual.
12. **Git: `git add` NO es `git commit`** (confusión que tuvo el usuario). `add` solo pone los archivos en la **bandeja de espera (staging)**; hasta que no se hace `commit`, no se guardan en el historial, y `push` no sube nada. Las 4 zonas: *directorio de trabajo* → (`git add`) → *staging* → (`git commit`) → *repo local* → (`git push`) → *GitHub*. Comprobar con `git log --oneline` y `git ls-tree origin/main --name-only`.
13. **Swagger en Spring Boot 4 → springdoc 3.x**: la línea **2.x es para Spring Boot 3**; para Boot 4 hay que usar **3.x** (probado: `3.1.1`). Dependencia:
    ```xml
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>3.1.1</version>
    </dependency>
    ```
    URLs: **`http://localhost:8080/swagger-ui.html`** (redirige a `/swagger-ui/index.html`) y el JSON en `/v3/api-docs`.
    **En Swagger hay que pulsar "Try it out" antes de poder editar el cuerpo JSON.**
14. **Validación con `@Valid` (ARREGLADO y verificado)**: antes, POST sin `title` devolvía **HTTP 500** (`NullPointerException` en `task.getTitle().trim()`). Arreglado usando el `spring-boot-starter-validation` (ya estaba en el pom): `@NotBlank(message = "...")` + `@Size(max = 200)` en `Task.title` y `@Valid` en los `@RequestBody` de POST y PUT.
    - Verificado con `tools/test-validacion.js` → **5/5 OK**: sin title → 400 · `""` → 400 · `"   "` → 400 · válido → 201 · 250 chars → 400
    - ⚠️ **Nota**: el mensaje del 400 que devuelve Spring es feo y técnico (*"Validation failed for object='task'. Error count: 1"*) y **no muestra el mensaje de `@NotBlank`**. El arreglo profesional sería un `@RestControllerAdvice` (el usuario decidió dejarlo para más adelante).
    - Regla: `@NotBlank` rechaza `null`, `""` **y** espacios; `@NotEmpty` solo `null`/`""`; `@NotNull` solo `null`.

---

## 📋 ESTADO ACTUAL (actualizado: 2026-10-08, sesión 6)

**IMPORTANTE:** el usuario **escribe el código él mismo** (es su práctica). El agente solo guía y configura el entorno.

### 🎉 LA APLICACIÓN FUNCIONA COMPLETA (backend + frontend + BD + Swagger)

- [x] **Backend COMPLETO y PROBADO** ✅:
  - Probado con Postman (sesión 3), `tools/test-api.js` (sesión 5) y `tools/test-validacion.js` (sesión 6): **10/10 + 5/5 pruebas OK**
  - CRUD completo: GET/GET id → 200 · POST → 201 · **duplicado → 409 con mensaje** · PUT → 200 · DELETE → 204 · inexistente → 404
  - `trim()` + `IgnoreCase` verificados
  - **Validación arreglada** ✅ (`@NotBlank` + `@Valid`): POST inválido → **400** (antes 500). Ver peculiaridad #14
  - **CORS arreglado** con `config/CorsConfig.java` (ver peculiaridad #10) — el navegador ya recibe `Access-Control-Allow-Origin` ✅
- [x] **Frontend COMPLETO y FUNCIONANDO** ✅: lista, crear, borrar y mensaje de error del 409 en pantalla
- [x] **Integración verificada de punta a punta** (2026-10-08): `curl` confirma la cabecera CORS y el usuario ve las tareas en `http://localhost:4200` ✅
- [x] **Swagger funcionando** ✅ (springdoc 3.1.1): los 5 endpoints documentados en `http://localhost:8080/swagger-ui.html`
- [x] **Servidores**: los arranca el usuario (IntelliJ ▶ para backend, `ng serve` en VS Code para frontend)
- [x] **Editar tareas — A MEDIAS** ⏳: el usuario ya añadió a `task.component.ts` los signals `idEditando = signal<number | null>(null)` y `tituloEditando = signal('')`, y el método `alEscribirEdicion(evento)`
  - ⏳ **FALTA (lo siguiente que debe escribir)**:
    1. Métodos `empezarEdicion(tarea)`, `cancelarEdicion()` y `guardarEdicion(tarea)` en `task.component.ts` (instrucciones ya entregadas: usan `...tarea, title: titulo` y `lista.map()`)
    2. Actualizar `task.component.html`: `@if (idEditando() === tarea.id)` dentro del `@for` para alternar input/texto + botones ✏️/💾/✖
    3. Probar con `ng build` y en el navegador
  - *El backend NO necesita cambios: el `PUT /api/tasks/{id}` y `actualizar()` del service ya existían*
- [ ] **Git: hay cambios SIN commitear** ⚠️ (último commit: `a498e7e`):
  - `BACKEND/pom.xml` (Swagger), `Task.java` + `TaskController.java` (validación), esta memoria
  - `tools/diagnostico-swagger.js` y `tools/test-validacion.js`

### 🛠️ Herramientas de diagnóstico creadas

| Comando (desde `F:\TASK_TRACKER`) | Qué hace |
|---|---|
| `node tools\estado-servidores.js` | Dice si backend (8080) y frontend (4200) están activos |
| `node tools\test-api.js` | Prueba las 10 operaciones de la API |
| `node tools\verificar-frontend.js` | Comprueba el frontend y crea 2 tareas de ejemplo |
| `node tools\diagnostico.js` | Diagnostica backend, CORS y puerto del frontend |
| `node tools\diagnostico-swagger.js` | Comprueba Swagger, prueba POST con y sin título, lista endpoints detectados |
| `node tools\test-validacion.js` | Verifica la validación del título (400 vs 201, 5 casos) |

---

## 🚀 CÓMO ARRANCAR

```powershell
# Backend (terminal 1) — puerto 8080
cd F:\TASK_TRACKER\BACKEND
.\mvnw.cmd spring-boot:run

# Frontend (terminal 2) — puerto 4200
cd F:\TASK_TRACKER\FRONTEND
ng serve
```

- API: `http://localhost:8080/api/tasks`
- **Swagger UI: `http://localhost:8080/swagger-ui.html`** (⚠️ pulsar "Try it out" antes de editar el JSON)
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Consola H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:taskdb`, user: `sa`, sin password)
- UI: `http://localhost:4200`

---

## 🎯 PRÓXIMOS PASOS (los escribe/ejecuta el usuario, en este orden)

**Estado de partida:** la app funciona completa, con Swagger, y (casi) todo en GitHub. Ahora toca **añadir funcionalidades** (el usuario escribe el código, el agente guía).

0. **✅ HECHO — Arreglar el bug de validación**: `@NotBlank` + `@Size` en `Task.title` y `@Valid` en `TaskController` → POST inválido devuelve **400** (verificado 5/5 con `tools/test-validacion.js`). Queda **opcional** un `@RestControllerAdvice` para que el 400 devuelva un mensaje limpio (el usuario lo dejó para más adelante).
1. **⭐ EN CURSO — Editar tareas** (ver estado detallado arriba en "ESTADO ACTUAL"):
   - ✅ Hecho por el usuario: signals `idEditando` / `tituloEditando` + `alEscribirEdicion()`
   - ⏳ Falta: `empezarEdicion()` / `cancelarEdicion()` / `guardarEdicion()` (con `{ ...tarea, title: titulo }` y `lista.map()`) + el `@if (idEditando() === tarea.id)` en el HTML con botones ✏️/💾/✖
   - Endpoint y service ya existen: `PUT /api/tasks/{id}` y `TaskService.actualizar()`
2. **Campo `status` en Task** (feature completa backend + frontend): enum `TaskStatus` (PENDIENTE/EN_PROGRESO/COMPLETADA), campo en la entidad, validación, y en Angular: selector, colores y filtros.
3. **Acción de negocio** `POST /api/tasks/{id}/completar` (ejemplo de "verbo en la URL").
4. **Docker**: Dockerfile para el backend (práctica de Docker, muy pedido en ofertas).
5. **Librería de UI**: Angular Material o PrimeNG para botones/tablas.

**Recordatorio de flujo de trabajo en cada sesión:**
- Guardar los archivos (`Ctrl+S`) → el agente lee el disco
- Commit al terminar cada hito: `git add -A` → `git commit -m "..."` → `git push origin main`
- Al terminar, pedir: *"actualiza la memoria"*

---

## 📜 HISTORIAL DE SESIONES

### Sesión 6 — 2026-10-08 (continuación del mismo día)
- **Swagger añadido al backend** por el usuario: `springdoc-openapi-starter-webmvc-ui` **3.1.1**
  - Averiguado revisando Maven Central: la línea **2.x es para Spring Boot 3**; para Boot 4 hay que usar **3.x** (se confirmó viendo que el POM de springdoc 3.1.1 usa los módulos nuevos de Boot 4: `spring-boot-tomcat`, `spring-boot-health`, `spring-boot-starter-webmvc-test`)
  - Verificado: `/swagger-ui.html` → 302, `/v3/api-docs` → 200, y los **5 endpoints detectados** correctamente
- **🐛 BUG ENCONTRADO en la API** (el usuario no podía crear tareas desde Swagger y el agente lo reprodujo): POST sin `title` → **HTTP 500** `NullPointerException` en `task.getTitle().trim()`. Debería ser **400 Bad Request**.
  - Causa: `spring-boot-starter-validation` está en el pom pero **no se usa** — falta `@NotBlank` en la entidad y `@Valid` en el controller
  - Queda como próximo paso nº0 (muy didáctico: validación declarativa)
- Creado `tools/diagnostico-swagger.js`
- **Pendiente**: commitear (pom con Swagger + memoria + script) y arreglar el bug de validación

### Sesión 5 — 2026-10-08
- **Prueba de integración completa**: el agente arrancó backend + frontend y ejecutó `tools/test-api.js` → **10/10 pruebas OK** (201, 409 con mensaje, 204, 404, trim+IgnoreCase)
- **🐛 PROBLEMA REAL ENCONTRADO — CORS en Spring Boot 4**:
  - Síntoma: la web mostraba "Error al cargar las tareas" aunque el backend respondía 200 en el navegador
  - Causa: las propiedades `spring.web.cors.allowed-origins/methods` **no existen en Spring Boot 4.1** y se ignoran en silencio → el navegador bloqueaba la respuesta por falta de `Access-Control-Allow-Origin`
  - Diagnóstico: `curl -H "Origin: ..." ` + búsqueda de "cors" en el metadata de TODOS los jars de Boot 4.1 (0 resultados)
  - **Solución**: `config/CorsConfig.java` implementando `WebMvcConfigurer.addCorsMappings()` + borrar las propiedades inválidas del `application.properties`
  - Verificado: ahora llega `Access-Control-Allow-Origin: http://localhost:4200` ✅
- Explicado: cómo crear un paquete/clase nuevo en IntelliJ (`New → Java Class` con nombre `config.CorsConfig`), la regla carpeta ↔ package
- Creados 4 scripts de diagnóstico en `tools/`
- **Lección de git**: el usuario creía que el frontend ya estaba subido porque había hecho `git add` antes. Se le explicó que **`add` solo prepara (staging)** y que sin `commit` no hay nada que `push`ear. Comprobado con `git ls-tree origin/main --name-only` (no aparecía `FRONTEND`).
- ✅ **Commit `a498e7e` hecho y pusheado** por el usuario: *"feat: frontend Angular funcional + fix CORS de Spring Boot 4 + scripts de diagnostico"*. `origin/main` ya contiene `FRONTEND/`; árbol de trabajo limpio

### Sesión 4 — 2026-10-06
- El usuario terminó **todo el frontend Angular** (model, service, componente, HTML, config, conexión con `app-root`)
- **Error encontrado y corregido** (importante para el futuro): `($event.target as HTMLInputElement).value` **NO compila** en plantillas Angular → *"NG5002: Parser Error: Missing closing parentheses"*. **Las plantillas de Angular NO soportan el cast `as`** (el lenguaje de expresiones es un subconjunto de TS).
  - **Solución aplicada**: mover el cast al TypeScript con un método `alEscribir(evento: Event)` y en el HTML dejar solo `(input)="alEscribir($event)"`. (Buena práctica: la vista dice QUÉ pasó, el .ts decide QUÉ hacer.)
- **Verificado por el agente**: `ng build` → ✅ **EXIT 0** ("Application bundle generation complete")
- Explicados a fondo: estructura HTML (elementos, atributos, listas, semántica), data binding (`{{ }}`, `[ ]`, `( )`), control de flujo (`@if`/`@for`/`@empty`/`track`), signals (`signal<T>` por qué lista, de dónde viene el parámetro `lista` en `update()`), `subscribe({next, error})`, objeto literal `{ title: titulo }` (clave JSON = nombre del campo en Java), `filter()`/spread, `inject()`
- Aprendizaje de flujo de trabajo: los archivos hay que **guardarlos (Ctrl+S)** — el agente lee el disco, no el editor
- **Pendiente**: probar la integración completa (backend + `ng serve`) y commitear/pushear el frontend

### Sesión 3 — 2026-08-22
- **API probada con Postman**: CRUD completo funcionando. El POST duplicado devuelve **409 con mensaje** ✅
- **Hallazgo importante**: en Spring Boot 4 la propiedad cambió: `server.error.include-message` → **`spring.web.error.include-message`** (verificado en el jar de autoconfigure). Sin esto, el 409 salía sin mensaje.
- Explicados conceptos de Angular: estructura de componentes (ts/html/css), globales vs componentes, rutas, inyección de dependencias (`inject`), `Observable` vs `Task` de C#, service por recurso no por página, librerías UI (Material/PrimeNG)
- **IntelliJ Community no soporta TypeScript** → el usuario pasó a **VS Code** para el frontend
- Frontend iniciado: `task.model.ts` ✅ y `task.service.ts` ✅ creados en `FRONTEND/src/app/Task/`
- **Commit hecho y pusheado**: `b62c8e8` (backend completo + memoria). Frontend pendiente de commitear
- Se fue a descansar antes de terminar el componente Angular

### Sesión 2 — 2026-08-20 (misma jornada)
- **Diagnóstico IntelliJ**: el usuario no podía crear clases ni compilar. Causa: `BACKEND/pom.xml` **no estaba importado como módulo Maven** en IntelliJ (solo había un módulo genérico). Solución: importar `pom.xml` como Maven Project. No era problema del JDK.
- Explicados conceptos clave (comparando con su práctica en C#/.NET):
  - Hibernate vs JPA vs Spring Data JPA (ORM); por qué los puestos piden Hibernate y Docker
  - JavaBeans (getters/setters) vs propiedades de C#; `super()` en excepciones
  - Capas: Controller → Service → Repository (≈ Controller → Service → DbContext en .NET)
  - Spring Data: los métodos de la interfaz (`existsByTitleIgnoreCase`) se implementan solos
- El usuario **escribió todo el backend** (model, repository, service, controller, exception) con validación de título único → 409
- Se fue a descansar antes de probar la API. Pendiente: prueba con Postman + frontend Angular.

### Sesión 1 — 2026-08-20
- Analizada la carpeta (vacía, solo git + `.gitignore` + BACKEND/FRONTEND vacíos)
- Detectado que solo había JDK 8 funcionando y Maven/Angular CLI ausentes
- Descargado e instalado **Temurin JDK 17.0.20+8** en `~/.jdks` + `JAVA_HOME` de usuario
- Generado **backend Spring Boot 4.1.0** vía start.spring.io (con Maven Wrapper) y descomprimido en `BACKEND/`
- Corregido `pom.xml`: `4.1.0.RELEASE` → `4.1.0` (la primera no existe en Maven Central)
- Instalado **Angular CLI 22.1.5** y creado proyecto Angular 22 en `FRONTEND/`
- Configurado `application.properties` (H2, JPA, consola H2, CORS)
- Verificado: backend **compila** (`mvnw compile`) · frontend **compila** (`ng build`)
- Pendiente: verificación de arranque del backend (la prueba se interrumpió; la primera `spring-boot:run` descargará los plugins restantes)
- **Decisión del usuario**: él mismo escribirá todo el código (se eliminaron los archivos de práctica del agente para dejar el esqueleto limpio)
- Creada esta memoria
