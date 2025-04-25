FROM tomcat:11.0-jdk17

RUN rm -rf /usr/local/tomcat/webapps/*

COPY SpringMVC_Health_Schedule-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/


EXPOSE 8080

CMD ["catalina.sh", "run"]
