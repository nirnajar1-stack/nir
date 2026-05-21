import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell, Line, ComposedChart, Legend,
} from 'recharts';
import { mainCategoryData, subCategoryData, COLORS, LABELS } from '../data.js';
import { getHeatmapBg } from '../utils.js';
import { getIntensityClassification } from '../utils/intensity.js';
import { CustomTooltipMain, CustomTooltipSub } from '../components/Tooltips.jsx';
import { CustomTooltipComposed } from '../components/CustomTooltipComposed.jsx';
import Interactive3DChart from '../components/Interactive3DChart.jsx';
import MatrixScatterChart from '../components/charts/MatrixScatterChart.jsx';
import MatrixFullscreenOverlay from '../components/layout/MatrixFullscreenOverlay.jsx';
import SectionIcon from '../components/ui/SectionIcon.jsx';


function renderDualCell(fam, task) {
  if (!fam && !task) return <span className="text-outline-variant">-</span>;
  return (
    <div className="flex items-center justify-center gap-0.5 dir-ltr flex-row-reverse">
      <div className="flex flex-col items-center bg-surface-container-low border border-outline-variant/20 rounded-l-md px-2 py-1 min-w-[36px]">
        <span className="text-[9px] text-outline-variant font-bold mb-0.5">{LABELS.families}</span>
        <span className="text-sm font-bold text-on-surface leading-none">{fam || 0}</span>
      </div>
      <div className="flex flex-col items-center bg-primary-container/40 border border-primary-container rounded-r-md px-2 py-1 min-w-[36px]">
        <span className="text-[9px] text-primary/70 font-bold mb-0.5">{LABELS.tasks}</span>
        <span className="text-sm font-bold text-primary-dim leading-none">{task || 0}</span>
      </div>
    </div>
  );
}

export default function AnalyticsView({ page = 'intensity' }) {
  const matrixMode = page === 'matrix-2d' ? '2d' : '3d';
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryData[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(LABELS.all);

  const filteredSubCategoryData = subCategoryData.filter((item) => {
    const matchesSearch = item.sub.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = categoryFilter === LABELS.all || item.main === categoryFilter;
    return matchesSearch && matchesFilter;
  });

  const trendChartData = selectedSubCategory
    ? [
        { month: LABELS.months[0], fam: selectedSubCategory.janF, tasks: selectedSubCategory.janT },
        { month: LABELS.months[1], fam: selectedSubCategory.febF, tasks: selectedSubCategory.febT },
        { month: LABELS.months[2], fam: selectedSubCategory.marF, tasks: selectedSubCategory.marT },
        { month: LABELS.months[3], fam: selectedSubCategory.aprF, tasks: selectedSubCategory.aprT },
      ]
    : [];

  const totalFamiliesSelected = trendChartData.reduce((acc, curr) => acc + curr.fam, 0);
  const totalTasksSelected = trendChartData.reduce((acc, curr) => acc + curr.tasks, 0);
  const intensityData = getIntensityClassification(totalFamiliesSelected, totalTasksSelected);

  return (
    <div className="space-y-8">
      {page === 'intensity' && (
        <div className="space-y-8">
          
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-none shadow-xl border border-outline-variant/15 grid grid-cols-1 lg:grid-cols-3 gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/40 rounded-full -z-10 opacity-60"></div>
            <div className="lg:col-span-2 border-l border-outline-variant/15 pl-4 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <SectionIcon name="balance" />
                <h3 className="text-xl font-extrabold text-on-surface">החלטה מבוססת נרטיב: תפוצה מול עצימות</h3>
              </div>
              <div className="text-on-surface-variant text-sm leading-relaxed mb-4">
                הוספת הניתוח המשלב בין "מספר משפחות" ל"מספר משימות" מאפשרת לזהות האם קפיצה בעומס נובעת מ<strong>בעיה רוחבית</strong> שפוגעת בהמון משפחות שונות, או מ<strong>בעיה נקודתית</strong> שבה מעט משפחות צורכות עשרות פעולות במקביל (לדוגמה: מוניות, סיוע משפטי).
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-3 bg-surface-container-low/80 p-5 rounded-none border border-outline-variant/20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-900 bg-rose-100 border border-rose-200/60 px-2.5 py-1 rounded-none">מורכבות קיצונית</span>
                <span className="text-on-surface-variant font-bold">מעל 1.8 משימות למשפחה</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900 bg-amber-100 border border-amber-200/60 px-2.5 py-1 rounded-none">עומס ממוצע</span>
                <span className="text-on-surface-variant font-bold">~ 1.5 משימות למשפחה</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 bg-emerald-100 border border-emerald-200/60 px-2.5 py-1 rounded-none">שירות חלק</span>
                <span className="text-on-surface-variant font-bold">יחס 1:1 למשפחה</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            <div className="lg:col-span-3 bg-surface-container-lowest rounded-none shadow-lg border border-outline-variant/15 p-6 overflow-hidden flex flex-col h-[700px]">
              
              <div className="mb-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">מפת עומסים לפי משימות (Count)</h2>
                  <p className="text-xs text-on-surface-variant mt-1">מפת החום משקפת את סך המשימות. לחץ על שורה לניתוח השוואתי מול המשפחות.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder={LABELS.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
                    />
                    <span className="absolute left-3 top-3 text-outline-variant">🔍</span>
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/20 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
                  >
                    <option value={LABELS.all}>{LABELS.allCategories}</option>
                    {Object.keys(COLORS).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/15 text-outline-variant text-xs font-bold sticky top-0 bg-surface-container-lowest z-10 pb-2">
                      <th className="pb-3 pr-2">תת-סיווג</th>
                      <th className="pb-3 text-center">ינואר</th>
                      <th className="pb-3 text-center">פברואר</th>
                      <th className="pb-3 text-center">מרץ</th>
                      <th className="pb-3 text-center">אפריל</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 text-sm">
                    {filteredSubCategoryData.map((item) => {
                      const isSelected = selectedSubCategory?.sub === item.sub;
                      return (
                        <tr 
                          key={item.sub} 
                          onClick={() => setSelectedSubCategory(item)}
                          className={`hover:bg-primary-container/30 cursor-pointer transition-all duration-150 rounded-none ${isSelected ? 'bg-primary-container/60 border-r-4 border-primary font-semibold' : ''}`}
                        >
                          <td className="py-3.5 pr-2">
                            <div className="font-bold text-on-surface">{item.sub}</div>
                            <div className="text-[10px] font-semibold" style={{ color: COLORS[item.main] }}>{item.main}</div>
                          </td>
                          <td className="py-2 text-center">
                            <div className="mx-auto rounded-none py-1.5 px-1 font-bold text-on-surface text-xs w-8" style={{ backgroundColor: getHeatmapBg(item.janT, item.main) }}>
                              {item.janT || '-'}
                            </div>
                          </td>
                          <td className="py-2 text-center">
                            <div className="mx-auto rounded-none py-1.5 px-1 font-bold text-on-surface text-xs w-8" style={{ backgroundColor: getHeatmapBg(item.febT, item.main) }}>
                              {item.febT || '-'}
                            </div>
                          </td>
                          <td className="py-2 text-center">
                            <div className="mx-auto rounded-none py-1.5 px-1 font-bold text-on-surface text-xs w-8" style={{ backgroundColor: getHeatmapBg(item.marT, item.main) }}>
                              {item.marT || '-'}
                            </div>
                          </td>
                          <td className="py-2 text-center">
                            <div className="mx-auto rounded-none py-1.5 px-1 font-bold text-on-surface text-xs w-8" style={{ backgroundColor: getHeatmapBg(item.aprT, item.main) }}>
                              {item.aprT || '-'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredSubCategoryData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-outline-variant">
                          {LABELS.noResults}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-surface-container-lowest p-6 rounded-none shadow-lg border border-outline-variant/15 flex flex-col h-[400px]">
                <div className="border-b border-outline-variant/15 pb-4 mb-4">
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border" style={{ color: COLORS[selectedSubCategory?.main], borderColor: `${COLORS[selectedSubCategory?.main]}30`, backgroundColor: `${COLORS[selectedSubCategory?.main]}10` }}>
                    {selectedSubCategory?.main}
                  </span>
                  <h3 className="text-2xl font-black text-on-surface mt-2.5 truncate" title={selectedSubCategory?.sub}>{selectedSubCategory?.sub}</h3>
                </div>

                <div className="flex-grow flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltipComposed />} cursor={{fill: '#f8fafc'}} />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{fontSize: '12px', fontWeight: 'bold', color: '#475569'}} />
                      
                      <Bar 
                        name="תפוצה: משפחות מעורבות" 
                        dataKey="fam" 
                        barSize={40} 
                        fill="#cbd5e1" 
                        radius={[4, 4, 0, 0]}
                      />
                      
                      <Line 
                        name="עומס: סך משימות שנפתחו" 
                        type="monotone" 
                        dataKey="tasks" 
                        stroke={COLORS[selectedSubCategory?.main]} 
                        strokeWidth={4} 
                        dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 8 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-none shadow-lg border border-outline-variant/15">
                <h4 className="font-extrabold text-on-surface mb-2.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">info</span>
                  אפיון עצימות: {intensityData.label}
                </h4>
                <div className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  {intensityData.desc}
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/15 pt-4 text-xs">
                  <div className={`p-3.5 rounded-none border ${intensityData.color}`}>
                    <span className="block mb-1 font-semibold opacity-80">יחס משימות למשפחה</span>
                    <span className="text-2xl font-black">
                      {intensityData.ratio}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3.5 rounded-none border border-outline-variant/15">
                    <span className="text-outline-variant block mb-1 font-semibold">סך הכל (ינו'-אפר')</span>
                    <div className="text-base font-bold text-on-surface">
                      {totalTasksSelected} משימות<br/>
                      <span className="text-on-surface-variant text-xs">{totalFamiliesSelected} משפחות</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 1.5: SPREAD (Data Grid Table) ======================= */}
      {page === 'spread' && (
        <div className="bg-surface-container-lowest rounded-none shadow-xl border border-outline-variant/15 p-6 md:p-8 overflow-hidden flex flex-col min-h-[600px]">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <SectionIcon name="table_chart" />
                <h2 className="text-2xl font-extrabold text-on-surface">טבלת פיזור מורחבת</h2>
              </div>
              <p className="text-on-surface-variant">
                השוואה חודשית מפורטת: כמות המשפחות אל מול המשימות בכל תת-סיווג. היחס הכללי בעמודה השמאלית מתריע על "פינג-פונג" מול משפחות.
              </p>
            </div>
            
            <div className="flex gap-3">
               <div className="relative w-64">
                  <input 
                    type="text"
                    placeholder={LABELS.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-none px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
                  />
                  <span className="absolute left-3 top-2.5 text-outline-variant text-sm">🔍</span>
                </div>
            </div>
          </div>

          <div className="flex-grow overflow-x-auto overflow-y-auto border border-outline-variant/15 rounded-none custom-scrollbar relative">
            <table className="w-full text-right border-collapse min-w-[900px]">
              <thead className="bg-surface-container-low sticky top-0 z-20">
                <tr className="border-b border-outline-variant/20">
                  <th className="py-4 px-4 text-on-surface font-bold w-1/5 shadow-sm">קטגוריה ותת-סיווג</th>
                  <th className="py-4 px-2 text-center text-on-surface font-bold shadow-sm">ינואר</th>
                  <th className="py-4 px-2 text-center text-on-surface font-bold shadow-sm">פברואר</th>
                  <th className="py-4 px-2 text-center text-on-surface font-bold shadow-sm">מרץ</th>
                  <th className="py-4 px-2 text-center text-on-surface font-bold shadow-sm">אפריל</th>
                  <th className="py-4 px-4 text-center text-on-surface font-extrabold bg-surface-container-low shadow-sm border-r border-outline-variant/20">יחס עצימות כללי</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {filteredSubCategoryData.map((item) => {
                  const tFam = item.janF + item.febF + item.marF + item.aprF;
                  const tTask = item.janT + item.febT + item.marT + item.aprT;
                  const intensity = getIntensityClassification(tFam, tTask);

                  return (
                    <tr key={item.sub} className="hover:bg-primary-container/40/30 transition-colors">
                      <td className="py-4 px-4 bg-surface-container-lowest sticky right-0 z-10 border-l border-surface-container-low">
                        <div className="font-bold text-on-surface text-sm">{item.sub}</div>
                        <div className="text-[10px] font-semibold" style={{ color: COLORS[item.main] }}>{item.main}</div>
                      </td>
                      <td className="py-3 px-2 align-middle">
                        {renderDualCell(item.janF, item.janT)}
                      </td>
                      <td className="py-3 px-2 align-middle">
                        {renderDualCell(item.febF, item.febT)}
                      </td>
                      <td className="py-3 px-2 align-middle">
                        {renderDualCell(item.marF, item.marT)}
                      </td>
                      <td className="py-3 px-2 align-middle">
                        {renderDualCell(item.aprF, item.aprT)}
                      </td>
                      <td className="py-3 px-4 text-center bg-surface-container-low/50 border-r border-outline-variant/15">
                        <div className="flex flex-col items-center justify-center">
                          <span className={`text-sm font-black px-3 py-1 rounded-full mb-1 ${intensity.color}`}>
                            {intensity.ratio}
                          </span>
                          <span className="text-[9px] text-on-surface-variant font-semibold">{intensity.label}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredSubCategoryData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-outline-variant">
                      {LABELS.noDataSpread}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: MATRIX VIEW (2D / 3D) ======================= */}
      {(page === 'matrix-3d' || page === 'matrix-2d') && (
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-none shadow-xl border border-outline-variant/15 mb-8 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container-low rounded-bl-full -z-10 opacity-50"></div>
          
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/15 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <SectionIcon name="psychology" />
                <h2 className="text-2xl font-extrabold text-on-surface">מטריצת החלטות להעברת שרביט</h2>
              </div>
              <p className="text-on-surface-variant">
                זיהוי ויזואלי של תהליכים דורשי התערבות: <strong>משימות ברביע האדום</strong> מחייבות מינוי רפרנט מקצועי.
              </p>
            </div>

            {/* Toggle Controls: 2D vs 3D and FULLSCREEN */}
            <div className="flex flex-wrap items-center gap-2 self-end">
              <button
                onClick={() => setIsFullscreen(true)}
                className="bg-primary hover:bg-primary-dim text-on-primary font-bold text-xs px-4 py-3 rounded-none shadow-md transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">fullscreen</span> מסך מלא
              </button>
            </div>
          </div>

          {/* Dynamic Matrix Frame (Normal View) */}
          <div className="h-[550px] w-full transition-all duration-300">
            {matrixMode === '3d' ? (
              <Interactive3DChart key="normal-3d" isFullscreen={false} />
            ) : (
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <MatrixScatterChart variant="light" />
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ======================= TAB 3: CATEGORY OVERVIEW VIEW ======================= */}
      {page === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          <div className="bg-surface-container-lowest p-6 rounded-none shadow-lg border border-outline-variant/15 flex flex-col h-[400px]">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <SectionIcon name="bar_chart" />
                <h2 className="text-xl font-bold text-on-surface">מבט על: עומס לפי סיווג ראשי</h2>
              </div>
            </div>
            <div className="flex-grow w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mainCategoryData} margin={{ top: 30, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 'dataMax + 20']} />
                  <Tooltip content={<CustomTooltipMain />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="families" radius={[6, 6, 0, 0]} barSize={45}>
                    {mainCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.category] || '#94a3b8'} />
                    ))}
                    <LabelList dataKey="avgSla" position="top" formatter={(value) => `${value} ימים`} fill="#334155" fontSize={12} fontWeight="bold" offset={10}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-none shadow-lg border border-outline-variant/15 flex flex-col h-[400px]">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <SectionIcon name="summarize" />
                <h2 className="text-xl font-bold text-on-surface">{LABELS.overviewSub}</h2>
              </div>
              <p className="text-sm text-on-surface-variant">{LABELS.overviewSubDesc}</p>
            </div>
            <div className="flex-grow w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subCategoryData.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide domain={[0, 'dataMax + 10']} />
                  <YAxis type="category" dataKey="sub" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} width={140} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltipSub />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="families" radius={[4, 0, 0, 4]} barSize={16}>
                    {subCategoryData.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.main] || '#94a3b8'} />
                    ))}
                    <LabelList dataKey="sla" position="right" formatter={(value) => `${value} ${LABELS.dayShort}`} fill="#64748b" fontSize={11} fontWeight="bold" offset={8} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      <MatrixFullscreenOverlay
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        matrixMode={matrixMode}
      >
        {matrixMode === '3d' ? (
          <Interactive3DChart key="fs-3d" isFullscreen />
        ) : (
          <div className="absolute inset-0 p-4 md:p-6">
            <ResponsiveContainer width="100%" height="100%">
              <MatrixScatterChart variant="dark" />
            </ResponsiveContainer>
          </div>
        )}
      </MatrixFullscreenOverlay>

    </div>
  );
}
