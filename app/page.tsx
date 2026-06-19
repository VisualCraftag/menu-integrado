import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <section id="inicio" className="relative overflow-hidden bg-shell">
        <div className="absolute inset-x-0 top-0 h-36 bg-citron" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div className="pt-10">
            <p className="mb-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-black text-citron">
              Restaurante contemporaneo
            </p>
            <h1 className="max-w-2xl text-5xl font-black tracking-normal text-ink sm:text-7xl">
              Mesa Viva
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70">
              Cocina de temporada con una carta digital que se siente visual, rapida y viva desde el primer toque.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-basil px-6 py-4 text-sm font-black text-white shadow-soft transition hover:bg-ink"
              >
                Ver menu
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[520px]">
            <div className="absolute inset-x-0 bottom-0 top-8 rounded-[2.2rem] bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85')] bg-cover bg-center shadow-soft" />
            <div className="absolute bottom-8 left-4 right-4 rounded-[1.6rem] bg-shell/92 p-4 shadow-soft backdrop-blur sm:left-8 sm:right-auto sm:w-96">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/45">Hoy en cocina</p>
              <p className="mt-2 text-2xl font-black">Sabores de estacion, listos para explorar.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className="bg-oat py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            ["Cocina abierta", "Ingredientes visibles, recetas honestas y platos preparados al momento."],
            ["Carta dinamica", "El equipo actualiza productos, precios e imagenes desde el panel privado."],
            ["Mobile first", "La experiencia esta pensada para mesas, QR y decisiones rapidas desde celular."],
          ].map(([title, copy]) => (
            <div key={title} className="border-t border-ink/15 pt-6">
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-ink/65">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contacto" className="bg-shell py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-basil">Contacto</p>
            <h2 className="mt-3 text-4xl font-black">Reserva tu mesa o prueba el MVP en vivo.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-oat p-5">
              <MapPin />
              <p className="mt-4 font-black">Palermo, Buenos Aires</p>
            </div>
            <div className="rounded-3xl bg-oat p-5">
              <Clock />
              <p className="mt-4 font-black">Mar a dom, 19 a 01</p>
            </div>
            <div className="rounded-3xl bg-oat p-5">
              <Phone />
              <p className="mt-4 font-black">+54 11 5555 0101</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
