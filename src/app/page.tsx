/**
 * HomePage.tsx
 * Landing page for Flowtrack with dark mode toggle and modern design
 */
'use client';

import {
  // useState,
  // useEffect,
  FC,
} from 'react';
// import { getSession } from 'next-auth/react';
import { AuthButtons } from '@/components/auth-buttons';

// Feature card props
interface FeatureCardProps {
  title: string;
  description: string;
}

// Price card props
interface PriceCardProps {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description }) => (
  <div className="p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-shadow">
    <h4 className="text-2xl font-semibold mb-2">{title}</h4>
    <p className="text-base">{description}</p>
  </div>
);

const PriceCard: FC<PriceCardProps> = ({
  title,
  price,
  features,
  highlight = false,
}) => (
  <div
    className={`p-6 rounded-lg transition-colors ${
      highlight
        ? 'bg-secondary text-secondary-foreground shadow-xl'
        : 'bg-card shadow-lg'
    }`}>
    <h4 className="text-2xl font-semibold mb-4">{title}</h4>
    <p className="text-3xl font-bold mb-6">{price}</p>
    <ul className="space-y-2 mb-6">
      {features.map((f, i) => (
        <li key={i}>• {f}</li>
      ))}
    </ul>
    {highlight && (
      <span className="px-4 py-2 bg-accent text-accent-foreground rounded-full">
        Most Popular
      </span>
    )}
  </div>
);

const HomePage: FC = () => {
  // const [isDark, setIsDark] = useState(false);

  // // useEffect(() => {
  // //   const saved = localStorage.getItem('theme');
  // //   const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // //   const mode = saved ? saved === 'dark' : prefers;
  // //   setIsDark(mode);
  // //   document.documentElement.classList.toggle('dark', mode);
  // // }, []);

  // // const toggleDark = (): void => {
  // //   setIsDark((prev) => {
  // //     const next = !prev;
  // //     localStorage.setItem('theme', next ? 'dark' : 'light');
  // //     document.documentElement.classList.toggle('dark', next);
  // //     return next;
  // //   });
  // // };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <header className="flex justify-between items-center p-6 shadow-sm bg-card">
        <h1 className="text-3xl font-bold text-primary">Flowtrack</h1>
        <div className="flex items-center space-x-4">
          {/* <button
            onClick={toggleDark}
            className="p-2 rounded-full bg-secondary hover:bg-secondary-foreground transition-colors"
            aria-label="Toggle theme">
            {isDark ? '🌞' : '🌙'}
          </button> */}
          <AuthButtons />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h2 className="text-5xl font-extrabold mb-4">
            Take Control of Your Day
          </h2>
          <p className="text-xl max-w-2xl mx-auto">
            Visual timeline + habit tracker + intelligent reminders—all in one
            intuitive tool.
          </p>
          <div className="mt-8">
            <AuthButtons primary />
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            [
              'Drag & Drop Timeline',
              'Visualize your day and move tasks with ease',
            ],
            [
              'Smart Habit Tracker',
              'See streaks, patterns, and stay motivated',
            ],
            ['Reminders & Alerts', 'Customize when and how you get notified'],
            ['Recurring Tasks', 'Never miss routine tasks again'],
            ['Calendar Sync', 'Integrate Google/Apple calendar'],
            ['Analytics & Trends', 'Detailed insights into your productivity'],
          ].map(([t, d]) => (
            <FeatureCard key={t} title={t} description={d} />
          ))}
        </section>

        {/* Pricing Section */}
        <section className="text-center mb-20">
          <h3 className="text-4xl font-bold mb-8">Choose Your Plan</h3>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <PriceCard
              title="Free"
              price="€0/mo"
              features={[
                'Timeline planner',
                'Up to 3 habits',
                'Basic reminders',
              ]}
            />
            <PriceCard
              title="Pro"
              price="€4.99/mo"
              features={[
                'Unlimited habits/tasks',
                'Calendar sync',
                'Detailed stats',
                'Custom alerts',
              ]}
              highlight
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4">Ready to flow?</h3>
          <AuthButtons primary big />
        </section>
      </main>

      <footer className="p-6 text-center bg-card text-muted">
        © {new Date().getFullYear()} Flowtrack. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
