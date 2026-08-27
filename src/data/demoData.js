/* =========================================================================
   DONNÉES DE DÉMONSTRATION — FICHIER UNIQUE
   -------------------------------------------------------------------------
   Tout ce que la démo affiche vient d'ici. Aucun chiffre, nom, date ou
   montant n'est écrit en dur dans les écrans.
   Pour passer aux vrais chiffres : modifier ce fichier, rien d'autre.

   Montants : nombres entiers en roupies (Rp). Le formatage est fait par
   src/lib/format.js — ne pas écrire "Rp 13.000.000" ici, écrire 13000000.
   Dates    : chaînes ISO "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm".
   ========================================================================= */

/* -- Horloge de la démo ---------------------------------------------------
   « Maintenant » pour toute l'application. Calée sur la dernière position
   connue du trajet en cours, pour que la démo montre un trajet réellement
   en route. Changer cette seule ligne rafraîchit toute la démo.          */
export const NOW = '2026-08-26T21:42'

export const business = {
  appName: 'Manajemen Angkutan',
  owner: 'Bu Sari',            // ← nom affiché du compte propriétaire
  ownerPhone: '+62 811-7654-2210',
  loginCode: '4417',
  city: 'Pekanbaru',
}

/* -- Flotte -------------------------------------------------------------- */
export const trucks = [
  {
    id: 'BM8241UZ',
    plate: 'BM 8241 UZ',
    brand: 'Mitsubishi Fuso Fighter',
    bodyType: 'wingbox',          // 'wingbox' (caisse fermée) | 'bak' (plateau)
    registeredIn: 'Pekanbaru',
    stnkExpiry: '2027-03-14',
    kirExpiry: '2026-11-09',
    lessor: 'CV Rifky Trans',
    lessorCity: 'Pekanbaru',
    lessorPhone: '+62 812-6811-4402',
    monthlyRent: 25000000,
    monthlyOperating: 62800000,   // charges du mois pour CE camion (chiffre fourni)
    status: 'jalan',              // 'jalan' | 'siap'
  },

  /* ─────────────────────────────────────────────────────────────────────
     ▼ CAMION INVENTÉ ▼  — ajouté pour démontrer le sélecteur de véhicule.
     Ne correspond à aucune donnée réelle. Pour revenir à une flotte d'un
     seul camion, supprimer ce bloc, le chauffeur D3, le trajet
     PJL-2508-04 et ses dépenses, positions et relevé GPS.
     ───────────────────────────────────────────────────────────────────── */
  {
    id: 'BM9317UY',
    plate: 'BM 9317 UY',
    brand: 'Hino Ranger FM 260 JD',
    bodyType: 'bak',              // plateau — l'autre carrosserie du cahier des charges
    registeredIn: 'Pekanbaru',
    stnkExpiry: '2027-01-28',
    kirExpiry: '2026-09-19',      // bientôt échu : déclenche l'alerte la plus forte
    lessor: 'H. Bakri Transport',
    lessorCity: 'Pekanbaru',
    lessorPhone: '+62 813-6577-2038',
    monthlyRent: 22000000,
    monthlyOperating: null,       // non modélisé : ce camion vient d'entrer en flotte
    status: 'jalan',
  },
]

/* -- Chauffeurs ---------------------------------------------------------- */
export const drivers = [
  {
    id: 'D1',
    name: 'Sudarmanto',
    age: 41,
    whatsapp: '+62 812-6754-3391',
    nik: '1471062604850002',      // encode la naissance : 26-04-1985
    birthPlace: 'Pekanbaru',
    birthDate: '1985-04-26',
    bloodType: 'B',
    address: 'JL. GARUDA SAKTI KM. 3 NO. 14',
    rtRw: '003/007',
    village: 'AIR PUTIH',
    district: 'TAMPAN',
    religion: 'ISLAM',
    maritalStatus: 'KAWIN',
    ktpIssued: '2016-02-19',
    licence: '8504-2671-0913',
    licenceClass: 'B2 Umum',
    licenceExpiry: '2028-05-22',
    status: 'jalan',              // 'jalan' (en route) | 'siap' (disponible)
    // Aucune photo libre de droit convenable trouvée pour ce profil : repli
    // sur un avatar aux initiales. Déposer public/photos/sudarmanto.jpg et
    // remettre le nom de fichier ici. Prompt prêt : docs/prompts-photos.md
    photo: null,
    photoFocus: '50% 20%',
  },
  {
    id: 'D2',
    name: 'Hendra Gunawan',
    age: 34,
    whatsapp: '+62 813-7521-8804',
    nik: '1471091107920001',      // encode la naissance : 11-07-1992
    birthPlace: 'Pekanbaru',
    birthDate: '1992-07-11',
    bloodType: 'O',
    address: 'JL. PAUS UJUNG NO. 27',
    rtRw: '004/002',
    village: 'TANGKERANG TENGAH',
    district: 'MARPOYAN DAMAI',
    religion: 'ISLAM',
    maritalStatus: 'KAWIN',
    ktpIssued: '2017-08-14',
    licence: '9207-1148-2205',
    licenceClass: 'B2 Umum',
    licenceExpiry: '2027-09-03',
    status: 'siap',
    photo: 'hendra.jpg',          // à remplacer — voir docs/prompts-photos.md
    photoFocus: '50% 36%',        // cadrage du visage dans les avatars et la KTP
  },

  /* ▼ CHAUFFEUR INVENTÉ ▼ — conduit le second camion. Voir le bloc ci-dessus.
     Le statut « disponible » de Hendra reste celui que tu as fourni.        */
  {
    id: 'D3',
    name: 'Anwar Siregar',
    age: 37,
    whatsapp: '+62 852-6318-7742',
    nik: '1471070908890004',      // encode la naissance : 09-08-1989
    birthPlace: 'Pekanbaru',
    birthDate: '1989-08-09',
    bloodType: 'A',
    address: 'JL. SOEKARNO-HATTA GG. MELATI NO. 8',
    rtRw: '002/005',
    village: 'SIDOMULYO TIMUR',
    district: 'MARPOYAN DAMAI',
    religion: 'ISLAM',
    maritalStatus: 'KAWIN',
    ktpIssued: '2015-11-03',
    licence: '8904-1573-2208',
    licenceClass: 'B2 Umum',
    licenceExpiry: '2029-01-17',
    status: 'jalan',
    photo: null,
    photoFocus: '50% 20%',
  },
]

/* -- Clients ------------------------------------------------------------- */
export const customers = [
  {
    id: 'C1',
    name: 'PT Anugrah Boga Nusantara',
    trade: 'distribusi makanan',
    contact: 'Pak Riyadi',
    phone: '+62 811-7522-9014',
    loadAddress: 'Jl. Soekarno-Hatta No. 214, Pekanbaru',
    unloadAddress: 'Jl. Pulau Pinang No. 8, Medan',
    direction: 'PKU_MES',
    rate: 13000000,
    paymentDays: 30,
  },
  {
    id: 'C2',
    name: 'PT Deli Kemasan Prima',
    trade: 'kemasan industri',
    contact: 'Ibu Sri',
    phone: '+62 813-6104-7788',
    loadAddress: 'Jl. Riau No. 96, Pekanbaru',
    unloadAddress: 'Kawasan Industri Medan (KIM) II, Blok C-14, Medan',
    direction: 'PKU_MES',
    rate: 13000000,
    paymentDays: 45,
  },
  {
    id: 'C3',
    name: 'CV Sumber Tani Riau',
    trade: 'pupuk',
    contact: 'Pak Joko',
    phone: '+62 812-6033-5521',
    loadAddress: 'Jl. Pulau Sicanang, Belawan, Medan',
    unloadAddress: 'Jl. Kaharuddin Nasution KM. 11, Pekanbaru',
    direction: 'MES_PKU',
    rate: 10500000,
    paymentDays: 0,               // 0 = paiement comptant
  },
]

/* -- Itinéraire ---------------------------------------------------------- */
export const route = {
  distanceKm: 750,
  hoursMin: 14,
  hoursMax: 16,
  // km : distances cumulées depuis l'entrepôt de Pekanbaru (approximatives)
  waypoints: [
    { id: 'W1', name: 'Gudang Pekanbaru',      lat: 0.5071, lon: 101.4478, km: 0,   note: 'muat' },
    { id: 'W2', name: 'GT Pekanbaru',          lat: 0.6435, lon: 101.4470, km: 18,  note: 'masuk Tol Permai' },
    { id: 'W3', name: 'Duri',                  lat: 1.2596, lon: 101.2131, km: 128, note: 'keluar tol, Lintas Sumatra' },
    { id: 'W4', name: 'Rantauprapat',          lat: 2.1008, lon: 99.8288,  km: 412, note: 'masuk Sumatra Utara' },
    { id: 'W5', name: 'Kisaran',               lat: 2.9832, lon: 99.6279,  km: 545, note: 'masuk tol arah Medan' },
    { id: 'W6', name: 'Tebing Tinggi',         lat: 3.3273, lon: 99.1618,  km: 620, note: '' },
    { id: 'W7', name: 'Kawasan Industri Medan',lat: 3.6721, lon: 98.6820,  km: 750, note: 'bongkar' },
  ],
  // points intermédiaires suivant l'axe réel, pour le tracé sur la carte
  shape: [
    [0.5071, 101.4478], [0.6435, 101.4470], [0.8667, 101.4000], [0.9833, 101.2833],
    [1.2596, 101.2131], [1.6500, 101.0000], [2.0167, 100.8000], [1.9500, 100.4500],
    [1.8833, 100.0833], [2.1008, 99.8288],  [2.3500, 99.6800],  [2.6167, 99.6167],
    [2.9832, 99.6279],  [3.1500, 99.4000],  [3.3273, 99.1618],  [3.4800, 98.9500],
    [3.5500, 98.8667],  [3.6721, 98.6820],
  ],
}

/* -- Tarifs -------------------------------------------------------------- */
export const tariffs = {
  outbound: 13000000,   // Pekanbaru → Medan, camion complet ~8 t
  backhaul: 10500000,   // Medan → Pekanbaru, muatan balik
  dpPercent: 40,        // acompte habituel à la commande
  defaultTonnage: 8,
}

/* -- Coûts --------------------------------------------------------------- */
export const costs = {
  // par aller-retour
  perTrip: {
    solarLitres: 430,
    solarKm: 1500,
    biosolarLitres: 340,
    biosolarPrice: 6800,
    dexliteLitres: 90,
    dexlitePrice: 20550,
    solar: 4160000,
    tol: 900000,
    tolDetail: 'Pekanbaru–Duri Rp 296.000/arah (Gol. V), Kisaran–Medan ±Rp 130.000/arah',
    uangJalan: 2000000,
    bongkarMuat: 1200000,
    pungli: 450000,
  },
  driverMonthlySalary: 4000000,
  tripsPerMonth: 3,
  // récapitulatif mensuel sur 3 allers-retours — total Rp 62.800.000
  monthly: [
    { key: 'sewaTruk',   amount: 25000000 },
    { key: 'solar',      amount: 12480000 },
    { key: 'tol',        amount: 2700000 },
    { key: 'sopir',      amount: 10000000 },
    { key: 'bongkarMuat',amount: 3600000 },
    { key: 'pungli',     amount: 1400000 },
    { key: 'perawatan',  amount: 4000000 },
    { key: 'administrasi',amount: 2000000 },
    { key: 'cadangan',   amount: 1620000 },
  ],
  monthlyTotal: 62800000,
}

/* Coût retenu par trajet pour le calcul de rentabilité du tableau de bord.
   Formule du cahier des charges :
   laba = (tarif aller + tarif muatan balik) − (sewa truk + solar + tol + sopir) */
/* Le loyer diffère d'un camion à l'autre : le coût est donc dérivé du véhicule
   plutôt que figé. Pour le Fuso loué 25.000.000, le total retombe exactement
   sur les 16.726.666 du cahier des charges.                                 */
export const tripCostParts = (truck) => [
  { key: 'sewaTruk', amount: Math.round(truck.monthlyRent / costs.tripsPerMonth) },
  { key: 'solar',    amount: costs.perTrip.solar },
  { key: 'tol',      amount: costs.perTrip.tol },
  { key: 'sopir',    amount: costs.perTrip.uangJalan
                             + Math.round(costs.driverMonthlySalary / costs.tripsPerMonth) },
]
export const tripCostTotal = (truck) =>
  tripCostParts(truck).reduce((sum, c) => sum + c.amount, 0)

/* -- Statuts de trajet, dans l'ordre imposé ------------------------------- */
export const TRIP_STATUSES = [
  'menuju_muat',      // en route vers le chargement
  'proses_muat',      // chargement en cours
  'berangkat',        // trajet aller
  'tiba_bongkar',     // arrivé au déchargement
  'cari_muatan_balik',// recherche de fret retour
  'pulang',           // trajet retour
  'selesai',          // terminé
]

/* -- Trajets ------------------------------------------------------------- */
export const trips = [
  {
    id: 'PJL-0308-01',
    driverId: 'D1', truckId: 'BM8241UZ',
    start: '2026-08-03', end: '2026-08-08',
    status: 'selesai',
    outbound: { customerId: 'C1', rate: 13000000, cargo: 'Makanan ringan kemasan', tonnage: 8,
                suratJalan: 'SJ/ABN/VIII/2026/0388' },
    backhaul: { customerId: 'C3', rate: 10500000, cargo: 'Pupuk NPK karung', tonnage: 7.5,
                suratJalan: 'SJ/STR/VIII/2026/0129' },
    revenue: 23500000,
  },
  {
    id: 'PJL-1208-02',
    driverId: 'D2', truckId: 'BM8241UZ',
    start: '2026-08-12', end: '2026-08-17',
    status: 'selesai',
    outbound: { customerId: 'C2', rate: 13000000, cargo: 'Kemasan karton lipat', tonnage: 6.2,
                suratJalan: 'SJ/DKP/VIII/2026/1042' },
    backhaul: null,               // aucun fret retour trouvé — retour à vide
    revenue: 13000000,
  },
  {
    id: 'PJL-2408-03',
    driverId: 'D1', truckId: 'BM8241UZ',
    start: '2026-08-24', end: null,
    status: 'berangkat',
    outbound: { customerId: 'C1', rate: 13000000, cargo: 'Makanan ringan kemasan', tonnage: 8,
                suratJalan: 'SJ/ABN/VIII/2026/0417', dp: 5200000 },
    backhaul: { customerId: 'C3', rate: 10500000, cargo: 'Pupuk NPK karung', tonnage: 7.5,
                suratJalan: null, booked: true },
    revenue: 23500000,            // prévisionnel
  },

  /* ▼ TRAJET INVENTÉ ▼ — celui du second camion. Voir le bloc « CAMION INVENTÉ ».
     Statut différent du trajet 3, pour que le suivi montre deux situations
     distinctes : l'un roule, l'autre est à quai moteur coupé.               */
  {
    id: 'PJL-2508-04',
    driverId: 'D3', truckId: 'BM9317UY',
    start: '2026-08-25', end: null,
    status: 'tiba_bongkar',
    outbound: { customerId: 'C2', rate: 13000000, cargo: 'Kemasan karton lipat', tonnage: 6.8,
                suratJalan: 'SJ/DKP/VIII/2026/1067', dp: 5200000 },
    backhaul: null,               // pas encore de muatan balik : étape suivante
    revenue: 13000000,
  },
]

/* Historique de statuts du trajet en cours */
export const statusLog = [
  { tripId: 'PJL-2408-03', status: 'menuju_muat', at: '2026-08-25T07:10', by: 'D1' },
  { tripId: 'PJL-2408-03', status: 'proses_muat', at: '2026-08-25T09:20', by: 'D1' },
  { tripId: 'PJL-2408-03', status: 'berangkat',   at: '2026-08-26T04:50', by: 'D1' },
  { tripId: 'PJL-2508-04', status: 'menuju_muat',  at: '2026-08-25T06:40', by: 'D3' },
  { tripId: 'PJL-2508-04', status: 'proses_muat',  at: '2026-08-25T08:15', by: 'D3' },
  { tripId: 'PJL-2508-04', status: 'berangkat',    at: '2026-08-25T13:20', by: 'D3' },
  { tripId: 'PJL-2508-04', status: 'tiba_bongkar', at: '2026-08-26T19:05', by: 'D3' },
]

/* -- Dépenses ------------------------------------------------------------ */
/* kind : uang_jalan | solar | tol | bongkar_muat | tak_terduga
   receipt : null, ou un ticket reproduit graphiquement (voir ReceiptSlip)  */
export const expenses = [
  // Trajet en cours — saisie au fil de l'eau par le chauffeur
  { id: 'E1', tripId: 'PJL-2408-03', kind: 'uang_jalan', amount: 2000000,
    at: '2026-08-24T06:15', note: 'Diserahkan tunai sebelum berangkat', receipt: null },
  { id: 'E2', tripId: 'PJL-2408-03', kind: 'bongkar_muat', amount: 600000,
    at: '2026-08-25T09:20', note: 'Muat di gudang Pekanbaru',
    receipt: { type: 'nota', place: 'GUDANG PEKANBARU', lines: [['Kuli muat', '6 orang'], ['Upah', '600.000']] } },
  { id: 'E3', tripId: 'PJL-2408-03', kind: 'tol', amount: 296000,
    at: '2026-08-26T05:35', note: 'GT Pekanbaru – Duri, Gol. V',
    receipt: { type: 'tol', gate: 'GT PEKANBARU', exit: 'GT DURI', gol: 'V' } },
  { id: 'E4', tripId: 'PJL-2408-03', kind: 'solar', amount: 1156000,
    at: '2026-08-26T08:41', note: 'SPBU Duri', fuel: 'Biosolar', litres: 170, pricePerLitre: 6800,
    receipt: { type: 'spbu', station: 'SPBU 14.284.02', addr: 'JL. LINTAS DURI–DUMAI', city: 'DURI, RIAU',
               trx: '0248871', pump: '04 / 2' } },
  { id: 'E5', tripId: 'PJL-2408-03', kind: 'tak_terduga', amount: 185000,
    at: '2026-08-26T14:10', note: 'Ban belakang bocor, tambal di Bagan Batu',
    receipt: { type: 'nota', place: 'TAMBAL BAN BAROKAH', lines: [['Tambal ban', '2 titik'], ['Jasa', '185.000']] } },
  { id: 'E6', tripId: 'PJL-2408-03', kind: 'solar', amount: 924750,
    at: '2026-08-26T20:15', note: 'SPBU Rantauprapat', fuel: 'Dexlite', litres: 45, pricePerLitre: 20550,
    receipt: { type: 'spbu', station: 'SPBU 14.214.07', addr: 'JL. LINTAS SUMATERA KM. 4', city: 'RANTAUPRAPAT, SUMUT',
               trx: '0113264', pump: '02 / 1' } },

  // Trajets clos — récapitulatif par poste
  { id: 'E7',  tripId: 'PJL-0308-01', kind: 'uang_jalan',  amount: 2000000, at: '2026-08-03T06:00', note: '', receipt: null },
  { id: 'E8',  tripId: 'PJL-0308-01', kind: 'solar',       amount: 4160000, at: '2026-08-05T00:00', note: '430 L, 2 arah', receipt: null },
  { id: 'E9',  tripId: 'PJL-0308-01', kind: 'tol',         amount: 900000,  at: '2026-08-05T00:00', note: '2 arah', receipt: null },
  { id: 'E10', tripId: 'PJL-0308-01', kind: 'bongkar_muat',amount: 1200000, at: '2026-08-05T00:00', note: 'muat + bongkar', receipt: null },
  { id: 'E11', tripId: 'PJL-0308-01', kind: 'tak_terduga', amount: 450000,  at: '2026-08-05T00:00', note: 'pungutan di jalan', receipt: null },
  { id: 'E12', tripId: 'PJL-1208-02', kind: 'uang_jalan',  amount: 2000000, at: '2026-08-12T06:00', note: '', receipt: null },
  { id: 'E13', tripId: 'PJL-1208-02', kind: 'solar',       amount: 4160000, at: '2026-08-14T00:00', note: '430 L, 2 arah', receipt: null },
  { id: 'E14', tripId: 'PJL-1208-02', kind: 'tol',         amount: 900000,  at: '2026-08-14T00:00', note: '2 arah', receipt: null },
  { id: 'E15', tripId: 'PJL-1208-02', kind: 'bongkar_muat',amount: 1200000, at: '2026-08-14T00:00', note: 'muat + bongkar', receipt: null },
  { id: 'E16', tripId: 'PJL-1208-02', kind: 'tak_terduga', amount: 450000,  at: '2026-08-14T00:00', note: 'pungutan di jalan', receipt: null },

  /* ▼ DÉPENSES INVENTÉES ▼ — trajet du second camion. */
  { id: 'E17', tripId: 'PJL-2508-04', kind: 'uang_jalan', amount: 2000000,
    at: '2026-08-25T06:10', note: 'Diserahkan tunai sebelum berangkat', receipt: null },
  { id: 'E18', tripId: 'PJL-2508-04', kind: 'bongkar_muat', amount: 600000,
    at: '2026-08-25T08:15', note: 'Muat di gudang Jl. Riau, Pekanbaru',
    receipt: { type: 'nota', place: 'GUDANG JL. RIAU', lines: [['Kuli muat', '5 orang'], ['Upah', '600.000']] } },
  { id: 'E19', tripId: 'PJL-2508-04', kind: 'tol', amount: 296000,
    at: '2026-08-25T13:55', note: 'GT Pekanbaru – Duri, Gol. V',
    receipt: { type: 'tol', gate: 'GT PEKANBARU', exit: 'GT DURI', gol: 'V' } },
  { id: 'E20', tripId: 'PJL-2508-04', kind: 'solar', amount: 1122000,
    at: '2026-08-25T16:55', note: 'SPBU Duri', fuel: 'Biosolar', litres: 165, pricePerLitre: 6800,
    receipt: { type: 'spbu', station: 'SPBU 14.284.02', addr: 'JL. LINTAS DURI–DUMAI', city: 'DURI, RIAU',
               trx: '0249104', pump: '02 / 1' } },
  { id: 'E21', tripId: 'PJL-2508-04', kind: 'solar', amount: 1020000,
    at: '2026-08-26T11:45', note: 'SPBU Kisaran', fuel: 'Biosolar', litres: 150, pricePerLitre: 6800,
    receipt: { type: 'spbu', station: 'SPBU 14.213.11', addr: 'JL. IMAM BONJOL KM. 2', city: 'KISARAN, SUMUT',
               trx: '0087432', pump: '03 / 2' } },
  { id: 'E22', tripId: 'PJL-2508-04', kind: 'tol', amount: 130000,
    at: '2026-08-26T14:20', note: 'GT Kisaran – Medan, Gol. V',
    receipt: { type: 'tol', gate: 'GT KISARAN', exit: 'GT TANJUNG MORAWA', gol: 'V' } },
]

/* -- Factures ------------------------------------------------------------ */
/* status : 'terbuka' (en attente) | 'lunas' (payée)                        */
export const invoices = [
  { id: 'INV/2026/07/019', customerId: 'C1', tripId: null, amount: 22000000,
    issued: '2026-07-11', due: '2026-08-10', status: 'terbuka',
    memo: 'Perjalanan 6–11 Juli 2026' },
  { id: 'INV/2026/08/024', customerId: 'C1', tripId: 'PJL-0308-01', amount: 13000000,
    issued: '2026-08-08', due: '2026-09-07', status: 'terbuka', memo: '' },
  { id: 'INV/2026/08/025', customerId: 'C3', tripId: 'PJL-0308-01', amount: 10500000,
    issued: '2026-08-08', due: '2026-08-08', status: 'lunas', paidAt: '2026-08-08',
    memo: 'Muatan balik, dibayar tunai' },
  { id: 'INV/2026/08/031', customerId: 'C2', tripId: 'PJL-1208-02', amount: 13000000,
    issued: '2026-08-17', due: '2026-10-01', status: 'terbuka', memo: '' },
]

/* -- Suivi de position --------------------------------------------------- */
/* source : 'gps' (boîtier) | 'whatsapp' (saisie manuelle par l'admin)      */
export const positions = [
  { tripId: 'PJL-2408-03', waypointId: 'W1', at: '2026-08-25T09:20', source: 'whatsapp',
    enteredBy: 'Bu Sari', note: 'Muat selesai, siap berangkat besok pagi' },
  { tripId: 'PJL-2408-03', waypointId: 'W2', at: '2026-08-26T05:35', source: 'whatsapp',
    enteredBy: 'Bu Sari', note: 'Masuk tol Permai' },
  { tripId: 'PJL-2408-03', waypointId: 'W3', at: '2026-08-26T08:55', source: 'whatsapp',
    enteredBy: 'Bu Sari', note: 'Isi solar di Duri' },
  { tripId: 'PJL-2408-03', waypointId: 'W4', at: '2026-08-26T21:40', source: 'whatsapp',
    enteredBy: 'Bu Sari', note: 'Isi solar, lanjut ke Kisaran' },

  /* ▼ POSITIONS INVENTÉES ▼ — trajet du second camion, arrivé à destination. */
  { tripId: 'PJL-2508-04', waypointId: 'W1', at: '2026-08-25T08:15', source: 'gps', enteredBy: null, note: '' },
  { tripId: 'PJL-2508-04', waypointId: 'W2', at: '2026-08-25T13:55', source: 'gps', enteredBy: null, note: '' },
  { tripId: 'PJL-2508-04', waypointId: 'W3', at: '2026-08-25T16:40', source: 'gps', enteredBy: null, note: '' },
  { tripId: 'PJL-2508-04', waypointId: 'W4', at: '2026-08-26T04:10', source: 'gps', enteredBy: null, note: '' },
  { tripId: 'PJL-2508-04', waypointId: 'W5', at: '2026-08-26T11:30', source: 'gps', enteredBy: null, note: '' },
  { tripId: 'PJL-2508-04', waypointId: 'W6', at: '2026-08-26T14:50', source: 'gps', enteredBy: null, note: '' },
  { tripId: 'PJL-2508-04', waypointId: 'W7', at: '2026-08-26T19:05', source: 'gps', enteredBy: null,
    note: 'Tiba di KIM, antre bongkar' },
]

/* Relevés des boîtiers GPS, indexés par trajet.
   Le trajet 3 roule, le trajet 4 est à quai moteur coupé : le sélecteur de
   véhicule montre ainsi deux situations réellement différentes.            */
export const telemetry = {
  'PJL-2408-03': {
    tripId: 'PJL-2408-03', truckId: 'BM8241UZ',
    lat: 2.1008, lon: 99.8288,
    place: 'Rantauprapat, Labuhanbatu',
    speedKmh: 62, heading: 'utara', engine: 'hidup',
    odometerKm: 412, fuelPercent: 46,
    at: '2026-08-26T21:40', deviceId: 'GT06N-8841',
  },
  'PJL-2508-04': {
    tripId: 'PJL-2508-04', truckId: 'BM9317UY',
    lat: 3.6721, lon: 98.6820,
    place: 'Kawasan Industri Medan, Deli Serdang',
    speedKmh: 0, heading: 'diam', engine: 'mati',
    odometerKm: 750, fuelPercent: 28,
    at: '2026-08-26T19:05', deviceId: 'GT06N-7712',
  },
}
