# Maquette Manajemen Angkutan — règles de travail

Maquette de démonstration d'une application de gestion de transport routier
Pekanbaru–Medan, montrée à une **partenaire indonésienne qui connaît le
métier**. Le réalisme prime sur la complétude fonctionnelle : un écran
crédible vaut mieux qu'une logique complète, et tout ce qui ressemble à un
placeholder ruine la démonstration.

En ligne : https://powershot.github.io/angkutan-demo/

---

## Règles d'interface

Issues des retours du propriétaire du projet. **Les enfreindre a déjà produit
des défauts qu'il a fallu corriger.**

- **Un état qui demande une décision ne doit jamais être en gris à 11 px.**
  Il porte une pastille, une couleur et une icône. Les compteurs de trajets
  et l'état de la flotte étaient chuchotés sous le montant : personne ne les
  voyait.
- **Un bouton nomme ce qu'il fait.** « Mulai muat », pas « Ubah Status ».
  Le cas courant doit être un seul appui sur un bouton explicite, jamais un
  menu à sept entrées à lire au volant.
- **Chaque étape de trajet a sa couleur et son icône** (`src/lib/status.js`).
  Cinq statuts partageaient la même couleur : changer d'étape ne se voyait
  pas. Les teintes restent profondes et peu saturées, et n'apparaissent que
  sur la pastille, le bandeau et la frise — la couleur signale l'état, elle
  ne décore pas.
- **Ce qui alerte remonte en tête**, avec un tri stable pour qu'en régime
  normal les lignes gardent leur place.
- **Nommer l'objet concerné**, pas le compter. « BM 9317 UY · 19 Sep », pas
  « 1 document » : c'est ce qui évite d'oublier un camion.
- **L'application ne dessine pas de barre d'état.** Sur un téléphone, la
  barre système et la barre d'URL sont déjà là ; une troisième trahit la
  maquette. Elle n'apparaît qu'au-dessus de 768 px, où l'app est affichée
  dans un cadre de téléphone centré.
- **Aucune icône sans son libellé**, aucun menu hamburger, aucune action
  derrière un balayage ou un appui long. Confirmation avant tout changement
  d'état.
- **Mobile d'abord, usage à une main.** Cible de test : **360 × 640**, la
  largeur Android d'entrée de gamme. Vérifier aussi 390 × 844 et qu'un écran
  large ne casse rien — sans concevoir de version dédiée.
- Le sélecteur **ID / EN** est accessible depuis l'en-tête de chaque écran.

## Données et langue

- **Toutes les données de démo dans `src/data/demoData.js`**, tous les
  libellés dans `src/i18n/{id,en}.js`. Rien en dur dans un écran. La parité
  des clés entre les deux langues est vérifiable en une commande (voir
  `docs/donnees.md`).
- **Ne jamais recalculer les chiffres fournis** : ils viennent de sources
  réelles. Les valeurs déduites ou inventées sont balisées `▼ … INVENTÉ ▼`
  dans `demoData.js` et listées dans `docs/donnees.md`.
- **Termes réels du métier en indonésien**, pas une traduction depuis
  l'anglais : `surat jalan`, `uang jalan`, `solar`, `muatan balik`,
  `jatuh tempo`, `bongkar muat`, `pungutan di jalan`.
- **Formats indonésiens partout** : `Rp 13.000.000` (point de milliers,
  espace insécable après Rp), `26 Agustus 2026`, `21.40 WIB` (point, pas
  deux-points), `8,0 ton` (virgule décimale), `+62 812-…`.
- `NOW` en tête de `demoData.js` fixe l'heure « maintenant » de toute la
  démo — une seule ligne à changer pour la rafraîchir.

## Interdits

- **Aucun logo de marque réelle** (WhatsApp compris : bulle générique dans le
  vert de la messagerie, avec le mot écrit).
- **Aucun emblème d'État** sur la KTP : rosette guillochée neutre.
- **Aucune photo de personne réelle** sur une carte d'identité factice. Les
  deux portraits sont générés (`docs/prompts-photos.md`).
- **Ne pas télécharger de tuiles OpenStreetMap en masse** : leur politique
  l'interdit et leur serveur renvoie une image « Access blocked ». Le repli
  hors ligne est un fond vectoriel Natural Earth, domaine public.

## Pièges techniques déjà rencontrés

- **CSS non calqué bat CSS calqué.** Un reset `button{padding:0}` écrit hors
  `@layer` écrasait le padding de tous les boutons. Les resets vont dans
  `@layer base`. Même piège avec `leaflet.css`, qui n'est pas calqué : ses
  surcharges doivent rester **hors** `@layer components`.
- **Ordre des règles.** Une règle générique écrite après sa media query
  l'écrase. Le cas mobile d'abord, l'écran large ensuite.
- **Leaflet monte jusqu'à z-index 800.** Toute feuille basse ouverte
  au-dessus d'une carte passe derrière si la carte n'a pas son propre
  contexte d'empilement (`isolation: isolate`).
- **`transform: scale()` ne change pas la place occupée dans le flux** :
  agrandir ainsi un élément le fait déborder sur ses voisins.
- **Un `<span>` dans un `divIcon` Leaflet est `display:inline`** : largeur,
  hauteur et rayon sont ignorés.

## Vérifier avant d'affirmer

- **La mesure du DOM ne suffit pas — regarder la capture.** Une feuille basse
  mesurée correctement placée s'affichait en réalité derrière la carte.
- **Lire la page avant que la feuille de style soit appliquée donne de faux
  négatifs.** Attendre `networkidle`, pas `domcontentloaded`.
- **Le CDN de GitHub Pages sert du contenu périmé** pendant quelques minutes
  après un déploiement. Vérifier avec un paramètre anti-cache
  (`?cb=$RANDOM`), sinon on croit à un échec qui n'existe pas.
- **Vérifier une suppression sur `git ls-files` ET sur le disque.** 91 tuiles
  annoncées supprimées sont restées suivies et déployées pendant plusieurs
  versions.
- Commandes utiles : `npm run build` (doit passer sans erreur),
  `npx oxlint src/` (zéro variable inutilisée), et la parité i18n.

## Où sont les choses

| | |
|---|---|
| `docs/donnees.md` | où changer chaque chiffre, ce qui est inventé |
| `docs/prompts-photos.md` | régénérer un portrait |
| `docs/deploiement.md` | `npm run deploy` → branche `gh-pages` |
| `docs/decisions.md` | journal des décisions et des erreurs corrigées |
