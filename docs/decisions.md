# Décisions prises sans validation

> Ce fichier est un **journal** : ce qui a été décidé et pourquoi.
> Les **règles à suivre** qui en découlent sont dans `CLAUDE.md`, à la racine,
> qui est chargé automatiquement à chaque session de travail.

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
| **Deux visages générés**, plus aucune personne réelle | Le fonds libre de droit ne contient pratiquement aucun portrait d'Indonésien en âge de travailler cadré en buste : un seul visage exploitable trouvé, et toutes les autres photos de la série étaient le même homme. Les deux portraits ont finalement été générés depuis les prompts fournis, ce qui retire toute personne réelle des fiches et des reproductions de KTP. |
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

Le cache a été remplacé par un **fond vectoriel Natural Earth**
(domaine public) : côtes et lacs réels de la région, 108 Ko, dessiné en
permanence sous les tuiles. C'est de la vraie géographie — on y reconnaît la
côte est de Sumatra, le détroit de Malacca et le lac Toba — et c'est
juridiquement propre.

## Ajout du second camion (demandé après coup)

Le suivi de position ne montrait qu'un camion, sans moyen d'en changer. Trois
verrous : `activeTrip()` renvoyait le premier trajet non terminé, l'écran en
déduisait le camion sans jamais le choisir, et `telemetry` était un objet
unique et non une liste.

| Décision | Raison |
|---|---|
| Un second camion **inventé et balisé** | Impossible de démontrer un sélecteur avec un seul véhicule. Tous les blocs concernés sont encadrés par des commentaires `▼ … INVENTÉ ▼` et listés dans `docs/donnees.md`, pour être retirables d'un bloc. |
| Un **troisième chauffeur** plutôt que de mettre Hendra en route | Le cahier des charges fixait Hendra comme « disponible ». Ajouter une entité laisse la donnée fournie intacte ; la modifier l'aurait écrasée. |
| Carrosserie **plateau** pour le second camion | Exerce l'autre type de carrosserie du cahier des charges, jusque-là inutilisé. |
| Statut **« Tiba di lokasi bongkar », moteur coupé** | Le sélecteur ne vaut que s'il montre deux situations réellement différentes : l'un roule à 62 km/h, l'autre est à quai à 0 km/h. |
| Coût par trajet **dérivé du camion** | Les loyers diffèrent (25.000.000 et 22.000.000). Le Fuso retombe exactement sur les 16.726.666 fournis. |
| Mention **« BM 8241 UZ saja »** sous les charges mensuelles | Les Rp 62.800.000 fournis ne couvrent que le premier camion. Plutôt qu'inventer un total de flotte, l'app dit ce que le chiffre couvre. |
| Sélecteur affiché **seulement si plusieurs camions roulent** | Avec une flotte d'un seul véhicule, un sélecteur à une entrée serait du bruit. |

## « Pilih status lain » se lisait comme un intertitre

L'action secondaire du chauffeur était un texte centré, gras, en gris —
sans fond, sans contour, sans icône, posé sous un bouton plein. Elle avait
toutes les caractéristiques d'un titre de section et aucune de celles d'un
bouton.

Elle est devenue un bouton contourné avec icône, 40 px de haut contre 52 pour
l'action principale : la hiérarchie distingue les deux, l'affordance ne
disparaît pas. « Lihat semua » a gagné un chevron au passage.

Un contrôle a été passé sur l'ensemble des éléments cliquables : chacun porte
désormais un fond, un contour, un chevron ou une icône.

## Le chiffre en tête disait autre chose que ce qu'on lisait

Le bandeau affichait « Laba perjalanan Rp 7.093.336 ». Deux défauts, dont un
qui induisait franchement en erreur :

- le montant **mélangeait 3.046.668 de marge réalisée et 4.046.668 de
  prévisionnel** sur deux trajets encore en route, sans le dire ;
- il était posé juste au-dessus de « Biaya operasional Rp 62.800.000 », alors
  que **4 des 9 postes de ce total — sewa truk, solar, tol, sopir, soit
  50.180.000 — sont déjà déduits** par la formule de marge. La lecture
  naturelle « j'ai gagné 7 M et dépensé 62,8 M » était fausse.

| Décision | Raison |
|---|---|
| Le montant en tête ne compte que les **trajets terminés** | Un chiffre annoncé comme un gain doit être un gain acquis. |
| La **projection est une ligne distincte**, jamais fondue dans le total | Elle reste visible, mais on ne peut plus la confondre avec du réalisé. |
| Les charges mensuelles **quittent l'accueil** pour l'écran Laba | Elles n'ont de sens qu'à côté de leur ventilation. |
| Cette ventilation sépare **« Sudah dikurangi » (50.180.000)** de **« Belum dikurangi » (12.620.000)** | C'est la seule façon de rendre le rapport entre marge et charges lisible sans formation comptable. |
| Le bandeau rouge de retard de paiement **est supprimé** | Il faisait doublon avec la ligne Tagihan du bloc d'état. Cette ligne nomme désormais le débiteur et son retard : « 16 hari · PT Anugrah Boga Nusantara ». |

## L'état de l'exploitation, d'un coup d'œil

L'accueil répondait à « combien j'ai gagné » mais pas à « est-ce que tout
tourne, et qu'est-ce que j'oublie ». Les compteurs étaient chuchotés en petit
sous le montant, et **l'état de la flotte n'apparaissait nulle part** — il
fallait aller dans Data → Armada. Le KIR du second camion expirait dans
24 jours sans que rien ne le signale.

| Décision | Raison |
|---|---|
| Bloc **Status operasional** de quatre lignes : armada, sopir, documents, tagihan | Répond en une lecture aux quatre questions qu'un propriétaire se pose en ouvrant l'application. Chaque ligne mène à son écran. |
| **Tri par urgence**, rouge d'abord puis ambre | Le KIR à 24 jours remonte en tête au lieu de dormir en quatrième position. Le tri est stable : en régime normal les lignes gardent leur place habituelle. |
| Les lignes **nomment** ce qui pose problème | « BM 9317 UY · 19 Sep » plutôt que « 1 document » : c'est ce qui évite d'oublier un camion. Un camion sans trajet en cours serait nommé de la même façon. |
| Compteurs de trajets **en pastilles** dans le bandeau | « 4 perjalanan · 2 sedang berjalan » était écrit en 12 px translucide sous le montant. Trois pastilles lisibles à la place. |
| Relevé GPS de plus de deux heures marqué **« Data lama »** | Un relevé qui date n'est pas une information neutre. La ligne le dit au lieu de le murmurer en gris. |

## Statuts : couleur, icône, et un bouton qui dit ce qu'il fait

Le changement de statut côté chauffeur n'était pas intuitif et un changement
se voyait à peine. Trois causes :

- **cinq statuts sur sept partageaient la même couleur**, donc passer d'une
  étape à l'autre ne changeait presque rien à l'écran ;
- aucun statut n'avait d'icône : les sept lignes étaient identiques ;
- le bouton disait « Ubah Status », une formule abstraite, puis imposait de
  lire sept libellés — au volant, d'une main. Un appui sur une ligne
  appliquait le changement **sans confirmation**.

Ce qui a été fait :

| Décision | Raison |
|---|---|
| **Une icône et une couleur par étape** (`src/lib/status.js`) | Un changement de statut se voit sans avoir à lire. Sept teintes profondes et peu saturées, de la même famille, employées uniquement par la pastille, le bandeau et la frise — la couleur signale l'étape, elle ne décore pas. |
| **Le bouton nomme l'action** : « Mulai muat », « Tiba di lokasi bongkar » | Le cas courant devient un seul appui sur un bouton qui dit ce qu'il fait, au lieu d'un menu à sept entrées. |
| **Le bouton porte la couleur de l'étape qu'il déclenche** | La chaîne bouton → badge → frise se lit d'une seule traite. |
| **Confirmation « Dari → Ke »** avec les deux statuts en couleur | Un appui accidentel ne change plus l'état du trajet, et le conducteur voit le changement avant de le valider. |
| « Pilih status lain » en second rang | Corriger une erreur reste possible sans encombrer le geste courant. |
| Frise de sept segments + « Langkah 3 dari 7 » écrit en toutes lettres | Répond à « où j'en suis » sans lecture. |

Corrige aussi : le message de confirmation s'affichait **par-dessus** la
feuille basse, alors que la feuille est la surface active.

## Barre d'état simulée : retirée du téléphone

Une fausse barre d'état — heure, réseau, batterie — était dessinée en haut de
chaque écran. Sur un vrai téléphone elle en faisait **trois empilées** : la
barre système d'Android, la barre d'URL du navigateur, puis la fausse. Le
rendu trahissait la maquette au lieu de la crédibiliser.

Elle appartient au **cadre de présentation**, pas à l'application. Elle est
donc masquée sous 768 px, et conservée au-dessus, là où l'application est
affichée dans une colonne centrée à largeur de téléphone où elle complète le
cadrage.

L'en-tête assume désormais lui-même l'encoche
(`padding-top: max(env(safe-area-inset-top), 12px)`), et le `theme-color`
`#0F4E5C` déjà posé teinte la barre du navigateur Android en pétrole : la
continuité se fait avec la vraie barre système plutôt que contre elle.

Au passage, le bouton de connexion n'est plus ancré en bas d'écran : sur un
téléphone haut, l'ancrage creusait un vide de 250 px au milieu du formulaire.

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
- Les calques internes de Leaflet montent jusqu'à z-index 800 : la feuille
  basse de sélection du véhicule s'ouvrait **derrière la carte**. Corrigé en
  isolant le contexte d'empilement de la carte (`isolation: isolate`) plutôt
  qu'en surenchérissant sur les z-index de l'application.
- La carrosserie était écrite en dur sur l'écran Armada : le second camion,
  un plateau, s'affichait en « Wingbox ».
