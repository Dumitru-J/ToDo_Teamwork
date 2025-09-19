# ToDo_Teamwork
Gruppenarbeit ToDo-Liste

POS 19.09.2025

Projekt (Abgabe Unterricht nächste Woche Freitag):
-> 3 Personen (6 Stunden Arbeitszeit), 1 Repository
-> To-Do Liste (weil überschaubarer Datensatz)
	-> Benutzerverwaltung -> registrieren, anmelden, abmelden
	-> To-Do Listen -> jeder User kann mehrere unabhängige To-Do Listen verwalten
	-> Liste -> Task einfügen, erledigt markieren
	-> Testfälle überlegen  und nachweislich dokumentieren
-> Frontend:	MVC (Model,View,Controller)Pattern verwenden
-> Backend: 	

Für den Anfang Benutzer+PW in Dokument gespeichert (ohne Hashing, etc.)
Je To-Do Liste eine eigene Datei


Realität wäre:
User-Stories (Anforderungen von Kunde), Agiles Programmieren
Sprints, Story-Points (limitiert)


Angehensweise:
1. Arbeitsaufteilung -> wer macht was
2. Frontend-Backend definieren			Route					Method
						/users					GET,POST
						/users/:userid (<-path Parameter)			
						/users/:userid/todolists


				request -> JSON Body
				
				Response <- HTTP Status Code, JSON Nachricht

Markus Vorschlag:
-> Projekt in kleinst mögliche Teile auftrennen
	1. Formular für Users (registrieren, anmelden, abspeichern, Fehlermeldungen)
					
