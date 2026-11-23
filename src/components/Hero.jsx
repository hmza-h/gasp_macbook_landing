import { useRef, useEffect } from "react";

const Hero = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.playbackRate = 2.0;
    }
  }, []);

  return (
    <section id="hero">
      <div>
        <h1>MacBook Pro</h1>
        <img src="/title.png" alt="MacBook Pro Title" />
      </div>

      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
      />

      <button>Buy</button>
      <p>From $1599 or $133/mo for 12 months</p>
    </section>
  );
};

export default Hero;
