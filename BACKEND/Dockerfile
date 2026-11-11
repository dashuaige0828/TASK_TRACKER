# ============================================================
#  Dockerfile del backend (Spring Boot) — construcción en 2 etapas
# ============================================================

# ---------- ETAPA 1: compilar con Maven + JDK ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos primero el pom para aprovechar la caché de capas
COPY pom.xml .
# Copiamos el código y compilamos (sin tests para ir más rápido)
COPY src ./src
RUN mvn -B -q -DskipTests package

# ---------- ETAPA 2: imagen final, solo JRE (más ligera) ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copiamos el .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Puerto que expone la aplicación
EXPOSE 8080

# Comando de arranque
ENTRYPOINT ["java", "-jar", "app.jar"]
