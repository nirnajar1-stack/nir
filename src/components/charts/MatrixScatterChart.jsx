import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, Customized,
} from 'recharts';
import { subCategoryData, COLORS } from '../../data.js';
import { CustomTooltipScatter } from '../Tooltips.jsx';
import { renderCustomBadgeLabel } from '../BadgeLabel.jsx';

const QUADRANT_LABELS = [
  { key: 'handoff', text: 'רביע העברת שרביט', fill: '#eab308', x: 0.76, y: 0.2 },
  { key: 'niche', text: 'רביע מומחיות נישה', fill: '#f59e0b', x: 0.24, y: 0.2 },
  { key: 'broad', text: 'טיפול שוטף נרחב', fill: '#10b981', x: 0.76, y: 0.1 },
  { key: 'quick', text: 'פעולות בזק', fill: '#3b82f6', x: 0.24, y: 0.1 },
];

function MatrixQuadrantLabels({ width, height, fontSize, opacity }) {
  if (!width || !height) return null;
  const innerW = width - 50;
  const innerH = height - 60;
  const offsetX = 40;
  const offsetY = 28;

  return (
    <g className="matrix-quadrant-labels" pointerEvents="none" aria-hidden>
      {QUADRANT_LABELS.map((q) => (
        <text
          key={q.key}
          x={offsetX + innerW * q.x}
          y={offsetY + innerH * q.y}
          fill={q.fill}
          fontSize={fontSize}
          fontWeight="900"
          opacity={opacity}
          textAnchor="middle"
        >
          {q.text}
        </text>
      ))}
    </g>
  );
}

/** @param {{ variant?: 'light' | 'dark' }} props */
export default function MatrixScatterChart({ variant = 'light' }) {
  const dark = variant === 'dark';

  const gridStroke = dark ? '#334155' : '#e2e8f0';
  const axisStroke = dark ? '#475569' : '#cbd5e1';
  const tickFill = dark ? '#94a3b8' : '#94a3b8';
  const labelFill = dark ? '#94a3b8' : '#64748b';
  const refStroke = dark ? '#475569' : '#94a3b8';
  const cursorStroke = dark ? '#cbd5e1' : '#94a3b8';
  const quadrantOpacity = dark ? 0.1 : 0.08;
  const quadrantSize = dark ? 22 : 16;

  return (
    <ScatterChart margin={{ top: 36, right: 28, bottom: 44, left: 16 }}>
      <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} opacity={0.6} />

      <XAxis
        type="number"
        dataKey="families"
        name="משפחות בטיפול"
        label={{
          value: 'תפוצה — משפחות בטיפול',
          position: 'bottom',
          offset: 12,
          fill: labelFill,
          fontWeight: 'bold',
        }}
        tick={{ fill: tickFill, fontSize: dark ? 13 : 12 }}
        axisLine={{ stroke: axisStroke }}
        tickLine={false}
      />

      <YAxis
        type="number"
        dataKey="sla"
        name="ימי טיפול"
        label={{
          value: 'מאמץ תפעולי - ימי טיפול נדרשים',
          angle: -90,
          position: 'insideLeft',
          offset: 0,
          fill: labelFill,
          fontWeight: 'bold',
        }}
        tick={{ fill: tickFill, fontSize: dark ? 13 : 12 }}
        axisLine={{ stroke: axisStroke }}
        tickLine={false}
        domain={[0, 40]}
      />

      <ZAxis type="number" dataKey="tasks" range={dark ? [500, 5000] : [400, 3500]} name="נפח משימות" />

      <Tooltip content={<CustomTooltipScatter />} cursor={{ strokeDasharray: '3 3', stroke: cursorStroke }} />

      <ReferenceLine x={32} stroke={refStroke} strokeDasharray="6 6" strokeWidth={2} opacity={dark ? 0.6 : 0.5} />
      <ReferenceLine y={20} stroke={refStroke} strokeDasharray="6 6" strokeWidth={2} opacity={dark ? 0.6 : 0.5} />

      <Customized
        component={(props) => (
          <MatrixQuadrantLabels
            width={props.width}
            height={props.height}
            fontSize={quadrantSize}
            opacity={quadrantOpacity}
          />
        )}
      />

      <Scatter name="משימות" data={subCategoryData} label={renderCustomBadgeLabel}>
        {subCategoryData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[entry.main] || '#94a3b8'}
            fillOpacity={dark ? 0.85 : 0.8}
            stroke={COLORS[entry.main]}
            strokeWidth={2}
          />
        ))}
      </Scatter>
    </ScatterChart>
  );
}
