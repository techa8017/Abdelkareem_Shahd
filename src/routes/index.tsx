import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Send, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import botanicalCorner from "@/assets/botanical-corner.png";
import openingFilm from "@/assets/opening-film.mp4";
import weddingSong from "@/assets/wedding-song.mp3";
import weddingHall from "@/assets/wedding-hall.jpg";
import heroBg from "@/assets/bg-hero.jpg";

import endingBg from "@/assets/bg-ending.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abdelkareem & Shahd | Wedding Invitation" },
      {
        name: "description",
        content: "Join Abdelkareem and Shahd at Grand Star Hall in Assiut on September 17, 2026.",
      },
      { property: "og:title", content: "Abdelkareem & Shahd | Wedding Invitation" },
      { property: "og:description", content: "A celebration of love, illuminated by candlelight." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://abdelkareem-shahd.techa8017.workers.dev/share-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://abdelkareem-shahd.techa8017.workers.dev/share-image.jpg" },
    ],
  }),

const weddingDate = new Date("2026-09-17T21:00:00+03:00");
const mapsUrl =
  "https://www.google.com/maps/place/Grand+Star+Assiut/@27.1837438,31.0426989,17z/data=!4m6!3m5!1s0x14450652b0b6ca95:0x8cce09ddf8916dc!8m2!3d27.1850131!4d31.0484496!16s%2Fg%2F11bbxl4q0s?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D";

// IDs for every section we want the auto-scroll to visit, in order.
const SECTION_IDS = ["invitation", "wedding-date", "venue", "guestbook", "closing"];

function useCountdown() {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const difference = Math.max(0, weddingDate.getTime() - Date.now());
      setRemaining({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return remaining;
}

function Index() {
  const [entered, setEntered] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [muted, setMuted] = useState(false);
  const [sent, setSent] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasFinishedRef = useRef(false); // guards against double-triggering the transition
  const lastInteractionRef = useRef(0);

  const countdown = useCountdown();

  // Moves past the opening video and reveals the site. Safe to call more than once.
  const finishFilm = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    setEntered(true);
    setNeedsTap(false);
    setShowSkip(false);

    videoRef.current?.pause();

    window.setTimeout(() => {
      document.querySelector("#invitation")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }, []);

  // Set up the intro video: reset it, show the tap prompt, and skip straight
  // to the site if the video (or audio) ever errors out.
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    video.muted = true;
    video.pause();
    video.currentTime = 0;
    setNeedsTap(true);

    const handleError = () => {
      console.warn("Opening media failed to load, skipping intro.");
      finishFilm();
    };

    video.addEventListener("error", handleError);
    audio?.addEventListener("error", handleError);
    return () => {
      video.removeEventListener("error", handleError);
      audio?.removeEventListener("error", handleError);
    };
  }, [finishFilm]);

  const beginFilm = async () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    setNeedsTap(false);
    video.muted = true;

    // Safety net: if playback hasn't actually started within 3s, stop waiting
    // and just show the site instead of leaving the visitor stuck.
    const watchdog = window.setTimeout(() => {
      finishFilm();
    }, 3000);

    try {
      await Promise.all([audio.play(), video.play()]);
      window.clearTimeout(watchdog);
      setShowSkip(true);
    } catch (err) {
      console.warn("Playback failed, skipping intro:", err);
      window.clearTimeout(watchdog);
      finishFilm();
    }
  };

  // Auto-scroll: every 5s, move to the next section and center it.
  // Pauses briefly if the person just scrolled/touched manually.
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    if (rect.height <= viewportHeight) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      const targetY = window.scrollY + rect.top - 24;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  // Figures out which section is currently closest to the center of the
  // screen — so auto-scroll always advances from where the visitor actually
  // is, not from an independent counter.
  const getCurrentSectionIndex = () => {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const viewportCenter = window.scrollY + viewportHeight / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = window.scrollY + rect.top + rect.height / 2;
      const distance = Math.abs(elCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    return closestIndex;
  };


  useEffect(() => {
    if (!entered) return;

    const markInteraction = () => {
      lastInteractionRef.current = Date.now();
    };
    window.addEventListener("wheel", markInteraction, { passive: true });
    window.addEventListener("touchmove", markInteraction, { passive: true });

    const timer = window.setInterval(() => {
      const idleFor = Date.now() - lastInteractionRef.current;
      const isTyping =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";
      if (idleFor < 4000 || isTyping) return; // skip this tick

      const currentIndex = getCurrentSectionIndex();
      const nextIndex = (currentIndex + 1) % SECTION_IDS.length;
      scrollToSection(SECTION_IDS[nextIndex]);
    }, 5000);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("wheel", markInteraction);
      window.removeEventListener("touchmove", markInteraction);
    };
  }, [entered]);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <audio ref={audioRef} src={weddingSong} loop preload="auto" />

      <section className={`opening ${entered ? "opening-finished" : ""}`} aria-label="Invitation opening">
        <video
          ref={videoRef}
          className="opening-video"
          src={openingFilm}
          poster={heroBg}
          playsInline
          muted
          preload="auto"
          onEnded={finishFilm}
        />
        {needsTap && (
          <div className="tap-layer">
            <Button variant="invitationOutline" size="lg" onClick={beginFilm} className="border-ivory/60 bg-transparent text-ivory">
              Tap to begin
            </Button>
          </div>
        )}
        {showSkip && !entered && (
          <button type="button" onClick={finishFilm} className="skip-button" aria-label="Skip intro">
            Skip <SkipForward size={16} />
          </button>
        )}
      </section>

      {entered && (
        <Button
          variant="invitationOutline"
          size="icon"
          onClick={toggleMusic}
          className="music-control"
          aria-label={muted ? "Unmute music" : "Mute music"}
        >
          {muted ? <VolumeX /> : <Volume2 />}
        </Button>
      )}

      <section id="invitation" className="hero-invitation relative flex min-h-screen items-center justify-center px-5 py-24 text-center text-ivory">
        <img src={heroBg} alt="Candlelit golden hall aisle lined with roses and candles" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1088} />
        <div className="hero-shade" />
        <div className="relative z-10 max-w-4xl">
          <p className="eyebrow text-ivory/80">Together with their families</p>
          <h1 className="couple-names mt-8">Abdelkareem <span>&</span> Shahd</h1>
          <div className="ornament my-9 text-gold-light"><span>◆</span></div>
          <p className="mx-auto max-w-xl font-display text-xl italic leading-relaxed text-ivory/85 sm:text-2xl">joyfully invite you to share in the celebration of their marriage</p>
        </div>
      </section>

<section className="paper-section parchment-section relative px-5 py-24 text-center sm:py-32">
        <img src={botanicalCorner} alt="White roses and sage botanical arrangement" width={1024} height={1024} className="botanical botanical-right" />
        <div id="wedding-date" className="calendar-card relative z-10 mx-auto max-w-2xl">
          <p className="eyebrow text-primary">Thursday</p>
          <p className="calendar-number">17</p>
          <div className="ornament text-primary"><span>◆</span></div>
          <h2 className="mt-7 font-display text-4xl uppercase sm:text-5xl">September</h2>
          <p className="mt-3 text-sm tracking-[0.38em]">2026</p>
          <p className="mt-8 font-display text-2xl italic text-muted-foreground">Nine o'clock in the evening</p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-primary">9:00 PM</p>

          <div className="mt-14 border-t border-border pt-12">
            <p className="eyebrow text-primary">Counting down to our day</p>
            <div className="mx-auto mt-9 grid max-w-xl grid-cols-4 gap-y-4">
              {Object.entries(countdown).map(([label, value]) => (
                <div key={label} className="countdown-cell px-1">
                  <span className="block font-display text-3xl leading-none text-primary sm:text-5xl">{String(value).padStart(2, "0")}</span>
                  <span className="mt-3 block text-[0.5rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-[0.62rem] sm:tracking-[0.24em]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="venue" className="venue-section relative flex min-h-[78vh] items-center justify-center px-6 py-24 text-center text-ivory">
        <img src={weddingHall} alt="Grand Palace wedding aisle illuminated by candles" loading="lazy" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="venue-shade" />
        <div className="relative z-10 max-w-2xl">
          <MapPin className="mx-auto h-7 w-7 text-gold-light" strokeWidth={1} />
          <p className="eyebrow mt-7 text-ivory/75">Where we'll celebrate</p>
          <h2 className="mt-5 font-display text-5xl sm:text-7xl">Grand Star Hall</h2>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gold-light">Assiut</p>
          <p className="mt-7 font-display text-xl italic text-ivory/85">Come celebrate with us where our beautiful evening begins.</p>
          <Button asChild variant="invitationOutline" size="lg" className="mt-10 border-ivory/50 bg-transparent text-ivory">
            <a href={mapsUrl} target="_blank" rel="noreferrer">Find your way to us <MapPin /></a>
          </Button>
        </div>
      </section>

<section className="paper-section parchment-section relative px-5 py-24 sm:py-32">
        <img src={botanicalCorner} alt="" aria-hidden="true" loading="lazy" width={1024} height={1024} className="botanical botanical-left" />
        <div id="guestbook" className="invitation-frame relative z-10 mx-auto max-w-2xl text-center">
          <p className="eyebrow text-primary">For our memories</p>
          <h2 className="section-title">Leave Us a Kind Word</h2>
          <div className="ornament my-8 text-primary"><span>◆</span></div>
          <p className="mx-auto max-w-md font-display text-xl italic leading-relaxed text-muted-foreground">Every note written here will be kept and read again on our anniversaries.</p>
          {sent ? (
            <div className="mt-12 border-t border-border pt-12">
              <p className="font-display text-3xl italic">Thank you for being part of our story. 🤍</p>
            </div>
          ) : (
            <form className="mt-12 space-y-6 text-left" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
              <label className="form-label">Your name<input required className="invitation-input" /></label>
              <label className="form-label">Your message<textarea required rows={5} className="invitation-input resize-none" /></label>
              <div className="pt-4 text-center"><Button type="submit" variant="invitation" size="lg">Leave your note <Send /></Button></div>
            </form>
          )}
        </div>
      </section>

      <footer id="closing" className="ending relative flex min-h-[92vh] items-center justify-center px-5 py-24 text-center text-ivory">
        <img src={endingBg} alt="Candlelit archway framed with cream roses" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="ending-shade" />
        <div className="relative z-10 max-w-3xl">
          <h2 className="see-you font-display">See you<br />There</h2>
          <div className="ornament my-9 text-gold-light"><span>◆</span></div>
          <p className="text-xs uppercase tracking-[0.32em] text-ivory/90 sm:text-sm">Abdelkareem &nbsp;&amp;&nbsp; Shahd</p>
          <p className="mt-4 text-xs uppercase tracking-[0.32em] text-gold-light">17 • 09 • 2026</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.32em] text-gold-light">9 PM</p>
        </div>
      </footer>
    </main>
  );
}
