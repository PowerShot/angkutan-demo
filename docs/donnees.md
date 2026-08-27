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
| `route` | `from` et `to` (les deux villes affichées dans l'interface), les 7 points de passage avec coordonnées réelles et leur `short` pour les libellés courts, et `shape` pour le tracé sur la carte |
| `tariffs` | tarif aller, tarif fret retour, pourcentage d'acompte (modèle camion loué au mois) |
| `destinations` | **modèle de carter** : trois destinations depuis Pekanbaru, avec le tarif facturé au client et le coût payé au transporteur |
| `costs` | coûts par aller-retour et récapitulatif mensuel |
| `tripCostBreakdown` | les 4 postes du calcul de rentabilité du tableau de bord |
| `trips` | les 3 trajets du mois |
| `expenses` | dépenses ligne à ligne, avec le contenu des justificatifs |
| `invoices` | factures, échéances, statut payé ou en attente |
| `positions` | positions reçues par WhatsApp |
| `telemetry` | relevé du boîtier GPS du trajet en cours |

## Le second camion est inventé

La flotte compte **deux camions** dans la démo, alors que ton cahier des
charges n'en décrivait qu'un. Le second sert uniquement à démontrer le
sélecteur de véhicule de l'écran de suivi.

Tout ce qui le concerne est encadré dans `demoData.js` par des commentaires
`▼ … INVENTÉ ▼`. Pour revenir à une flotte d'un seul camion, supprimer :

| Bloc | Repère dans `demoData.js` |
|---|---|
| Camion `BM 9317 UY` | `▼ CAMION INVENTÉ ▼` |
| Chauffeur `D3` Anwar Siregar | `▼ CHAUFFEUR INVENTÉ ▼` |
| Trajet `PJL-2508-04` | `▼ TRAJET INVENTÉ ▼` |
| Ses 6 dépenses `E17` à `E22` | `▼ DÉPENSES INVENTÉES ▼` |
| Ses 7 positions | `▼ POSITIONS INVENTÉES ▼` |
| Son relevé GPS | entrée `'PJL-2508-04'` de `telemetry` |

Le sélecteur de véhicule disparaît alors automatiquement : il ne s'affiche
que lorsque plus d'un camion est en route.

**Ce que l'ajout déplace à l'écran.** Les chiffres du Fuso restent
strictement inchangés — ses trois trajets gardent leurs marges de
+6.773.334, −3.726.666 et +6.773.334, et son coût par trajet reste
16.726.666. En revanche :

- l'accueil annonce **4 perjalanan · 2 sedang berjalan** au lieu de 3 et 1 ;
- la marge du mois passe de **9.820.002** à **7.093.336**, le nouveau trajet
  étant projeté à −2.726.666 faute de fret retour ;
- la ligne des charges mensuelles porte la mention **« BM 8241 UZ saja »**,
  parce que tes Rp 62.800.000 ne couvrent que le premier camion. Le second
  a `monthlyOperating: null` : son coût mensuel n'est pas modélisé, et la
  mention de périmètre disparaîtra le jour où tu le renseigneras.

Le loyer étant différent d'un camion à l'autre, le coût par trajet est
maintenant **dérivé du véhicule** (`tripCostParts`) au lieu d'être figé.
Pour le Fuso loué 25.000.000, le calcul retombe exactement sur les
16.726.666 du cahier des charges.

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
5. **Distances et durées des destinations de carter** (`km`, `hours`) et
   coordonnées de Palembang et Jambi : ordres de grandeur, pas des chiffres
   fournis. Les tarifs, eux, sont ceux que tu as donnés.
6. **Nom du compte propriétaire** : `Bu Sari`. À remplacer par le prénom réel
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
