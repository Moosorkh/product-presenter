import Image from "next/image";
import Reveal from "./Reveal";

const columns = [
  {
    title: "Products",
    links: ["Vapes", "Edibles", "Prerolls", "Batteries"],
  },
  {
    title: "Our Company",
    links: ["About", "Promotions", "Lab Results", "Blog"],
  },
  {
    title: "Help",
    links: ["FAQ", "Contact", "Validate"],
  },
];

export default function Footer() {
  return (
    <footer id="where-to-buy" className="relative overflow-hidden bg-[#111210] text-[#f3ede1]">
      <div className="border-y border-gold/20 bg-[#090a09]">
        <Reveal className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:py-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gold">
              Dime Dispatch
            </p>
            <h2 className="mt-3 max-w-md text-3xl font-black leading-tight tracking-[-0.035em] sm:text-4xl">
              Access our members-only newsletter.
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="Your email address"
              className="min-h-14 flex-1 rounded-full border border-white/15 bg-white/[0.07] px-6 text-sm outline-none transition placeholder:text-white/35 focus:border-gold/70 focus:bg-white/[0.1]"
            />
            <button
              type="button"
              className="min-h-14 rounded-full bg-gold px-8 text-xs font-black uppercase tracking-[0.14em] text-[#15120b] transition hover:-translate-y-0.5 hover:bg-[#e1bb67]"
            >
              Sign me up
            </button>
          </div>
        </Reveal>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[190px] opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 45%, rgba(210,166,75,.13) 46%, transparent 48%), url(/concrete-black-1024x773.jpg)",
          backgroundSize: "88px 88px, 760px auto",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:py-16">
        <Reveal>
          <div className="grid gap-9 lg:grid-cols-[1.15fr_1.85fr] lg:gap-16">
            <div>
              <Image
                src="/Dime-R-Logo-01-2.png"
                alt="Dime Industries"
                width={2048}
                height={885}
                className="h-14 w-auto"
              />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#f3ede1]/48">
                Bold hardware, signature flavor, and a standard that never
                changes. Built for adults who expect more from every pull.
              </p>
              <div className="mt-5 flex gap-3" aria-label="Social links">
                {["IG", "X", "F", "YT"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    aria-label={social}
                    className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-[10px] font-black text-gold transition hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-[#15120b]"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              {columns.map((col) => (
                <div key={col.title}>
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-gold sm:text-xs sm:tracking-[0.2em]">
                    {col.title}
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs text-[#f3ede1]/58 sm:mt-5 sm:text-sm">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="transition hover:text-gold">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} y={18}>
          <p className="my-10 text-center font-serif text-[clamp(3rem,9vw,8.5rem)] font-medium italic leading-none tracking-[-0.06em] text-gold lg:my-16">
            Think Higher.
          </p>
        </Reveal>

        <div className="space-y-3 border-t border-gold/15 pt-6 text-xs leading-relaxed text-[#f3ede1]/38">
          <p>
            For use only by adults 21 years of age and older. Keep out of
            reach of children. This product may be illegal outside your
            state or country &mdash; check local laws before use.
          </p>
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} Dime Industries &mdash; demo
              project, illustrative content only.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a href="#" className="hover:text-gold">Terms</a>
              <a href="#" className="hover:text-gold">Privacy</a>
              <a href="#" className="hover:text-gold">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
