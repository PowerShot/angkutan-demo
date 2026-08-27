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

Le fond de carte utilise les tuiles OpenStreetMap **en ligne**. Si une tuile
ne répond pas — réseau faible, pas de connexion — l'application bascule
automatiquement sur le jeu de tuiles embarqué dans `public/tiles`, qui
couvre le corridor Pekanbaru–Medan aux zooms 6 à 8 (91 tuiles, 740 Ko).

La démo fonctionne donc même sans réseau, avec un zoom borné au corridor.
Aucune clé d'API, aucun compte, aucune facturation.

## Ce qui n'est pas dans la maquette

Pas de serveur, pas de base de données, pas d'authentification réelle, pas de
persistance : recharger la page remet la démonstration à son état initial.
C'est voulu — la démo peut être rejouée à l'identique autant de fois que
nécessaire.
