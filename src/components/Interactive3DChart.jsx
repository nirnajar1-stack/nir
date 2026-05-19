import React, { useState, useEffect, useRef } from 'react';
import { COLORS, subCategoryData, LABELS } from '../data.js';

export default function Interactive3DChart({ isFullscreen = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [projectedLabels, setProjectedLabels] = useState([]);

  useEffect(() => {
    if (window.THREE) {
      setThreeLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => setThreeLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!threeLoaded || !canvasRef.current || !containerRef.current) return;

    const THREE = window.THREE;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 550;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let radius = isFullscreen ? 16 : 18;
    let theta = 45;
    let phi = 65;
    
    const updateCamera = () => {
      const phiRad = (phi * Math.PI) / 180;
      const thetaRad = (theta * Math.PI) / 180;
      camera.position.x = radius * Math.sin(phiRad) * Math.sin(thetaRad);
      camera.position.y = radius * Math.cos(phiRad);
      camera.position.z = radius * Math.sin(phiRad) * Math.cos(thetaRad);
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-10, -20, -15);
    scene.add(dirLight2);

    const boxGeom = new THREE.BoxGeometry(10, 10, 10);
    const edges = new THREE.EdgesGeometry(boxGeom);
    const boxFrame = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x475569, linewidth: 2 }));
    scene.add(boxFrame);

    const gridHelper = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    const mapX = (x) => (x / 80) * 10 - 5;
    const mapY = (y) => (y / 40) * 10 - 5;
    const mapZ = (z) => (z / 220) * 10 - 5;

    const spheresGroup = new THREE.Group();
    const sphereDataAssoc = [];

    subCategoryData.forEach((item) => {
      const size = 0.15 + (item.sla / 40) * 0.35;
      const geom = new THREE.SphereGeometry(size, 32, 32);
      
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(COLORS[item.main]),
        roughness: 0.1,
        metalness: 0.15,
        emissive: new THREE.Color(COLORS[item.main]),
        emissiveIntensity: 0.15
      });
      
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(mapX(item.families), mapY(item.sla), mapZ(item.tasks));
      
      spheresGroup.add(mesh);
      sphereDataAssoc.push({ mesh, data: item });
    });
    scene.add(spheresGroup);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        theta -= deltaX * 0.45;
        phi = Math.max(5, Math.min(175, phi + deltaY * 0.45));

        updateCamera();
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycaster.intersectObjects(spheresGroup.children);

      if (intersects.length > 0) {
        const collided = sphereDataAssoc.find(s => s.mesh === intersects[0].object);
        if (collided) {
          setHoveredPoint(collided.data);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredPoint(null);
        document.body.style.cursor = 'default';
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      radius = Math.max(6, Math.min(30, radius + e.deltaY * 0.025));
      updateCamera();
    };

    const canvasDom = canvasRef.current;
    canvasDom.addEventListener('mousedown', handleMouseDown);
    canvasDom.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvasDom.addEventListener('wheel', handleWheel, { passive: false });

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);

      const newLabels = sphereDataAssoc.map((s) => {
        const vector = new THREE.Vector3();
        s.mesh.getWorldPosition(vector);
        vector.project(camera);

        const isBehind = vector.z > 1;
        const currWidth = containerRef.current ? containerRef.current.clientWidth : width;
        const currHeight = containerRef.current ? containerRef.current.clientHeight : height;

        const x2d = (vector.x * .5 + .5) * currWidth;
        const y2d = (-(vector.y * .5) + .5) * currHeight;

        return {
          id: s.data.sub,
          name: s.data.sub,
          color: COLORS[s.data.main],
          visible: !isBehind && s.data.families > 25 && s.data.sla > 15,
          x: x2d,
          y: y2d,
          families: s.data.families,
          sla: s.data.sla
        };
      });
      setProjectedLabels(newLabels);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 550;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvasDom.removeEventListener('mousedown', handleMouseDown);
      canvasDom.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvasDom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  }, [threeLoaded, isFullscreen]);

  if (!threeLoaded) {
    return (
      <div className="h-full w-full bg-slate-900 rounded-2xl flex items-center justify-center text-white min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">{LABELS.loading3d}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[450px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800">
      <canvas ref={canvasRef} className="block w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {projectedLabels.map((lbl) => {
          if (!lbl.visible) return null;
          return (
            <div 
              key={lbl.id} 
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center select-none"
              style={{ left: `${lbl.x}px`, top: `${lbl.y - 12}px` }}
            >
              <div className="bg-white/95 border shadow-md px-2.5 py-1 rounded-t-md border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-800 whitespace-nowrap">{lbl.name}</span>
              </div>
              <div className="bg-slate-800 text-white text-[9px] px-2 py-1 rounded-b-md font-semibold border-t border-slate-700">
                {lbl.sla} {LABELS.dayShort} | {lbl.families} {LABELS.familiesShort}
              </div>
              <div className="w-1.5 h-1.5 rotate-45 border-r border-b border-slate-300 bg-slate-800 -mt-0.5"></div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl text-xs text-slate-300 space-y-1.5 border border-slate-800" dir="rtl">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">{LABELS.axisLegendTitle}</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-500"></div>
          <span>{LABELS.axisX}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-500"></div>
          <span>{LABELS.axisY}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-500"></div>
          <span>{LABELS.axisZ}</span>
        </div>
        <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 mt-1 font-medium">
          {LABELS.axisHint}
        </div>
      </div>

      {hoveredPoint && (
        <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl text-right min-w-[220px] border border-indigo-500/30 shadow-lg shadow-indigo-500/10 transition-all duration-150" dir="rtl">
          <p className="font-extrabold text-slate-100 text-sm mb-1">{hoveredPoint.sub}</p>
          <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: COLORS[hoveredPoint.main] }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS[hoveredPoint.main] }}></span>
            {hoveredPoint.main}
          </p>
          <div className="space-y-1.5 border-t border-slate-800 pt-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{LABELS.hoverX}</span>
              <span className="font-bold text-slate-200">{hoveredPoint.families} {LABELS.families}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{LABELS.hoverY}</span>
              <span className="font-bold text-slate-200">{hoveredPoint.sla} {LABELS.days}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{LABELS.hoverZ}</span>
              <span className="font-bold text-slate-200">{hoveredPoint.tasks} {LABELS.inquiries}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};