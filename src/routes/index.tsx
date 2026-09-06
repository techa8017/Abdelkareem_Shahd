import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Send, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const weddingDate = new Date("2026-09-17T22:00:00+03:00");
const mapsUrl = "https://www.google.com/maps/place/Grand+Star+Assiut/@27.1837438,31.0426989,17z/data=!4m6!3m5!1s0x14450652b0b6ca95:0x8cce09ddf8916dc!8m2!3d27.1850131!4d31.0484496!16s%2Fg%2F11bbxl4q0s?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D";

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
  const [muted, setMuted] = useState(false);
  const [sent, setSent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown();

useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  video.muted = true;
  video.pause();
  video.currentTime = 0;

  setNeedsTap(true);
}, []);

const beginFilm = async () => {
  const video = videoRef.current;
  const audio = audioRef.current;

  if (!video || !audio) return;

  video.muted = true;

  await audio.play();
  await video.play();

  setNeedsTap(false);
};

const finishFilm = () => {
  setEntered(true);

  window.setTimeout(
    () => document.querySelector("#invitation")?.scrollIntoView(),
    1000
  );
};

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <main className="overflow-hidden bg-background text-foreground">
<audio ref={audioRef} src={weddingSong} loop preload="auto" />
      <section className={`opening ${entered ? "opening-finished" : ""}`} aria-label="Invitation opening">
<video ref={videoRef} className="opening-video" src={openingFilm} playsInline muted preload="auto" onEnded={finishFilm} />
        {needsTap && <div className="tap-layer"><Button variant="invitationOutline" size="lg" onClick={beginFilm} className="border-ivory/60 bg-transparent text-ivory">Tap to begin</Button></div>}
      </section>

      {entered && <Button variant="invitationOutline" size="icon" onClick={toggleMusic} className="music-control" aria-label={muted ? "Unmute music" : "Mute music"}>{muted ? <VolumeX /> : <Volume2 />}</Button>}

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
        <div className="calendar-card relative z-10 mx-auto max-w-2xl">
          <p className="eyebrow text-primary">Thursday</p>
          <p className="calendar-number">17</p>
          <div className="ornament text-primary"><span>◆</span></div>
          <h2 className="mt-7 font-display text-4xl uppercase sm:text-5xl">September</h2>
          <p className="mt-3 text-sm tracking-[0.38em]">2026</p>
          <p className="mt-8 font-display text-2xl italic text-muted-foreground">Ten o’clock in the evening</p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-primary">10:00 PM</p>

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

      <section className="venue-section relative flex min-h-[78vh] items-center justify-center px-6 py-24 text-center text-ivory">
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
        <div className="invitation-frame relative z-10 mx-auto max-w-2xl text-center">
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


      <footer className="ending relative flex min-h-[92vh] items-center justify-center px-5 py-24 text-center text-ivory">
<img src={endingBg} alt="Candlelit archway framed with cream roses" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="ending-shade" />
        <div className="relative z-10 max-w-3xl">
          <h2 className="see-you font-display">See you<br />There</h2>
          <div className="ornament my-9 text-gold-light"><span>◆</span></div>
          <p className="text-xs uppercase tracking-[0.32em] text-ivory/90 sm:text-sm">Abdelkareem &nbsp;&amp;&nbsp; Shahd</p>
          <p className="mt-4 text-xs uppercase tracking-[0.32em] text-gold-light">17 • 09 • 2026</p>
        </div>
      </footer>
    </main>
  );
}
