const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'diagrams', 'class');
fs.mkdirSync(OUT_DIR, { recursive: true });

const width = 5600;
const height = 3600;

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function boxHeight(box) {
  const lineHeight = box.type === 'enum' ? 32 : 28;
  return 58 + box.lines.length * lineHeight + 24;
}

function renderBox(box) {
  const h = boxHeight(box);
  const startY = box.y + (box.type === 'enum' ? 94 : 86);
  const title = box.type === 'enum'
    ? `
    <text x="${box.x + box.w / 2}" y="${box.y + 24}" class="stereo">&lt;&lt;enumeration&gt;&gt;</text>
    <text x="${box.x + box.w / 2}" y="${box.y + 50}" class="title">${esc(box.name)}</text>`
    : `<text x="${box.x + box.w / 2}" y="${box.y + 38}" class="title">${esc(box.name)}</text>`;

  return `
  <g>
    <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${h}" class="box ${box.type === 'enum' ? 'enum' : ''}"/>
    <line x1="${box.x}" y1="${box.y + 58}" x2="${box.x + box.w}" y2="${box.y + 58}" class="sep"/>
    ${title}
    ${box.lines.map((line, i) => `<text x="${box.x + 16}" y="${startY + i * (box.type === 'enum' ? 32 : 28)}" class="attr">${esc(line)}</text>`).join('\n')}
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
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
  }
  return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
}

function multText(x, y, side, text) {
  const dx = side === 'left' ? -62 : 12;
  const dy = side === 'bottom' ? 22 : -10;
  return `<text x="${x + dx}" y="${y + dy}" class="mult">${esc(text)}</text>`;
}

function openArrow(x1, y1, x2, y2, className = 'arrow') {
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

function selfRelation(rel, map) {
  const box = map[rel.from];
  const x = box.x + box.w;
  const y = box.y + 110;
  return `
  <path d="M ${x} ${y} C ${x + 170} ${y}, ${x + 170} ${y + 220}, ${x} ${y + 220}" class="assoc"/>
  <text x="${x + 24}" y="${y - 10}" class="mult">${esc(rel.m1)}</text>
  <text x="${x + 24}" y="${y + 246}" class="mult">${esc(rel.m2)}</text>`;
}

function relation(rel, map, idx) {
  if (rel.type === 'self') return selfRelation(rel, map);

  const a = map[rel.from];
  const b = map[rel.to];
  const sides = rel.sides || chooseSides(a, b);
  const shift = rel.shift != null ? rel.shift : ((idx % 3) - 1) * 20;
  const p1 = anchor(a, sides[0], sides[0] === 'top' || sides[0] === 'bottom' ? shift : 0);
  const p2 = anchor(b, sides[1], sides[1] === 'top' || sides[1] === 'bottom' ? -shift : 0);

  const baseLine = `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="assoc"/>`;
  const deco = rel.type === 'composition'
    ? diamond(p1.x, p1.y, sides[0], true)
    : rel.type === 'aggregation'
      ? diamond(p1.x, p1.y, sides[0], false)
      : '';
  const nav = rel.navigable || rel.type === 'enum-link' ? openArrow(p1.x, p1.y, p2.x, p2.y, 'arrow') : '';

  return `
  ${baseLine}
  ${deco}
  ${nav}
  ${rel.m1 ? multText(p1.x, p1.y, sides[0], rel.m1) : ''}
  ${rel.m2 ? multText(p2.x, p2.y, sides[1], rel.m2) : ''}`;
}

const boxes = [
  { name: 'Role', type: 'enum', x: 120, y: 180, w: 260, lines: ['CLIENT', 'PRESTATAIRE', 'ADMIN'] },
  { name: 'User', x: 560, y: 180, w: 560, lines: ['+id: UUID', '+email: String', '+password: String', '+firstName: String', '+lastName: String', '+phone: String', '+role: Role', '+avatar: String?', '+bio: String?', '+address: String?', '+latitude: Float?', '+longitude: Float?', '+isVerified: Boolean', '+isActive: Boolean'] },
  { name: 'ProviderProfile', x: 1450, y: 180, w: 620, lines: ['+id: UUID', '+userId: UUID', '+businessName: String?', '+specialty: String?', '+hourlyRate: Decimal?', '+location: String?', '+serviceRadius: Int?', '+isAvailable: Boolean', '+rating: Decimal', '+totalReviews: Int', '+totalBookings: Int'] },
  { name: 'Category', x: 2430, y: 220, w: 470, lines: ['+id: UUID', '+name: String', '+slug: String', '+description: String?', '+isActive: Boolean', '+displayOrder: Int', '+parentId: UUID?'] },
  { name: 'Service', x: 3220, y: 180, w: 520, lines: ['+id: UUID', '+providerId: UUID', '+categoryId: UUID?', '+name: String', '+description: String?', '+price: Decimal', '+priceType: TypePrix', '+duration: Int?', '+isActive: Boolean'] },
  { name: 'TypePrix', type: 'enum', x: 4040, y: 220, w: 280, lines: ['FIXED', 'HOURLY', 'QUOTE'] },

  { name: 'StatutReservation', type: 'enum', x: 120, y: 1080, w: 330, lines: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'] },
  { name: 'Booking', x: 930, y: 1130, w: 620, lines: ['+id: UUID', '+clientId: UUID', '+serviceId: UUID', '+bookingDate: DateTime', '+bookingTime: String', '+duration: Int', '+status: StatutReservation', '+address: String', '+city: String', '+phone: String?', '+notes: String?', '+totalAmount: Decimal?', '+paymentStatus: StatutPaiement'] },
  { name: 'Review', x: 1960, y: 1180, w: 500, lines: ['+id: UUID', '+bookingId: UUID', '+clientId: UUID', '+providerId: UUID', '+serviceId: UUID?', '+rating: Int', '+comment: String?', '+isVerified: Boolean'] },
  { name: 'Payment', x: 2830, y: 1180, w: 470, lines: ['+id: UUID', '+bookingId: UUID?', '+userId: UUID', '+amount: Decimal', '+paymentMethod: String?', '+status: StatutPaiement', '+transactionId: String?'] },
  { name: 'StatutPaiement', type: 'enum', x: 3540, y: 1240, w: 320, lines: ['PENDING', 'PAID', 'REFUNDED'] },

  { name: 'VerificationRequest', x: 520, y: 2620, w: 520, lines: ['+id: UUID', '+userId: UUID', '+documents: Json?', '+status: String', '+reviewedBy: UUID?', '+reviewedAt: DateTime?'] },
  { name: 'Subscription', x: 1550, y: 2620, w: 470, lines: ['+id: UUID', '+userId: UUID', '+plan: String', '+status: String', '+startDate: DateTime', '+endDate: DateTime'] },
  { name: 'SubscriptionPlan', x: 2370, y: 2620, w: 520, lines: ['+id: UUID', '+name: String', '+slug: String', '+price: Decimal', '+duration: Int', '+features: Json', '+isActive: Boolean'] },
  { name: 'Notification', x: 3290, y: 2620, w: 480, lines: ['+id: UUID', '+userId: UUID', '+title: String', '+message: String', '+type: String', '+read: Boolean', '+link: String?'] },
];

const map = Object.fromEntries(boxes.map((b) => [b.name, b]));

const relations = [
  { from: 'User', to: 'Role', type: 'enum-link', m1: '*', m2: '1', sides: ['left', 'right'] },
  { from: 'User', to: 'ProviderProfile', type: 'composition', m1: '1', m2: '0..1', navigable: true },
  { from: 'ProviderProfile', to: 'Service', type: 'composition', m1: '1', m2: '0..*', navigable: true },
  { from: 'Category', to: 'Category', type: 'self', m1: 'parent 0..1', m2: 'children 0..*' },
  { from: 'Category', to: 'Service', type: 'association', m1: '1', m2: '0..*', navigable: true },
  { from: 'Service', to: 'TypePrix', type: 'enum-link', m1: '*', m2: '1', sides: ['right', 'left'] },

  { from: 'User', to: 'Booking', type: 'association', m1: '1', m2: '0..*', navigable: true },
  { from: 'Service', to: 'Booking', type: 'association', m1: '1', m2: '0..*', navigable: true },
  { from: 'Booking', to: 'StatutReservation', type: 'enum-link', m1: '*', m2: '1', sides: ['left', 'right'] },

  { from: 'Booking', to: 'Review', type: 'composition', m1: '1', m2: '0..1', navigable: true },
  { from: 'User', to: 'Review', type: 'association', m1: '1', m2: '0..*', navigable: true, sides: ['bottom', 'top'], shift: -130 },
  { from: 'ProviderProfile', to: 'Review', type: 'association', m1: '1', m2: '0..*', navigable: true, sides: ['bottom', 'top'], shift: 80 },
  { from: 'Service', to: 'Review', type: 'association', m1: '0..1', m2: '0..*', navigable: true, sides: ['bottom', 'top'], shift: 150 },

  { from: 'Booking', to: 'Payment', type: 'association', m1: '1', m2: '0..*', navigable: true },
  { from: 'User', to: 'Payment', type: 'association', m1: '1', m2: '0..*', navigable: true, sides: ['bottom', 'top'], shift: 70 },
  { from: 'Booking', to: 'StatutPaiement', type: 'enum-link', m1: '*', m2: '1', sides: ['right', 'left'], shift: -20 },
  { from: 'Payment', to: 'StatutPaiement', type: 'enum-link', m1: '*', m2: '1', sides: ['right', 'left'] },

  { from: 'User', to: 'VerificationRequest', type: 'association', m1: '1', m2: '0..*', navigable: true, sides: ['bottom', 'top'], shift: -170 },
  { from: 'User', to: 'VerificationRequest', type: 'association', m1: '0..1', m2: '0..*', navigable: true, sides: ['left', 'top'], shift: 30 },
  { from: 'User', to: 'Subscription', type: 'association', m1: '1', m2: '0..*', navigable: true, sides: ['bottom', 'top'], shift: 0 },
  { from: 'SubscriptionPlan', to: 'Subscription', type: 'aggregation', m1: '1', m2: '0..*', navigable: true, sides: ['left', 'right'] },
  { from: 'User', to: 'Notification', type: 'association', m1: '1', m2: '0..*', navigable: true, sides: ['bottom', 'top'], shift: 170 },
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
    .main-title { font-size: 42px; font-weight: 700; }
    .sub-title { font-size: 20px; fill: #555; }
    .box { fill: #fff; stroke: #111; stroke-width: 2.1; filter: url(#shadow); }
    .enum { fill: #fcfcfc; }
    .sep { stroke: #111; stroke-width: 1.7; }
    .title { font-size: 26px; font-weight: 700; text-anchor: middle; }
    .stereo { font-size: 18px; font-style: italic; text-anchor: middle; fill: #444; }
    .attr { font-size: 21px; }
    .assoc { stroke: #111; stroke-width: 2; fill: none; }
    .arrow { stroke: #111; stroke-width: 2; fill: none; }
    .diamond-open { fill: #fff; stroke: #111; stroke-width: 1.7; }
    .diamond-filled { fill: #111; stroke: #111; stroke-width: 1.7; }
    .mult { font-size: 19px; font-weight: 600; }
  </style>
  <rect width="100%" height="100%" fill="#fbfbfb"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <text x="70" y="60" class="main-title">KaayJob - Diagramme De Classe</text>
  <text x="70" y="92" class="sub-title">Version classique, aérée, avec multiplicités et relations UML</text>
  ${relations.map((r, i) => relation(r, map, i)).join('\n')}
  ${boxes.map(renderBox).join('\n')}
</svg>`;

const out = path.join(OUT_DIR, 'kaayjob-classic-class-diagram.svg');
fs.writeFileSync(out, svg, 'utf8');
console.log(out);
