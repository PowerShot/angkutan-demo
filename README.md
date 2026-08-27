# Manajemen Angkutan — maquette de démonstration

Maquette navigable d'une application de gestion pour une petite activité de
transport routier entre **Pekanbaru et Medan**, sur l'île de Sumatra.

Interface **bilingue indonésien / anglais**, indonésien par défaut, sélecteur
de langue accessible depuis n'importe quel écran. Conçue **mobile d'abord**,
pour un usage à une main.

> Démonstration à données factices. Aucun serveur, aucune persistance :
> recharger la page remet tout à l'état initial.

## Démarrer

```bash
npm install
npm run dev
```

## Les écrans

**Propriétaire / admin** — accueil et rentabilité du mois · liste et détail
des trajets · création de commande en trois étapes · dépenses et
justificatifs · statut du trajet · suivi de position avec sélecteur de
véhicule · factures et alertes d'échéance · flotte, chauffeurs, clients.

**Chauffeur** — mission en cours · saisie des frais de route avec photo de
justificatif · envoi de position aux points de passage.

## Les deux fichiers à modifier

| Fichier | Contenu |
|---|---|
| `src/data/demoData.js` | 100 % des données de démonstration |
| `src/i18n/id.js` et `en.js` | 100 % des libellés, statuts et messages |

Rien n'est écrit en dur dans les écrans.

## Documentation

- [`CLAUDE.md`](CLAUDE.md) — **les règles de travail** : interface, données,
  interdits, pièges déjà rencontrés
- [`docs/donnees.md`](docs/donnees.md) — où changer chaque chiffre
- [`docs/prompts-photos.md`](docs/prompts-photos.md) — remplacer les portraits
- [`docs/deploiement.md`](docs/deploiement.md) — publier une mise à jour
- [`docs/decisions.md`](docs/decisions.md) — choix faits et pourquoi

## Pile

React 19 · Vite 8 · Tailwind 4 · React Router 7 · Leaflet.
Polices auto-hébergées (Plus Jakarta Sans, DM Mono).
Fond de carte © OpenStreetMap en ligne, avec fond vectoriel Natural Earth
(domaine public) en secours hors ligne.
