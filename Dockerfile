FROM eclipse-temurin:17-jdk AS build

WORKDIR /workspace

COPY backend ./backend

WORKDIR /workspace/backend

RUN ./mvnw -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /workspace/backend/target/*.jar /app/app.jar
COPY index.html indexxx.html styleee.css script.js api-config.js login.html login.css logiin.js admin.html admin.css /app/
COPY campus1.jpg campus2.jfif campus3.jfif campus4.jfif campus5.jpg rgpv.jpg rgpv2.jpg university-management-system-demo-compressed.mp4 /app/

ENV SPRING_WEB_RESOURCES_STATIC_LOCATIONS=file:/app/,classpath:/META-INF/resources/,classpath:/resources/,classpath:/static/,classpath:/public/

CMD ["sh", "-c", "java -jar /app/app.jar"]
