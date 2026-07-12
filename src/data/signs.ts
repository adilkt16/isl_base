export type Sign = {
  id: string;
  label: string;
  category: 'alphabet' | 'number';
  mediaType: 'video' | 'image-sequence' | 'placeholder';
  mediaSrc: string | null; // null = placeholder, clearly marked
  description: string;
  usageNote?: string;
};

export const ALPHABET_SIGNS: Sign[] = [
  {
    id: 'a',
    label: 'A',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify if this matches standard ISL for A, as the data shows two closed fists.
    description: 'Both hands closed into fists.',
    usageNote: 'Currently renders as a two-handed closed fist shape in the data, which may deviate from traditional ISL vowel fingerspelling.'
  },
  {
    id: 'b',
    label: 'B',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify if the semi-bent loops match standard ISL loops.
    description: 'Both hands form open circles (O-shapes) with the fingers and thumbs, touching at the tips of the fingers/thumbs, resembling a double loop or "8" held horizontally.',
    usageNote: 'This is a symmetric two-handed sign. Keep the circles clearly defined so it does not get confused with the sign for D.'
  },
  {
    id: 'c',
    label: 'C',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (right-hand C shape on flat left palm) in the data.
    description: 'One-handed sign where the right hand index finger and thumb form a curved C-shape, with other fingers closed.',
    usageNote: 'Currently renders as a single-handed C shape in the data.'
  },
  {
    id: 'd',
    label: 'D',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify the alignment of the two hands to form the D loop.
    description: 'The left index finger is extended straight up. The right hand index and thumb form a curved C-shape that touches the left index finger at the tip and base to form a closed D-loop.',
    usageNote: 'Be careful to touch the right thumb to the base of the left index, and the right index to the top of the left index. Do not reverse this.'
  },
  {
    id: 'e',
    label: 'E',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify index finger touching for E vowel.
    description: 'The right index finger touches the tip of the left index finger.',
    usageNote: 'All five vowels (A, E, I, O, U) in ISL involve touching a specific finger of the left hand. For E, it is the index finger.'
  },
  {
    id: 'f',
    label: 'F',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify grid/cross alignment for F.
    description: 'The left hand index and middle fingers are extended horizontally. The right hand index and middle fingers are placed across them vertically at right angles, forming a grid/cross pattern.',
    usageNote: 'Keep the knuckles close together to form a neat overlapping hashtag-like shape.'
  },
  {
    id: 'g',
    label: 'G',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify fist stacking for G.
    description: 'Both hands are closed into fists. The right fist is placed vertically on top of the left fist.',
    usageNote: 'Maintain a vertical stack. This resembles grinding or stacking blocks.'
  },
  {
    id: 'h',
    label: 'H',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify sweeping motion for H.
    description: 'The left hand palm is open and flat, facing up. The right hand palm is swept horizontally across the left hand palm from the heel to the fingertips.',
    usageNote: 'This is a clean brushing motion. Keep the movement smooth and deliberate.'
  },
  {
    id: 'i',
    label: 'I',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (right index touching left middle) instead of a single extended index finger.
    description: 'One-handed sign with the index finger extended straight up, and other fingers closed.',
    usageNote: 'Currently renders as a single extended index finger in the data, rather than the traditional two-handed vowel touch.'
  },
  {
    id: 'j',
    label: 'J',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify drawing movement of J on flat palm.
    description: 'The right index finger starts at the tip of the left middle finger and draws a J-like hook downward across the left palm.',
    usageNote: 'Start at the middle finger tip (the "I" position) and then trace the hook shape downward.'
  },
  {
    id: 'k',
    label: 'K',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify diagonal contact for K.
    description: 'The left index finger is held straight up. The right index finger is bent at the middle joint and touches the middle of the left index finger, representing the diagonal arm of the letter K.',
    usageNote: 'The right hand index finger acts like the diagonal legs of K, meeting the vertical left finger.'
  },
  {
    id: 'l',
    label: 'L',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (left L-shape + right index touching) instead of a single hand L-shape.
    description: 'One-handed sign where the thumb and index finger are extended at right angles to form an L-shape, with other fingers closed.',
    usageNote: 'Currently renders as a single hand forming an L-shape in the data.'
  },
  {
    id: 'm',
    label: 'M',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify three flat fingers on palm.
    description: 'The right hand index, middle, and ring fingers are placed flat on the open palm of the left hand.',
    usageNote: 'Think of the three fingers representing the three vertical legs of the letter M.'
  },
  {
    id: 'n',
    label: 'N',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify two flat fingers on palm.
    description: 'The right hand index and middle fingers are placed flat on the open palm of the left hand.',
    usageNote: 'Think of the two fingers representing the two vertical legs of the letter N. Contrasts directly with M.'
  },
  {
    id: 'o',
    label: 'O',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (right index touching left ring) instead of a single hand O-shape.
    description: 'One-handed sign where all fingers and thumb curve to form a closed circle or O-shape.',
    usageNote: 'Currently renders as a single-handed O-shape in the data, deviating from the traditional vowel fingerspelling.'
  },
  {
    id: 'p',
    label: 'P',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify P shape circle and stem.
    description: 'The left index finger and thumb form an upright vertical line. The right index finger and thumb form a loop that touches the top half of the left index finger.',
    usageNote: 'This forms the visual shape of a P. The right hand creates the circular loop, the left hand is the stem.'
  },
  {
    id: 'q',
    label: 'Q',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify hook tail into circle for Q.
    description: 'The left hand index finger and thumb form a circle (O-shape). The right index finger hooks into the circle from below.',
    usageNote: 'The right finger represents the tail of the letter Q, coming out from the bottom of the circle.'
  },
  {
    id: 'r',
    label: 'R',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify hook on palm for R.
    description: 'The right index finger is curved into a hook (like a small "r") and placed upright in the center of the left open palm.',
    usageNote: 'Make sure the hook is clearly curved and resting flat on the palm surface.'
  },
  {
    id: 's',
    label: 'S',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a right index hooking left pinky finger instead of both pinkies extended/hooked.
    description: 'A two-handed sign where both hands have the pinky fingers extended, with other fingers closed.',
    usageNote: 'Currently renders as two hands with extended pinky fingers in the data.'
  },
  {
    id: 't',
    label: 'T',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be the right index pointing to the bottom edge of the open left palm instead of both index fingers extended.
    description: 'A two-handed sign where both hands have the index fingers extended, with other fingers closed.',
    usageNote: 'Currently renders as two hands with extended index fingers in the data.'
  },
  {
    id: 'u',
    label: 'U',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (right index touching left pinky) instead of a single hand with partially curled fingers.
    description: 'One-handed sign with all fingers and thumb curved and partially extended.',
    usageNote: 'Currently renders as a single hand with partially curled/extended fingers in the data.'
  },
  {
    id: 'v',
    label: 'V',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (V-shape in flat left palm) instead of a single hand V-shape.
    description: 'One-handed sign with the index and middle fingers extended in a V-shape, and other fingers closed.',
    usageNote: 'Currently renders as a single-handed V-shape in the data.'
  },
  {
    id: 'w',
    label: 'W',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify interlocked fingers for W.
    description: 'Both hands are open. The fingers of both hands are interlocked at diagonal angles, pointing upward and outward to form a W shape.',
    usageNote: 'Interlock the fingers slightly at the knuckles. Keep the palms facing you.'
  },
  {
    id: 'x',
    label: 'X',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify index fingers crossing for X.
    description: 'Both index fingers are extended and crossed over each other to form a perfect X shape.',
    usageNote: 'Keep other fingers closed. The crossing point should be around the middle of both index fingers.'
  },
  {
    id: 'y',
    label: 'Y',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be right index placed in the webbing of left open hand instead of two hands with index fingers extended.
    description: 'A two-handed sign where both hands have the index fingers extended, with other fingers closed.',
    usageNote: 'Currently renders as two hands with extended index fingers in the data.'
  },
  {
    id: 'z',
    label: 'Z',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify drawing of Z shape on flat open palm.
    description: 'The right index finger draws a Z shape in the air, or draws a Z directly on the flat open palm of the left hand.',
    usageNote: 'Drawing it on the left palm is the standard Indian fingerspelling variant and is highly legible.'
  }
];

export const NUMBER_SIGNS: Sign[] = [
  {
    id: '0',
    label: '0',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Replace placeholder flat open hand with a closed circle (O-shape) when real joint angles are calibrated.
    description: 'A flat open hand (placeholder pose in the data).',
    usageNote: 'In ISL, a zero is signed by forming a closed circle with all fingers meeting the thumb.'
  },
  {
    id: '1',
    label: '1',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify finger-count 1 representation.
    description: 'The right index finger is raised straight up, palm facing outward, other fingers folded.',
    usageNote: 'Keep the hand still. The palm faces forward (away from the signer).'
  },
  {
    id: '2',
    label: '2',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify finger-count 2 representation.
    description: 'The right index and middle fingers are raised straight up in a V-shape, palm facing outward.',
    usageNote: 'Ensure the two fingers are clearly separated and visible.'
  },
  {
    id: '3',
    label: '3',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify finger-count 3 representation.
    description: 'The right index, middle, and ring fingers are raised straight up, palm facing outward.',
    usageNote: 'Keep the pinky and thumb tucked together.'
  },
  {
    id: '4',
    label: '4',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify finger-count 4 representation.
    description: 'The right four fingers (index, middle, ring, pinky) are raised straight up, palm facing outward, thumb folded in.',
    usageNote: 'All four fingers should be held together and straight.'
  },
  {
    id: '5',
    label: '5',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify finger-count 5 representation.
    description: 'The right hand is fully open, showing all five fingers extended and spread apart, palm facing outward.',
    usageNote: 'The standard sign for five. Make sure it is wide open.'
  },
  {
    id: '6',
    label: '6',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (5 fingers open + right index touching) and calibrate joint angles.
    description: 'A flat open hand (placeholder pose in the data).',
    usageNote: 'In ISL, 6 is signed by touching the right index finger to the center of the open left palm (5 + 1).'
  },
  {
    id: '7',
    label: '7',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (5 fingers open + right index and middle touching) and calibrate joint angles.
    description: 'A flat open hand (placeholder pose in the data).',
    usageNote: 'In ISL, 7 is signed by touching two right fingers (index/middle) to the center of the open left palm (5 + 2).'
  },
  {
    id: '8',
    label: '8',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (5 fingers open + right three fingers touching) and calibrate joint angles.
    description: 'A flat open hand (placeholder pose in the data).',
    usageNote: 'In ISL, 8 is signed by touching three right fingers (index/middle/ring) to the center of the open left palm (5 + 3).'
  },
  {
    id: '9',
    label: '9',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Check if this should be a two-handed sign (5 fingers open + right four fingers touching) and calibrate joint angles.
    description: 'A flat open hand (placeholder pose in the data).',
    usageNote: 'In ISL, 9 is signed by touching four right fingers to the center of the open left palm (5 + 4).'
  },
  {
    id: '10',
    label: '10',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify dynamic transition from 1 to 0.
    description: 'Sign the number 1, then immediately sign the number 0 in a quick fluid transition.',
    usageNote: 'Move the hand slightly to the right as you transition to represent decimal place progression.'
  },
  {
    id: '20',
    label: '20',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify dynamic transition from 2 to 0.
    description: 'Sign the number 2, then immediately sign the number 0 in a quick fluid transition.',
    usageNote: 'Common double-digit numbers are signed by chaining single digits in sequence.'
  },
  {
    id: '50',
    label: '50',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify dynamic transition from 5 to 0.
    description: 'Sign the number 5, then immediately sign the number 0 in a quick fluid transition.',
    usageNote: 'Chaining digits in sequence is the standard way to represent larger numbers in ISL fingerspelling.'
  },
  {
    id: '99',
    label: '99',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    // TODO: Verify dynamic transition from 9 to 9.
    description: 'Sign the number 9, then immediately sign the number 9 again in a quick fluid transition.',
    usageNote: 'Slide the hand slightly to the side between the two digits to show there are two separate counts of nine.'
  }
];

export const ALL_SIGNS: Sign[] = [...ALPHABET_SIGNS, ...NUMBER_SIGNS];
