import { PresentationControls } from "@react-three/drei";
import { useRef } from "react";
import MacbookModel16 from "../models/Macbook-16";
import MacbookModel14 from "../models/Macbook-14";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TRANSITION_DISTANCE = 5;

const getMaterials = (group) => {
  const materials = new Set();
  group.traverse((child) => {
    if (!child.isMesh) return;

    const meshMaterials = Array.isArray(child.material)
      ? child.material
      : [child.material];
    meshMaterials.forEach((material) => materials.add(material));
  });
  return [...materials];
};

const ModelSwitcher = ({ scale, isMobile }) => {
  const smallMacbookRef = useRef();
  const largeMacbookRef = useRef();
  const activeGroupRef = useRef(null);
  const timelineRef = useRef(null);

  const showLargeMacbook = scale === 0.08 || scale === 0.05;

  useGSAP(() => {
    const incomingGroup = showLargeMacbook
      ? largeMacbookRef.current
      : smallMacbookRef.current;
    const otherGroup = showLargeMacbook
      ? smallMacbookRef.current
      : largeMacbookRef.current;

    if (!incomingGroup || !otherGroup) return;

    if (!activeGroupRef.current) {
      gsap.set(incomingGroup.position, { x: 0 });
      gsap.set(otherGroup.position, {
        x: showLargeMacbook ? -TRANSITION_DISTANCE : TRANSITION_DISTANCE,
      });
      incomingGroup.visible = true;
      otherGroup.visible = false;
      activeGroupRef.current = incomingGroup;
      return;
    }

    const outgoingGroup = activeGroupRef.current;
    if (outgoingGroup === incomingGroup) return;

    timelineRef.current?.kill();
    const incomingStartX = showLargeMacbook
      ? TRANSITION_DISTANCE
      : -TRANSITION_DISTANCE;
    const outgoingEndX = -incomingStartX;
    const outgoingMaterials = getMaterials(outgoingGroup);
    const incomingMaterials = getMaterials(incomingGroup);

    gsap.set(outgoingGroup.position, { x: 0 });
    gsap.set(incomingGroup.position, { x: incomingStartX });
    outgoingGroup.visible = true;
    incomingGroup.visible = true;
    [...outgoingMaterials, ...incomingMaterials].forEach((material) => {
      if (!material.transparent) {
        material.transparent = true;
        material.needsUpdate = true;
      }
      material.opacity = 1;
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        outgoingGroup.visible = false;
        gsap.set(outgoingGroup.position, { x: -incomingStartX });
        gsap.set(outgoingMaterials, { opacity: 1 });
      },
    });

    timeline
      .to(outgoingGroup.position, {
        x: outgoingEndX,
        duration: 0.45,
        ease: "power2.inOut",
      }, 0)
      .to(incomingGroup.position, {
        x: 0,
        duration: 0.45,
        ease: "power2.inOut",
      }, 0)
      .to(outgoingMaterials, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
      }, 0);

    timelineRef.current = timeline;
    activeGroupRef.current = incomingGroup;

    return () => timeline.kill();
  }, [showLargeMacbook]);

  const controlsConfig = {
    snap: true,
    speed: 1,
    zoom: 1,
    config: { mass: 1, tension: 170, friction: 26 },
    azimuth: [-Infinity, Infinity],
  };

  return (
    <PresentationControls {...controlsConfig}>
      <group ref={largeMacbookRef}>
        <MacbookModel16 scale={isMobile ? 0.05 : 0.08} />
      </group>
      <group ref={smallMacbookRef}>
        <MacbookModel14 scale={isMobile ? 0.03 : 0.06} />
      </group>
    </PresentationControls>
  );
};

export default ModelSwitcher;
