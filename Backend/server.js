// backend/server.js

// Express-Framework importieren (Basis für Webserver)
const express = require('express');

// CORS-Middleware importieren, damit Requests vom Frontend (z. B. http://localhost:5500) erlaubt sind
const cors = require('cors');

// Router mit allen User- und Todo-Routen importieren
const userRouter = require('./routes/user');

// Neue Express-App erstellen
const app = express();

// Middleware aktivieren: CORS erlauben (Frontend darf Backend ansprechen)
app.use(cors());

// Middleware aktivieren: Body-Parser für JSON (req.body automatisch als JS-Objekt)
app.use(express.json());

// Alle API-Endpunkte, die im userRouter definiert sind, unter /api erreichbar machen
// Beispiel: router.post('/users/registrieren') → /api/users/registrieren
app.use('/api', userRouter);

// Port festlegen, auf dem der Server läuft
const PORT = 3000;

// Server starten und Meldung in Konsole ausgeben
app.listen(PORT, () => console.log(`Backend läuft: http://localhost:${PORT}`));
