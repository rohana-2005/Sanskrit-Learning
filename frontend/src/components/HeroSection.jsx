import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import background from "../assets/image.png";
import Dashboard from "./Dashboard";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const HeroSection = () => {
  const wrapper = useRef(null);
  const content = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: wrapper.current,
      content: content.current,
      smooth: 2,
      speed: 3,
      effects: true,
    });

    smoother.effects(".hero__image-cont", {
      speed: () => gsap.utils.random(0.55, 0.85, 0.05),
    });

    gsap.to(".anim-swipe", {
      yPercent: 300,
      delay: 0.2,
      duration: 3,
      stagger: {
        from: "random",
        each: 0.1,
      },
      ease: "sine.out",
    });

    gsap.to(".hero__image-cont > img", {
      scale: 1.5,
      xPercent: 20,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=3000px",
        scrub: true,
      },
    });
  }, []);

  const renderImages = () => {
    return [...Array(6)].map((_, i) => (
      <div className="hero__image-cont" key={i}>
        <img src={background} alt={`slide-${i}`} />
        <div className="anim-swipe"></div>
      </div>
    ));
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background: linear-gradient(135deg, #A0522D 0%, #8B4513 25%, #DAA520 50%, #CD853F 75%, #F5DEB3 100%);
        }
        .hero {
          height: 100vh;
        }
        .hero__inner {
          height: 100%;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
        }
        .hero__image-cont {
          position: relative;
          overflow: hidden;
        }
        .hero__image-cont:not(:last-child)::after {
          content: "";
          position: absolute;
          right: 0;
          background: linear-gradient(135deg, #A0522D 0%, #8B4513 25%, #DAA520 50%, #CD853F 75%, #F5DEB3 100%);
          height: 100%;
          top: 0;
          width: 2.5px;
          z-index: 999;
        }
        .hero__image-cont img,
        .anim-swipe {
          position: absolute;
          width: 800%;
          height: 100%;
          object-fit: contain;
          
        }
        .anim-swipe {
          width: 100%;
          background: linear-gradient(135deg, #A0522D 0%, #8B4513 25%, #DAA520 50%, #CD853F 75%, #F5DEB3 100%);
        }
        .hero__image-cont:nth-child(1) img { left: -100%; }
        .hero__image-cont:nth-child(2) img { left: -200%; }
        .hero__image-cont:nth-child(3) img { left: -300%; }
        .hero__image-cont:nth-child(4) img { left: -400%; }
        .hero__image-cont:nth-child(5) img { left: -500%; }
        .hero__image-cont:nth-child(6) img { left: -600%; }
        
        .hero__image-cont {
          background: linear-gradient(135deg, #A0522D 0%, #8B4513 25%, #DAA520 50%, #CD853F 75%, #F5DEB3 100%);
          background-size: 400% 400%;
          animation: gradientShift 12s ease infinite;
        }

        .dashboard-section {
          min-height: 100vh;
          position: relative;
          z-index: 10;
          margin-top: 100vh; /* Ensures dashboard starts after hero section */
        }

        .scroll-indicator {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: 1.2rem;
          z-index: 1000;
          animation: bounce 2s infinite;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          padding: 10px 20px;
          border-radius: 25px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        .scroll-indicator:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div id="wrapper" ref={wrapper}>
        <div id="content" ref={content}>
          <section className="hero" ref={heroRef}>
            <div className="hero__inner constrain">{renderImages()}</div>
          </section>

          <section className="dashboard-section">
            <Dashboard />
          </section>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
