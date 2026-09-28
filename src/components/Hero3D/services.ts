/**
 * The hero scene's content, as data.
 *
 * ONE ARRAY DRIVES THE WHOLE COMPOSITION - cards, connections, overlay labels,
 * supporting lists and links. Adding a fourth capability later should be a row
 * here and nothing else, which is the brief's own requirement and the reason
 * positions live in the data rather than in the components that render them.
 *
 * POSITIONS ARE SCENE UNITS, not pixels. The camera is fixed, so these read as
 * a layout: x is left/right, y is height above the platform, z is toward the
 * viewer. The centre cube sits at the origin, so every card's vector is also
 * the direction its connection travels inward from.
 */

export type ServiceId = 'engineering' | 'ai' | 'blockchain';

export type Service = {
  id: ServiceId;
  title: string;
  description: string;
  /** Card centre in scene units. */
  position: [number, number, number];
  /** Slight turn toward the viewer, in radians. */
  rotationY: number;
  /** The supporting list beside the card. Kept short; the last item is "And more". */
  supporting: string[];
  /** Which side the supporting list sits on, so the overlay knows where to put it. */
  side: 'left' | 'right';
  href: string;
};

export const SERVICES: Service[] = [
  {
    id: 'engineering',
    title: 'Engineering',
    description: 'From complex problems to reliable products',
    position: [-1.8, 0.62, 0.15],
    rotationY: 0.3,
    supporting: ['Custom software', 'Web and mobile', 'Scalable architecture', 'Modernisation', 'And more'],
    side: 'left',
    href: '/engineering',
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    description: 'From insight to real-world action',
    position: [1.25, 1.42, -0.55],
    rotationY: -0.32,
    supporting: ['Intelligent workflows', 'Agentic AI', 'Data and integration', 'Decision support', 'And more'],
    side: 'right',
    href: '/ai-automation',
  },
  {
    id: 'blockchain',
    title: 'Blockchain',
    description: 'Where decentralisation creates real value',
    position: [1.72, -0.22, 0.5],
    rotationY: -0.28,
    supporting: ['Tokenisation', 'Smart contracts', 'Verification', 'Distributed systems', 'And more'],
    side: 'right',
    href: '/blockchain',
  },
];

export const CENTRE = {
  title: 'Experience',
  description: 'Built around the people who use it',
  /** Floats slightly above the platform, as the brief asks. */
  position: [0, 0.25, 0] as [number, number, number],
};

/** The one accent. Everything else in the scene is white, silver or ink. */
export const BRAND = '#661a8f';
export const BRAND_LIGHT = '#9d5bc4';
