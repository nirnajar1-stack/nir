import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, LabelList, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, Treemap, PolarRadiusAxis,
} from 'recharts';
import { coordinators, categories, rawData, BRAND_CHART_COLORS } from '../data.js';

const brandStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800&display=swap');
  
  .font-assistant { font-family: 'Assistant', sans-serif; }
  
  /* רקע כללי כהה יותר - אפור/כחול מתון */
  .bg-bg-main { background-color: #dbe4ee; } 
  
  .text-brand-blue { color: #004795; }
  .text-brand-blue-dark { color: #002855; }
  .text-brand-blue-light { color: #d0def0; }
  .text-brand-yellow { color: #FFC107; }
  .text-brand-yellow-dark { color: #FF8F00; }
  
  .bg-brand-blue { background-color: #004795; }
  .bg-brand-blue-dark { background-color: #002855; }
  .bg-brand-blue-light { background-color: #e6f0fa; }
  .bg-brand-yellow { background-color: #FFC107; }
  .bg-brand-yellow-light { background-color: #fff8e1; }
  
  .border-brand-blue { border-color: #004795; }
  .border-brand-blue-light { border-color: #e6f0fa; }
  .border-brand-yellow { border-color: #FFC107; }
  
  .shadow-soft { box-shadow: 0 4px 12px -2px rgba(0, 40, 85, 0.1); }
  .shadow-glow { box-shadow: 0 0 10px rgba(255, 193, 7, 0.3); }
  
  .scrollbar-thin::-webkit-scrollbar { width: 5px; height: 5px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: #cbd5e1; border-radius: 4px; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #94a3b8; border-radius: 4px; }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: #004795; }

  /* מחלקות ייעודיות למפת החום (הותאמו לרקע הכהה) */
  .heat-1 { background-color: #d0e1f9; color: #004795; }
  .heat-2 { background-color: #8ab4f8; color: #002855; }
  .heat-3 { background-color: #004795; color: #ffffff; }
  .heat-4 { background-color: #001f44; color: #FFC107; }
`;

const CustomTreemapContent = (props) => {
  const { x, y, width, height, index, name } = props;
  const safeName = typeof name === 'string' ? name : (name ? String(name) : '');
  const isLightBg = (index % BRAND_CHART_COLORS.length === 1) || (index % BRAND_CHART_COLORS.length === 3);
  const textColor = isLightBg ? '#002855' : '#ffffff';
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length],
          stroke: '#f0f5fa',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {width > 60 && height > 30 && safeName ? (
        <text x={x + width / 2} y={y + height / 2 + 5} textAnchor="middle" fill={textColor} fontSize={13} fontWeight="bold">
          {safeName.length > 18 ? safeName.substring(0, 18) + '...' : safeName}
        </text>
      ) : null}
    </g>
  );
};

const renderPieLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#002855" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

export default function CoordinatorView() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCoordinator, setSelectedCoordinator] = useState(coordinators[0]);

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

  // --- חישובים לטאב DNA ---
  const coordinatorDnaData = useMemo(() => {
    const cIdx = coordinators.indexOf(selectedCoordinator);
    return categories.map(cat => {
      const value = sortedTasks
        .filter(d => d.main === cat)
        .reduce((sum, row) => sum + row.values[cIdx], 0);
      return { subject: cat, A: value };
    });
  }, [selectedCoordinator, sortedTasks]);

  const dynamicInsights = useMemo(() => {
    const sortedDna = [...coordinatorDnaData].sort((a, b) => b.A - a.A);
    const top = sortedDna[0];
    const bottom = sortedDna[sortedDna.length - 1];

    if (top.A === 0) return { status: "חדש", topCategory: "אין נתונים", strength: "טרם נצברה פעילות", growth: "טרם נצברה פעילות" };

    const categoryMap = {
      "בירוקרטיה וזכויות": "מיצוי זכויות מול משרדי הממשלה",
      "בריאות ורווחה": "מענה רפואי, חוסן נפשי ותמיכה",
      "לוגיסטיקה ודיגיטל": "סיוע לוגיסטי, היסעים וכלים דיגיטליים",
      "סיוע כלכלי ומגורים": "פתרונות דיור וליווי פיננסי",
      "פנאי ושונות": "רווחה חברתית, הפוגה ונופש"
    };

    return {
      topCategory: top.subject,
      strength: categoryMap[top.subject] || top.subject,
      growth: categoryMap[bottom.subject] || bottom.subject,
      status: top.A > 20 ? "Master" : top.A > 10 ? "Expert" : "Specialist"
    };
  }, [coordinatorDnaData]);

  const treeData = useMemo(() => {
    const cIdx = coordinators.indexOf(selectedCoordinator);
    const children = categories.map((cat, i) => {
      const subItems = sortedTasks
        .filter(d => d.main === cat)
        .map(sub => ({
          name: sub.sub,
          size: sub.values[cIdx]
        }))
        .filter(s => s.size > 0);
      
      return subItems.length > 0 ? { name: cat, children: subItems } : null;
    }).filter(Boolean);

    return children.length > 0 ? [{ name: 'Root', children }] : [];
  }, [selectedCoordinator, sortedTasks]);

  // --- כלים (Utils) ---
  const getHeatColorClass = (value, totalInColumn) => {
    if (value === 0) return 'bg-[#e2e8f0] text-slate-400'; // אפור-כחלחל עדין עבור תאים ריקים
    const intensity = (value / totalInColumn) * 100;
    if (intensity < 15) return 'heat-1 font-bold'; 
    if (intensity < 40) return 'heat-2 font-bold'; 
    if (intensity < 70) return 'heat-3 font-black'; 
    return 'heat-4 font-black'; 
  };

  return (
    <>
      <style>{brandStyles}</style>
      <div className="font-assistant">
      <nav className="flex flex-wrap gap-2 mb-6 justify-center">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'}`}>
              <span>📊</span> תקציר ופעילות
            </button>
            <button onClick={() => setActiveTab('heatmap')} className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === 'heatmap' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'}`}>
              <span>🔲</span> פיזור עומסים
            </button>
            <button onClick={() => setActiveTab('dna')} className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === 'dna' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'}`}>
              <span>🧬</span> DNA מתכללים
            </button>
          </nav>

{/* --- טאב 1: מבט על (Overview) --- */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">📈</span>
                <div>
                    <h2 className="text-xl font-extrabold text-brand-blue-dark tracking-tight">תמונת מצב ארגונית</h2>
                    <p className="text-slate-500 text-[11px] font-medium">ריכוז המשימות לפי קטגוריות ראשיות ומשניות</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#f0f5fa] p-6 rounded-lg shadow-soft border-b-2 border-brand-yellow">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-4">התפלגות לפי קטגוריות ראשיות</p>
                <div className="h-[280px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={mainStats} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={65} 
                        outerRadius={95} 
                        paddingAngle={2} 
                        dataKey="value" 
                        stroke="none"
                        label={renderPieLabel}
                        labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                      >
                        {mainStats.map((entry, index) => <Cell key={index} fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]} />)}
                      </Pie>
                      <text x="50%" y="46%" textAnchor="middle" className="fill-slate-500 text-[11px] font-bold uppercase">סה"כ</text>
                      <text x="50%" y="58%" textAnchor="middle" className="fill-brand-blue-dark text-4xl font-black">{totalTasks}</text>
                      <Tooltip contentStyle={{ backgroundColor: '#f0f5fa', color: '#002855', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px -2px rgba(0, 71, 149, 0.08)' }} itemStyle={{ color: '#004795', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-[#f0f5fa] p-6 rounded-lg shadow-soft border-b-2 border-brand-yellow">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-4">טופ 5 המענים השכיחים ביותר</p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subStatsTop5} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="sub" type="category" tick={{ fontSize: 13, fill: '#002855', fontWeight: 600 }} width={160} axisLine={false} orientation="right" textAnchor="start" dx={5} />
                      <Tooltip contentStyle={{ backgroundColor: '#f0f5fa', color: '#002855', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px -2px rgba(0, 71, 149, 0.08)' }} itemStyle={{ color: '#004795', fontWeight: 'bold' }} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={26}>
                        {subStatsTop5.map((entry, i) => <Cell key={i} fill={entry.main === "בירוקרטיה וזכויות" ? '#004795' : '#002855'} opacity={entry.main === "בירוקרטיה וזכויות" ? 1 : 0.8} />)}
                        <LabelList dataKey="count" position="left" offset={15} style={{ fill: '#002855', fontWeight: '900', fontSize: '14px' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-[#f0f5fa] rounded-lg shadow-soft border border-slate-300 overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin max-h-[500px]">
                <table className="w-full text-right border-collapse text-[13px]">
                  <thead className="bg-slate-200 border-b border-brand-blue-light sticky top-0 z-10">
                    <tr className="text-slate-600 text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold w-10 text-center">#</th>
                      <th className="py-3 px-4 font-bold w-1/3">סיווג המענה (ממוין)</th>
                      <th className="py-3 px-4 font-bold w-1/4">קטגורית אב</th>
                      <th className="py-3 px-4 font-bold text-center">כמות מענים</th>
                      <th className="py-3 px-4 font-bold text-center">נתח מכלל הפעילות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 text-slate-700">
                    {sortedTasks.map((row, idx) => {
                      const count = row.values.reduce((a, b) => a + b, 0);
                      return (
                        <tr key={idx} className="hover:bg-slate-200 transition-colors">
                          <td className="py-2.5 px-4 text-center font-bold text-brand-blue-dark text-xs">{idx+1}</td>
                          <td className="py-2.5 px-4 font-black text-brand-blue-dark text-[15px]">{row.sub}</td>
                          <td className="py-2.5 px-4 text-slate-500 font-medium text-xs">{row.main}</td>
                          <td className="py-2.5 px-4 text-center font-black text-slate-900 text-lg">{count}</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="px-2 py-0.5 bg-brand-blue-light/50 border border-brand-blue-light text-brand-blue-dark rounded font-bold text-[13px]">
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
        {activeTab === 'heatmap' && (
          <div className="bg-[#f0f5fa] rounded-lg shadow-soft border border-slate-300 p-5 overflow-hidden animate-fade-in">
            <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">🔲</span>
                <div>
                    <h2 className="text-xl font-extrabold text-brand-blue-dark tracking-tight">מטריצת עומסים: מתכללים מול סוגי מענה</h2>
                    <p className="text-slate-500 text-[11px] font-medium">זיהוי עומסים ממוקדים או פיזור משימות (הנתונים מציגים כמות ואחוז מסך המענה הספציפי)</p>
                </div>
            </div>
            
            <div className="overflow-x-auto scrollbar-thin overflow-y-auto max-h-[700px] border border-brand-blue-light rounded-lg">
              <table className="w-full border-collapse text-[13px]">
                <thead className="sticky top-0 z-20 bg-[#f0f5fa] shadow-soft">
                  <tr className="bg-slate-200 border-b border-brand-blue-light">
                    <th className="py-3 px-4 sticky right-0 z-30 min-w-[180px] text-right text-[12px] font-bold text-slate-700 bg-slate-200 border-l border-brand-blue-light uppercase tracking-wider align-bottom">גורם מטפל / סוג מענה</th>
                    {sortedTasks.map((task, i) => (
                      <th key={i} className="py-2 px-2 border-b border-l border-brand-blue-light text-[11px] font-bold text-slate-700 min-w-[110px] max-w-[130px] text-center align-bottom whitespace-normal leading-snug">
                        <div className="flex flex-col h-full justify-end items-center">
                          <span className="text-[9px] text-slate-500 mb-1 font-normal leading-tight">{task.main}</span>
                          <span className="break-words">{task.sub}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {coordinators.map((coordinator, cIdx) => {
                    const coordinatorTotal = sortedTasks.reduce((sum, task) => sum + task.values[cIdx], 0);
                    return (
                      <tr key={cIdx} className="hover:bg-slate-200 border-b border-slate-200 transition-colors">
                        <td className="py-3 px-4 text-sm font-bold text-brand-blue-dark bg-[#f0f5fa] sticky right-0 z-10 shadow-[2px_0_8px_-2px_rgba(0,71,149,0.08)] text-right border-l border-brand-blue-light">
                          <div className="text-[14px] leading-none">{coordinator}</div>
                          <div className="text-[10px] text-brand-yellow-dark font-bold mt-1.5 uppercase">סה"כ משימות: {coordinatorTotal}</div>
                        </td>
                        {sortedTasks.map((task, tIdx) => {
                          const val = task.values[cIdx];
                          const taskTotal = task.values.reduce((a, b) => a + b, 0);
                          return (
                            <td key={tIdx} className={`py-1 px-2 border-l border-slate-300 text-center transition-all ${getHeatColorClass(val, taskTotal)}`}>
                              {val > 0 ? (
                                <div className="flex flex-col items-center justify-center">
                                  <span className="text-[16px] leading-none">{val}</span>
                                  <span className="text-[10px] opacity-80 mt-0.5">{((val/taskTotal)*100).toFixed(0)}%</span>
                                </div>
                              ) : <span className="font-bold">-</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- טאב 3: פרופיל DNA מקצועי --- */}
        {activeTab === 'dna' && (
          <div className="space-y-4 animate-fade-in">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">🧬</span>
                <div>
                    <h2 className="text-xl font-extrabold text-brand-blue-dark tracking-tight">פרופיל DNA מקצועי למתכלל</h2>
                    <p className="text-slate-500 text-[11px] font-medium">ניתוח פעילות ממוקד, זיהוי חוזקות והזדמנויות לפיתוח מקצועי</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* כרטיס פרופיל וגרף מכ"ם */}
              <div className="lg:col-span-4 bg-[#f0f5fa] p-6 rounded-lg shadow-soft border-b-2 border-brand-blue-dark relative overflow-hidden flex flex-col">
                <div className="flex items-center gap-4 mb-6 relative z-10 border-b border-brand-blue-light pb-4">
                  <div className="w-12 h-12 bg-brand-blue-light rounded-lg flex items-center justify-center border border-brand-blue/20">
                    <span>👤</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">בחר מתכלל מתוך הרשימה:</p>
                    <select 
                      value={selectedCoordinator}
                      onChange={(e) => setSelectedCoordinator(e.target.value)}
                      className="w-full bg-slate-200 border border-slate-300 rounded py-1 px-2 text-lg font-black text-brand-blue-dark focus:ring-1 focus:ring-brand-blue outline-none cursor-pointer"
                    >
                      {coordinators.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="h-[280px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={coordinatorDnaData}>
                      <PolarGrid stroke="#e6f0fa" strokeWidth={2} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#002855', fontSize: 11, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} axisLine={false} />
                      <Radar name={selectedCoordinator} dataKey="A" stroke="#004795" strokeWidth={3} fill="#004795" fillOpacity={0.2} dot={{ r: 4, fill: '#FFC107', strokeWidth: 2, stroke: '#004795' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#f0f5fa', color: '#002855', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px -2px rgba(0, 71, 149, 0.08)' }} itemStyle={{ color: '#004795', fontWeight: 'bold' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <div className="bg-brand-blue-light/50 p-4 rounded-lg border border-brand-blue/10 flex flex-col items-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">דירוג עומס</p>
                    <p className="text-xl font-black text-brand-blue-dark mt-1">{dynamicInsights.status}</p>
                  </div>
                  <div className="bg-brand-yellow-light/50 p-4 rounded-lg border border-brand-yellow/20 flex flex-col items-center text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">תחום ליבה</p>
                    <p className="text-[15px] font-black text-brand-yellow-dark leading-tight mt-1 px-1">{dynamicInsights.topCategory}</p>
                  </div>
                </div>
              </div>

              {/* אזור פעילות ראשי */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Treemap כרטיס */}
                <div className="bg-[#f0f5fa] p-6 rounded-lg shadow-soft border border-slate-300 flex flex-col h-[320px]">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span>🌳</span> פירוט ההשקעה לפי משימות - {selectedCoordinator}
                  </h3>
                  <div className="flex-1 border border-slate-200 rounded bg-slate-200">
                    {treeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <Treemap data={treeData} dataKey="size" aspectRatio={4 / 3} stroke="#f0f5fa" strokeWidth={1} isAnimationActive={false} content={<CustomTreemapContent />}>
                          <Tooltip contentStyle={{ backgroundColor: '#f0f5fa', color: '#002855', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px -2px rgba(0, 71, 149, 0.08)' }} itemStyle={{ color: '#004795', fontWeight: 'bold' }} />
                        </Treemap>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-slate-400">
                          <span>⚠️</span>
                          <p className="font-bold text-sm">אין נתונים מספקים להצגה</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* באנר תובנות אסטרטגיות */}
                <div className="bg-white p-6 rounded-lg shadow-soft border border-slate-300 relative overflow-hidden">
                  <span>💡</span>
                  <h4 className="text-lg font-black tracking-wide mb-4 flex items-center gap-2 relative z-10 text-brand-blue-dark">
                    <span>💡</span>
                    נקודות למחשבה ופיתוח צוותי
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    <div className="bg-[#f0f5fa] p-4 rounded border border-slate-200 border-r-4 border-r-brand-blue">
                      <p className="text-brand-blue font-bold text-[11px] uppercase mb-1 flex items-center gap-1"><span>⬆️</span> חוזקה ארגונית</p>
                      <p className="text-sm font-medium leading-relaxed text-slate-700">נפח פעילות מרכזי ב<strong className="text-brand-blue-dark">{dynamicInsights.topCategory}</strong>. כדאי להיעזר במתכלל לשיתוף ידע מול העמיתים בנושאי {dynamicInsights.strength}.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded border border-slate-200 border-r-4 border-r-slate-400">
                      <p className="text-slate-500 font-bold text-[11px] uppercase mb-1 flex items-center gap-1"><span>⬇️</span> אזור לחיזוק</p>
                      <p className="text-sm font-medium leading-relaxed text-slate-700">נפח פעילות נמוך יחסית ב<strong className="text-brand-blue-dark">{dynamicInsights.growth.split(',')[0]}</strong>. מומלץ לתגבר היכרות עם נושאי {dynamicInsights.growth}.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* טבלת מומחים */}
            <div className="bg-[#f0f5fa] p-5 rounded-lg shadow-soft border border-slate-300 mt-5">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>🏆</span> מוקדי ידע ארגוניים לכל תחום
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((cat, i) => {
                    const topPersonForCat = coordinators.reduce((best, current) => {
                    const currentVal = rawData.filter(d => d.main === cat).reduce((sum, row) => sum + row.values[coordinators.indexOf(current)], 0);
                    const bestVal = rawData.filter(d => d.main === cat).reduce((sum, row) => sum + row.values[coordinators.indexOf(best)], 0);
                    return currentVal > bestVal ? current : best;
                    }, coordinators[0]);
                    
                    return (
                    <div key={i} className="p-3 rounded bg-slate-200 border border-slate-300 border-t-2" style={{ borderTopColor: BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length] }}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 truncate" title={cat}>{cat}</p>
                        <p className="text-[14px] font-black text-brand-blue-dark">{topPersonForCat}</p>
                    </div>
                    );
                })}
                </div>
            </div>

          </div>
        )}

      </div>
    </>
  );
}