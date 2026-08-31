/**
 * Testimonials.
 *
 * These are the firm's real Clutch reviews, carried across verbatim from the
 * live site's verified data with their per-review Clutch permalinks intact.
 * Nothing here is written for the website: if a quote cannot be opened and
 * read on Clutch by a stranger, it does not go on the page.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Initials shown in the avatar when there is no cleared portrait. */
  initials: string;
  rating: number;
  /** Deep link to the individual review on Clutch. */
  url: string;
};

export const testimonials: Testimonial[] = [
  {
    // Punctuation matches the review verbatim, exclamation mark included. One
    // design board renders it with a full stop; the review is the authority.
    quote: 'The deliverables were there on time and at high quality!',
    name: 'David Elcombe',
    role: 'Managing Director, WindWorkX Industry',
    initials: 'DE',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0?sort_by=date_desc#review-255279',
  },
  {
    quote: 'We couldn’t ask for a more professional service.',
    name: 'Anthony Bevan',
    role: 'CEO, The BlockGuard Technologies',
    initials: 'AB',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0?sort_by=date_desc#review-275026',
  },
  {
    quote: 'Pixelette Technologies has been the perfect partner so far.',
    name: 'Mushtaq Khalil',
    role: 'Co-Founder, Buttersmiles Marketplace',
    initials: 'MK',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0#review-158221',
  },
  {
    quote: 'The people were impressive.',
    name: 'Julien Braun',
    role: 'Co-Founder, Carmentis',
    initials: 'JB',
    rating: 4,
    url: 'https://clutch.co/go-to-review/258ba1ac-898a-4a98-8359-19cf91fc3ced/341615',
  },
  {
    quote: 'They were very reliable.',
    name: 'Anonymous',
    role: 'CEO, System Soft Technologies',
    initials: 'SS',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0?sort_by=date_desc#review-365839',
  },
  {
    quote: 'Working with them has been a good experience.',
    name: 'Anonymous',
    role: 'Executive, Healthcare Company',
    initials: 'HC',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0#review-178359',
  },
];

/** The two the design pulls onto the AI landing page. */
export const featuredTestimonials = testimonials.slice(0, 2);
