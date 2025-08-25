"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type Region = "none" | "domestic" | "export" | "farmer";

const INDIA = { lat: 19.9975, lng: 73.7898 };
const DESTS = [
  { key: "dubai", lat: 25.2048, lng: 55.2708 },
  { key: "singapore", lat: 1.3521, lng: 103.8198 },
  { key: "malaysia", lat: 3.139, lng: 101.6869 },
];

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function midPointOnSphere(a: THREE.Vector3, b: THREE.Vector3, height = 0.25) {
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize();
  // raise midpoint for arc height
  return mid.multiplyScalar(1 + height);
}

export default function TradingNetworkGlobe({ highlight = "none", className = "w-full h-96" }: { highlight?: Region; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const mixersRef = useRef<THREE.AnimationMixer[]>([]);
  const indiaMarkerRef = useRef<THREE.Mesh | null>(null);
  const arcMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Update highlight reactively
  useEffect(() => {
    if (indiaMarkerRef.current) {
      const mat = indiaMarkerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = highlight !== "none" ? 1.1 : 0.7;
      mat.needsUpdate = true;
    }
    arcMatsRef.current.forEach((m) => {
      m.emissiveIntensity = highlight === "export" ? 0.9 : 0.6;
      m.color = new THREE.Color("#16a34a").lerp(new THREE.Color("#1e3a8a"), 0.25);
      m.needsUpdate = true;
    });
  }, [highlight]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.5);
    cameraRef.current = camera;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Globe sphere
    const radius = 1.4;
    const globeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0b1227").lerp(new THREE.Color("#1e3a8a"), 0.35),
      roughness: 0.6,
      metalness: 0.1,
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), globeMat);
    globeGroup.add(globe);

    // Atmosphere (inner-backface slightly larger sphere)
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.06, 64, 64),
      new THREE.MeshBasicMaterial({ color: new THREE.Color("#16a34a"), transparent: true, opacity: 0.08, side: THREE.BackSide })
    );
    globeGroup.add(atmo);

    // India marker
    const indiaMat = new THREE.MeshStandardMaterial({ color: "#16a34a", emissive: "#16a34a", emissiveIntensity: highlight !== "none" ? 1.1 : 0.7, metalness: 0.2, roughness: 0.4 });
    const indiaMarker = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), indiaMat);
    indiaMarker.position.copy(latLngToVector3(INDIA.lat, INDIA.lng, radius + 0.01));
    globeGroup.add(indiaMarker);
    indiaMarkerRef.current = indiaMarker;

    // Routes and moving crates
    const createArc = (from: { lat: number; lng: number }, to: { lat: number; lng: number }, delay: number) => {
      const fromV = latLngToVector3(from.lat, from.lng, radius);
      const toV = latLngToVector3(to.lat, to.lng, radius);
      const mid = midPointOnSphere(fromV, toV, 0.35);
      const curve = new THREE.CatmullRomCurve3([fromV, mid, toV]);

      const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color("#16a34a").lerp(new THREE.Color("#1e3a8a"), 0.25), emissive: "#16a34a", emissiveIntensity: highlight === "export" ? 0.9 : 0.6, roughness: 0.5, metalness: 0.2 });
      arcMatsRef.current.push(mat);

      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.006, 8, false), mat);
      globeGroup.add(tube);

      // crate group
      const crate = new THREE.Group();
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: "#d97706", roughness: 0.5, metalness: 0.1 }));
      const glow = new THREE.PointLight("#16a34a", 0.8, 0.7);
      crate.add(cube);
      crate.add(glow);
      globeGroup.add(crate);

      // animate along curve
      const clock = new THREE.Clock();
      const speed = 1 / 6; // seconds to complete
      function move() {
        const tRaw = (clock.getElapsedTime() - delay);
        const tt = ((tRaw * speed) % 1 + 1) % 1; // 0..1 looping
        const ease = 0.5 - 0.5 * Math.cos(Math.PI * tt);
        const p = curve.getPoint(ease);
        const tangent = curve.getTangent(ease).normalize();
        crate.position.copy(p);
        const up = p.clone().normalize();
        const m = new THREE.Matrix4();
        m.lookAt(new THREE.Vector3(0, 0, 0), tangent, up);
        crate.quaternion.setFromRotationMatrix(m);
      }
      return move;
    };

    const movers: Array<() => void> = [];
    DESTS.forEach((d, i) => movers.push(createArc(INDIA, { lat: d.lat, lng: d.lng }, i * 0.8)));

    // Resize handler
    function resize() {
      const parent = canvas.parentElement!;
      const w = parent.clientWidth;
      const h = parent.clientHeight || 384; // fallback height
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // Pointer drag rotation (simple)
    let dragging = false;
    let lastX = 0;
    canvas.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; });
    window.addEventListener("pointerup", () => { dragging = false; });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = (e.clientX - lastX) / 200;
      globeGroup.rotation.y += dx;
      lastX = e.clientX;
    });

    // Animate
    const clock = new THREE.Clock();
    function loop() {
      const dt = clock.getDelta();
      // auto-rotate
      globeGroup.rotation.y += dt * 0.08;
      movers.forEach((m) => m());
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      scene.traverse((obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose?.();
          const mat = mesh.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose?.();
        }
      });
    };
  }, []);

  return (
    <div className={className} aria-label="3D Trading Network Globe">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
