const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'diagrams', 'class');
fs.mkdirSync(OUT_DIR, { recursive: true });

const width = 4200;
const height = 2600;

const classes = [
  { id:'Role', label:'Role', x:120, y:140, w:260, enum:true, attrs:['CLIENT','PRESTATAIRE','ADMIN'] },
  { id:'PriceType', label:'PriceType', x:120, y:480, w:260, enum:true, attrs:['FIXED','HOURLY','QUOTE'] },
  { id:'BookingStatus', label:'BookingStatus', x:120, y:860, w:300, enum:true, attrs:['PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','REJECTED'] },
  { id:'PaymentStatus', label:'PaymentStatus', x:120, y:1320, w:300, enum:true, attrs:['PENDING','PAID','REFUNDED'] },

  { id:'User', label:'User', x:950, y:120, w:430, attrs:['+id: String','+email: String','+password: String','+firstName: String','+lastName: String','+phone: String','+role: Role','+avatar: String?','+bio: String?','+specialization: String?','+address: String?','+zone: String?','+latitude: Float?','+longitude: Float?','+isVerified: Boolean','+isActive: Boolean'] },
  { id:'ProviderProfile', label:'ProviderProfile', x:2400, y:420, w:520, attrs:['+id: String','+userId: String','+businessName: String?','+specialty: String?','+bio: String?','+hourlyRate: Decimal?','+location: String?','+serviceRadius: Int?','+isAvailable: Boolean','+rating: Decimal','+totalReviews: Int','+totalBookings: Int'] },
  { id:'Category', label:'Category', x:2300, y:120, w:400, attrs:['+id: String','+name: String','+slug: String','+description: String?','+icon: String?','+image: String?','+parentId: String?','+displayOrder: Int'] },
  { id:'Service', label:'Service', x:3300, y:120, w:420, attrs:['+id: String','+providerId: String','+categoryId: String?','+name: String','+description: String?','+price: Decimal','+priceType: PriceType','+duration: Int?','+isActive: Boolean'] },

  { id:'Booking', label:'Booking', x:760, y:900, w:450, attrs:['+id: String','+clientId: String','+serviceId: String','+bookingDate: DateTime','+bookingTime: String','+duration: Int','+status: BookingStatus','+address: String','+city: String','+phone: String?','+notes: String?','+totalAmount: Decimal?','+paymentStatus: PaymentStatus'] },
  { id:'Review', label:'Review', x:1650, y:980, w:410, attrs:['+id: String','+bookingId: String','+clientId: String','+providerId: String','+serviceId: String?','+rating: Int','+comment: String?','+isVerified: Boolean'] },
  { id:'Payment', label:'Payment', x:2650, y:980, w:380, attrs:['+id: String','+bookingId: String?','+userId: String','+amount: Decimal','+paymentMethod: String?','+status: PaymentStatus','+transactionId: String?'] },

  { id:'VerificationRequest', label:'VerificationRequest', x:540, y:1960, w:440, attrs:['+id: String','+userId: String','+documents: Json?','+status: String','+reviewedBy: String?','+reviewedAt: DateTime?'] },
  { id:'Subscription', label:'Subscription', x:1450, y:1960, w:390, attrs:['+id: String','+userId: String','+plan: String','+status: String','+startDate: DateTime','+endDate: DateTime','+subscriptionPlanId: String?'] },
  { id:'SubscriptionPlan', label:'SubscriptionPlan', x:2200, y:1960, w:430, attrs:['+id: String','+name: String','+slug: String','+price: Decimal','+duration: Int','+features: Json','+isActive: Boolean','+displayOrder: Int'] },
  { id:'Notification', label:'Notification', x:3090, y:1960, w:410, attrs:['+id: String','+userId: String','+title: String','+message: String','+type: String','+read: Boolean','+link: String?'] }
];

const classMap = Object.fromEntries(classes.map(c => [c.id, c]));

const relations = [
  {a:'User', b:'ProviderProfile', m1:'1', m2:'0..1'},
  {a:'User', b:'Booking', m1:'1', m2:'0..*'},
  {a:'User', b:'Review', m1:'1', m2:'0..*'},
  {a:'User', b:'Payment', m1:'1', m2:'0..*'},
  {a:'User', b:'VerificationRequest', m1:'1', m2:'0..*', sides:['bottom','top']},
  {a:'User', b:'Subscription', m1:'1', m2:'0..*', sides:['bottom','top']},
  {a:'User', b:'Notification', m1:'1', m2:'0..*', sides:['bottom','top']},
  {a:'ProviderProfile', b:'Service', m1:'1', m2:'0..*'},
  {a:'ProviderProfile', b:'Review', m1:'1', m2:'0..*', sides:['left','right']},
  {a:'Category', b:'Service', m1:'1', m2:'0..*'},
  {a:'Service', b:'Booking', m1:'1', m2:'0..*', sides:['left','right']},
  {a:'Service', b:'Review', m1:'0..1', m2:'0..*', sides:['left','right']},
  {a:'Booking', b:'Review', m1:'1', m2:'0..1', type:'composition'},
  {a:'Booking', b:'Payment', m1:'1', m2:'0..*', sides:['right','left']},
  {a:'SubscriptionPlan', b:'Subscription', m1:'1', m2:'0..*', sides:['left','right']}
];

const dependencies = [
  {a:'User', b:'Role'},
  {a:'Service', b:'PriceType'},
  {a:'Booking', b:'BookingStatus'},
  {a:'Booking', b:'PaymentStatus'},
  {a:'Payment', b:'PaymentStatus'}
];

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function boxHeight(c){ return 58 + c.attrs.length * 30 + 24; }
function mid(c){ return {x:c.x + c.w/2, y:c.y + boxHeight(c)/2}; }
function anchor(c, side, shift=0){
  const h = boxHeight(c);
  if (side === 'left') return {x:c.x, y:c.y + h/2 + shift};
  if (side === 'right') return {x:c.x + c.w, y:c.y + h/2 + shift};
  if (side === 'top') return {x:c.x + c.w/2 + shift, y:c.y};
  return {x:c.x + c.w/2 + shift, y:c.y + h};
}
function autoSides(a,b){
  const ma = mid(a), mb = mid(b);
  const dx = mb.x - ma.x, dy = mb.y - ma.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? ['right','left'] : ['left','right'];
  return dy > 0 ? ['bottom','top'] : ['top','bottom'];
}
function drawClass(c){
  const h = boxHeight(c);
  const titleLines = c.enum ? ['<<enumeration>>', c.label] : [c.label];
  const title = titleLines.map((t,i)=>`<tspan x="${c.x + c.w/2}" dy="${i===0?0:24}">${esc(t)}</tspan>`).join('');
  const attrs = c.attrs.map((a,i)=>`<text x="${c.x+16}" y="${c.y+88+i*30}" class="attr">${esc(a)}</text>`).join('\n');
  return `
  <g>
    <rect x="${c.x}" y="${c.y}" width="${c.w}" height="${h}" class="classBox"/>
    <line x1="${c.x}" y1="${c.y+52}" x2="${c.x+c.w}" y2="${c.y+52}" class="sep"/>
    <line x1="${c.x}" y1="${c.y+h-36}" x2="${c.x+c.w}" y2="${c.y+h-36}" class="sep"/>
    <text x="${c.x + c.w/2}" y="${c.y+31}" class="title">${title}</text>
    ${attrs}
  </g>`;
}
function diamond(x,y,side){
  const s = 12;
  let pts;
  if(side==='right') pts=[[x,y],[x-s,y-s],[x-2*s,y],[x-s,y+s]];
  else if(side==='left') pts=[[x,y],[x+s,y-s],[x+2*s,y],[x+s,y+s]];
  else if(side==='top') pts=[[x,y],[x-s,y+s],[x,y+2*s],[x+s,y+s]];
  else pts=[[x,y],[x-s,y-s],[x,y-2*s],[x+s,y-s]];
  return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" class="filledDiamond"/>`;
}
function arrowHead(x1,y1,x2,y2){
  const a = Math.atan2(y2-y1, x2-x1), s = 12;
  const p1 = [x2 - s*Math.cos(a-Math.PI/6), y2 - s*Math.sin(a-Math.PI/6)];
  const p2 = [x2 - s*Math.cos(a+Math.PI/6), y2 - s*Math.sin(a+Math.PI/6)];
  return `<path d="M ${p1[0]} ${p1[1]} L ${x2} ${y2} L ${p2[0]} ${p2[1]}" class="dep"/>`;
}
function selfRelation(c){
  const x = c.x + c.w, y = c.y + 110;
  return `
  <path d="M ${x} ${y} C ${x+120} ${y}, ${x+120} ${y+150}, ${x} ${y+150}" class="assoc"/>
  <text x="${x+18}" y="${y-10}" class="mult">parent 0..1</text>
  <text x="${x+18}" y="${y+175}" class="mult">children 0..*</text>`;
}
function relationSvg(r, idx){
  if (r.a === 'Category' && r.b === 'Category') return selfRelation(classMap['Category']);
  const a = classMap[r.a], b = classMap[r.b];
  const sides = r.sides || autoSides(a,b);
  const shift = (idx % 2 === 0 ? 0 : 18);
  const p1 = anchor(a, sides[0], sides[0]==='top'||sides[0]==='bottom' ? shift : 0);
  const p2 = anchor(b, sides[1], sides[1]==='top'||sides[1]==='bottom' ? -shift : 0);
  const line = `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="assoc"/>`;
  const extra = r.type === 'composition' ? diamond(p1.x,p1.y,sides[0]) : '';
  const t1 = `<text x="${p1.x + (sides[0]==='left'?-52:10)}" y="${p1.y - 10}" class="mult">${esc(r.m1)}</text>`;
  const t2 = `<text x="${p2.x + (sides[1]==='left'?-52:10)}" y="${p2.y - 10}" class="mult">${esc(r.m2)}</text>`;
  return `${line}\n${extra}\n${t1}\n${t2}`;
}
function dependencySvg(d){
  const a = classMap[d.a], b = classMap[d.b];
  const [sa,sb] = autoSides(a,b);
  const p1 = anchor(a,sa), p2 = anchor(b,sb);
  return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="dep"/>\n${arrowHead(p1.x,p1.y,p2.x,p2.y)}`;
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ececec" stroke-width="1"/>
    </pattern>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill: #111; }
    .classBox { fill: #fff; stroke: #666; stroke-width: 2; }
    .sep { stroke: #666; stroke-width: 1.8; }
    .title { font-size: 24px; font-weight: 700; text-anchor: middle; }
    .attr { font-size: 21px; }
    .assoc { stroke: #111; stroke-width: 1.8; fill: none; }
    .dep { stroke: #555; stroke-width: 1.6; stroke-dasharray: 8 7; fill: none; }
    .mult { font-size: 20px; fill: #111; }
    .filledDiamond { fill: #111; stroke: #111; stroke-width: 1.5; }
  </style>
  <rect width="100%" height="100%" fill="#fafafa"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  ${relations.map((r,i)=>relationSvg(r,i)).join('\n')}
  ${dependencies.map(dependencySvg).join('\n')}
  ${classes.map(drawClass).join('\n')}
</svg>`;

fs.writeFileSync(path.join(OUT_DIR, 'kaayjob-class-diagram-staruml.svg'), svg, 'utf8');
console.log(path.join(OUT_DIR, 'kaayjob-class-diagram-staruml.svg'));
