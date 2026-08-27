# Décisions prises sans validation

Consigné comme convenu : à partir de la consigne « itère sans plus me poser
de questions », voici tout ce que j'ai tranché seul et pourquoi.

## Produit

| Décision | Raison |
|---|---|
| Nom affiché **Manajemen Angkutan** | Purement fonctionnel, aucune identité de marque inventée, conformément au cahier des charges. |
| Compte propriétaire **Bu Sari** | Aucun prénom fourni. À remplacer par celui de la partenaire : une seule ligne dans `demoData.js`. |
| Horloge de la démo figée au **26 août 2026, 21.42 WIB** | C'est l'horodatage de la dernière position connue à Rantauprapat. Le trajet 3 est ainsi réellement « en cours » pendant la démonstration. Une constante `NOW` permet de rafraîchir. |
| **Écran de connexion** conservé | Une application qui démarre sur une connexion paraît en service. Il sert aussi de sélecteur de rôle. |
| **Deux rôles** avec bascule | Le mode dégradé WhatsApp n'a de sens que si l'on voit le chauffeur envoyer et l'admin saisir. |
| **11 écrans** au lieu des 5 demandés | Les données de référence du cahier des charges (flotte, chauffeurs, clients) devaient être visibles quelque part. |

## Rendu

| Décision | Raison |
|---|---|
| Police **Plus Jakarta Sans** | Dessinée pour la ville de Jakarta. Un vrai produit indonésien moderne l'utilise ; le choix a un sens local et évite le rendu générique. Auto-hébergée, 27 Ko, variable. |
| Police **DM Mono** pour plaques, codes et tickets | Sépare visuellement les données machine du texte lu. |
| Couleur primaire **pétrole profond `#0F4E5C`** | Sobre et professionnel, distinct du vert WhatsApp et du rouge d'alerte. Aucune décoration ajoutée. |
| **Pas de logo WhatsApp** | Le cahier des charges interdit de reproduire une marque réelle. Bulle de message générique dans le vert de la messagerie, avec le mot écrit. |
| **Pas d'emblème Garuda sur la KTP** | Reproduire un emblème d'État est à éviter. Remplacé par une rosette guillochée neutre, qui donne l'aspect officiel sans copier l'emblème. |
| Portrait réel pour **Hendra** (34 ans), avatar aux initiales pour **Sudarmanto** (41 ans) | Le fonds libre de droit ne contient pratiquement aucun portrait d'Indonésien en âge de travailler cadré en buste. Un seul visage exploitable a été trouvé, et toutes les autres photos de la série sont le même homme. Prompts de remplacement fournis. |
| Photo **recadrée** en 480 × 640 | La source était un plan large. Recadrage tête-épaules à la génération du dépôt, pour que l'avatar et la KTP soient corrects sans bricolage CSS. |

## Technique

| Décision | Raison |
|---|---|
| Routage par **hash** (`#/beranda`) | GitHub Pages ne réécrit pas les URL côté serveur. Bénéfice réel : le bouton retour d'Android fonctionne. |
| Carte : **tuiles en ligne + fond vectoriel de secours** | Voir ci-dessous : la première tentative, un cache de tuiles OpenStreetMap, a échoué et devait être abandonnée. |
| **Aucune persistance** | La démo se remet à zéro au rechargement, ce qui est souhaitable pour la montrer plusieurs fois. |
| Traduction : **hook maison de 30 lignes** plutôt que `react-i18next` | Une dépendance de moins, et le fichier de traduction reste lisible par un non-développeur. 244 clés, parité vérifiée entre les deux langues. |
| Dépôt **public** sur GitHub Pages | Demandé explicitement, le lien devant être partagé. |

## Une erreur, et ce qu'elle a changé

Le repli hors ligne devait d'abord être un **cache de 91 tuiles
OpenStreetMap**. À la vérification, 90 des 91 fichiers téléchargés étaient en
réalité la même image : l'avertissement « Access blocked — App is not
following the tile usage policy of OpenStreetMap's volunteer-run servers ».
Le téléchargement en masse avait déclenché leur protection anti-aspiration.

Sans cette vérification, la démonstration aurait affiché à la partenaire un
message accusant l'application de violer la politique d'OpenStreetMap dès la
moindre faiblesse de réseau.

Le cache a été supprimé et remplacé par un **fond vectoriel Natural Earth**
(domaine public) : côtes et lacs réels de la région, 108 Ko, dessiné en
permanence sous les tuiles. C'est de la vraie géographie — on y reconnaît la
côte est de Sumatra, le détroit de Malacca et le lac Toba — et c'est
juridiquement propre.

## Bugs corrigés en cours de route

- Les resets CSS (`button{padding:0}`) étaient **hors couche Tailwind** :
  une règle non calquée bat toujours une règle calquée, donc tous les boutons
  de l'application perdaient leur padding. Déplacés dans `@layer base`.
- Même piège avec les surcharges Leaflet, sorties de `@layer components`
  car `leaflet.css` n'est pas calqué.
- La coque n'était pas contrainte en hauteur : la barre de navigation basse
  sortait de l'écran au défilement.
- La règle générique `.app-shell` était écrite après sa media query et
  l'écrasait, ce qui cassait l'affichage en écran large.
- Les repères de carte étaient des `<span>` en `display:inline` : largeur et
  rayon ignorés, ils sortaient en carrés.
- `Rp` se détachait de son montant en fin de ligne. Espace insécable.
