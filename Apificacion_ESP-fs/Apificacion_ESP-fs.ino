#include <Servo.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <FS.h>

const char* ssid = "TP-LINK_A217";
const char* password = "z9yv7tE44v";

ESP8266WebServer server(80);
Servo myServo;

const int ledPin = 16;
const int servoPin = 12;
const int bateryPin = A0;

void handleBrightness(){
  if(server.hasArg("value")){
    int brightness = server.arg("value").toInt();
    brightness = constrain(brightness, 0, 1023);
    analogWrite(ledPin, brightness);
    Serial.println("intencidad: "+String(brightness));
    server.send(200, "text/plain", "Intensidad actual: " + String(brightness));
  } else {
    server.send(400, "text/plain", "Falta el valor");
    Serial.println("no recibido");
  }
}

void nivelBatery(){
  int batery = analogRead(bateryPin);
  int porcentaje = batery;
  Serial.println("bateria: "+String(porcentaje));
  server.send(200, "application/json", "{\"bateria\": " + String(porcentaje) + "}");
}

void handleServo(){
  if(server.hasArg("value")){
    int servo = server.arg("value").toInt();
    servo = constrain(servo, 0, 180);
    myServo.write(servo);
    Serial.println("grado: "+String(servo));
    server.send(200, "text/plain", "grado: " + String(servo));
  } else {
    server.send(400, "text/plain", "servo: Falta el valor");
    Serial.println("servo: no recibido");
  }
}

void handleFileRequest(String path, String contentType){
  File file = SPIFFS.open(path, "r");
  if(!file) {
    server.send(404, "text/plain", "Archivo no encontrado");
    return;
  }
  server.streamFile(file, contentType);
  file.close();
}

void setup() {
  Serial.begin(115200);

  pinMode(ledPin, OUTPUT);
  analogWrite(ledPin, 0);
  
  myServo.attach(servoPin);
  myServo.write(90);
  
  pinMode(bateryPin, INPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println(".");
  }
  Serial.println("\nWifi conectado");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  if (!SPIFFS.begin()){
    Serial.println("error al montar SPIFFS");
    return;
  }

  server.on("/", HTTP_GET, []() {
    handleFileRequest("/index.html", "text/html");
  });
  server.on("/style.css", HTTP_GET, []() {
    handleFileRequest("/style.css", "text/css");
  });
  server.on("/script.js", HTTP_GET, []() {
    handleFileRequest("/script.js", "application/javascript");
  });
  server.on("/luz", HTTP_POST, handleBrightness);
  server.on("/servo", HTTP_POST, handleServo);
  server.on("/bateria", HTTP_GET, nivelBatery);

  server.begin();
  Serial.println("Servidor iniciado");
}

void loop() {
  server.handleClient();
}
