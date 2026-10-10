FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw -q -B dependency:go-offline

COPY src/ src/
RUN ./mvnw -q -B package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN groupadd -r fittrack && useradd -r -g fittrack fittrack
COPY --from=build /app/target/*.jar app.jar
USER fittrack

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
