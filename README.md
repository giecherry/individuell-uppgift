### **7. Scenario: Nytt krav från Hakim – Analytics-endpoint för affärsdata**

Din projektägare, **Hakim**, har anlitat en **dataanalytiker** som behöver tillgång till viss affärsdata från företagets **webbshop**. Analytikern ska dock inte arbeta i koden eller databasen direkt, utan vill istället få tillgång till informationen via ett nytt, dedikerat **API-gränssnitt**.

Hakim ber dig därför skapa en ny samling **administrativa endpoints** under `/api/analytics` som endast är tillgänglig för **administratörer**.

### ✅ Krav på funktionalitet:

1. **Månadsvis orderintäkt för senaste 12 månader - `/api/analytics/revenue-per-month/`**
    - API:t ska returnera en lista med totala orderintäkter för varje månad bakåt i tiden, från nuvarande månad till exakt ett år tillbaka.
    - Exempel om anrop görs i april 2025:
        
        ```json
        {
          "april-2025": 560000,
          "mars-2025": 430000,
          ...
          "april-2024": 38000
        }
        
        ```
        
2. **Topp 10 största kunder - `/api/analytics/top-customers/`**
    - Returnerar en lista över de 5 kunder som har spenderat mest totalt i webbshopen.
3. **Åtkomstskydd för administratörer**
    - Endast användare med admin-behörighet ska kunna anropa dessa endpoints.
    - Om en icke-admin försöker få åtkomst ska API:t svara med en **`404 Not Found`**, så att resursen inte avslöjas.


## Utmaningar

Under arbetet med denna backendapplikation har jag fokuserat på att bygga en stabil och användarvänlig lösning som uppfyller kraven för logiken, autentisering och auktorisering. Här är en sammanfattning av vad jag har gjort och de utmaningar jag stött på:

### Vad jag har gjort:
- Implementerat två analytics-endpoints:
  1. **Månadsvis orderintäkt för senaste 12 månader** (`/api/analytics/revenue-per-month`):
     - Returnerar en lista med totala orderintäkter för varje månad bakåt i tiden, från nuvarande månad till exakt ett år tillbaka (inklusive).
     - Säkerställt att alla månader inkluderas, även om det inte finns några ordrar för en viss månad.
     - Hanterar flyttalsfel genom att runda av intäkterna till två decimaler.
  2. **Topp 5 största kunder** (`/api/analytics/top-customers`):
     - Returnerar en lista över de 5 kunder som har spenderat mest totalt i webbshopen.
     - Sorterar kunderna efter deras totala spenderade belopp

- Implementerat **autentisering och auktorisering**:
  - Endast administratörer kan anropa analytics-endpoints.
  - Om en icke-admin försöker få åtkomst returnerar API:t en `404 Not Found` för att dölja resursen.

- Säkerställt att API:et hanterar fel på ett konsekvent sätt:
  - Använt `try-catch` i alla routes för att förhindra att applikationen kraschar vid oväntade fel.
  - Returnerat tydliga och användbara felmeddelanden till frontend för att förbättra användarupplevelsen.

- Skapat en `data-local`-mapp med exempeldata för att underlätta testning:
  - JSON-filer för användare, produkter, kategorier och ordrar som kan importeras i MongoDB.

### Utmaningar:

- **Logiken bakom varje route**:
  - I början var det förvirrande att förstå hur jag skulle implementera logiken för varje route, särskilt när det gällde att hantera relationer mellan modeller och beräkningar. Jag fick gå tillbaka till grundläggande JavaScript-kunskaper och bryta ner problemet steg för steg. Detta visade sig vara en mycket bra övning och gav mig en djupare förståelse för backendutveckling.

- **Databasrelationer**:
  - Att hantera relationer mellan ordrar och användare krävde noggrann användning av Mongoose-metoden `.populate()` för att hämta användarnamn från `User`-modellen.
  - Säkerställt att referenser i `Order`-modellen hanteras korrekt och att data är konsekvent.

- **Felhantering**:
  - Använde tydliga felmeddelanden och loggning för att underlätta felsökning.

- **Flyttalsfel**:
  - Under testning upptäckte jag att vissa beräkningar resulterade i långa decimaler (t.ex. `3200.3999999999996`). Jag löste detta genom att runda av alla beräkningar till två decimaler med `toFixed()`.

### Slutsats:
Det jag har lärt mig mest är logiken bakom varje route – att bryta ner problemen och lösa dem steg för steg har varit en utmanande men spännande process. Jag är nöjd med resultatet av projektet och ser fram emot att använda dessa kunskaper i framtida projekt.

---
