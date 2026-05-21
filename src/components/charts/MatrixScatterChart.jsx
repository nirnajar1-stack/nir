import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, Cell,
} from 'recharts';
import { subCategoryData, COLORS } from '../../data.js';
import { CustomTooltipScatter } from '../Tooltips.jsx';
import { renderCustomBadgeLabel } from '../BadgeLabel.jsx';

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
  const quadrantSize = dark ? 24 : 18;

  return (
    <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 20 }}>
      <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} opacity={0.6} />

      <XAxis
        type="number"
        dataKey="families"
        name="משפחות ייחודיות"
        label={{
          value: 'תפוצה - כמות משפחות בטיפול',
          position: 'bottom',
          offset: 10,
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
          offset: -10,
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

      <text x={75} y={38} fill="#ef4444" fontSize={quadrantSize} fontWeight="900" opacity={quadrantOpacity}>
        רביע העברת שרביט
      </text>
      <text x={15} y={38} fill="#f59e0b" fontSize={quadrantSize} fontWeight="900" opacity={quadrantOpacity}>
        רביע מומחיות נישה
      </text>
      <text x={75} y={8} fill="#10b981" fontSize={quadrantSize} fontWeight="900" opacity={quadrantOpacity}>
        טיפול שוטף נרחב
      </text>
      <text x={15} y={8} fill="#3b82f6" fontSize={quadrantSize} fontWeight="900" opacity={quadrantOpacity}>
        פעולות בזק
      </text>

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
