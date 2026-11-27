import { Canvas } from "@react-three/fiber";
import StudioLights from "./three/StudioLights";
import { features, featureSequence } from "../constants";
import clsx from "clsx";
import { Suspense, useEffect, useRef } from "react";
import { Center, Html } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MacbookModel from "./models/Macbook";
import { useMediaQuery } from "react-responsive";
import useMacbookStore from "../store";

const ModelScroll = ({ groupRef, isMobile }) => {
  return (
    <group ref={groupRef}>
      <Suspense
        fallback={
          <Html>
            <h1 className="text-white text-3xl uppercase">Loading ...</h1>
          </Html>
        }
      >
        <Center>
          <MacbookModel
            scale={isMobile ? 0.05 : 0.08}
            position={[0, -1, 0]}
          />
        </Center>
      </Suspense>
    </group>
  );
};

const Features = () => {
  const sectionRef = useRef(null);
  const groupRef = useRef(null);
  const activeFeatureRef = useRef(-1);
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const setTexture = useMacbookStore((state) => state.setTexture);
  const setVideos = useMacbookStore((state) => state.setVideos);

  useEffect(() => {
    const videoListeners = new Map();
    const videos = Object.fromEntries(
      featureSequence.map(({ videoPath }) => {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.disablePictureInPicture = true;
        video.setAttribute("webkit-playsinline", "");
        video.src = videoPath;

        const handleError = () => {
          console.error(`Unable to preload feature video: ${videoPath}`, video.error);
        };
        video.addEventListener("error", handleError);
        videoListeners.set(videoPath, handleError);
        video.load();

        return [videoPath, video];
      }),
    );

    setVideos(videos);

    return () => {
      Object.entries(videos).forEach(([videoPath, video]) => {
        video.pause();
        video.removeEventListener("error", videoListeners.get(videoPath));
        video.removeAttribute("src");
        video.load();
      });
      setVideos({});
    };
  }, [setVideos]);

  useGSAP(() => {
    const cards = featureSequence.map(({ boxClass }) =>
      sectionRef.current.querySelector(boxClass),
    );
    const rotation = { y: 0 };
    const cardsContainer = sectionRef.current.querySelector(".feature-cards");
    const pinCards = () => {
      Object.assign(cardsContainer.style, {
        position: "fixed",
        inset: "0",
        zIndex: "50",
        pointerEvents: "none",
      });
    };
    const unpinCards = () => {
      gsap.set(cardsContainer, {
        clearProps: "position,inset,zIndex,pointerEvents",
      });
    };
    const syncFeature = (self) => {
      const featureIndex = Math.min(
        featureSequence.length - 1,
        Math.floor(self.progress * featureSequence.length),
      );

      if (featureIndex !== activeFeatureRef.current) {
        activeFeatureRef.current = featureIndex;
        setTexture(featureSequence[featureIndex].videoPath);
      }
    };
    const clearActiveFeature = () => {
      activeFeatureRef.current = -1;
      setTexture(null);
    };

    gsap.set(cards, { autoAlpha: 0, y: 24 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#f-canvas",
        start: "top top",
        end: () => `+=${window.innerHeight * featureSequence.length}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: (self) => {
          pinCards();
          syncFeature(self);
        },
        onEnterBack: (self) => {
          pinCards();
          syncFeature(self);
        },
        onLeave: () => {
          unpinCards();
          clearActiveFeature();
        },
        onLeaveBack: () => {
          unpinCards();
          clearActiveFeature();
        },
        onUpdate: (self) => {
          if (self.isActive) syncFeature(self);
        },
      },
    });

    timeline.to(
      rotation,
      {
        y: Math.PI * 2,
        duration: featureSequence.length,
        ease: "none",
        onUpdate: () => {
          if (groupRef.current) groupRef.current.rotation.y = rotation.y;
        },
      },
      0,
    );

    cards.forEach((card, index) => {
      timeline.to(
        card,
        { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" },
        index,
      );
      timeline.to(
        card,
        { autoAlpha: 0, y: -16, duration: 0.18, ease: "power2.in" },
        index + 0.82,
      );
    });

    return () => {
      clearActiveFeature();
      unpinCards();
    };
  }, { scope: sectionRef });

  return (
    <section id="features" ref={sectionRef}>
      <h2>See it all in a new light.</h2>

      <Canvas
        id="f-canvas"
        camera={{ position: [0, 0, 6], fov: isMobile ? 42 : 40 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: !isMobile }}
      >
        <StudioLights />
        <ambientLight intensity={0.5} />
        <ModelScroll groupRef={groupRef} isMobile={isMobile} />
      </Canvas>

      <div className="feature-cards absolute inset-0">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={clsx(
              "box",
              `box${index + 1}`,
              "max-w-[18rem]",
              feature.styles,
            )}
          >
            <div className="flex items-center gap-3 mb-3">
              <img className="w-10 h-10" src={feature.icon} alt="" />
              <h3 className="text-white font-semibold text-xl">
                {feature.highlight}
              </h3>
            </div>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
