FROM ubuntu
COPY Project1_OctavianC  .
RUN apt-get update
RUN apt install git -y
RUN apt install openjdk-21-jdk-headless -y
RUN apt install maven -y
ENTRYPOINT [“mvn”, “spring-boot:run”]






