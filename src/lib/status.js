/* =========================================================================
   SYSTÈME DE STATUTS
   Chaque étape du trajet a son icône et sa couleur. C'est ce qui rend un
   changement de statut visible d'un coup d'œil : la pastille, le bandeau du
   chauffeur et la frise se repeignent ensemble.
   Les teintes sont profondes et peu saturées, de la même famille, pour
   rester sobres malgré leur nombre.
   ========================================================================= */

export const STATUS_META = {
  menunggu_muat:     { icon: 'clock',       tone: 'st-tunggu' },
  menuju_muat:       { icon: 'nav',         tone: 'st-menuju' },
  proses_muat:       { icon: 'box',         tone: 'st-muat' },
  berangkat:         { icon: 'truck',       tone: 'st-berangkat' },
  tiba_bongkar:      { icon: 'pin',         tone: 'st-tiba' },
  cari_muatan_balik: { icon: 'search',      tone: 'st-cari' },
  pulang:            { icon: 'uturn',       tone: 'st-pulang' },
  selesai:           { icon: 'checkCircle', tone: 'st-selesai' },
}

export const metaOf = (status) =>
  STATUS_META[status] ?? { icon: 'clock', tone: 'st-tunggu' }
