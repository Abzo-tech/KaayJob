const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'diagrams', 'class');
fs.mkdirSync(OUT_DIR, { recursive: true });

const width = 5200;
const height = 3600;

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function classHeight(box) {
  const attrLines = box.attrs.length;
  const methodLines = box.methods.length;
  return 56 + Math.max(attrLines, 1) * 28 + 18 + Math.max(methodLines, 1) * 28 + 26;
}

function enumHeight(box) {
  return 56 + box.attrs.length * 32 + 24;
}

function boxHeight(box) {
  return box.type === 'enum' ? enumHeight(box) : classHeight(box);
}

function renderClass(box) {
  const h = boxHeight(box);
  const attrStart = box.y + 86;
  const methodStart = box.y + 86 + Math.max(box.attrs.length, 1) * 28 + 18;
  return `
  <g>
    <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${h}" class="uml-box"/>
    <line x1="${box.x}" y1="${box.y + 56}" x2="${box.x + box.w}" y2="${box.y + 56}" class="sep"/>
    <line x1="${box.x}" y1="${methodStart - 18}" x2="${box.x + box.w}" y2="${methodStart - 18}" class="sep"/>
    <text x="${box.x + box.w / 2}" y="${box.y + 36}" class="title">${esc(box.name)}</text>
    ${box.attrs.map((a, i) => `<text x="${box.x + 16}" y="${attrStart + i * 28}" class="line">${esc(a)}</text>`).join('\n')}
    ${box.methods.map((m, i) => `<text x="${box.x + 16}" y="${methodStart + i * 28}" class="line">${esc(m)}</text>`).join('\n')}
  </g>`;
}

function renderEnum(box) {
  const h = boxHeight(box);
  const start = box.y + 94;
  return `
  <g>
    <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${h}" class="uml-box enum"/>
    <line x1="${box.x}" y1="${box.y + 56}" x2="${box.x + box.w}" y2="${box.y + 56}" class="sep"/>
    <text x="${box.x + box.w / 2}" y="${box.y + 24}" class="stereo">&lt;&lt;enumeration&gt;&gt;</text>
    <text x="${box.x + box.w / 2}" y="${box.y + 48}" class="title">${esc(box.name)}</text>
    ${box.attrs.map((a, i) => `<text x="${box.x + 16}" y="${start + i * 32}" class="line">${esc(a)}</text>`).join('\n')}
  </g>`;
}

function center(box) {
  return { x: box.x + box.w / 2, y: box.y + boxHeight(box) / 2 };
}

function anchor(box, side, shift = 0) {
  const h = boxHeight(box);
  if (side === 'left') return { x: box.x, y: box.y + h / 2 + shift };
  if (side === 'right') return { x: box.x + box.w, y: box.y + h / 2 + shift };
  if (side === 'top') return { x: box.x + box.w / 2 + shift, y: box.y };
  return { x: box.x + box.w / 2 + shift, y: box.y + h };
}

function chooseSides(a, b) {
  const ca = center(a);
  const cb = center(b);
  const dx = cb.x - ca.x;
  const dy = cb.y - ca.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? ['right', 'left'] : ['left', 'right'];
  return dy > 0 ? ['bottom', 'top'] : ['top', 'bottom'];
}

function multLabel(x, y, side, text) {
  const dx = side === 'left' ? -58 : 12;
  const dy = side === 'bottom' ? 20 : -10;
  return `<text x="${x + dx}" y="${y + dy}" class="mult">${esc(text)}</text>`;
}

function openArrow(x1, y1, x2, y2, className = 'nav') {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 12;
  const p1x = x2 - size * Math.cos(angle - Math.PI / 6);
  const p1y = y2 - size * Math.sin(angle - Math.PI / 6);
  const p2x = x2 - size * Math.cos(angle + Math.PI / 6);
  const p2y = y2 - size * Math.sin(angle + Math.PI / 6);
  return `<path d="M ${p1x} ${p1y} L ${x2} ${y2} L ${p2x} ${p2y}" class="${className}"/>`;
}

function diamond(x, y, side, filled = false) {
  const s = 12;
  let pts;
  if (side === 'right') pts = [[x, y], [x - s, y - s], [x - 2 * s, y], [x - s, y + s]];
  else if (side === 'left') pts = [[x, y], [x + s, y - s], [x + 2 * s, y], [x + s, y + s]];
  else if (side === 'top') pts = [[x, y], [x - s, y + s], [x, y + 2 * s], [x + s, y + s]];
  else pts = [[x, y], [x - s, y - s], [x, y - 2 * s], [x + s, y - s]];
  return `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" class="${filled ? 'diamond-filled' : 'diamond-open'}"/>`;
}

function renderSelfRelation(rel, map) {
  const box = map[rel.from];
  const x = box.x + box.w;
  const y = box.y + 90;
  return `
  <path d="M ${x} ${y} C ${x + 150} ${y}, ${x + 150} ${y + 180}, ${x} ${y + 180}" class="assoc"/>
  <text x="${x + 18}" y="${y - 10}" class="mult">${esc(rel.m1)}</text>
  <text x="${x + 18}" y="${y + 205}" class="mult">${esc(rel.m2)}</text>
  <text x="${x + 36}" y="${y + 94}" class="reltype">${esc(rel.label || '')}</text>`;
}

function renderRelation(rel, map, idx) {
  if (rel.type === 'self') return renderSelfRelation(rel, map);

  const a = map[rel.from];
  const b = map[rel.to];
  const sides = rel.sides || chooseSides(a, b);
  const shift = rel.shift != null ? rel.shift : ((idx % 3) - 1) * 18;
  const p1 = anchor(a, sides[0], sides[0] === 'top' || sides[0] === 'bottom' ? shift : 0);
  const p2 = anchor(b, sides[1], sides[1] === 'top' || sides[1] === 'bottom' ? -shift : 0);

  if (rel.type === 'enum-link' || rel.type === 'navigable') {
    return `
    <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="nav"/>
    ${openArrow(p1.x, p1.y, p2.x, p2.y, 'nav')}
    ${rel.m1 ? multLabel(p1.x, p1.y, sides[0], rel.m1) : ''}
    ${rel.m2 ? multLabel(p2.x, p2.y, sides[1], rel.m2) : ''}`;
  }

  const line = `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="assoc"/>`;
  const deco = rel.type === 'composition'
    ? diamond(p1.x, p1.y, sides[0], true)
    : rel.type === 'aggregation'
      ? diamond(p1.x, p1.y, sides[0], false)
      : '';
  const nav = rel.navigable ? openArrow(p1.x, p1.y, p2.x, p2.y, 'assoc') : '';
  const labelX = (p1.x + p2.x) / 2 + 8;
  const labelY = (p1.y + p2.y) / 2 - 8;
  return `
  ${line}
  ${deco}
  ${nav}
  ${rel.m1 ? multLabel(p1.x, p1.y, sides[0], rel.m1) : ''}
  ${rel.m2 ? multLabel(p2.x, p2.y, sides[1], rel.m2) : ''}
  ${rel.label ? `<text x="${labelX}" y="${labelY}" class="reltype">${esc(rel.label)}</text>` : ''}`;
}

const boxes = [
  { type: 'class', name: 'Utilisateur', x: 500, y: 200, w: 560, attrs: ['-id: UUID', '-email: String', '-motDePasse: String', '-prenom: String', '-nom: String', '-telephone: String', '-role: Role', '-adresse: String?', '-latitude: Float?', '-longitude: Float?', '-estVerifie: Boolean', '-estActif: Boolean'], methods: ['+sInscrire()', '+seConnecter()', '+modifierProfil()', '+changerMotDePasse()', '+consulterNotifications()'] },
  { type: 'class', name: 'ProfilPrestataire', x: 1460, y: 200, w: 610, attrs: ['-id: UUID', '-userId: UUID', '-nomEntreprise: String?', '-specialite: String?', '-tarifHoraire: Decimal?', '-rayonService: Int?', '-estDisponible: Boolean', '-noteMoyenne: Decimal', '-totalAvis: Int', '-totalReservations: Int'], methods: ['+mettreAJourDisponibilite()', '+mettreAJourLocalisation()', '+demanderVerification()', '+calculerNoteMoyenne()'] },
  { type: 'class', name: 'Categorie', x: 2490, y: 220, w: 450, attrs: ['-id: UUID', '-nom: String', '-slug: String', '-description: String?', '-estActive: Boolean', '-ordreAffichage: Int', '-parentId: UUID?'], methods: ['+ajouterSousCategorie()', '+modifierCategorie()', '+activer()', '+desactiver()'] },
  { type: 'class', name: 'Service', x: 3280, y: 200, w: 500, attrs: ['-id: UUID', '-providerId: UUID', '-categoryId: UUID?', '-nom: String', '-description: String?', '-prix: Decimal', '-typePrix: TypePrix', '-duree: Int?', '-estActif: Boolean'], methods: ['+creer()', '+modifier()', '+activer()', '+desactiver()', '+calculerPrix()'] },

  { type: 'class', name: 'Reservation', x: 920, y: 1220, w: 590, attrs: ['-id: UUID', '-clientId: UUID', '-serviceId: UUID', '-dateReservation: DateTime', '-heureReservation: String', '-duree: Int', '-statut: StatutReservation', '-adresse: String', '-ville: String', '-telephone: String?', '-notes: String?', '-montantTotal: Decimal?', '-statutPaiement: StatutPaiement'], methods: ['+creer()', '+confirmer()', '+rejeter()', '+annuler()', '+terminer()', '+calculerMontant()'] },
  { type: 'class', name: 'Avis', x: 1870, y: 1260, w: 500, attrs: ['-id: UUID', '-bookingId: UUID', '-clientId: UUID', '-providerId: UUID', '-serviceId: UUID?', '-note: Int', '-commentaire: String?', '-estVerifie: Boolean'], methods: ['+publier()', '+modifier()', '+supprimer()'] },
  { type: 'class', name: 'Paiement', x: 2770, y: 1260, w: 470, attrs: ['-id: UUID', '-bookingId: UUID?', '-userId: UUID', '-montant: Decimal', '-methodePaiement: String?', '-statut: StatutPaiement', '-transactionId: String?'], methods: ['+initierPaiement()', '+marquerPaye()', '+rembourser()'] },

  { type: 'class', name: 'DemandeVerification', x: 560, y: 2550, w: 500, attrs: ['-id: UUID', '-userId: UUID', '-documents: Json?', '-statut: String', '-reviewedBy: UUID?', '-reviewedAt: DateTime?'], methods: ['+soumettre()', '+valider()', '+rejeter()'] },
  { type: 'class', name: 'Abonnement', x: 1590, y: 2550, w: 450, attrs: ['-id: UUID', '-userId: UUID', '-plan: String', '-statut: String', '-dateDebut: DateTime', '-dateFin: DateTime'], methods: ['+activer()', '+renouveler()', '+annuler()'] },
  { type: 'class', name: 'PlanAbonnement', x: 2430, y: 2550, w: 500, attrs: ['-id: UUID', '-nom: String', '-slug: String', '-prix: Decimal', '-duree: Int', '-fonctionnalites: Json', '-estActif: Boolean'], methods: ['+creerPlan()', '+modifierPlan()', '+desactiverPlan()'] },
  { type: 'class', name: 'Notification', x: 3300, y: 2550, w: 450, attrs: ['-id: UUID', '-userId: UUID', '-titre: String', '-message: String', '-type: String', '-lu: Boolean', '-lien: String?'], methods: ['+marquerCommeLu()', '+supprimer()'] },

  { type: 'enum', name: 'Role', x: 120, y: 220, w: 250, attrs: ['CLIENT', 'PRESTATAIRE', 'ADMIN'], methods: [] },
  { type: 'enum', name: 'TypePrix', x: 4020, y: 240, w: 280, attrs: ['FIXE', 'HORAIRE', 'DEVIS'], methods: [] },
  { type: 'enum', name: 'StatutReservation', x: 120, y: 1060, w: 320, attrs: ['EN_ATTENTE', 'CONFIRMEE', 'EN_COURS', 'TERMINEE', 'ANNULEE', 'REJETEE'], methods: [] },
  { type: 'enum', name: 'StatutPaiement', x: 3520, y: 1220, w: 300, attrs: ['EN_ATTENTE', 'PAYE', 'REMBOURSE'], methods: [] },
];

const boxMap = Object.fromEntries(boxes.map((b) => [b.name, b]));

const relations = [
  { from: 'Utilisateur', to: 'ProfilPrestataire', type: 'composition', m1: '1', m2: '0..1', label: 'possède', navigable: true },
  { from: 'Utilisateur', to: 'Reservation', type: 'association', m1: '1', m2: '0..*', label: 'effectue', navigable: true },
  { from: 'Utilisateur', to: 'Avis', type: 'association', m1: '1', m2: '0..*', label: 'rédige', navigable: true, sides: ['bottom', 'top'], shift: -120 },
  { from: 'Utilisateur', to: 'Paiement', type: 'association', m1: '1', m2: '0..*', label: 'réalise', navigable: true, sides: ['bottom', 'top'], shift: 80 },
  { from: 'Utilisateur', to: 'DemandeVerification', type: 'association', m1: '1', m2: '0..*', label: 'soumet', navigable: true, sides: ['bottom', 'top'], shift: -180 },
  { from: 'Utilisateur', to: 'Abonnement', type: 'association', m1: '1', m2: '0..*', label: 'souscrit', navigable: true, sides: ['bottom', 'top'], shift: -10 },
  { from: 'Utilisateur', to: 'Notification', type: 'association', m1: '1', m2: '0..*', label: 'reçoit', navigable: true, sides: ['bottom', 'top'], shift: 170 },

  { from: 'ProfilPrestataire', to: 'Service', type: 'composition', m1: '1', m2: '0..*', label: 'propose', navigable: true },
  { from: 'ProfilPrestataire', to: 'Avis', type: 'association', m1: '1', m2: '0..*', label: 'reçoit', navigable: true },

  { from: 'Categorie', to: 'Categorie', type: 'self', m1: 'parent 0..1', m2: 'enfants 0..*', label: 'hiérarchie' },
  { from: 'Categorie', to: 'Service', type: 'association', m1: '1', m2: '0..*', label: 'classe', navigable: true },

  { from: 'Service', to: 'Reservation', type: 'association', m1: '1', m2: '0..*', label: 'concerne', navigable: true },
  { from: 'Service', to: 'Avis', type: 'association', m1: '0..1', m2: '0..*', label: 'reçoit', navigable: true, sides: ['bottom', 'top'], shift: 110 },

  { from: 'Reservation', to: 'Avis', type: 'composition', m1: '1', m2: '0..1', label: 'génère', navigable: true },
  { from: 'Reservation', to: 'Paiement', type: 'association', m1: '1', m2: '0..*', label: 'déclenche', navigable: true },

  { from: 'PlanAbonnement', to: 'Abonnement', type: 'aggregation', m1: '1', m2: '0..*', label: 'définit', navigable: true },

  { from: 'Utilisateur', to: 'Role', type: 'enum-link', m1: '*', m2: '1', sides: ['left', 'right'] },
  { from: 'Service', to: 'TypePrix', type: 'enum-link', m1: '*', m2: '1', sides: ['right', 'left'] },
  { from: 'Reservation', to: 'StatutReservation', type: 'enum-link', m1: '*', m2: '1', sides: ['left', 'right'] },
  { from: 'Paiement', to: 'StatutPaiement', type: 'enum-link', m1: '*', m2: '1', sides: ['right', 'left'] },
  { from: 'Reservation', to: 'StatutPaiement', type: 'enum-link', m1: '*', m2: '1', sides: ['right', 'left'], shift: -20 },
];

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ececec" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="8" dy="8" stdDeviation="4" flood-color="#c9c9c9" flood-opacity="0.35"/>
    </filter>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill: #111; }
    .main-title { font-size: 40px; font-weight: 700; }
    .sub-title { font-size: 20px; fill: #555; }
    .uml-box { fill: #fff; stroke: #111; stroke-width: 2.1; filter: url(#shadow); }
    .enum { fill: #fcfcfc; }
    .sep { stroke: #111; stroke-width: 1.7; }
    .title { font-size: 26px; font-weight: 700; text-anchor: middle; }
    .stereo { font-size: 18px; font-style: italic; text-anchor: middle; fill: #444; }
    .line { font-size: 21px; }
    .assoc { stroke: #111; stroke-width: 2; fill: none; }
    .nav { stroke: #111; stroke-width: 2; fill: none; }
    .diamond-open { fill: #fff; stroke: #111; stroke-width: 1.7; }
    .diamond-filled { fill: #111; stroke: #111; stroke-width: 1.7; }
    .mult { font-size: 19px; font-weight: 600; }
    .reltype { font-size: 17px; font-style: italic; fill: #444; }
  </style>
  <rect width="100%" height="100%" fill="#fbfbfb"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <text x="70" y="60" class="main-title">KaayJob - Diagramme De Conception</text>
  <text x="70" y="92" class="sub-title">Classes metier, attributs, methodes, navigabilite, multiplicites et enumerations</text>
  ${relations.map((r, i) => renderRelation(r, boxMap, i)).join('\n')}
  ${boxes.map((b) => (b.type === 'enum' ? renderEnum(b) : renderClass(b))).join('\n')}
</svg>`;

const out = path.join(OUT_DIR, 'kaayjob-conception-class-diagram.svg');
fs.writeFileSync(out, svg, 'utf8');
console.log(out);
