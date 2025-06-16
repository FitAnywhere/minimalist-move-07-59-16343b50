
import { useEffect } from 'react';

const NeverGetSick = () => {
  useEffect(() => {
    console.log('🎯 NeverGetSick component mounted successfully!');
    console.log('Current URL:', window.location.href);
    
    // Set page title and meta description
    document.title = 'The Anti-Virus Blueprint | FitAnywhere';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover five simple, science-backed habits to strengthen your immune system. No supplements. Just biology that works.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover five simple, science-backed habits to strengthen your immune system. No supplements. Just biology that works.';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              The Anti-Virus Blueprint
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Here are five simple, science-backed ways to strengthen your immune system—starting today.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-4">
              No supplements. No fluff. Just biology that works.
            </p>
          </header>

          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                1. Digest less, defend more
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Most people live in a constant state of digestion—snacking, bloating, crashing.
                But 70% of your immune system lives in your gut. If your body's always digesting, it can't clean house.
              </p>
              <div className="ml-6 space-y-2 mb-4">
                <p className="text-gray-700"><strong>Try an 8-hour eating window (intermittent fasting)</strong></p>
                <p className="text-gray-700"><strong>Give your gut 16 hours off-duty</strong></p>
                <p className="text-gray-700"><strong>Let immune cells do what they're built for: protecting, not processing croissants</strong></p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                You're not starving—you're activating cellular repair and defense.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                2. Light first, screens later
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Step outside first thing in the morning. Face the sunlight. Breathe through your nose.
                This isn't theory—it's circadian biology. Morning light tells your brain to lower melatonin and strengthen immune response.
                Nasal breathing boosts nitric oxide, widens blood vessels, and improves oxygen flow.
              </p>
              <p className="text-gray-700 leading-relaxed font-medium">
                90 seconds of light. Deep inhale. Done.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                3. Cold water, stronger cells
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                A cold shower isn't punishment—it's a biological wake-up call.
                Cold exposure triggers norepinephrine (focus, energy) and boosts production of immune cells like lymphocytes and monocytes.
                It reduces inflammation, sharpens your mind, and hardens your nervous system.
              </p>
              <ul className="list-disc ml-6 space-y-2 mb-4 text-gray-700">
                <li>15 seconds today</li>
                <li>30 seconds tomorrow</li>
                <li>1 minute next week</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You're not just getting cold—you're building resilience.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                4. Cut sugar, starve the enemy
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Viruses, bacteria, and even cancer love sugar.
                What they hate? Stable blood sugar and clean fuel from real food.
                Every time you skip sugar, your immune system wins.
              </p>
              <ul className="list-disc ml-6 space-y-2 mb-4 text-gray-700">
                <li>Swap soda for water</li>
                <li>Eat fruit instead of candy</li>
                <li>Prioritize protein at every meal</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                This is cellular discipline—and it compounds daily.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                5. Sleep: your immune system's battlefield
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sleep isn't optional—it's where your immune system trains.
              </p>
              <ul className="list-disc ml-6 space-y-2 mb-4 text-gray-700">
                <li>Natural killer cells multiply</li>
                <li>T-cells memorize threats</li>
                <li>Damaged cells get marked for destruction</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Less than 6 hours of sleep? Your immune system can drop by 70% the next day.
                Sleep isn't rest. It's your immune shield. Guard it like your life depends on it—because it does.
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
};

export default NeverGetSick;
