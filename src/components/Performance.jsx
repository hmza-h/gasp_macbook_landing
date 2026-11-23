import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { performanceImages, performanceImgPositions } from "../constants";

const Performance = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".content p",
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".content p",
          start: "top 85%",
          end: "top 60%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );

    const media = gsap.matchMedia();
    media.add("(min-width: 1024px)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "center center",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      performanceImgPositions
        .filter(({ id }) => id !== "p5")
        .forEach(({ id, transform, ...position }) => {
          const finalPosition = Object.fromEntries(
            Object.entries(position).map(([property, value]) => [
              property,
              `${value}%`,
            ]),
          );

          timeline.fromTo(
            `.${id}`,
            { opacity: 1, y: 80 },
            {
              ...finalPosition,
              ...(transform ? { transform } : {}),
              opacity: 1,
              y: 0,
              ease: "none",
              duration: 1,
            },
            0,
          );
        });
    });
  }, { scope: sectionRef });

  return (
    <section id="performance" ref={sectionRef}>
      <h2>Next-level graphics performance. Game on.</h2>

      <div className="wrapper">
        {performanceImages.map(({ id, src }) => (
          <img key={id} className={id} src={src} alt={id} />
        ))}
      </div>

      <div className="content">
        <p>
          Run graphics-intensive workflows with a responsiveness that keeps up
          with your imagination. The M4 family of chips features a GPU with a
          second-generation hardware accelerated ray tracing engine that renders
          images faster, so{' '}<span className="text-white">gamming feels more immersive and realistic than ever</span>{' '}
          and Dynamic Caching optimizes fast on-chip memory to dramatically
          increase average GPU utilization - driving a huge performance boost
          for the most demanding pro apps and games.
        </p>
      </div>
    </section>
  );
};

export default Performance;
