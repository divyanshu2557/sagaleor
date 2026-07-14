import { MainLayout } from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-12 py-8">
        {/* Header Section */}
        <div>
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-2">
            Design System
          </p>
          <h1 className="text-4xl text-foreground">SagaLeor Kitchen Sink</h1>
          <p className="text-muted-foreground mt-2">
            Verify the typography, colors, and layout components.
          </p>
        </div>

        {/* Typography Scale */}
        <section className="space-y-6">
          <h2 className="text-2xl border-b border-border pb-2">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-5xl">Heading 1 (Playfair Display)</h1>
              <p className="text-sm text-muted-foreground mt-1">Font: Playfair Display / 48px</p>
            </div>
            <div>
              <h2 className="text-4xl">Heading 2 (Playfair Display)</h2>
              <p className="text-sm text-muted-foreground mt-1">Font: Playfair Display / 36px</p>
            </div>
            <div>
              <h3 className="text-3xl">Heading 3 (Playfair Display)</h3>
              <p className="text-sm text-muted-foreground mt-1">Font: Playfair Display / 30px</p>
            </div>
            <div>
              <p className="text-lg text-foreground font-sans">
                Body Large: The quick brown fox jumps over the lazy dog. (Inter)
              </p>
              <p className="text-sm text-muted-foreground mt-1">Font: Inter / 18px</p>
            </div>
            <div>
              <p className="text-base text-foreground font-sans">
                Body Regular: The quick brown fox jumps over the lazy dog. (Inter)
              </p>
              <p className="text-sm text-muted-foreground mt-1">Font: Inter / 16px</p>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl border-b border-border pb-2">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ColorSwatch name="Background Base" colorClass="bg-background" />
            <ColorSwatch name="Secondary" colorClass="bg-secondary" />
            <ColorSwatch name="Card/Surface" colorClass="bg-card" />
            <ColorSwatch name="Primary Text" colorClass="bg-foreground text-background" />
            <ColorSwatch name="Muted" colorClass="bg-muted" />
            <ColorSwatch name="Muted Text" colorClass="bg-muted-foreground text-background" />
            <ColorSwatch name="Accent (Gold)" colorClass="bg-primary text-primary-foreground" />
            <ColorSwatch name="Border / Accent" colorClass="bg-border" />
          </div>
        </section>

        {/* Components Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl border-b border-border pb-2">UI Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card Example */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl">Your Style Score</h3>
                <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                  Updated
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center shrink-0">
                  <span className="text-3xl text-foreground font-heading">82</span>
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">Great Style!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Keep exploring new looks to improve your unique Style DNA.
                  </p>
                </div>
              </div>
              <button className="w-full mt-8 bg-secondary hover:bg-border transition-colors text-foreground py-3 rounded-xl text-sm font-medium">
                View Full Analysis
              </button>
            </div>

            {/* AI Message Example */}
            <div className="bg-secondary rounded-3xl p-6 flex flex-col justify-end space-y-4">
              <div className="flex items-start gap-3 w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0" />
                <div className="bg-card text-foreground px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-border/50">
                  Hi Suvreen! I&apos;m your AI Stylist. How can I help you today?
                </div>
              </div>
              <div className="flex items-start gap-3 w-[80%] self-end flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-accent shrink-0" />
                <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
                  What should I wear for a brunch with friends?
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

function ColorSwatch({ name, colorClass }: { name: string; colorClass: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-24 rounded-2xl shadow-sm border border-border/50 ${colorClass}`}></div>
      <p className="text-sm font-medium text-foreground">{name}</p>
    </div>
  );
}
