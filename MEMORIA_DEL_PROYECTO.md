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
│       └── exception\DuplicateTitleException.java  (→ HTTP 409)
│   └── src\main\resources\application.properties   (H2, JPA, CORS ya configurados)
├── FRONTEND\                 → Angular (puerto 4200) — generado, sin código propio aún
│   └── src\app\              (componentes standalone; el usuario creará servicio y componentes)
├── tools\download.js         → helper de descarga con Node (ver Peculiaridades)
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

---

## 📋 ESTADO ACTUAL (actualizado: 2026-08-20, sesión 2)

**IMPORTANTE:** el usuario **escribe el código él mismo** (es su práctica). El agente solo guía y configura el entorno.

- [x] Repositorio git inicializado (rama `main`, remoto `origin/main`), `.gitignore` raíz configurado
- [x] **JDK 17 instalado** y `JAVA_HOME` configurado
- [x] **Backend Spring Boot 4.1.0** generado + **importado como módulo Maven en IntelliJ** (clave: sin importar `pom.xml` no se podía crear clases ni compilar)
- [x] `application.properties` configurado (H2 en memoria, JPA `ddl-auto=update`, consola H2, CORS para `http://localhost:4200`)
- [x] **Backend compila** (`mvnw compile` → OK, verificado por el agente sobre el esqueleto)
- [x] **Angular CLI 22.1.5** instalado + proyecto Angular 22 en `FRONTEND/` (compila)
- [x] **Código backend COMPLETO (escrito por el usuario, revisado y aprobado por el agente ✅)**:
  - `model/Task.java` — entidad: id (`@Id` + `@GeneratedValue`), title (`nullable=false`), description + getters/setters
  - `repository/TaskRepository.java` — `extends JpaRepository<Task, Long>` + `existsByTitleIgnoreCase`
  - `service/TaskService.java` — CRUD completo + validación de título único (lanza 409)
  - `controller/TaskController.java` — `GET/POST/PUT/DELETE` en `/api/tasks`
  - `exception/DuplicateTitleException.java` — `@ResponseStatus(HttpStatus.CONFLICT)`
- [ ] **Probar la API con Postman/navegador** (el usuario se fue a descansar justo antes de probar)
- [ ] Escribir el código Angular (modelo, servicio, componentes) — **lo hace el usuario**
- [ ] Probar integración completa (CORS, CRUD desde la UI)

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
- Consola H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:taskdb`, user: `sa`, sin password)
- UI: `http://localhost:4200`

---

## 🎯 PRÓXIMOS PASOS (los escribe/ejecuta el usuario, en este orden)

1. **Probar la API** con Postman/navegador (backend ya completo):
   - `GET /api/tasks` → `[]` · `POST /api/tasks` → **201** · repetir el POST → **409** (título duplicado)
   - `PUT /api/tasks/{id}` → 200 · `GET /api/tasks/{id}` → 200/404 · `DELETE /api/tasks/{id}` → 204/404
   - Consola H2 en `/h2-console` (JDBC: `jdbc:h2:mem:taskdb`, user `sa`)
2. **Opcional**: añadir Swagger (springdoc-openapi) — buscar versión compatible con Spring Boot 4.1
3. **Angular — modelo y servicio**: interfaz `Task` + `TaskService` con `HttpClient` (recordar: agregar `provideHttpClient()` en `app.config.ts`)
4. **Angular — componentes**: lista de tareas + formulario para crear/editar (estilo standalone + signals de Angular 22)
5. **Integración**: probar el CRUD desde la UI (Angular 4200 ↔ Spring Boot 8080, CORS ya configurado)
6. **Git**: commit por cada hito (aún NO se ha commiteado el código: backend, frontend y memoria están pendientes)

---

## 📜 HISTORIAL DE SESIONES

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
