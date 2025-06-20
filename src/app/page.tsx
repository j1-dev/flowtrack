/**
 * HomePage.tsx
 * Landing page for Flowtrack with dark mode toggle and modern design
 */
'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  LineChart,
  CheckCircle2,
  Users,
  Star,
} from 'lucide-react';
import { AuthButtons } from '@/components/auth-buttons';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import MouseMoveEffect from '@/components/mouse-move-effect';
import { ThemeSwitcher } from '@/components/theme-switcher';

const features = [
  {
    icon: <Calendar className="w-7 h-7" />,
    title: 'Smart Task Management',
    desc: 'Organize your day with drag-and-drop tasks, color labels, and instant scheduling.',
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: 'Time Analytics',
    desc: 'Visualize your productivity with beautiful charts and actionable insights.',
  },
  {
    icon: <LineChart className="w-7 h-7" />,
    title: 'Habit Builder',
    desc: 'Build habits with streaks, reminders, and playful progress tracking.',
  },
  {
    icon: <CheckCircle2 className="w-7 h-7" />,
    title: 'Goal Achievement',
    desc: 'Break down big goals into small wins and celebrate your progress.',
  },
];

const testimonials = [
  {
    name: 'Alex Rivera',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote:
      'Flowtrack made me love planning my day. The playful UI keeps me coming back!',
    stars: 5,
  },
  {
    name: 'Jamie Chen',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      'I finally built a daily routine that sticks. The streaks are so motivating!',
    stars: 5,
  },
];

const FeatureCard: FC<{
  title: string;
  desc: string;
  icon: React.ReactNode;
}> = ({ title, desc, icon }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.04 }}
    className="rounded-2xl bg-card/90 border border-border shadow-md p-6 flex flex-col items-start gap-3 transition-all hover:shadow-xl min-h-[180px] backdrop-blur-md">
    <div className="bg-primary/10 text-primary rounded-lg p-2 mb-2">{icon}</div>
    <h3 className="font-bold text-lg mb-1 text-foreground">{title}</h3>
    <p className="text-base text-foreground/80">{desc}</p>
  </motion.div>
);

const TestimonialCard: FC<{
  name: string;
  avatar: string;
  quote: string;
  stars: number;
}> = ({ name, avatar, quote, stars }) => (
  <div className="rounded-xl bg-card/90 border border-border p-6 flex flex-col items-center text-center shadow-sm backdrop-blur-md">
    <Image
      src={avatar}
      alt={name}
      className="w-14 h-14 rounded-full mb-3 border-2 border-primary/40"
      height={56}
      width={56}
    />
    <div className="flex gap-1 mb-2">
      {Array.from({ length: stars }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-300" />
      ))}
    </div>
    <p className="italic text-foreground/80 mb-2">“{quote}”</p>
    <span className="font-semibold text-primary">{name}</span>
  </div>
);

const HomePage: FC = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <MouseMoveEffect />
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-10 pt-24 md:pt-32 bg-card/90 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/10 rounded-full blur-3xl opacity-60 animate-pulse" />
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-lg mb-6">
            Playful Productivity, <span className="text-primary">Mastered</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-xl md:text-2xl text-foreground text-center max-w-2xl mb-8">
            Flowtrack helps you plan, track, and celebrate your daily wins with
            a bold, playful interface.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <AuthButtons primary big className="h-10 px-6 text-lg" />
            <Button variant="outline" size="lg" className="h-10 px-6 text-lg">
              Learn More
            </Button>
          </div>
          <div className="flex items-center gap-2 text-foreground/80 text-sm">
            <Users className="w-5 h-5" />
            Join <span className="font-bold text-primary">3,000+</span> happy
            users
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-card/90 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground">
            Everything you need to{' '}
            <span className="text-primary">win your day</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Testimonial Section */}
      <section className="py-16 bg-card/90 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-primary">
            Loved by productive people
          </h3>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-card/90 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Play &amp; Win?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Start your playful productivity journey with Flowtrack today.
          </p>
          <AuthButtons big />
        </div>
      </section>
      <div className="z-50 fixed bottom-5 right-5">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default HomePage;
