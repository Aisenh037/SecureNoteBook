# ---------- BUILD STAGE ----------
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY . .
RUN ./mvnw clean package -DskipTests

# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java","-jar","app.jar"]
