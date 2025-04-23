Rapport Application de Gestion du Recrutement des Tuteurs UNCHK

Technologie web

Projet : 

Ce projet porte sur le développement d’une application web permettant la gestion du processus de recrutement des tuteurs effectué chaque année académique.

Présenté par :							Tutrice :												
Macoumba Touré							Fatoumata Traoré SALL 

Date de dépôt : Vendredi, le 25 Avril 2025

Table des matières
Rapport Application de Gestion du Recrutement des Tuteurs UNCHK	1
1. Introduction	4
1.1 Contexte du Projet	4
1.2 Objectifs du Projet	4
1.3 Public cible	4
2. Analyse des Besoins	4
2.1 Besoins Fonctionnels	4
2.2 Besoins Non-Fonctionnels	5
3. Architecture Technique	5
3.1 Stack Technologique	5
3.2 Modèle de Données	6
4. Conception Fonctionnelle	6
4.1 Processus de Candidature	6
4.2 Processus d'Administration	7
5. Maquettes et Interfaces	7
5.1 Page Publiques	7
5.2 Espace Candidat	9
	11
5.3 Espace Administrateur	11
6. Planification du Projet	12
6.1 Phasage du Projet	12
7. Gestion des Risques	13
8. Plan de Test	13
8.1 Tests Unitaires	13
8.2 Tests d'Intégration	14
8.3 Tests Fonctionnels	14
8.4 Tests de Performance	14
8.5 Tests de Sécurité	14
9. Budget Prévisionnel	14
9.1 Estimation Financière	14
10. Conclusion	14
11. Perspectives d'Évolution	15
1. Introduction
1.1 Contexte du Projet
Dans le cadre de notre formation en Master 1 Ingénierie Logicielle, nous avons été amenés à réaliser un projet opérationnel visant à répondre à un besoin réel exprimé par l’Université Numérique Cheikh Hamidou Kane (UNCHK). Parmi les fonctionnalités suggérées pour le développement, j'ai opté pour celles de l'insertion. 
Ce projet porte sur le développement d’une application web permettant la gestion processus de recrutement des tuteurs académiques en implémentant une solution numérique complète.
La mise en place d'une application web dédiée permettra d'optimiser ce processus qui se déroule annuellement, en offrant une plateforme centralisée où les candidats pourront soumettre leurs dossiers et suivre l'évolution de leur candidature, tandis que les administrateurs pourront gérer efficacement l'ensemble du processus de recrutement.
1.2 Objectifs du Projet
•	Développer une application web intuitive et responsive pour la gestion du recrutement des tuteurs
•	Simplifier le processus de candidature pour les postulants
•	Faciliter le traitement et le suivi des dossiers par les administrateurs
•	Améliorer la communication entre l'institution et les candidats
•	Garantir la sécurité et la confidentialité des données personnelles
•	Optimiser la gestion administrative des recrutements annuels
1.3 Public cible
Le système s'adresse à deux types d'utilisateurs :
•	Candidats : Étudiants ou professionnels souhaitant devenir tuteurs 
•	Administrateurs : Personnel responsable du recrutement à l'UNCHK.
________________________________________
2. Analyse des Besoins
2.1 Besoins Fonctionnels
2.1.1 Pour les Candidats
•	Création et gestion de compte utilisateur
•	Authentification sécurisée
•	Modification des informations personnelles
•	Consultation des annonces de recrutement
•	Soumission de candidature (nouvelle ou reconduction)
•	Téléchargement de documents justificatifs
•	Suivi de l'état d'avancement des candidatures
•	Réception de notifications par email
2.1.2 Pour les Administrateurs
•	Gestion des comptes administrateurs
•	Publication d'annonces de recrutement
•	Consultation et recherche des candidatures
•	Traitement des dossiers (validation/refus)
•	Gestion des années académiques
•	Envoi de notifications automatiques
•	Génération de rapports statistiques
Diagramme de classe :
 https://drive.google.com/file/d/1-E8xU8jVW4jZYgRpDijt7F0KJH4Wydx_/view?usp=sharing
Diagramme de cas d’utilisation :
https://drive.google.com/file/d/1WV01fKOVAxwoWMLpiU2radhK4odMy-Dk/view?usp=sharing
2.2 Besoins Non-Fonctionnels
•	Sécurité : Authentification robuste, protection des données personnelles, chiffrement des mots de passe
•	Performance : Temps de réponse rapide, gestion efficace des ressources serveur
•	Convivialité : Interface intuitive et accessible sur différents appareils
•	Évolutivité : Possibilité d'ajouter de nouvelles fonctionnalités sans refonte majeure
•	Disponibilité : Application accessible 24/7 avec un taux de disponibilité élevé
•	Maintenance : Documentation complète pour faciliter la maintenance
________________________________________
3. Architecture Technique
3.1 Stack Technologique
Le projet sera développé en utilisant une architecture moderne basée sur les technologies suivantes :
•	Backend : Spring Boot (Java)
•	Frontend : Angular
•	Base de données : MySQL
•	Gestion de l'authentification : JWT (JSON Web Tokens)
•	API : REST Outils de Développement
•	UI/UX :  Figma
•	Service d'envoi d'emails : SendGrid / JavaMailSender
•	Gestion de version : Git, Github

3.2 Modèle de Données
Le schéma de base de données comprendra les entités principales suivantes :
•	users : Représente les utilisateurs du système, incluant aussi bien les candidats que les administrateurs.
•	admins : Table spécifique contenant les informations des administrateurs (peut être liée à users pour les privilèges spécifiques).
•	candidats : Détaille les informations personnelles des candidats inscrits au recrutement.
•	annees_academiques : Permet la gestion des différentes années académiques disponibles.
•	annonces : Contient les annonces de recrutement des tuteurs avec les détails des postes proposés.
•	candidatures : Correspond aux dossiers de candidature soumis par les candidats en réponse aux annonces.
•	documents : Regroupe les fichiers justificatifs fournis par les candidats (CV, diplômes, etc.).
•	candidature_documents : Fait le lien entre une candidature et les documents associés.
•	formats-documents : Définit les types de formats acceptés pour les documents (PDF, DOCX, etc.).
•	types_documents : Définit les différentes catégories de documents requis (CV, lettre de motivation, etc.).
•	files : Table utilisée pour stocker les fichiers téléversés dans le système.
•	notifications : Gère l’envoi et l’historique des notifications (emails, messages) envoyées aux utilisateurs.
 
schéma de base de données
________________________________________
4. Conception Fonctionnelle
4.1 Processus de Candidature
1.	Inscription du candidat
o	Création de compte
o	Remplissage du profil personnel
2.	Consultation des annonces
o	Liste des postes de disponibles
o	Filtrage annonces
3.	Soumission de candidature
o	Choix  de candidature
o	Remplissage du formulaire de candidature
o	Téléchargement des pièces justificatives
4.	Suivi du traitement
o	Visualisation de l'état d'avancement
o	Réception de notifications
4.2 Processus d'Administration
1.	Gestion des années académiques
o	Création d'une nouvelle année
o	Configuration des périodes de recrutement
2.	Publication des annonces
o	Création des offres de tutorat
o	Définition des critères et documents requis
3.	Traitement des candidatures
o	Consultation des dossiers reçus
o	Validation ou refus avec commentaires
o	Notification automatique aux candidats
4.	Reporting
o	Génération de statistiques
o	Export des données de recrutement
________________________________________
5. Maquettes et Interfaces
5.1 Page Publiques
Interface principale présentant les fonctionnalités essentielles et les annonces actives.
 
 

 
 
 
 
5.2 Espace Candidat
5.2.1 Tableau de Bord Candidat
Vue centralisée permettant au candidat de suivre ses candidatures et accéder aux différentes fonctionnalités.
 
5.2.2 Formulaire de Candidature
Interface de soumission de candidature avec téléchargement de documents.
 
5.2.3 Suivi de Candidature
Visualisation détaillée de l'état d'avancement d'une candidature.
 
5.3 Espace Administrateur
5.3.1 Tableau de Bord Administrateur
Vue d'ensemble des statistiques et des actions à effectuer.
 
5.3.2 Gestion des Candidatures
Interface de traitement des dossiers reçus.
 
5.3.3 Publication d'Annonce
Formulaire de création d'une nouvelle offre de tutorat.
 


Voir la maquette entière : 

https://www.figma.com/design/A6Tj1htWsGqxK5OsaAoy5a/Recruitement-Tuteur---UNCHK?node-id=0-1&t=QRLpLh94FwEFXTvI-1
________________________________________
6. Planification du Projet
6.1 Phasage du Projet
Phase 1: Initialisation et Conception
•	Analyse détaillée des besoins
•	Conception de l'architecture technique
•	Modélisation de la base de données
•	Création des maquettes d'interface
Phase 2: Développement du Backend 
•	Mise en place de l'infrastructure technique
•	Développement des API REST
•	Implémentation de la logique métier
•	Système d'authentification et de gestion des rôles
Phase 3: Développement du Frontend 
•	Intégration des maquettes
•	Développement des composants Angular
•	Connexion avec les API Backend
•	Tests d'intégration
Phase 4: Tests et Déploiement 
•	Tests unitaires et fonctionnels
•	Tests de performance et de sécurité
•	Correction des bugs identifiés
•	Déploiement sur l'environnement de production
________________________________________
7. Gestion des Risques
Risque	Probabilité	Impact	Mesures de mitigation
Délais de développement sous-estimés	Moyenne	Élevé	Planning avec marge de sécurité, priorisation des fonctionnalités
Problèmes d'intégration entre Front et Back	Moyenne	Moyen	Mise en place précoce d'un environnement d'intégration continue
Résistance au changement des utilisateurs	Faible	Moyen	Formation des utilisateurs, documentation claire, période de transition
Problèmes de sécurité des données	Faible	Élevé	Audit de sécurité régulier, tests de pénétration
Indisponibilité des ressources techniques	Faible	Moyen	Plan de redondance, hébergement cloud sécurisé

________________________________________
8. Plan de Test
8.1 Tests Unitaires
•	Validation des fonctions individuelles du code
•	Couverture de code > 80%
8.2 Tests d'Intégration
•	Vérification de la communication entre les composants
•	Validation des flux de données
8.3 Tests Fonctionnels
•	Scénarios utilisateurs complets
•	Validation des cas d'utilisation principaux
8.4 Tests de Performance
•	Temps de réponse sous charge
•	Comportement avec volume important de données
8.5 Tests de Sécurité
•	Validation de l'authentification
•	Tests de vulnérabilités courantes (injection SQL, XSS)
•	Protection des données sensibles
________________________________________
10. Conclusion
Le projet d'application de gestion du recrutement des tuteurs pour l'UVS représente une avancée significative dans la modernisation des processus administratifs de l'université. Cette solution numérique permettra d'optimiser considérablement le processus de recrutement en offrant:
•	Une interface intuitive et accessible pour les candidats
•	Un outil de gestion efficace pour les administrateurs
•	Une transparence accrue dans le suivi des candidatures
•	Une réduction des délais de traitement des dossiers
•	Une sécurisation des données personnelles
11. Perspectives d'Évolution
À terme, cette application pourrait être étendue pour:
•	Intégrer un système d'évaluation des performances des tuteurs
•	Mettre en place un système d'analyse avancée pour optimiser les recrutements futurs
Liens externes utiles :
Diagramme de classe :
 https://drive.google.com/file/d/1-E8xU8jVW4jZYgRpDijt7F0KJH4Wydx_/view?usp=sharing
Diagramme de cas d’utilisation :
https://drive.google.com/file/d/1WV01fKOVAxwoWMLpiU2radhK4odMy-Dk/view?usp=sharing
Voir la maquette entière : 
https://www.figma.com/design/A6Tj1htWsGqxK5OsaAoy5a/Recruitement-Tuteur---UNCHK?node-id=0-1&t=QRLpLh94FwEFXTvI-1

Répertoire Github du projet :
https://github.com/tourecodeur/Projet-Techno-web-M1.git

Vidéo de présentation du projet :
https://drive.google.com/file/d/1zIJEeoVkveGzlUB_JTcUWmD-llNFSaDQ/view?usp=sharing

Accès à l'Application Identifiants de test : 

   - Administrateur : 	
 	Email : adminTest@gmail.com 
Mot de passe : test123 
   
  - Candidat : 
Email : candidatTest@gmail.com 
Mot de passe : test123
________________________________________Document préparé par: Macoumba Touré
Date: 25 avril 2025
Version: 1.0
