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