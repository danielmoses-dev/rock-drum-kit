import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "../audio/AudioEngine";

export type DrumKey = "bass" | "snare" | "hihat" | "tom1" | "tom2" | "floorTom" | "crash" | "ride";

interface DrumPieceData {
  id: DrumKey;
  name: string;
  key: string;
  meshGroup: THREE.Group;
  initialPos: THREE.Vector3;
  initialRot: THREE.Euler;
  recoilVel: number;
  recoilAngle: number;
}

interface ThreeDrumKitProps {
  onTrigger?: (id: DrumKey) => void;
  activeTrigger?: DrumKey | null;
}

export const ThreeDrumKit: React.FC<ThreeDrumKitProps> = ({ onTrigger, activeTrigger }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);
  const piecesRef = useRef<Map<DrumKey, DrumPieceData>>(new Map());
  const shockwavesRef = useRef<Array<{ mesh: THREE.Mesh; scale: number; opacity: number }>>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera angled from player / stage perspective
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 5.2, 8.8);
    camera.lookAt(0, 0.4, -0.4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // ==========================================
    // LIGHTING (Studio Warm Spotlights & Rim Lights)
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xfff3e8, 0.65);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xfff5ea, 3.2);
    mainSpot.position.set(2, 9, 6);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.6;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    const rimLight = new THREE.DirectionalLight(0xa5c4d4, 1.4);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xffaa55, 0.9, 12);
    warmFill.position.set(0, 2, 2);
    scene.add(warmFill);

    // ==========================================
    // MATERIALS SYSTEM (Classic Rock Vintage Finish)
    // ==========================================
    // Deep walnut lacquer shell
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x1f1712,
      roughness: 0.25,
      metalness: 0.2,
    });

    // Die-cast chrome hardware
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8e2ec,
      metalness: 0.95,
      roughness: 0.12,
    });

    // Coated white batter head (Remo / Evans style)
    const batterHeadMat = new THREE.MeshStandardMaterial({
      color: 0xf2f4f7,
      roughness: 0.6,
      metalness: 0.05,
    });

    // Center black dot patch
    const centerDotMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c20,
      roughness: 0.4,
    });

    // Front resonant bass drum head (Matte black with logo)
    const frontHeadMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.5,
      metalness: 0.1,
    });

    // Hammered B20 Bronze Cymbal Alloy
    const cymbalMat = new THREE.MeshStandardMaterial({
      color: 0xdfa038,
      metalness: 0.88,
      roughness: 0.28,
    });

    // ==========================================
    // DRUM KIT BUILDER HELPER FUNCTIONS
    // ==========================================
    const createDrum = (
      id: DrumKey,
      name: string,
      key: string,
      radius: number,
      depth: number,
      x: number,
      y: number,
      z: number,
      rotX = 0,
      rotY = 0,
      rotZ = 0,
      isBass = false
    ) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.set(rotX, rotY, rotZ);

      // Shell cylinder
      const shellGeo = new THREE.CylinderGeometry(radius, radius, depth, 32, 1, true);
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      shellMesh.castShadow = true;
      shellMesh.receiveShadow = true;
      group.add(shellMesh);

      // Top & Bottom Hoops
      const hoopGeo = new THREE.TorusGeometry(radius + 0.03, 0.035, 12, 32);
      const topHoop = new THREE.Mesh(hoopGeo, chromeMat);
      topHoop.rotation.x = Math.PI / 2;
      topHoop.position.y = depth / 2;
      group.add(topHoop);

      const bottomHoop = topHoop.clone();
      bottomHoop.position.y = -depth / 2;
      group.add(bottomHoop);

      // Batter Head (Top)
      const headGeo = new THREE.CircleGeometry(radius, 32);
      const topHead = new THREE.Mesh(headGeo, isBass ? frontHeadMat : batterHeadMat);
      topHead.rotation.x = -Math.PI / 2;
      topHead.position.y = depth / 2 - 0.01;
      topHead.receiveShadow = true;
      group.add(topHead);

      // Center Dot Reinforcement
      if (!isBass) {
        const dotGeo = new THREE.CircleGeometry(radius * 0.35, 24);
        const centerDot = new THREE.Mesh(dotGeo, centerDotMat);
        centerDot.rotation.x = -Math.PI / 2;
        centerDot.position.y = depth / 2;
        group.add(centerDot);
      }

      // Bottom / Resonant Head
      const botHead = new THREE.Mesh(headGeo, batterHeadMat);
      botHead.rotation.x = Math.PI / 2;
      botHead.position.y = -depth / 2 + 0.01;
      group.add(botHead);

      // Tension Lugs around shell
      const lugCount = isBass ? 10 : 8;
      for (let i = 0; i < lugCount; i++) {
        const angle = (i / lugCount) * Math.PI * 2;
        const lugGeo = new THREE.BoxGeometry(0.04, depth * 0.65, 0.04);
        const lug = new THREE.Mesh(lugGeo, chromeMat);
        lug.position.set(
          Math.cos(angle) * (radius + 0.03),
          0,
          Math.sin(angle) * (radius + 0.03)
        );
        lug.rotation.y = -angle;
        group.add(lug);
      }

      // Attach ID and click detection tag to group
      group.userData = { id, name, key };
      group.traverse((child) => {
        child.userData = { id, name, key };
      });

      scene.add(group);
      piecesRef.current.set(id, {
        id,
        name,
        key,
        meshGroup: group,
        initialPos: group.position.clone(),
        initialRot: group.rotation.clone(),
        recoilVel: 0,
        recoilAngle: 0,
      });

      return group;
    };

    const createCymbal = (
      id: DrumKey,
      name: string,
      key: string,
      radius: number,
      x: number,
      y: number,
      z: number,
      tilt = 0.15
    ) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.set(tilt, 0, 0);

      // Main curved cymbal body
      const cymbalGeo = new THREE.ConeGeometry(radius, radius * 0.12, 36, 1, true);
      const cymbalMesh = new THREE.Mesh(cymbalGeo, cymbalMat);
      cymbalMesh.rotation.x = Math.PI; // Flare outward
      cymbalMesh.castShadow = true;
      group.add(cymbalMesh);

      // Raised Bell (Cup)
      const bellGeo = new THREE.SphereGeometry(radius * 0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const bellMesh = new THREE.Mesh(bellGeo, cymbalMat);
      bellMesh.position.y = radius * 0.02;
      group.add(bellMesh);

      // Center Felt & Wingnut
      const feltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16);
      const feltMesh = new THREE.Mesh(feltGeo, centerDotMat);
      feltMesh.position.y = radius * 0.08;
      group.add(feltMesh);

      // Stand rod
      const rodGeo = new THREE.CylinderGeometry(0.025, 0.025, y + 0.5, 12);
      const rodMesh = new THREE.Mesh(rodGeo, chromeMat);
      rodMesh.position.set(0, -(y + 0.5) / 2, 0);
      group.add(rodMesh);

      group.userData = { id, name, key };
      group.traverse((child) => {
        child.userData = { id, name, key };
      });

      scene.add(group);
      piecesRef.current.set(id, {
        id,
        name,
        key,
        meshGroup: group,
        initialPos: group.position.clone(),
        initialRot: group.rotation.clone(),
        recoilVel: 0,
        recoilAngle: 0,
      });

      return group;
    };

    // ==========================================
    // CONSTRUCT THE CLASSIC ROCK KIT
    // ==========================================
    // 1. 22" Bass Drum (Center Kick)
    const bass = createDrum("bass", "22\" Bass Drum", "B", 1.45, 1.4, 0, 1.45, -0.6, Math.PI / 2, 0, 0, true);
    // Add Bass Drum Spurs (Legs)
    const spurGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 12);
    const leftSpur = new THREE.Mesh(spurGeo, chromeMat);
    leftSpur.position.set(-1.45, -0.6, 0.4);
    leftSpur.rotation.z = Math.PI / 4;
    bass.add(leftSpur);
    const rightSpur = leftSpur.clone();
    rightSpur.position.set(1.45, -0.6, 0.4);
    rightSpur.rotation.z = -Math.PI / 4;
    bass.add(rightSpur);

    // 2. 14" Snare Drum (Front Left)
    createDrum("snare", "14\" Custom Snare", "S", 0.95, 0.55, -1.5, 1.6, 0.65, 0.18, 0, 0.1);

    // 3. 14" Hi-Hat (Far Left)
    createCymbal("hihat", "14\" Studio Hi-Hats", "H", 0.92, -2.5, 2.5, 0.4, 0.1);

    // 4. 10" Rack Tom 1 (Mounted High Left)
    createDrum("tom1", "10\" Rack Tom", "T", 0.65, 0.6, -0.75, 2.9, -0.5, 0.35, 0.2, 0);

    // 5. 12" Rack Tom 2 (Mounted High Right)
    createDrum("tom2", "12\" Rack Tom", "G", 0.78, 0.7, 0.85, 2.9, -0.5, 0.35, -0.2, 0);

    // 6. 16" Floor Tom (Right Front)
    createDrum("floorTom", "16\" Deep Floor Tom", "F", 1.15, 1.05, 1.9, 1.4, 0.5, 0.1, 0, -0.15);

    // 7. 18" Crash Cymbal (Top Left)
    createCymbal("crash", "18\" Heavy Crash", "C", 1.25, -2.3, 3.4, -0.6, 0.25);

    // 8. 22" Ride Cymbal (Top Right)
    createCymbal("ride", "22\" Hammered Ride", "R", 1.45, 2.4, 3.2, -0.4, 0.22);

    // Floor shadow disc
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // ==========================================
    // SHOCKWAVE TRIGGER LOGIC
    // ==========================================
    const trigger3DHit = (id: DrumKey) => {
      const piece = piecesRef.current.get(id);
      if (!piece) return;

      // Physical spring recoil
      piece.recoilVel = id === "bass" ? 0.18 : 0.25;
      piece.recoilAngle = 0.25;

      // Spawn expanding 3D shockwave ring
      const ringGeo = new THREE.RingGeometry(0.1, 0.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: id === "snare" ? 0x00f0ff : id === "bass" ? 0xff2a5f : id === "ride" ? 0xffd700 : 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(piece.meshGroup.position);
      ringMesh.position.y += 0.25;
      ringMesh.rotation.x = Math.PI / 2;
      scene.add(ringMesh);

      shockwavesRef.current.push({ mesh: ringMesh, scale: 1, opacity: 0.9 });
    };

    // Store trigger method on window for callback
    (container as unknown as { triggerHit: typeof trigger3DHit }).triggerHit = trigger3DHit;

    // ==========================================
    // RAYCASTING & INTERACTION
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Subtle camera parallax
      camera.position.x = mouse.x * 0.4;
      camera.position.y = 5.2 + mouse.y * 0.25;
      camera.lookAt(0, 0.4, -0.4);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let foundId: string | null = null;
      for (const hit of intersects) {
        if (hit.object.userData && hit.object.userData.id) {
          foundId = hit.object.userData.id;
          setHoveredPiece(`${hit.object.userData.name} [Key: ${hit.object.userData.key}]`);
          break;
        }
      }
      if (!foundId) setHoveredPiece(null);
    };

    const handlePointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        if (hit.object.userData && hit.object.userData.id) {
          const id = hit.object.userData.id as DrumKey;
          executeDrumStrike(id);
          break;
        }
      }
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);

    // ==========================================
    // ANIMATION RENDER LOOP
    // ==========================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Animate physical piece recoil
      piecesRef.current.forEach((piece) => {
        if (piece.recoilVel > 0 || piece.recoilAngle > 0) {
          piece.recoilAngle -= delta * 1.8;
          piece.recoilVel -= delta * 1.5;
          if (piece.recoilAngle < 0) piece.recoilAngle = 0;
          if (piece.recoilVel < 0) piece.recoilVel = 0;

          // Apply elastic wobble
          const wobble = Math.sin(piece.recoilAngle * 18) * piece.recoilVel;
          piece.meshGroup.position.y = piece.initialPos.y - wobble * 0.4;
          piece.meshGroup.rotation.x = piece.initialRot.x + wobble * 0.2;
          piece.meshGroup.rotation.z = piece.initialRot.z + wobble * 0.15;
        }
      });

      // Animate 3D shockwave rings
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.scale += delta * 6;
        sw.opacity -= delta * 1.8;
        sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
        (sw.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, sw.opacity);

        if (sw.opacity <= 0) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          (sw.mesh.material as THREE.Material).dispose();
          shockwavesRef.current.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Method to execute strike sound & animation
  const executeDrumStrike = (id: DrumKey) => {
    switch (id) {
      case "bass":
        soundEngine.playKick(1.2);
        break;
      case "snare":
        soundEngine.playSnare(1.15);
        break;
      case "hihat":
        soundEngine.playHiHat(false, 1.0);
        break;
      case "tom1":
        soundEngine.playTom(145, 1.0);
        break;
      case "tom2":
        soundEngine.playTom(115, 1.0);
        break;
      case "floorTom":
        soundEngine.playTom(85, 1.1);
        break;
      case "crash":
        soundEngine.playCrash(1.2);
        break;
      case "ride":
        soundEngine.playRide(true, 1.1);
        break;
    }

    // Trigger 3D visual shockwave
    if (mountRef.current) {
      const containerWithHit = mountRef.current as unknown as { triggerHit?: (key: DrumKey) => void };
      if (containerWithHit.triggerHit) {
        containerWithHit.triggerHit(id);
      }
    }

    if (onTrigger) onTrigger(id);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toUpperCase();
      let targetId: DrumKey | null = null;

      if (key === "B" || e.code === "Space") targetId = "bass";
      else if (key === "S") targetId = "snare";
      else if (key === "H") targetId = "hihat";
      else if (key === "T") targetId = "tom1";
      else if (key === "G") targetId = "tom2";
      else if (key === "F") targetId = "floorTom";
      else if (key === "C") targetId = "crash";
      else if (key === "R") targetId = "ride";

      if (targetId) {
        e.preventDefault();
        executeDrumStrike(targetId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // React to external triggers
  useEffect(() => {
    if (activeTrigger) {
      executeDrumStrike(activeTrigger);
    }
  }, [activeTrigger]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Floating Dynamic Tooltip for Hovered Piece */}
      {hoveredPiece && (
        <div
          style={{
            position: "absolute",
            bottom: "35px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(18, 20, 24, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(222, 216, 206, 0.3)",
            padding: "8px 22px",
            borderRadius: "30px",
            color: "#ded8ce",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "1px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00f0ff" }} />
          <span>{hoveredPiece} • Click or Press Key to Strike</span>
        </div>
      )}
    </div>
  );
};
