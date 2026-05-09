#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>

const char* ssid = "SEU_SSID";
const char* password = "SUA_SENHA";

String apiBase = "http://192.0.0.10:3001/system/esp32";

#define SS_PIN  21
#define RST_PIN 22

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");
  SPI.begin();
  rfid.PCD_Init();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiBase);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();

      // Criar documento JSON para parsing
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        bool reading = doc["reading"];  // pega o valor do campo "reading"

        if (reading == true) {
          if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
            String uid = "";
            for (byte i = 0; i < rfid.uid.size; i++) {
              uid += String(rfid.uid.uidByte[i], HEX);
            }
            uid.toUpperCase();

            // Criar JSON para envio
            StaticJsonDocument<200> postDoc;
            postDoc["uid"] = uid;

            String postData;
            serializeJson(postDoc, postData);

            HTTPClient postHttp;
            postHttp.begin("http://192.0.0.10:3001/system/reading");
            postHttp.addHeader("Content-Type", "application/json");
            int postCode = postHttp.POST(postData);

            if (postCode > 0) {
              Serial.println("UID enviado com sucesso: " + uid);
            } else {
              Serial.println("Erro ao enviar UID");
            }

            postHttp.end();
          }
        }
      } else {
        Serial.println("Erro ao parsear JSON: " + String(error.c_str()));
      }
    }
    http.end();
  }
  delay(5000);
}