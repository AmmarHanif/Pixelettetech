/**
 * The four approved viewpoints, as real camera positions inside the office.
 *
 * THESE ARE POSITIONS IN A ROOM, NOT ROTATIONS OF A MODEL. The brief is explicit
 * that changing viewpoint must move the camera THROUGH the space rather than
 * spin the building in front of a fixed eye, so each entry is a place to stand
 * and a place to look, in metres, and the rig travels between them.
 *
 * EVERY ONE CARRIES A WRITTEN DESCRIPTION, and that is not documentation. A
 * WebGL canvas is opaque to a screen reader, so the active viewpoint's
 * description is rendered as text beside the canvas and announced when it
 * changes. Someone who never sees the scene still learns what the space is.
 *
 * The room runs x -9..+9 (windows on the left at x -9), z -7..+7 (entrance at
 * +z, back wall at -z), with a 2.9m ceiling. Eye height is 1.6m throughout
 * except the overview, which lifts to look across the whole plate.
 */

export type Viewpoint = {
  id: string;
  label: string;
  /** Where the visitor stands, in metres. */
  position: [number, number, number];
  /** What they are looking at. */
  target: [number, number, number];
  /** How far the camera may be turned from its default heading, in radians. */
  yawRange: number;
  pitchRange: number;
  /** Read out beside the canvas, and the accessible name of the scene. */
  description: string;
};

export const VIEWPOINTS: Viewpoint[] = [
  {
    id: 'entrance',
    label: 'Entrance',
    position: [0.4, 1.6, 6.1],
    target: [-0.6, 1.45, -2.5],
    yawRange: 0.5,
    pitchRange: 0.22,
    description:
      'Standing just inside the entrance, looking down the length of the floor. The glazed wall and the open desks are on the left, the glass meeting room sits ahead on the right, and the tea point is beyond it.',
  },
  {
    id: 'floor',
    label: 'Open floor',
    position: [-4.1, 1.6, 1.6],
    target: [-4.6, 1.4, -4],
    yawRange: 0.62,
    pitchRange: 0.24,
    description:
      'In among the desks on the open floor, beside the windows. Two bench runs face each other with task chairs, monitors and laptops, and daylight comes across them from the left.',
  },
  {
    id: 'meeting',
    label: 'Meeting area',
    position: [1.4, 1.6, 0.2],
    target: [4.6, 1.35, -3.4],
    yawRange: 0.55,
    pitchRange: 0.22,
    description:
      'At the entrance to the meeting room, looking through its glass partition. A table with six chairs sits inside, with a screen on the end wall and planting along the glass.',
  },
  {
    id: 'overview',
    label: 'Overview',
    /* INSIDE the room, not outside it. This first read [-1.2, 6.4, 10.2],
       which is 3m beyond the entrance wall at z=7 - so the camera sat outside
       the building looking in through a culled ceiling, which is a cutaway
       model rather than a viewpoint. High and back, but still in the room. */
    position: [-0.8, 2.62, 6.1],
    target: [0.4, 0.95, -3.2],
    yawRange: 0.34,
    pitchRange: 0.16,
    description:
      'Raised and pulled back, showing how the whole floor fits together: the window side and its desks on the left, circulation through the middle, the meeting room and tea point on the right.',
  },
];

export const DEFAULT_VIEWPOINT = VIEWPOINTS[0]!;
