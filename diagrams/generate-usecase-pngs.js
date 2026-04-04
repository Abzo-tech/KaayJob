const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'diagrams', 'usecase');
fs.mkdirSync(OUT_DIR, { recursive: true });

const width = 3200;
const height = 2300;
const frame = { x: 470, y: 110, width: 2580, height: 2030 };

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function actorSvg(actor) {
  const { x, y, label } = actor;
  return `
  <g class="actor">
    <circle cx="${x}" cy="${y - 150}" r="48" />
    <line x1="${x}" y1="${y - 102}" x2="${x}" y2="${y + 34}" />
    <line x1="${x - 70}" y1="${y - 40}" x2="${x + 70}" y2="${y - 40}" />
    <line x1="${x}" y1="${y + 34}" x2="${x - 62}" y2="${y + 126}" />
    <line x1="${x}" y1="${y + 34}" x2="${x + 62}" y2="${y + 126}" />
    <text x="${x}" y="${y + 182}" class="actor-label">${esc(label)}</text>
  </g>`;
}

function useCaseSvg(uc, mini = false) {
  const textY = uc.y - (uc.label.length > 1 ? (mini ? 12 : 16) : 0);
  const tspans = uc.label
    .map((line, i) => `<tspan x="${uc.x}" dy="${i === 0 ? 0 : mini ? 22 : 26}">${esc(line)}</tspan>`)
    .join('');
  return `
  <g class="usecase${mini ? ' mini' : ''}">
    <ellipse cx="${uc.x}" cy="${uc.y}" rx="${uc.rx}" ry="${uc.ry}" />
    <text x="${uc.x}" y="${textY}" class="${mini ? 'mini-label' : 'usecase-label'}">${tspans}</text>
  </g>`;
}

function edgePoint(uc, targetX, targetY) {
  const dx = targetX - uc.x;
  const dy = targetY - uc.y;
  if (dx === 0 && dy === 0) return { x: uc.x + uc.rx, y: uc.y };
  const scale = 1 / Math.max(Math.abs(dx) / uc.rx, Math.abs(dy) / uc.ry);
  return { x: uc.x + dx * scale, y: uc.y + dy * scale };
}

function assocLine(actor, uc) {
  const startY = actor.y - 40;
  const end = edgePoint(uc, actor.x, startY);
  return `<line class="assoc" x1="${actor.x}" y1="${startY}" x2="${end.x.toFixed(2)}" y2="${end.y.toFixed(2)}" />`;
}

function relationSvg(base, rel) {
  const box = useCaseSvg(rel, true);
  const start = edgePoint(rel, base.x, base.y);
  const end = edgePoint(base, rel.x, rel.y);
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const arrow = 14;
  const ax1 = end.x - arrow * Math.cos(angle - Math.PI / 6);
  const ay1 = end.y - arrow * Math.sin(angle - Math.PI / 6);
  const ax2 = end.x - arrow * Math.cos(angle + Math.PI / 6);
  const ay2 = end.y - arrow * Math.sin(angle + Math.PI / 6);
  const labelX = rel.labelX ?? ((start.x + end.x) / 2 - 55);
  const labelY = rel.labelY ?? ((start.y + end.y) / 2 - 12);
  const stereotype = rel.type === 'extend' ? '&lt;&lt;extend&gt;&gt;' : '&lt;&lt;include&gt;&gt;';
  return `${box}
  <g>
    <line class="${rel.type}" x1="${start.x.toFixed(2)}" y1="${start.y.toFixed(2)}" x2="${end.x.toFixed(2)}" y2="${end.y.toFixed(2)}" />
    <line class="${rel.type}" x1="${end.x.toFixed(2)}" y1="${end.y.toFixed(2)}" x2="${ax1.toFixed(2)}" y2="${ay1.toFixed(2)}" />
    <line class="${rel.type}" x1="${end.x.toFixed(2)}" y1="${end.y.toFixed(2)}" x2="${ax2.toFixed(2)}" y2="${ay2.toFixed(2)}" />
    <text x="${labelX}" y="${labelY}" class="relation-label">${stereotype}</text>
  </g>`;
}

function makeSvg(diagram) {
  const ucMap = Object.fromEntries(diagram.useCases.map((uc) => [uc.id, uc]));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e7e7e7" stroke-width="1" />
    </pattern>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="8" dy="8" stdDeviation="4" flood-color="#c7c7c7" flood-opacity="0.38"/>
    </filter>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill: #111; }
    .frame-title { font-size: 42px; font-weight: 700; }
    .actor-label { font-size: 36px; font-weight: 700; text-anchor: middle; }
    .actor circle, .actor line { stroke: #111; stroke-width: 3; fill: none; }
    .assoc { stroke: #111; stroke-width: 2.8; }
    .usecase ellipse { fill: #fff; stroke: #111; stroke-width: 2.3; filter: url(#softShadow); }
    .usecase-label { font-size: 28px; font-weight: 600; text-anchor: middle; dominant-baseline: middle; }
    .mini-label { font-size: 22px; font-weight: 500; text-anchor: middle; dominant-baseline: middle; }
    .include, .extend { stroke: #444; stroke-width: 2.1; stroke-dasharray: 9 7; fill: none; }
    .relation-label { font-size: 20px; fill: #333; }
  </style>
  <rect width="100%" height="100%" fill="#fbfbfb"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="${frame.x}" y="${frame.y}" width="${frame.width}" height="${frame.height}" fill="#fff" stroke="#666" stroke-width="3"/>
  <text x="${frame.x + frame.width / 2}" y="170" text-anchor="middle" class="frame-title">${esc(diagram.title)}</text>
  ${diagram.useCases.map((uc) => assocLine(diagram.actor, uc)).join('\n')}
  ${diagram.useCases.map((uc) => useCaseSvg(uc)).join('\n')}
  ${diagram.relations.map((rel) => relationSvg(ucMap[rel.parent], rel)).join('\n')}
  ${actorSvg(diagram.actor)}
</svg>`;
}

const diagrams = [
  {
    file: 'client-usecase-diagram',
    title: 'Gestion Client',
    actor: { x: 180, y: 1060, label: 'Client' },
    useCases: [
      { id: 'auth', x: 900, y: 260, rx: 190, ry: 54, label: ['Se connecter'] },
      { id: 'browse', x: 900, y: 540, rx: 230, ry: 58, label: ['Parcourir catégories'] },
      { id: 'search', x: 900, y: 860, rx: 235, ry: 58, label: ['Rechercher prestataire'] },
      { id: 'view', x: 900, y: 1180, rx: 240, ry: 58, label: ['Consulter profil', 'prestataire'] },
      { id: 'book', x: 900, y: 1490, rx: 190, ry: 54, label: ['Réserver service'] },
      { id: 'bookings', x: 900, y: 1780, rx: 220, ry: 58, label: ['Consulter mes', 'réservations'] },
      { id: 'review', x: 1600, y: 1490, rx: 175, ry: 54, label: ['Laisser un avis'] },
      { id: 'profile', x: 900, y: 1890, rx: 175, ry: 54, label: ['Gérer profil'] },
      { id: 'notifications', x: 1600, y: 1780, rx: 235, ry: 58, label: ['Consulter notifications'] },
    ],
    relations: [
      { parent: 'auth', type: 'extend', x: 1600, y: 260, rx: 155, ry: 40, label: ['Mot de passe oublié'] },

      { parent: 'search', type: 'extend', x: 1600, y: 780, rx: 165, ry: 40, label: ['Filtrer résultats'] },
      { parent: 'search', type: 'extend', x: 1600, y: 880, rx: 160, ry: 40, label: ['Localiser sur carte'] },
      { parent: 'search', type: 'include', x: 2140, y: 830, rx: 150, ry: 38, label: ['Définir ma position'] },
      { parent: 'search', type: 'extend', x: 2140, y: 930, rx: 170, ry: 38, label: ['Filtrer par distance'] },

      { parent: 'view', type: 'extend', x: 1600, y: 1120, rx: 165, ry: 40, label: ['Voir services'] },
      { parent: 'view', type: 'extend', x: 1600, y: 1220, rx: 150, ry: 40, label: ['Voir avis'] },
      { parent: 'view', type: 'extend', x: 2140, y: 1180, rx: 150, ry: 38, label: ['Calculer itinéraire'] },

      { parent: 'book', type: 'include', x: 1600, y: 1440, rx: 175, ry: 40, label: ['Choisir date/heure'] },
      { parent: 'book', type: 'include', x: 2140, y: 1490, rx: 165, ry: 38, label: ['Renseigner adresse'] },

      { parent: 'bookings', type: 'extend', x: 1600, y: 1720, rx: 160, ry: 40, label: ['Annuler réservation'] },

      { parent: 'review', type: 'include', x: 2140, y: 1590, rx: 145, ry: 38, label: ['Noter service'] },
      { parent: 'review', type: 'include', x: 2140, y: 1690, rx: 165, ry: 38, label: ['Rédiger commentaire'] },

      { parent: 'profile', type: 'extend', x: 1600, y: 1890, rx: 145, ry: 40, label: ['Modifier infos'] },
      { parent: 'profile', type: 'extend', x: 2140, y: 1990, rx: 165, ry: 38, label: ['Changer mot de passe'] },

      { parent: 'notifications', type: 'extend', x: 2140, y: 1780, rx: 150, ry: 38, label: ['Marquer comme lu'] },
    ],
  },
  {
    file: 'prestataire-usecase-diagram',
    title: 'Gestion Prestataire',
    actor: { x: 180, y: 1060, label: 'Prestataire' },
    useCases: [
      { id: 'auth', x: 900, y: 260, rx: 190, ry: 54, label: ['Se connecter'] },
      { id: 'dashboard', x: 900, y: 520, rx: 240, ry: 58, label: ['Consulter tableau', 'de bord'] },
      { id: 'profile', x: 900, y: 800, rx: 185, ry: 54, label: ['Gérer profil'] },
      { id: 'services', x: 900, y: 1090, rx: 215, ry: 58, label: ['Gérer services'] },
      { id: 'bookings', x: 900, y: 1380, rx: 220, ry: 58, label: ['Gérer réservations'] },
      { id: 'subscription', x: 900, y: 1660, rx: 205, ry: 54, label: ['Gérer abonnement'] },
      { id: 'verification', x: 900, y: 1910, rx: 220, ry: 58, label: ['Demander vérification'] },
      { id: 'notifications', x: 1600, y: 1910, rx: 235, ry: 58, label: ['Consulter notifications'] },
    ],
    relations: [
      { parent: 'auth', type: 'extend', x: 1600, y: 260, rx: 155, ry: 40, label: ['Mot de passe oublié'] },

      { parent: 'profile', type: 'include', x: 1600, y: 740, rx: 170, ry: 40, label: ['Gérer disponibilité'] },
      { parent: 'profile', type: 'extend', x: 1600, y: 840, rx: 165, ry: 40, label: ['Gérer localisation'] },

      { parent: 'services', type: 'include', x: 1600, y: 1000, rx: 130, ry: 40, label: ['Créer service'] },
      { parent: 'services', type: 'include', x: 1600, y: 1100, rx: 150, ry: 40, label: ['Modifier service'] },
      { parent: 'services', type: 'extend', x: 2140, y: 1090, rx: 160, ry: 38, label: ['Supprimer service'] },

      { parent: 'bookings', type: 'extend', x: 1600, y: 1320, rx: 165, ry: 40, label: ['Accepter réservation'] },
      { parent: 'bookings', type: 'extend', x: 1600, y: 1420, rx: 165, ry: 40, label: ['Refuser réservation'] },
      { parent: 'bookings', type: 'extend', x: 2140, y: 1380, rx: 160, ry: 38, label: ['Terminer prestation'] },

      { parent: 'subscription', type: 'include', x: 1600, y: 1600, rx: 145, ry: 40, label: ['Souscrire plan'] },
      { parent: 'subscription', type: 'extend', x: 1600, y: 1700, rx: 160, ry: 40, label: ['Annuler abonnement'] },

      { parent: 'verification', type: 'include', x: 1600, y: 1860, rx: 180, ry: 40, label: ['Télécharger documents'] },
      { parent: 'verification', type: 'extend', x: 2140, y: 1910, rx: 165, ry: 38, label: ['Suivre statut'] },
    ],
  },
  {
    file: 'admin-usecase-diagram',
    title: 'Gestion Administrateur',
    actor: { x: 180, y: 1060, label: 'Administrateur' },
    useCases: [
      { id: 'auth', x: 900, y: 260, rx: 190, ry: 54, label: ['Se connecter'] },
      { id: 'dashboard', x: 900, y: 500, rx: 240, ry: 58, label: ['Consulter tableau', 'de bord'] },
      { id: 'users', x: 900, y: 770, rx: 210, ry: 54, label: ['Gérer utilisateurs'] },
      { id: 'verify', x: 900, y: 1050, rx: 220, ry: 58, label: ['Vérifier prestataires'] },
      { id: 'categories', x: 900, y: 1330, rx: 210, ry: 54, label: ['Gérer catégories'] },
      { id: 'services', x: 900, y: 1610, rx: 190, ry: 54, label: ['Gérer services'] },
      { id: 'bookings', x: 1600, y: 1330, rx: 225, ry: 58, label: ['Superviser réservations'] },
      { id: 'subscriptions', x: 1600, y: 1610, rx: 215, ry: 54, label: ['Gérer abonnements'] },
      { id: 'payments', x: 1600, y: 1890, rx: 210, ry: 54, label: ['Consulter paiements'] },
      { id: 'notifications', x: 900, y: 1890, rx: 220, ry: 54, label: ['Envoyer notifications'] },
    ],
    relations: [
      { parent: 'auth', type: 'extend', x: 1600, y: 260, rx: 165, ry: 40, label: ['Changer mot de passe'] },

      { parent: 'users', type: 'include', x: 1600, y: 700, rx: 130, ry: 40, label: ['Créer utilisateur'] },
      { parent: 'users', type: 'include', x: 1600, y: 800, rx: 160, ry: 40, label: ['Supprimer utilisateur'] },

      { parent: 'verify', type: 'extend', x: 1600, y: 1000, rx: 155, ry: 40, label: ['Valider demande'] },
      { parent: 'verify', type: 'extend', x: 1600, y: 1100, rx: 150, ry: 40, label: ['Rejeter demande'] },

      { parent: 'categories', type: 'include', x: 1600, y: 1260, rx: 150, ry: 40, label: ['Créer catégorie'] },
      { parent: 'categories', type: 'include', x: 1600, y: 1360, rx: 165, ry: 40, label: ['Modifier catégorie'] },
      { parent: 'categories', type: 'extend', x: 2140, y: 1330, rx: 170, ry: 38, label: ['Supprimer catégorie'] },

      { parent: 'services', type: 'extend', x: 1600, y: 1560, rx: 135, ry: 40, label: ['Voir détails'] },
      { parent: 'services', type: 'extend', x: 1600, y: 1660, rx: 160, ry: 40, label: ['Supprimer service'] },

      { parent: 'bookings', type: 'extend', x: 2140, y: 1280, rx: 165, ry: 38, label: ['Voir détails'] },
      { parent: 'bookings', type: 'extend', x: 2140, y: 1380, rx: 160, ry: 38, label: ['Annuler réservation'] },

      { parent: 'subscriptions', type: 'extend', x: 2140, y: 1560, rx: 165, ry: 38, label: ['Gérer les plans'] },
      { parent: 'subscriptions', type: 'extend', x: 2140, y: 1660, rx: 170, ry: 38, label: ['Annuler abonnement'] },

      { parent: 'payments', type: 'extend', x: 2140, y: 1890, rx: 160, ry: 38, label: ['Voir détail paiement'] },
    ],
  },
];

for (const diagram of diagrams) {
  fs.writeFileSync(path.join(OUT_DIR, `${diagram.file}.svg`), makeSvg(diagram), 'utf8');
}

console.log(`Generated ${diagrams.length} richer SVG files in ${OUT_DIR}`);
