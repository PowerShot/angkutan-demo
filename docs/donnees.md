# Où changer les chiffres

Toutes les données de démonstration sont dans **un seul fichier** :

```
src/data/demoData.js
```

Aucun montant, nom, date ou libellé n'est écrit en dur dans les écrans. Pour
passer aux vrais chiffres de la partenaire, ce fichier suffit.

## Règles d'écriture

| | Écrire | Ne pas écrire |
|---|---|---|
| Montants | `13000000` | `"Rp 13.000.000"` |
| Dates | `'2026-08-26'` | `'26/08/2026'` |
| Dates + heure | `'2026-08-26T21:40'` | `'26 Agu, 21.40'` |
| Tonnage | `8` ou `7.5` | `'8,0 ton'` |

Le formatage indonésien — `Rp 13.000.000`, `26 Agustus 2026`, `21.40 WIB`,
`8,0` — est appliqué automatiquement par `src/lib/format.js`.

## Repères dans le fichier

| Section | Ce qu'elle contient |
|---|---|
| `NOW` | l'heure « maintenant » de toute la démo. **Une seule ligne à changer** pour rafraîchir la date du trajet en cours. |
| `business` | nom affiché de l'app, nom et numéro du compte propriétaire, code de connexion |
| `trucks` | plaque, carrosserie, échéances STNK et KIR, loueur, loyer mensuel |
| `drivers` | nom, âge, WhatsApp, NIK, SIM, adresse KTP, statut, photo |
| `customers` | raison sociale, contact, adresses de chargement et de déchargement, tarif, délai de paiement |
| `route` | les 7 points de passage avec coordonnées réelles, et `shape` pour le tracé sur la carte |
| `tariffs` | tarif aller, tarif fret retour, pourcentage d'acompte |
| `costs` | coûts par aller-retour et récapitulatif mensuel |
| `tripCostBreakdown` | les 4 postes du calcul de rentabilité du tableau de bord |
| `trips` | les 3 trajets du mois |
| `expenses` | dépenses ligne à ligne, avec le contenu des justificatifs |
| `invoices` | factures, échéances, statut payé ou en attente |
| `positions` | positions reçues par WhatsApp |
| `telemetry` | relevé du boîtier GPS du trajet en cours |

## Points à vérifier en priorité

Ces valeurs sont des **déductions** faites faute d'information, pas des
données fournies. Elles se corrigent dans `demoData.js` :

1. **Facture de juillet en retard** (`INV/2026/07/019`, Rp 22.000.000)
   attribuée à PT Anugrah Boga Nusantara, seul client à 30 jours. Émise le
   11 juillet pour une échéance au 10 août, ce qui correspond aux dates
   fournies.
2. **Trajet 2** attribué à PT Deli Kemasan Prima, seul client à 45 jours,
   ce qui correspond à l'échéance du 1er octobre.
3. **Trajet 3** : aller pour PT Anugrah Boga Nusantara, fret retour réservé
   chez CV Sumber Tani Riau.
4. **Numéros de surat jalan**, adresses complètes des entrepôts, relevés du
   boîtier GPS (vitesse, cap, niveau de gazole), distances cumulées des
   points de passage et horodatages des dépenses du trajet en cours :
   inventés de façon cohérente.
5. **Nom du compte propriétaire** : `Bu Sari`. À remplacer par le prénom réel
   de la partenaire — c'est le détail qui rend la démo convaincante.

## Rentabilité

La formule appliquée est celle du cahier des charges :

```
laba = (tarif aller + tarif muatan balik)
     − (sewa truk + solar + tol + sopir)
```

Elle **exclut volontairement** la manutention, les paiements informels,
l'entretien et l'administratif. C'est une marge de trajet, pas un résultat
net. Le tableau de bord affiche à côté le total des charges mensuelles
(Rp 62.800.000) pour que la différence reste lisible.

Pour changer la formule, modifier `margin()` dans `src/store/index.jsx`.
