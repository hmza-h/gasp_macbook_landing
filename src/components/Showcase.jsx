import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Showcase = () => {
    const showcaseRef = useRef(null);

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".media",
                start: "top top",
                end: "+=150%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        timeline
            .to(".mask img", { scale: 1, duration: 0.85, ease: "none" })
            .fromTo(
                ".content",
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.15, ease: "none" },
                0.85,
            );
    }, { scope: showcaseRef });

  return (
    <section id="showcase" ref={showcaseRef}>
        <div className="media">
            <video src="/videos/game.mp4" loop muted autoPlay playsInline />
            <div className="mask">
                <img src="/mask-logo.svg" alt="" />
            </div>
        </div>


        <div className="content">
            <div className="wrapper">
                <div className="lg:max-w-md">
                    <h2>Rocket Chip</h2>

                    <div className="space-y-5 mt-7 pe-10">
                        <p>
                            Introducing {" "}
                            <span className="text-white">
                                M4, the next generation of Apple Silicon
                            </span>
                            . M4 powers
                        </p>
                        <p>
                            It drives Apple Intellegence on iPad Pro, so you can write, create, and accomplish more with ease. All in a design that's unbelievably thin, light and powerful.
                        </p>
                        <p>
                            A brand-new display engine delivers breathtaking precision, color accuracy, and brightness. And a next-gen GPU with hardware-accelerated ray tracing brings console-level graphics to your figertips.
                        </p>
                        <p className="text-primary">Learn more about Apple Intellegence</p>
                    </div>
                </div>

                <div className="max-w-3xs space-y-14">
                    <div className="space-y-2">
                        <p>Up to</p>
                        <h3>4x faster</h3>
                        <p>pro rendering performance than M2</p>
                    </div>
                    <div className="space-y-2">
                        <p>Up to</p>
                        <h3>1.5x faster</h3>
                        <p>CPU performance than M2</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Showcase