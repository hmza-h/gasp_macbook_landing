import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

const Highlights = () => {
  const sectionRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  useGSAP(() => {
    gsap.to(".left-column, .right-column", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: isMobile ? "top 85%" : "top 70%",
        toggleActions: "play none none reverse",
      },
    });
  }, { scope: sectionRef, dependencies: [isMobile] });

  return (
    <section id="highlights" ref={sectionRef}>
      <h2>There's never been a better time to upgrade.</h2>
      <h3>Here's what you get with new Macbook Pro.</h3>

      <div className="masonry">
        <div className="left-column">
          <div>
            <img src="/laptop.png" alt="Laptop" />
            <p>Fly through demanding tasks upto 9.8x faster.</p>
          </div>
          <div>
            <img src="/sun.png" alt="Sun" />
            <p>
              A stunning <br />
              Liquid Retina XDR <br />
              Display.
            </p>
          </div>
        </div>
        <div className="right-column">
          <div className="apple-gradient">
            <img src="/ai.png" alt="AI" />
            <p>
              Built for <br />
              <span>Apple Intelligence.</span>
            </p>
          </div>
          <div>
            <img src="/battery.png" alt="Battery" />
            <p>
              Up to
              <span className="green-gradient"> 14 more hours </span>
              battery life.
              <span className="text-dark-100"> (Up to 24 hours total.) </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
