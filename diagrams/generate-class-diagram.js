const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'diagrams', 'class');
fs.mkdirSync(OUT_DIR, { recursive: true });

const width = 3600;
const height = 2400;

const classes = [
  {
    id: 'User', type: 'class', x: 120, y: 120, w: 520,
    attrs: [
      '+ id: String', '+ email: String', '+ password: String', '+ firstName: String', '+ lastName: String',
      '+ phone: String', '+ role: Role', '+ avatar: String?', '+ bio: String?', '+ specialization: String?',
      '+ address: String?', '+ zone: String?', '+ latitude: Float?', '+ longitude: Float?', '+ isVerified: Boolean',
      '+ isActive: Boolean', '+ createdAt: DateTime', '+ updatedAt: DateTime'
    ]
  },
  {
    id: 'ProviderProfile', type: 'class', x: 830, y: 120, w: 560,
    attrs: [
      '+ id: String', '+ userId: String', '+ businessName: String?', '+ specialty: String?', '+ bio: String?',
      '+ hourlyRate: Decimal?', '+ yearsExperience: Int?', '+ location: String?', '+ address: String?', '+ city: String?',
      '+ region: String?', '+ postalCode: String?', '+ serviceRadius: Int?', '+ isAvailable: Boolean', '+ rating: Decimal',
      '+ totalReviews: Int', '+ totalBookings: Int', '+ isVerified: Boolean', '+ profileImage: String?', '+ specialties: Json?',
      '+ availability: Json?', '+ createdAt: DateTime', '+ updatedAt: DateTime'
    ]
  },
  {
    id: 'Category', type: 'class', x: 1610, y: 120, w: 470,
    attrs: [
      '+ id: String', '+ name: String', '+ slug: String', '+ description: String?', '+ icon: String?', '+ image: String?',
      '+ isActive: Boolean', '+ displayOrder: Int', '+ parentId: String?', '+ createdAt: DateTime'
    ]
  },
  {
    id: 'Service', type: 'class', x: 2300, y: 120, w: 480,
    attrs: [
      '+ id: String', '+ providerId: String', '+ categoryId: String?', '+ name: String', '+ description: String?',
      '+ price: Decimal', '+ priceType: PriceType', '+ duration: Int?', '+ isActive: Boolean', '+ createdAt: DateTime', '+ updatedAt: DateTime'
    ]
  },
  {
    id: 'Booking', type: 'class', x: 650, y: 910, w: 510,
    attrs: [
      '+ id: String', '+ clientId: String', '+ serviceId: String', '+ bookingDate: DateTime', '+ bookingTime: String',
      '+ duration: Int', '+ status: BookingStatus', '+ address: String', '+ city: String', '+ phone: String?', '+ notes: String?',
      '+ totalAmount: Decimal?', '+ paymentStatus: PaymentStatus', '+ createdAt: DateTime', '+ updatedAt: DateTime'
    ]
  },
  {
    id: 'Review', type: 'class', x: 1430, y: 920, w: 470,
    attrs: [
      '+ id: String', '+ bookingId: String', '+ clientId: String', '+ providerId: String', '+ serviceId: String?',
      '+ rating: Int', '+ comment: String?', '+ isVerified: Boolean', '+ createdAt: DateTime', '+ updatedAt: DateTime'
    ]
  },
  {
    id: 'Payment', type: 'class', x: 2140, y: 930, w: 450,
    attrs: [
      '+ id: String', '+ bookingId: String?', '+ userId: String', '+ amount: Decimal', '+ paymentMethod: String?',
      '+ status: PaymentStatus', '+ transactionId: String?', '+ createdAt: DateTime'
    ]
  },
  {
    id: 'VerificationRequest', type: 'class', x: 110, y: 1640, w: 500,
    attrs: [
      '+ id: String', '+ userId: String', '+ documents: Json?', '+ status: String', '+ reviewedBy: String?',
      '+ reviewedAt: DateTime?', '+ createdAt: DateTime'
    ]
  },
  {
    id: 'Subscription', type: 'class', x: 860, y: 1640, w: 460,
    attrs: [
      '+ id: String', '+ userId: String', '+ plan: String', '+ status: String', '+ startDate: DateTime', '+ endDate: DateTime',
      '+ subscriptionPlanId: String?', '+ createdAt: DateTime'
    ]
  },
  {
    id: 'SubscriptionPlan', type: 'class', x: 1570, y: 1640, w: 500,
    attrs: [
      '+ id: String', '+ name: String', '+ slug: String', '+ description: String?', '+ price: Decimal', '+ duration: Int',
      '+ features: Json', '+ isActive: Boolean', '+ displayOrder: Int', '+ createdAt: DateTime', '+ updatedAt: DateTime'
    ]
  },
  {
    id: 'Notification', type: 'class', x: 2310, y: 1640, w: 470,
    attrs: [
      '+ id: String', '+ userId: String', '+ title: String', '+ message: String', '+ type: String', '+ read: Boolean',
      '+ link: String?', '+ privateRecipients: Json?', '+ createdAt: DateTime'
    ]
  },
  { id: 'Role', type: 'enum', x: 2990, y: 120, w: 260, attrs: ['CLIENT', 'PRESTATAIRE', 'ADMIN'] },
  { id: 'PriceType', type: 'enum', x: 2990, y: 430, w: 260, attrs: ['FIXED', 'HOURLY', 'QUOTE'] },
  { id: 'BookingStatus', type: 'enum', x: 2990, y: 820, w: 290, attrs: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'] },
  { id: 'PaymentStatus', type: 'enum', x: 2990, y: 1290, w: 290, attrs: ['PENDING', 'PAID', 'REFUNDED'] },
];

const relations = [
  { from: 'User', to: 'ProviderProfile', labelA: '1', labelB: '0..1', kind: 'assoc' },
  { from: 'User', to: 'Booking', labelA: '1', labelB: '0..*', kind: 'assoc', note: 'clientBookings' },
  { from: 'User', to: 'Review', labelA: '1', labelB: '0..*', kind: 'assoc', note: 'client' },
  { from: 'User', to: 'Payment', labelA: '1', labelB: '0..*', kind: 'assoc' },
  { from: 'User', to: 'VerificationRequest', labelA: '1', labelB: '0..*', kind: 'assoc', note: 'requester' },
  { from: 'User', to: 'VerificationRequest', labelA: '0..1', labelB: '0..*', kind: 'assoc', note: 'reviewer(admin)', anchorFrom: 'bottom', anchorTo: 'top', offset: 34 },
  { from: 'User', to: 'Subscription', labelA: '1', labelB: '0..*', kind: 'assoc' },
  { from: 'User', to: 'Notification', labelA: '1', labelB: '0..*', kind: 'assoc' },

  { from: 'ProviderProfile', to: 'Service', labelA: '1', labelB: '0..*', kind: 'assoc', note: 'providerId -> userId' },
  { from: 'ProviderProfile', to: 'Review', labelA: '1', labelB: '0..*', kind: 'assoc' },

  { from: 'Category', to: 'Category', labelA: 'parent 0..1', labelB: 'children 0..*', kind: 'self' },
  { from: 'Category', to: 'Service', labelA: '1', labelB: '0..*', kind: 'assoc' },

  { from: 'Service', to: 'Booking', labelA: '1', labelB: '0..*', kind: 'assoc' },
  { from: 'Service', to: 'Review', labelA: '0..1', labelB: '0..*', kind: 'assoc' },

  { from: 'Booking', to: 'Review', labelA: '1', labelB: '0..1', kind: 'composition' },
  { from: 'Booking', to: 'Payment', labelA: '1', labelB: '0..*', kind: 'assoc' },

  { from: 'SubscriptionPlan', to: 'Subscription', labelA: '1', labelB: '0..*', kind: 'assoc' },

  { from: 'User', to: 'Role', kind: 'dependency' },
  { from: 'Service', to: 'PriceType', kind: 'dependency' },
  { from: 'Booking', to: 'BookingStatus', kind: 'dependency' },
  { from: 'Booking', to: 'PaymentStatus', kind: 'dependency' },
  { from: 'Payment', to: 'PaymentStatus', kind: 'dependency', offset: 25 },
];

const map = Object.fromEntries(classes.map(c => [c.id, c]));

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function classHeight(c){
  return 56 + c.attrs.length * (c.type === 'enum' ? 34 : 30) + 18;
}

function boxSvg(c){
  const h = classHeight(c);
  const title = c.type === 'enum' ? `&lt;&lt;enumeration&gt;&gt;\n${c.id}` : c.id;
  const titleLines = c.type === 'enum' ? [`<<enumeration>>`, c.id] : [c.id];
  const attrsY = c.y + 84;
  const attrs = c.attrs.map((a,i)=>`<text x="${c.x+20}" y="${attrsY + i*(c.type==='enum'?34:30)}" class="attr">${esc(a)}</text>`).join('\n');
  const titleText = titleLines.map((line,i)=>`<tspan x="${c.x + c.w/2}" dy="${i===0?0:28}">${esc(line)}</tspan>`).join('');
  return `
  <g>
    <rect x="${c.x}" y="${c.y}" width="${c.w}" height="${h}" class="box ${c.type}" />
    <line x1="${c.x}" y1="${c.y+60}" x2="${c.x+c.w}" y2="${c.y+60}" class="separator" />
    <text x="${c.x + c.w/2}" y="${c.y+36}" class="title">${titleText}</text>
    ${attrs}
  </g>`;
}

function anchor(c, side, offset=0){
  const h = classHeight(c);
  switch(side){
    case 'left': return {x:c.x, y:c.y+h/2+offset};
    case 'right': return {x:c.x+c.w, y:c.y+h/2+offset};
    case 'top': return {x:c.x+c.w/2+offset, y:c.y};
    case 'bottom': return {x:c.x+c.w/2+offset, y:c.y+h};
  }
}

function defaultAnchors(a,b){
  const ac = {x:a.x+a.w/2, y:a.y+classHeight(a)/2};
  const bc = {x:b.x+b.w/2, y:b.y+classHeight(b)/2};
  const dx = bc.x - ac.x;
  const dy = bc.y - ac.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? ['right','left'] : ['left','right'];
  }
  return dy > 0 ? ['bottom','top'] : ['top','bottom'];
}

function arrowHead(x1,y1,x2,y2,size=14, hollow=true){
  const angle = Math.atan2(y2-y1, x2-x1);
  const p1x = x2 - size*Math.cos(angle - Math.PI/6);
  const p1y = y2 - size*Math.sin(angle - Math.PI/6);
  const p2x = x2 - size*Math.cos(angle + Math.PI/6);
  const p2y = y2 - size*Math.sin(angle + Math.PI/6);
  if (hollow) return `<path d="M ${p1x} ${p1y} L ${x2} ${y2} L ${p2x} ${p2y}" class="dep" />`;
  return `<polygon points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}" class="diamond" />`;
}

function diamond(x,y,dir,size=14, filled=false){
  let pts;
  if(dir==='right') pts=[[x,y],[x-size,y-size/1.5],[x-2*size,y],[x-size,y+size/1.5]];
  else if(dir==='left') pts=[[x,y],[x+size,y-size/1.5],[x+2*size,y],[x+size,y+size/1.5]];
  else if(dir==='down') pts=[[x,y],[x-size/1.5,y-size],[x,y-2*size],[x+size/1.5,y-size]];
  else pts=[[x,y],[x-size/1.5,y+size],[x,y+2*size],[x+size/1.5,y+size]];
  return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" class="${filled?'diamond-filled':'diamond'}" />`;
}

function relationSvg(r){
  if(r.kind==='self'){
    const c = map[r.from];
    const h = classHeight(c);
    const x1 = c.x + c.w;
    const y1 = c.y + 120;
    const path = `M ${x1} ${y1} C ${x1+120} ${y1}, ${x1+120} ${y1+170}, ${x1} ${y1+170}`;
    return `
    <path d="${path}" class="assoc" />
    <text x="${x1+28}" y="${y1-12}" class="mult">${esc(r.labelA)}</text>
    <text x="${x1+28}" y="${y1+195}" class="mult">${esc(r.labelB)}</text>`;
  }
  const a = map[r.from], b = map[r.to];
  const [sa,sb] = r.anchorFrom && r.anchorTo ? [r.anchorFrom, r.anchorTo] : defaultAnchors(a,b);
  const p1 = anchor(a, sa, r.offset || 0);
  const p2 = anchor(b, sb, r.offset || 0);

  if(r.kind==='dependency'){
    const line = `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="dep" />`;
    const head = arrowHead(p1.x,p1.y,p2.x,p2.y,16,true);
    return `\n${line}\n${head}`;
  }

  let extra='';
  let line = `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="assoc" />`;
  if(r.kind==='composition'){
    extra = diamond(p1.x,p1.y, sa==='right'?'right':sa==='left'?'left':sa==='bottom'?'down':'up', 13, true);
  }
  const mx = (p1.x+p2.x)/2;
  const my = (p1.y+p2.y)/2;
  const t1x = p1.x + (sa==='right'?8:sa==='left'?-50:8);
  const t1y = p1.y + (sa==='top'?-10:sa==='bottom'?24:-10);
  const t2x = p2.x + (sb==='right'?8:sb==='left'?-50:8);
  const t2y = p2.y + (sb==='top'?-10:sb==='bottom'?24:-10);
  const note = r.note ? `<text x="${mx+10}" y="${my-10}" class="note">${esc(r.note)}</text>` : '';
  return `
  ${line}
  ${extra}
  <text x="${t1x}" y="${t1y}" class="mult">${esc(r.labelA||'')}</text>
  <text x="${t2x}" y="${t2y}" class="mult">${esc(r.labelB||'')}</text>
  ${note}`;
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M 26 0 L 0 0 0 26" fill="none" stroke="#ebebeb" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="8" dy="8" stdDeviation="4" flood-color="#c9c9c9" flood-opacity="0.4"/>
    </filter>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill: #111; }
    .titleMain { font-size: 46px; font-weight: 700; }
    .subtitle { font-size: 20px; fill: #555; }
    .box { fill: #fff; stroke: #111; stroke-width: 2.4; filter: url(#shadow); }
    .enum { fill: #fcfcfc; }
    .separator { stroke: #111; stroke-width: 2; }
    .title { font-size: 26px; font-weight: 700; text-anchor: middle; }
    .attr { font-size: 21px; }
    .assoc { stroke: #111; stroke-width: 2.2; fill: none; }
    .dep { stroke: #444; stroke-width: 2; stroke-dasharray: 10 7; fill: none; }
    .mult { font-size: 20px; font-weight: 600; }
    .note { font-size: 18px; fill: #444; font-style: italic; }
    .diamond { fill: white; stroke: #111; stroke-width: 2.2; }
    .diamond-filled { fill: #111; stroke: #111; stroke-width: 2.2; }
  </style>
  <rect width="100%" height="100%" fill="#fafafa"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="40" y="40" width="3520" height="2320" fill="none" stroke="#bdbdbd" stroke-width="2"/>
  <text x="1800" y="90" text-anchor="middle" class="titleMain">Diagramme de Classes - KaayJob</text>
  <text x="1800" y="125" text-anchor="middle" class="subtitle">Modèle métier reconstitué depuis Prisma, SQL et les routes backend du projet</text>
  ${relations.map(relationSvg).join('\n')}
  ${classes.map(boxSvg).join('\n')}
</svg>`;

fs.writeFileSync(path.join(OUT_DIR, 'kaayjob-class-diagram.svg'), svg, 'utf8');
console.log(path.join(OUT_DIR, 'kaayjob-class-diagram.svg'));
