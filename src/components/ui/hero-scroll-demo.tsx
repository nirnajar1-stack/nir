import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80';

export function HeroScrollDemo() {
  return (
    <section className="flex flex-col overflow-hidden pb-24 pt-4">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-3xl md:text-4xl font-medium text-on-surface">
              תצוגה אינטראקטיבית של{' '}
              <br />
              <span className="text-3xl md:text-[4rem] font-bold mt-1 leading-none text-primary">
                נתוני המערכת
              </span>
            </h2>
            <p className="mt-4 text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto flex items-center justify-center gap-2">
              <BarChart3 className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              גלול למטה כדי לראות את לוח הבקרה בפרספקטיבה תלת-ממדית
            </p>
          </>
        }
      >
        <img
          src={HERO_IMAGE}
          alt="לוח בקרה עם גרפים ונתונים"
          height={720}
          width={1400}
          className="mx-auto object-cover h-full w-full object-left-top"
          draggable={false}
          loading="lazy"
        />
      </ContainerScroll>
    </section>
  );
}
