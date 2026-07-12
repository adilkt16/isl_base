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
    description: 'The tip of the right index finger touches the tip of the left thumb. Both palms face the viewer.',
    usageNote: 'Ensure your remaining left fingers are closed in a loose fist, while the right hand remains open to keep the focus on the connection point.'
  },
  {
    id: 'b',
    label: 'B',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'Both hands form open circles (O-shapes) with the fingers and thumbs, touching at the tips of the fingers/thumbs, resembling a double loop or "8" held horizontally.',
    usageNote: 'This is a symmetric two-handed sign. Keep the circles clearly defined so it does not get confused with the sign for D.'
  },
  {
    id: 'c',
    label: 'C',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right hand index finger and thumb form a curved C-shape. The left hand can act as a flat supporting base underneath it.',
    usageNote: 'Unlike ASL where C is strictly one-handed, in ISL, placing the right-hand C shape slightly above or on the flat left palm is common for stability and clarity.'
  },
  {
    id: 'd',
    label: 'D',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left index finger is extended straight up. The right hand index and thumb form a curved C-shape that touches the left index finger at the tip and base to form a closed D-loop.',
    usageNote: 'Be careful to touch the right thumb to the base of the left index, and the right index to the top of the left index. Do not reverse this.'
  },
  {
    id: 'e',
    label: 'E',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger touches the tip of the left index finger.',
    usageNote: 'All five vowels (A, E, I, O, U) in ISL involve touching a specific finger of the left hand. For E, it is the index finger.'
  },
  {
    id: 'f',
    label: 'F',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left hand index and middle fingers are extended horizontally. The right hand index and middle fingers are placed across them vertically at right angles, forming a grid/cross pattern.',
    usageNote: 'Keep the knuckles close together to form a neat overlapping hashtag-like shape.'
  },
  {
    id: 'g',
    label: 'G',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'Both hands are closed into fists. The right fist is placed vertically on top of the left fist.',
    usageNote: 'Maintain a vertical stack. This resembles grinding or stacking blocks.'
  },
  {
    id: 'h',
    label: 'H',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left hand palm is open and flat, facing up. The right hand palm is swept horizontally across the left hand palm from the heel to the fingertips.',
    usageNote: 'This is a clean brushing motion. Keep the movement smooth and deliberate.'
  },
  {
    id: 'i',
    label: 'I',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger touches the tip of the left middle finger.',
    usageNote: 'This is the second vowel sign. Make sure to touch the middle finger, not the index or ring finger.'
  },
  {
    id: 'j',
    label: 'J',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger starts at the tip of the left middle finger and draws a J-like hook downward across the left palm.',
    usageNote: 'Start at the middle finger tip (the "I" position) and then trace the hook shape downward.'
  },
  {
    id: 'k',
    label: 'K',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left index finger is held straight up. The right index finger is bent at the middle joint and touches the middle of the left index finger, representing the diagonal arm of the letter K.',
    usageNote: 'The right hand index finger acts like the diagonal legs of K, meeting the vertical left finger.'
  },
  {
    id: 'l',
    label: 'L',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left index finger and thumb form an upright L-shape. The right index finger is placed horizontally, touching the corner of the left L.',
    usageNote: 'Keep the left hand steady. The right index finger highlights the angle of the L.'
  },
  {
    id: 'm',
    label: 'M',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right hand index, middle, and ring fingers are placed flat on the open palm of the left hand.',
    usageNote: 'Think of the three fingers representing the three vertical legs of the letter M.'
  },
  {
    id: 'n',
    label: 'N',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right hand index and middle fingers are placed flat on the open palm of the left hand.',
    usageNote: 'Think of the two fingers representing the two vertical legs of the letter N. Contrasts directly with M.'
  },
  {
    id: 'o',
    label: 'O',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger touches the tip of the left ring finger.',
    usageNote: 'This is the third vowel sign, corresponding to the fourth finger (ring finger) of the left hand.'
  },
  {
    id: 'p',
    label: 'P',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left index finger and thumb form an upright vertical line. The right index finger and thumb form a loop that touches the top half of the left index finger.',
    usageNote: 'This forms the visual shape of a P. The right hand creates the circular loop, the left hand is the stem.'
  },
  {
    id: 'q',
    label: 'Q',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left hand index finger and thumb form a circle (O-shape). The right index finger hooks into the circle from below.',
    usageNote: 'The right finger represents the tail of the letter Q, coming out from the bottom of the circle.'
  },
  {
    id: 'r',
    label: 'R',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger is curved into a hook (like a small "r") and placed upright in the center of the left open palm.',
    usageNote: 'Make sure the hook is clearly curved and resting flat on the palm surface.'
  },
  {
    id: 's',
    label: 'S',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger hooks around the left pinky finger.',
    usageNote: 'Lock or loop the right index finger onto the left pinky, keeping other fingers tucked in a fist.'
  },
  {
    id: 't',
    label: 'T',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left hand is held open. The right index finger points horizontally to the bottom edge of the left hand palm (near the wrist).',
    usageNote: 'This forms the bottom stem/crossbar shape visually.'
  },
  {
    id: 'u',
    label: 'U',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger touches the tip of the left pinky finger.',
    usageNote: 'This is the fourth vowel sign, corresponding to the fifth finger (pinky) of the left hand.'
  },
  {
    id: 'v',
    label: 'V',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right hand index and middle fingers form a V-shape and are placed flat in the center of the left open palm.',
    usageNote: 'Keep the fingers spread in a clean V-shape. This rests in the left palm.'
  },
  {
    id: 'w',
    label: 'W',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'Both hands are open. The fingers of both hands are interlocked at diagonal angles, pointing upward and outward to form a W shape.',
    usageNote: 'Interlock the fingers slightly at the knuckles. Keep the palms facing you.'
  },
  {
    id: 'x',
    label: 'X',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'Both index fingers are extended and crossed over each other to form a perfect X shape.',
    usageNote: 'Keep other fingers closed. The crossing point should be around the middle of both index fingers.'
  },
  {
    id: 'y',
    label: 'Y',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger is placed in the V-shaped webbing between the thumb and index finger of the left open hand.',
    usageNote: 'The left hand should have fingers together and thumb extended, and the right index finger presses into that junction.'
  },
  {
    id: 'z',
    label: 'Z',
    category: 'alphabet',
    mediaType: 'placeholder',
    mediaSrc: null,
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
    description: 'The right hand forms a closed circle (O-shape) with all five fingers curving to meet the thumb.',
    usageNote: 'Hold it steady in front of your chest. This represents a zero.'
  },
  {
    id: '1',
    label: '1',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index finger is raised straight up, palm facing outward, other fingers folded.',
    usageNote: 'Keep the hand still. The palm faces forward (away from the signer).'
  },
  {
    id: '2',
    label: '2',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index and middle fingers are raised straight up in a V-shape, palm facing outward.',
    usageNote: 'Ensure the two fingers are clearly separated and visible.'
  },
  {
    id: '3',
    label: '3',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right index, middle, and ring fingers are raised straight up, palm facing outward.',
    usageNote: 'Keep the pinky and thumb tucked together.'
  },
  {
    id: '4',
    label: '4',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right four fingers (index, middle, ring, pinky) are raised straight up, palm facing outward, thumb folded in.',
    usageNote: 'All four fingers should be held together and straight.'
  },
  {
    id: '5',
    label: '5',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The right hand is fully open, showing all five fingers extended and spread apart, palm facing outward.',
    usageNote: 'The standard sign for five. Make sure it is wide open.'
  },
  {
    id: '6',
    label: '6',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left hand is fully open showing 5 fingers. The right index finger touches the center of the left palm.',
    usageNote: 'In ISL, numbers 6 to 9 are signed by combining the base of 5 (left hand) with additional fingers on the right hand.'
  },
  {
    id: '7',
    label: '7',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left hand is fully open showing 5 fingers. The right index and middle fingers (2 fingers) touch the left palm.',
    usageNote: 'Think of it as 5 + 2 = 7.'
  },
  {
    id: '8',
    label: '8',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left hand is fully open showing 5 fingers. The right index, middle, and ring fingers (3 fingers) touch the left palm.',
    usageNote: 'Think of it as 5 + 3 = 8.'
  },
  {
    id: '9',
    label: '9',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'The left hand is fully open showing 5 fingers. The right four fingers touch the left palm.',
    usageNote: 'Think of it as 5 + 4 = 9.'
  },
  {
    id: '10',
    label: '10',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'Sign the number 1, then immediately sign the number 0 in a quick fluid transition.',
    usageNote: 'Move the hand slightly to the right as you transition to represent decimal place progression.'
  },
  {
    id: '20',
    label: '20',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'Sign the number 2, then immediately sign the number 0 in a quick fluid transition.',
    usageNote: 'Common double-digit numbers are signed by chaining single digits in sequence.'
  },
  {
    id: '50',
    label: '50',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'Sign the number 5, then immediately sign the number 0 in a quick fluid transition.',
    usageNote: 'Chaining digits in sequence is the standard way to represent larger numbers in ISL fingerspelling.'
  },
  {
    id: '99',
    label: '99',
    category: 'number',
    mediaType: 'placeholder',
    mediaSrc: null,
    description: 'Sign the number 9, then immediately sign the number 9 again in a quick fluid transition.',
    usageNote: 'Slide the hand slightly to the side between the two digits to show there are two separate counts of nine.'
  }
];

export const ALL_SIGNS: Sign[] = [...ALPHABET_SIGNS, ...NUMBER_SIGNS];
