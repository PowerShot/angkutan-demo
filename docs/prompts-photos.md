# Portraits des chauffeurs — prompts prêts à copier

Les photos actuelles sont **temporaires**. Ce fichier contient les prompts à
donner à Nano Banana (ou à tout autre générateur d'images) pour les remplacer
par des visages générés, cohérents avec les âges de la fiche.

## Pourquoi remplacer

- **Hendra Gunawan** utilise aujourd'hui une photo libre de droit d'une
  personne réelle. Elle apparaît sur sa fiche **et sur la reproduction de sa
  KTP**. Diffuser publiquement une carte d'identité factice portant le visage
  d'un individu réel n'est pas souhaitable : ce remplacement règle le point.
- **Sudarmanto** n'a pas de photo. Le fonds libre de droit ne contient
  pratiquement aucun portrait d'Indonésien en âge de travailler cadré en
  buste — presque tout est folklorique ou âgé. Sa fiche affiche donc un
  avatar aux initiales en attendant.

## Où déposer les fichiers

```
public/photos/sudarmanto.jpg
public/photos/hendra.jpg
```

Format attendu : **JPEG, portrait 3:4, 480 × 640 px minimum**, cadrage
tête-épaules, visage centré horizontalement et placé au tiers supérieur.

Puis, dans `src/data/demoData.js`, renseigner le nom du fichier :

```js
photo: 'sudarmanto.jpg',
photoFocus: '50% 36%',   // ajuste le cadrage du visage si besoin
```

`photoFocus` est un `object-position` CSS : le premier nombre décale
horizontalement, le second verticalement. Baisser la valeur remonte le visage.

---

## Prompt 1 — Sudarmanto, 41 ans

```
Photorealistic head-and-shoulders portrait of a 41-year-old Indonesian man
from Riau, Sumatra. Long-distance truck driver. Warm medium-brown skin,
short black hair with a few grey strands at the temples, thin moustache,
slight crow's feet, calm and direct gaze into the camera, faint natural
smile. Wearing a plain dark navy short-sleeve collared shirt.
Photographed outdoors in soft overcast daylight, shallow depth of field,
plain neutral blurred background. Natural skin texture, no retouching,
no studio lighting, no logos, no text. Documentary photography style,
85mm lens. Vertical 3:4 framing, head centred, eyes on the upper third.
```

## Prompt 2 — Hendra Gunawan, 34 ans

```
Photorealistic head-and-shoulders portrait of a 34-year-old Indonesian man
from Riau, Sumatra. Long-distance truck driver. Medium-brown skin, short
neatly combed black hair, clean-shaven, relaxed confident expression
looking straight into the camera. Wearing a plain charcoal grey polo shirt.
Photographed outdoors in soft overcast daylight, shallow depth of field,
plain neutral blurred background. Natural skin texture, no retouching,
no studio lighting, no logos, no text. Documentary photography style,
85mm lens. Vertical 3:4 framing, head centred, eyes on the upper third.
```

---

## Si le rendu ne convient pas

Ajouts utiles à la fin du prompt, un seul à la fois :

| Problème | À ajouter |
|---|---|
| Visage trop jeune | `visible age lines on the forehead, mature features` |
| Trop « studio » | `candid, taken on a phone camera, slightly imperfect framing` |
| Trop souriant | `neutral expression, mouth closed` |
| Traits pas assez indonésiens | `Malay-Indonesian facial features, Sumatran` |
| Cadrage trop large | `tight crop, shoulders visible at the bottom edge of the frame` |

## Variante pour la photo de la KTP

La reproduction de la carte d'identité réutilise automatiquement le même
fichier. Pour une photo d'identité plus conforme, générer une seconde image
avec ce complément et l'enregistrer sous `sudarmanto-ktp.jpg` :

```
...plain light blue background, frontal passport-photo framing,
neutral expression, even lighting, no shadows on the background.
```

Il faut alors ajouter un champ `photoKtp` dans `demoData.js` et l'utiliser
dans `src/components/KtpCard.jsx` (une ligne à changer, la variable `photo`).
