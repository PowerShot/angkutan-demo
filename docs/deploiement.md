# Publier et mettre à jour la démo

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse affichée. En local, le chemin de base est `/`.

## Publier une mise à jour

```bash
npm run deploy
```

Construit le projet et pousse `dist/` sur la branche `gh-pages`. La mise en
ligne prend une à deux minutes.

## Comment c'est câblé

- La branche **`main`** contient le code source.
- La branche **`gh-pages`** contient uniquement le site construit.
- GitHub Pages sert `gh-pages` à la racine du dépôt.
- `vite.config.js` fixe `base` à `/angkutan-demo/`, le chemin du dépôt sur
  `github.io`. Pour publier ailleurs, changer cette valeur, ou lancer avec
  `VITE_BASE=/ npm run build` pour une racine de domaine.

## La carte

Deux couches superposées :

1. **un fond vectoriel** — les côtes et les lacs réels de la région, issus de
   [Natural Earth](https://www.naturalearthdata.com/) qui est dans le domaine
   public. Il est embarqué dans `src/data/basemap.json` (108 Ko, 40 Ko une
   fois compressé) et dessiné en permanence **sous** les tuiles ;
2. **les tuiles OpenStreetMap en ligne**, qui le recouvrent.

Si une tuile ne répond pas — réseau faible, pas de connexion — elle devient
transparente et le fond vectoriel apparaît, avec une pastille « Peta luring ».
La bascule est donc immédiate et sans clignotement, sans avoir à détecter une
panne réseau.

Aucune clé d'API, aucun compte, aucune facturation, et **aucune tuile
OpenStreetMap n'est mise en cache** : leur politique d'usage interdit le
téléchargement en masse, et le fond vectoriel remplit ce rôle légalement.

## Ce qui n'est pas dans la maquette

Pas de serveur, pas de base de données, pas d'authentification réelle, pas de
persistance : recharger la page remet la démonstration à son état initial.
C'est voulu — la démo peut être rejouée à l'identique autant de fois que
nécessaire.
