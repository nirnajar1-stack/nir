import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { coordinators, categories, rawData, BRAND_CHART_COLORS } from '../data.js';
import {
  ACTIVE_COORDINATORS,
  INACTIVE_COORDINATORS,
  getCoordinatorCategoryProfile,
  getCoordinatorServiceSpread,
  getCategoryKnowledgeRoster,
  getOrgKnowledgeHubList,
} from '../utils/coordinatorStats.js';
import SectionIcon from '../components/ui/SectionIcon.jsx';

const ZEN_TOOLTIP = {
  backgroundColor: '#f4f4ef',
  color: '#2f342e',
  borderRadius: '0px',
  border: '1px solid #afb3ac',
  boxShadow: '0 4px 20px rgba(79, 94, 127, 0.12)',
};

const brandStyles = `
  .font-assistant { font-family: 'Heebo', system-ui, sans-serif; }
  
  .bg-bg-main { background-color: #faf9f5; } 
  
  .text-brand-blue { color: #4f5e7f; }
  .text-brand-blue-dark { color: #445272; }
  .text-brand-blue-light { color: #d8e2ff; }
  .text-brand-yellow { color: #ca8a04; }
  .text-brand-yellow-dark { color: #9e2426; }
  
  .bg-brand-blue { background-color: #4f5e7f; }
  .bg-brand-blue-dark { background-color: #445272; }
  .bg-brand-yellow { background-color: #fc6863; }
  .bg-brand-yellow-light { background-color: #edeee8; }
  
  .border-brand-blue { border-color: #4f5e7f; }
  .border-r-brand-blue { border-right-color: #4f5e7f; }
  
  .shadow-soft { box-shadow: 0 9px 20px rgba(79, 94, 127, 0.08); }
  .shadow-glow { box-shadow: 0 0 10px rgba(175, 48, 48, 0.15); }
  
  .scrollbar-thin::-webkit-scrollbar { width: 5px; height: 5px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: #e0e4db; border-radius: 0; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #afb3ac; border-radius: 0; }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: #4f5e7f; }

  .heat-1 { background-color: #d8e2ff; color: #435271; }
  .heat-2 { background-color: #c5d4fa; color: #445272; }
  .heat-3 { background-color: #4f5e7f; color: #f7f7ff; }
  .heat-4 { background-color: #303f5e; color: #fc6863; }
`;

/** תווית מחוץ לפאי — גרסה מוגדלת ל-DNA */
const renderDnaPieLabelOutside = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
  value,
}) => {
  if (!percent || percent < 0.025) return null;

  const RADIAN = Math.PI / 180;
  const angle = -midAngle * RADIAN;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const labelR = outerRadius + 48;
  const lx = cx + labelR * cos;
  const ly = cy + labelR * sin;

  const displayName = name?.length > 16 ? `${name.slice(0, 14)}…` : name;
  const statLine = `${value} (${(percent * 100).toFixed(0)}%)`;

  let anchor = 'middle';
  if (cos > 0.25) anchor = 'start';
  else if (cos < -0.25) anchor = 'end';

  return (
    <g pointerEvents="none">
      <text x={lx} y={ly - 8} textAnchor={anchor} dominantBaseline="middle" fill="#64748b" fontSize={11} fontWeight={600}>
        {displayName}
      </text>
      <text x={lx} y={ly + 10} textAnchor={anchor} dominantBaseline="middle" fill="#334155" fontSize={12} fontWeight={800}>
        {statLine}
      </text>
    </g>
  );
};

/** תווית מחוץ לפאי — טקסט בלבד (ללא רקע) */
const renderPieLabelOutside = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
  value,
}) => {
  if (!percent || percent < 0.03) return null;

  const RADIAN = Math.PI / 180;
  const angle = -midAngle * RADIAN;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const labelR = outerRadius + 36;
  const lx = cx + labelR * cos;
  const ly = cy + labelR * sin;

  const displayName = name?.length > 14 ? `${name.slice(0, 12)}…` : name;
  const statLine = `${value} (${(percent * 100).toFixed(0)}%)`;

  let anchor = 'middle';
  if (cos > 0.25) anchor = 'start';
  else if (cos < -0.25) anchor = 'end';

  return (
    <g pointerEvents="none">
      <text x={lx} y={ly - 7} textAnchor={anchor} dominantBaseline="middle" fill="#64748b" fontSize={9} fontWeight={600}>
        {displayName}
      </text>
      <text x={lx} y={ly + 8} textAnchor={anchor} dominantBaseline="middle" fill="#334155" fontSize={10} fontWeight={800}>
        {statLine}
      </text>
    </g>
  );
};

/** בר אופקי עם תווית לבנה במרכז */
const renderBarWithCenterLabel = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload?.sub) return null;
  const entry = payload;

  const barX = Number(x);
  const barW = Number(width);
  const barY = Number(y);
  const barH = Number(height);
  if (!barW || !barH) return null;

  const fill = entry.main === 'בירוקרטיה וזכויות' ? '#4f5e7f' : '#445272';
  const cx = barX + barW / 2;
  const cy = barY + barH / 2;
  const sub = entry.sub.length > 20 ? `${entry.sub.slice(0, 18)}…` : entry.sub;
  const label = `${sub} · ${entry.count}`;

  return (
    <g>
      <rect x={barX} y={barY} width={barW} height={barH} fill={fill} rx={4} ry={4} opacity={0.92} />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize={10}
        fontWeight={800}
        style={{ pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.55)' }}
      >
        {label}
      </text>
    </g>
  );
};

function PolarAngleTick({ payload, x, y, cx, cy, dataMap }) {
  const entry = dataMap?.[payload.value];
  const line1 = payload.value?.length > 13 ? `${payload.value.slice(0, 11)}…` : payload.value;
  const line2 = entry ? `${entry.A} (${entry.pct}%)` : '0 (0%)';
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const push = 32;
  const nx = x + (dx / dist) * push;
  const ny = y + (dy / dist) * push;
  const anchor = nx > cx + 4 ? 'start' : nx < cx - 4 ? 'end' : 'middle';

  return (
    <g>
      <text x={nx} y={ny - 5} textAnchor={anchor} fill="#64748b" fontSize={9} fontWeight={600}>
        {line1}
      </text>
      <text x={nx} y={ny + 9} textAnchor={anchor} fill="#4f5e7f" fontSize={11} fontWeight={800}>
        {line2}
      </text>
    </g>
  );
}

function CoordinatorSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-outline-variant/30 bg-surface-container py-1.5 px-2 text-base font-bold text-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
    >
      <optgroup label={`פעילים (${ACTIVE_COORDINATORS.length})`}>
        {ACTIVE_COORDINATORS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </optgroup>
      <optgroup label={`לא פעילים (${INACTIVE_COORDINATORS.length})`}>
        {INACTIVE_COORDINATORS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </optgroup>
    </select>
  );
}

export default function CoordinatorView({ page = 'overview' }) {
  const [selectedCoordinator, setSelectedCoordinator] = useState(ACTIVE_COORDINATORS[0]);

  // --- עיבוד נתונים גלובלי ---
  const sortedTasks = useMemo(() => {
    return [...rawData].sort((a, b) => {
      const sumA = a.values.reduce((acc, curr) => acc + curr, 0);
      const sumB = b.values.reduce((acc, curr) => acc + curr, 0);
      return sumB - sumA;
    });
  }, []);

  const totalTasks = useMemo(() => {
    return sortedTasks.reduce((acc, row) => acc + row.values.reduce((a, b) => a + b, 0), 0);
  }, [sortedTasks]);

  const mainStats = useMemo(() => {
    const stats = {};
    sortedTasks.forEach(row => {
      const rowSum = row.values.reduce((a, b) => a + b, 0);
      stats[row.main] = (stats[row.main] || 0) + rowSum;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [sortedTasks]);

  const subStatsTop5 = useMemo(() => {
    return sortedTasks
      .map(row => ({ sub: row.sub, main: row.main, count: row.values.reduce((a, b) => a + b, 0) }))
      .slice(0, 5);
  }, [sortedTasks]);

  const coordinatorProfile = useMemo(
    () => getCoordinatorCategoryProfile(selectedCoordinator, sortedTasks),
    [selectedCoordinator, sortedTasks],
  );

  const radarDataMap = useMemo(() => {
    const map = {};
    coordinatorProfile.radarData.forEach((d) => {
      map[d.subject] = d;
    });
    return map;
  }, [coordinatorProfile]);

  const serviceSpreadPie = useMemo(
    () => getCoordinatorServiceSpread(selectedCoordinator),
    [selectedCoordinator],
  );

  const orgKnowledgeList = useMemo(() => getOrgKnowledgeHubList(), []);
  const categoryRosters = useMemo(() => getCategoryKnowledgeRoster(), []);

  const isSelectedActive = ACTIVE_COORDINATORS.includes(selectedCoordinator);

  const getHeatColorClass = (value, totalInColumn) => {
    if (value === 0) return 'bg-[#e2e8f0] text-outline-variant';
    const intensity = (value / totalInColumn) * 100;
    if (intensity < 15) return 'heat-1 font-bold';
    if (intensity < 40) return 'heat-2 font-bold';
    if (intensity < 70) return 'heat-3 font-black';
    return 'heat-4 font-black';
  };

  const renderHeatmapRows = (list, badgeLabel, badgeClass) =>
    list.map((coordinator) => {
      const cIdx = coordinators.indexOf(coordinator);
      const coordinatorTotal = sortedTasks.reduce((sum, task) => sum + task.values[cIdx], 0);
      return (
        <tr key={coordinator} className="hover:bg-surface-container border-b border-outline-variant/20 transition-colors">
          <td className="py-2.5 px-4 text-sm font-bold text-primary bg-surface-container-low sticky right-0 z-10 shadow-[2px_0_8px_-2px_rgba(0,71,149,0.08)] text-right border-l border-outline-variant/25">
            <div className="flex items-center gap-2">
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${badgeClass}`}>{badgeLabel}</span>
              <span className="text-[13px] leading-tight">{coordinator}</span>
            </div>
            <div className="text-[10px] text-on-surface-variant font-semibold mt-1">סה״כ {coordinatorTotal} · {((coordinatorTotal / totalTasks) * 100).toFixed(1)}% מכלל</div>
          </td>
          {sortedTasks.map((task, tIdx) => {
            const val = task.values[cIdx];
            const taskTotal = task.values.reduce((a, b) => a + b, 0);
            return (
              <td key={tIdx} className={`py-1 px-2 border-l border-outline-variant/30 text-center transition-all ${getHeatColorClass(val, taskTotal)}`}>
                {val > 0 ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[15px] leading-none">{val}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">{((val / taskTotal) * 100).toFixed(0)}%</span>
                  </div>
                ) : (
                  <span className="font-bold">-</span>
                )}
              </td>
            );
          })}
        </tr>
      );
    });

  return (
    <>
      <style>{brandStyles}</style>
      <div className="font-assistant">
        {page === 'overview' && (
          <div className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
                <SectionIcon name="insights" />
                <div>
                    <h2 className="text-xl font-extrabold text-primary tracking-tight">תמונת מצב ארגונית</h2>
                    <p className="text-on-surface-variant text-[11px] font-medium">ריכוז המשימות לפי קטגוריות ראשיות ומשניות</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-6 rounded-none shadow-soft border-b-2 border-primary/30">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-4">התפלגות לפי קטגוריות ראשיות</p>
                <div className="h-[380px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 36, right: 120, bottom: 36, left: 120 }}>
                      <Pie 
                        data={mainStats} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={72} 
                        outerRadius={100} 
                        paddingAngle={3} 
                        dataKey="value" 
                        stroke="#faf9f5"
                        strokeWidth={2}
                        label={renderDnaPieLabelOutside}
                        labelLine={false}
                      >
                        {mainStats.map((entry, index) => <Cell key={index} fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]} />)}
                      </Pie>
                      <text x="50%" y="46%" textAnchor="middle" className="fill-on-surface-variant text-[11px] font-bold uppercase">סה"כ</text>
                      <text x="50%" y="58%" textAnchor="middle" className="fill-brand-blue-dark text-4xl font-black">{totalTasks}</text>
                      <Tooltip contentStyle={ZEN_TOOLTIP} itemStyle={{ color: '#4f5e7f', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-none shadow-soft border-b-2 border-primary/30">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-4">טופ 5 המענים השכיחים ביותר</p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subStatsTop5} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide domain={[0, 'dataMax + 20']} />
                      <YAxis dataKey="sub" type="category" hide width={0} />
                      <Tooltip contentStyle={ZEN_TOOLTIP} itemStyle={{ color: '#4f5e7f', fontWeight: 'bold' }} />
                      <Bar
                        dataKey="count"
                        barSize={34}
                        isAnimationActive={false}
                        shape={(barProps) =>
                          renderBarWithCenterLabel({
                            ...barProps,
                            payload: subStatsTop5[barProps.index],
                          })
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-low rounded-none shadow-soft border border-outline-variant/30 overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin max-h-[500px]">
                <table className="w-full text-right border-collapse text-[13px]">
                  <thead className="bg-surface-container border-b border-outline-variant/25 sticky top-0 z-10">
                    <tr className="text-on-surface-variant text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold w-10 text-center">#</th>
                      <th className="py-3 px-4 font-bold w-1/3">סיווג המענה (ממוין)</th>
                      <th className="py-3 px-4 font-bold w-1/4">קטגורית אב</th>
                      <th className="py-3 px-4 font-bold text-center">כמות מענים</th>
                      <th className="py-3 px-4 font-bold text-center">נתח מכלל הפעילות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20/50 text-on-surface">
                    {sortedTasks.map((row, idx) => {
                      const count = row.values.reduce((a, b) => a + b, 0);
                      return (
                        <tr key={idx} className="hover:bg-surface-container transition-colors">
                          <td className="py-2.5 px-4 text-center font-bold text-primary text-xs">{idx+1}</td>
                          <td className="py-2.5 px-4 font-black text-primary text-[15px]">{row.sub}</td>
                          <td className="py-2.5 px-4 text-on-surface-variant font-medium text-xs">{row.main}</td>
                          <td className="py-2.5 px-4 text-center font-black text-on-surface text-lg">{count}</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="px-2 py-0.5 bg-primary-container/50 border border-outline-variant/25 text-primary rounded font-bold text-[13px]">
                              {((count/totalTasks)*100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- טאב 2: מפת עומסים (Heatmap) --- */}
        {page === 'heatmap' && (
          <div className="bg-surface-container-low rounded-none shadow-soft border border-outline-variant/30 p-5 overflow-hidden animate-fade-in">
            <div className="mb-4 flex items-center gap-2">
                <SectionIcon name="grid_on" />
                <div>
                    <h2 className="text-xl font-extrabold text-primary tracking-tight">מטריצת עומסים: מתכללים מול סוגי מענה</h2>
                    <p className="text-on-surface-variant text-[11px] font-medium">זיהוי עומסים ממוקדים או פיזור משימות (הנתונים מציגים כמות ואחוז מסך המענה הספציפי)</p>
                </div>
            </div>
            
            <div className="overflow-x-auto scrollbar-thin overflow-y-auto max-h-[700px] border border-outline-variant/25 rounded-none">
              <table className="w-full border-collapse text-[13px]">
                <thead className="sticky top-0 z-20 bg-surface-container-low shadow-soft">
                  <tr className="bg-surface-container border-b border-outline-variant/25">
                    <th className="py-3 px-4 sticky right-0 z-30 min-w-[180px] text-right text-[12px] font-bold text-on-surface bg-surface-container border-l border-outline-variant/25 uppercase tracking-wider align-bottom">גורם מטפל / סוג מענה</th>
                    {sortedTasks.map((task, i) => (
                      <th key={i} className="py-2 px-2 border-b border-l border-outline-variant/25 text-[11px] font-bold text-on-surface min-w-[110px] max-w-[130px] text-center align-bottom whitespace-normal leading-snug">
                        <div className="flex flex-col h-full justify-end items-center">
                          <span className="text-[9px] text-on-surface-variant mb-1 font-normal leading-tight">{task.main}</span>
                          <span className="break-words">{task.sub}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-on-surface">
                  <tr className="bg-primary-container/30">
                    <td colSpan={sortedTasks.length + 1} className="py-2 px-4 text-[11px] font-extrabold text-primary sticky right-0">
                      פעילים ({ACTIVE_COORDINATORS.length})
                    </td>
                  </tr>
                  {renderHeatmapRows(ACTIVE_COORDINATORS, 'פעיל', 'bg-emerald-100 text-emerald-800')}
                  <tr className="bg-surface-container">
                    <td colSpan={sortedTasks.length + 1} className="py-2 px-4 text-[11px] font-extrabold text-on-surface-variant sticky right-0">
                      לא פעילים ({INACTIVE_COORDINATORS.length})
                    </td>
                  </tr>
                  {renderHeatmapRows(INACTIVE_COORDINATORS, 'לא פעיל', 'bg-surface-container-high text-outline-variant')}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- טאב 3: פרופיל DNA מקצועי --- */}
        {page === 'dna' && (
          <div className="space-y-4 animate-fade-in">
            <div className="mb-2 flex flex-wrap items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <SectionIcon name="hub" />
                <div>
                  <h2 className="text-xl font-extrabold text-primary tracking-tight">פרופיל DNA מקצועי למתכלל</h2>
                  <p className="text-on-surface-variant text-[11px] font-medium">
                    {ACTIVE_COORDINATORS.length} פעילים · {INACTIVE_COORDINATORS.length} לא פעילים
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4 bg-surface-container-low p-4 rounded-xl shadow-soft border border-outline-variant/25 flex flex-col">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-outline-variant/20">
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-lg">👤</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-on-surface-variant font-bold mb-1">בחירת מתכלל</p>
                    <CoordinatorSelect value={selectedCoordinator} onChange={setSelectedCoordinator} />
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className={`rounded-full px-2 py-0.5 font-bold ${isSelectedActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high text-outline-variant'}`}>
                    {isSelectedActive ? 'פעיל' : 'לא פעיל'}
                  </span>
                  <span className="font-bold text-primary">{coordinatorProfile.coordinatorTotal} משימות</span>
                  <span className="text-on-surface-variant">· {coordinatorProfile.orgSharePct}% מכלל הפעילות</span>
                  <span className="text-on-surface-variant">· ליבה: <strong className="text-primary">{coordinatorProfile.topCategory}</strong> ({coordinatorProfile.topCategoryPct}%)</span>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="58%"
                      data={coordinatorProfile.radarData}
                      margin={{ top: 36, right: 72, bottom: 36, left: 72 }}
                    >
                      <PolarGrid stroke="#e2e8f0" strokeWidth={1.5} />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={(props) => <PolarAngleTick {...props} dataMap={radarDataMap} />}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                      <Radar
                        name={selectedCoordinator}
                        dataKey="A"
                        stroke="#4f5e7f"
                        strokeWidth={2.5}
                        fill="#4f5e7f"
                        fillOpacity={0.18}
                        dot={{ r: 4, fill: '#ca8a04', strokeWidth: 2, stroke: '#4f5e7f' }}
                      />
                      <Tooltip
                        contentStyle={ZEN_TOOLTIP}
                        formatter={(value, _name, item) => [
                          `${value} משימות (${item.payload.pct}% מהפרופיל)`,
                          item.payload.subject,
                        ]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="bg-surface-container-low p-5 rounded-xl shadow-soft border border-outline-variant/25">
                  <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                    פיזור מענים — {selectedCoordinator}
                  </h3>
                  <div className="h-[420px]">
                    {coordinatorProfile.pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 36, right: 120, bottom: 36, left: 120 }}>
                          <Pie
                            data={coordinatorProfile.pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={72}
                            outerRadius={108}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="#faf9f5"
                            strokeWidth={2}
                            label={renderDnaPieLabelOutside}
                            labelLine={false}
                          >
                            {coordinatorProfile.pieData.map((entry, index) => (
                              <Cell key={entry.name} fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <text x="50%" y="46%" textAnchor="middle" className="fill-on-surface-variant text-[11px] font-bold uppercase">סה״כ</text>
                          <text x="50%" y="58%" textAnchor="middle" className="fill-primary text-4xl font-black">
                            {coordinatorProfile.coordinatorTotal}
                          </text>
                          <Tooltip contentStyle={ZEN_TOOLTIP} formatter={(v, _n, item) => [`${v} משימות · ${item.payload.name}`, '']} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-outline-variant font-medium">
                        אין נתוני פעילות למתכלל זה
                      </div>
                    )}
                  </div>
                  {serviceSpreadPie.length > 0 && (
                    <p className="mt-2 text-[10px] text-on-surface-variant">
                      מענה מוביל: <strong className="text-primary">{serviceSpreadPie[0].name}</strong> ({serviceSpreadPie[0].value} משימות)
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl shadow-soft border border-outline-variant/25">
              <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">school</span>
                מוקדי ידע ארגוניים — כל המתכללים
              </h3>
              <div className="overflow-x-auto scrollbar-thin max-h-[320px] border border-outline-variant/20 rounded-lg">
                <table className="w-full text-right text-[12px] border-collapse">
                  <thead className="bg-surface-container sticky top-0 z-10">
                    <tr className="text-[10px] uppercase text-on-surface-variant">
                      <th className="py-2 px-3 font-bold">#</th>
                      <th className="py-2 px-3 font-bold">מתכלל</th>
                      <th className="py-2 px-3 font-bold text-center">סטטוס</th>
                      <th className="py-2 px-3 font-bold text-center">משימות</th>
                      <th className="py-2 px-3 font-bold text-center">% מכלל</th>
                      <th className="py-2 px-3 font-bold">חוזק (תחום)</th>
                      <th className="py-2 px-3 font-bold text-center">% בתחום</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15">
                    {orgKnowledgeList.map((row, idx) => (
                      <tr
                        key={row.name}
                        className={`hover:bg-primary-container/20 transition-colors ${row.name === selectedCoordinator ? 'bg-primary-container/35 font-semibold' : ''}`}
                      >
                        <td className="py-2 px-3 text-center text-primary font-bold">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-primary">{row.name}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${row.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high text-outline-variant'}`}>
                            {row.isActive ? 'פעיל' : 'לא פעיל'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-black">{row.total}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="rounded-md bg-primary-container/40 px-2 py-0.5 font-bold text-primary">{row.orgPct}%</span>
                        </td>
                        <td className="py-2 px-3 text-on-surface-variant text-[11px]">{row.topCategory}</td>
                        <td className="py-2 px-3 text-center font-bold text-on-surface">{row.topCategoryPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categoryRosters.map((block, i) => (
                <div
                  key={block.category}
                  className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/25 border-t-[3px]"
                  style={{ borderTopColor: BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length] }}
                >
                  <h4 className="text-[11px] font-extrabold text-primary mb-2 truncate" title={block.category}>
                    {block.category}
                  </h4>
                  <ul className="max-h-[200px] overflow-y-auto scrollbar-thin space-y-1.5">
                    {block.roster.map((person, rIdx) => (
                      <li
                        key={person.name}
                        className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[11px] transition-colors ${
                          person.isActive
                            ? 'bg-surface-container hover:bg-primary-container/25'
                            : 'bg-surface-container-high/80 opacity-75'
                        }`}
                      >
                        <span className={`font-bold truncate ${person.isActive ? 'text-primary' : 'text-outline-variant'}`}>
                          <span className="text-on-surface-variant font-medium ml-1">{rIdx + 1}.</span> {person.name}
                          {!person.isActive && (
                            <span className="mr-1 rounded-full bg-surface-container-high px-1.5 py-0.5 text-[8px] font-bold text-outline-variant">
                              לא פעיל
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 font-black text-on-surface">
                          {person.value} <span className="text-on-surface-variant font-semibold">({person.catPct}%)</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}