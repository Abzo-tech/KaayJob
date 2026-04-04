const fs = require('fs');
const path = require('path');

const width = 2000;
const height = 1280;

const actors = [
  { id: 'client', label: 'Client', x: 120, y: 560 },
  { id: 'prestataire', label: 'Prestataire', x: 1880, y: 560 },
  { id: 'admin', label: 'Administrateur', x: 1000, y: 1120 },
];

const useCases = [
  { id: 'uc_auth_client', section: 'Client', label: ['S\'inscrire /', 'Se connecter'], x: 380, y: 170, rx: 120, ry: 42 },
  { id: 'uc_browse_categories', section: 'Client', label: ['Parcourir', 'catégories'], x: 360, y: 290, rx: 110, ry: 38 },
  { id: 'uc_search_providers', section: 'Client', label: ['Rechercher et filtrer', 'les prestataires'], x: 600, y: 290, rx: 145, ry: 40 },
  { id: 'uc_view_provider', section: 'Client', label: ['Voir profil, services', 'et avis prestataire'], x: 480, y: 420, rx: 145, ry: 40 },
  { id: 'uc_book_service', section: 'Client', label: ['Réserver un', 'service'], x: 360, y: 550, rx: 100, ry: 38 },
  { id: 'uc_manage_bookings', section: 'Client', label: ['Consulter / annuler', 'mes réservations'], x: 610, y: 560, rx: 145, ry: 40 },
  { id: 'uc_leave_review', section: 'Client', label: ['Laisser une note', 'et un avis'], x: 420, y: 700, rx: 120, ry: 38 },
  { id: 'uc_client_profile', section: 'Client', label: ['Gérer profil et', 'notifications'], x: 620, y: 705, rx: 135, ry: 40 },

  { id: 'uc_auth_provider', section: 'Prestataire', label: ['S\'inscrire /', 'Se connecter'], x: 1620, y: 170, rx: 120, ry: 42 },
  { id: 'uc_provider_dashboard', section: 'Prestataire', label: ['Consulter tableau de bord', 'et statistiques'], x: 1560, y: 300, rx: 155, ry: 40 },
  { id: 'uc_manage_profile', section: 'Prestataire', label: ['Gérer profil,', 'géolocalisation et dispo'], x: 1350, y: 430, rx: 160, ry: 42 },
  { id: 'uc_manage_services', section: 'Prestataire', label: ['Créer / modifier /', 'supprimer mes services'], x: 1615, y: 430, rx: 155, ry: 42 },
  { id: 'uc_manage_provider_bookings', section: 'Prestataire', label: ['Gérer réservations', '(confirmer, refuser, terminer)'], x: 1510, y: 575, rx: 185, ry: 44 },
  { id: 'uc_request_verification', section: 'Prestataire', label: ['Demander', 'vérification'], x: 1345, y: 705, rx: 110, ry: 38 },
  { id: 'uc_manage_subscription', section: 'Prestataire', label: ['Souscrire / annuler', 'un abonnement'], x: 1605, y: 705, rx: 145, ry: 40 },
  { id: 'uc_provider_notifications', section: 'Prestataire', label: ['Consulter notifications', 'et historique paiements'], x: 1485, y: 840, rx: 160, ry: 42 },

  { id: 'uc_admin_login', section: 'Admin', label: ['Se connecter'], x: 860, y: 965, rx: 92, ry: 34 },
  { id: 'uc_admin_dashboard', section: 'Admin', label: ['Consulter tableau de bord', 'et analyses'], x: 1085, y: 960, rx: 150, ry: 40 },
  { id: 'uc_manage_users', section: 'Admin', label: ['Gérer utilisateurs'], x: 760, y: 1080, rx: 110, ry: 36 },
  { id: 'uc_verify_providers', section: 'Admin', label: ['Vérifier', 'prestataires'], x: 955, y: 1080, rx: 105, ry: 36 },
  { id: 'uc_manage_categories', section: 'Admin', label: ['Gérer', 'catégories'], x: 1145, y: 1080, rx: 95, ry: 36 },
  { id: 'uc_monitor_services', section: 'Admin', label: ['Gérer services', 'et réservations'], x: 1335, y: 1080, rx: 120, ry: 38 },
  { id: 'uc_manage_subscriptions', section: 'Admin', label: ['Gérer abonnements,', 'plans et paiements'], x: 1150, y: 1195, rx: 155, ry: 40 },
];

const relations = [
  ['client', 'uc_auth_client'],
  ['client', 'uc_browse_categories'],
  ['client', 'uc_search_providers'],
  ['client', 'uc_view_provider'],
  ['client', 'uc_book_service'],
  ['client', 'uc_manage_bookings'],
  ['client', 'uc_leave_review'],
  ['client', 'uc_client_profile'],

  ['prestataire', 'uc_auth_provider'],
  ['prestataire', 'uc_provider_dashboard'],
  ['prestataire', 'uc_manage_profile'],
  ['prestataire', 'uc_manage_services'],
  ['prestataire', 'uc_manage_provider_bookings'],
  ['prestataire', 'uc_request_verification'],
  ['prestataire', 'uc_manage_subscription'],
  ['prestataire', 'uc_provider_notifications'],

  ['admin', 'uc_admin_login'],
  ['admin', 'uc_admin_dashboard'],
  ['admin', 'uc_manage_users'],
  ['admin', 'uc_verify_providers'],
  ['admin', 'uc_manage_categories'],
  ['admin', 'uc_monitor_services'],
  ['admin', 'uc_manage_subscriptions'],
];

const includes = [
  ['uc_search_providers', 'Filtrer par catégorie', 780, 210, 95, 28],
  ['uc_search_providers', 'Filtrer par localisation', 810, 290, 95, 28],
  ['uc_search_providers', 'Filtrer par note', 790, 370, 85, 28],
  ['uc_book_service', 'Choisir date', 515, 520, 80, 26],
  ['uc_book_service', 'Choisir créneau', 520, 590, 90, 26],
  ['uc_book_service', 'Ajouter adresse', 505, 660, 90, 26],
  ['uc_leave_review', 'Noter prestataire', 560, 770, 95, 28],
  ['uc_leave_review', 'Écrire commentaire', 365, 820, 105, 28],
  ['uc_manage_profile', 'Mettre à jour disponibilité', 1190, 505, 120, 28],
  ['uc_manage_subscription', 'Choisir plan', 1770, 650, 75, 24],
  ['uc_manage_subscription', 'Payer abonnement', 1785, 730, 90, 26],
  ['uc_verify_providers', 'Valider demande', 955, 920, 95, 26],
];

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
    <g class="actor" id="${actor.id}">
      <circle cx="${x}" cy="${y - 120}" r="34" />
      <line x1="${x}" y1="${y - 86}" x2="${x}" y2="${y + 6}" />
      <line x1="${x - 50}" y1="${y - 45}" x2="${x + 50}" y2="${y - 45}" />
      <line x1="${x}" y1="${y + 6}" x2="${x - 45}" y2="${y + 70}" />
      <line x1="${x}" y1="${y + 6}" x2="${x + 45}" y2="${y + 70}" />
      <text x="${x}" y="${y + 112}" class="actor-label">${esc(label)}</text>
    </g>`;
}

function useCaseSvg(uc) {
  const tspans = uc.label.map((line, index) => {
    const dy = index === 0 ? 0 : 20;
    return `<tspan x="${uc.x}" dy="${dy}">${esc(line)}</tspan>`;
  }).join('');
  return `
    <g class="usecase" id="${uc.id}">
      <ellipse cx="${uc.x}" cy="${uc.y}" rx="${uc.rx}" ry="${uc.ry}" />
      <text x="${uc.x}" y="${uc.y - (uc.label.length > 1 ? 10 : 0)}" class="usecase-label">${tspans}</text>
    </g>`;
}

function miniUseCaseSvg(parentId, label, x, y, rx, ry) {
  return `
    <g class="usecase mini" id="mini_${parentId}_${label.replace(/[^a-z0-9]+/gi, '_')}">
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" />
      <text x="${x}" y="${y + 4}" class="mini-label">${esc(label)}</text>
    </g>`;
}

function lineFor(actor, uc) {
  const ax = actor.x;
  const ay = actor.y - 45;
  const leftSide = uc.x < ax;
  const ux = leftSide ? uc.x + uc.rx : uc.x - uc.rx;
  const uy = uc.y;
  return `<line class="assoc" x1="${ax}" y1="${ay}" x2="${ux}" y2="${uy}" />`;
}

function dashedBetween(x1, y1, x2, y2, label, labelX, labelY) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLen = 10;
  const a1x = x2 - arrowLen * Math.cos(angle - Math.PI / 6);
  const a1y = y2 - arrowLen * Math.sin(angle - Math.PI / 6);
  const a2x = x2 - arrowLen * Math.cos(angle + Math.PI / 6);
  const a2y = y2 - arrowLen * Math.sin(angle + Math.PI / 6);
  return `
    <g>
      <line class="include" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />
      <line class="include" x1="${x2}" y1="${y2}" x2="${a1x.toFixed(2)}" y2="${a1y.toFixed(2)}" />
      <line class="include" x1="${x2}" y1="${y2}" x2="${a2x.toFixed(2)}" y2="${a2y.toFixed(2)}" />
      <text x="${labelX}" y="${labelY}" class="include-label">&lt;&lt;include&gt;&gt;</text>
    </g>`;
}

const actorMap = Object.fromEntries(actors.map(a => [a.id, a]));
const ucMap = Object.fromEntries(useCases.map(u => [u.id, u]));

const relationSvg = relations.map(([actorId, ucId]) => lineFor(actorMap[actorId], ucMap[ucId])).join('\n');
const useCaseSvgs = useCases.map(useCaseSvg).join('\n');
const actorSvgs = actors.map(actorSvg).join('\n');

const includeSvgs = includes.map(([fromId, label, x, y, rx, ry], index) => {
  const from = ucMap[fromId];
  const miniId = `mini_${index}`;
  const mini = { x, y, rx, ry };
  const miniSvg = miniUseCaseSvg(fromId, label, x, y, rx, ry);
  const startX = from.x < x ? from.x + from.rx * 0.84 : from.x - from.rx * 0.84;
  const startY = from.y + (y - from.y) * 0.1;
  const endX = from.x < x ? x - rx : x + rx;
  const endY = y;
  const mx = (startX + endX) / 2;
  const my = (startY + endY) / 2 - 8;
  const link = dashedBetween(startX, startY, endX, endY, 'include', mx - 28, my);
  return miniSvg + link;
}).join('\n');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e9e9e9" stroke-width="1" />
    </pattern>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="5" dy="6" stdDeviation="3" flood-color="#b8b8b8" flood-opacity="0.35"/>
    </filter>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill: #111; }
    .title { font-size: 34px; font-weight: 700; }
    .section-title { font-size: 26px; font-weight: 700; }
    .actor-label { font-size: 22px; font-weight: 700; text-anchor: middle; }
    .usecase ellipse { fill: #fff; stroke: #222; stroke-width: 2; filter: url(#softShadow); }
    .usecase-label { font-size: 19px; font-weight: 600; text-anchor: middle; dominant-baseline: middle; }
    .mini-label { font-size: 15px; font-weight: 500; text-anchor: middle; dominant-baseline: middle; }
    .actor circle, .actor line { stroke: #111; stroke-width: 2.5; fill: none; }
    .assoc { stroke: #111; stroke-width: 2; }
    .include { stroke: #444; stroke-width: 1.8; stroke-dasharray: 7 6; fill: none; }
    .include-label { font-size: 15px; fill: #333; }
    .note { font-size: 17px; fill: #444; }
  </style>

  <rect width="100%" height="100%" fill="#fafafa" />
  <rect width="100%" height="100%" fill="url(#grid)" />

  <rect x="220" y="80" width="1560" height="1120" fill="#fff" stroke="#6a6a6a" stroke-width="2.4" />
  <text x="1000" y="115" class="title" text-anchor="middle">Diagramme de Cas d'utilisation - KaayJob</text>

  <line x1="740" y1="140" x2="740" y2="910" stroke="#d0d0d0" stroke-width="2" />
  <line x1="1260" y1="140" x2="1260" y2="910" stroke="#d0d0d0" stroke-width="2" />
  <line x1="280" y1="910" x2="1720" y2="910" stroke="#d0d0d0" stroke-width="2" />

  <text x="500" y="150" class="section-title" text-anchor="middle">Espace Client</text>
  <text x="1520" y="150" class="section-title" text-anchor="middle">Espace Prestataire</text>
  <text x="1000" y="945" class="section-title" text-anchor="middle">Espace Administrateur</text>

  ${relationSvg}
  ${useCaseSvgs}
  ${includeSvgs}
  ${actorSvgs}

  <text x="250" y="1238" class="note">Sources analysées : documentation métier, schéma Prisma, routes backend et interfaces front.</text>
</svg>`;

const out = path.join(process.cwd(), 'diagrams', 'kaayjob-usecase-diagram.svg');
fs.writeFileSync(out, svg, 'utf8');
console.log(out);
