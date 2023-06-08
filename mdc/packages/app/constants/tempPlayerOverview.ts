import { PRACTICE_TYPE } from '@ankora/models';
import dayjs from 'dayjs';

export const tempObjectives = [
  {
    id: '1',
    title: 'Focus',
    type: PRACTICE_TYPE.MENTAL,
    description: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit.',
    duration: '2 weeks',
    progress: '12%',
    endsAt: dayjs(),
  },
  {
    id: '2',
    title: 'Improve footwork',
    type: PRACTICE_TYPE.FITNESS,
    description: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit.',
    duration: '2 weeks',
    progress: '24%',
    endsAt: dayjs(),
  },
  {
    id: '3',
    title: 'Shoulder exercises',
    type: PRACTICE_TYPE.PHYSIO,
    description: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit.',
    duration: '2 weeks',
    progress: '25%',
    endsAt: dayjs(),
  },
  {
    id: '4',
    title: 'Practice serve v1',
    type: PRACTICE_TYPE.TENNIS,
    description:
      'Practice serve for 45 minutes a day every morning to improve second serve. Goal is to be able to hit 10 kick serves in a row in 3 weeks.',
    duration: '2 weeks',
    progress: '36%',
    endsAt: dayjs(),
  },
  {
    id: '5',
    title: 'Focus v2',
    type: PRACTICE_TYPE.MENTAL,
    description: 'Gorem ipsum dolor sit amet, consectetur adipiscing elit.',
    duration: '2 weeks',
    progress: '55%',
    endsAt: dayjs(),
  },
  {
    id: '6',
    title: 'Practice serve v2',
    type: PRACTICE_TYPE.TENNIS,
    description:
      'Practice serve for 45 minutes a day every morning to improve second serve. Goal is to be able to hit 10 kick serves in a row in 3 weeks.',
    duration: '2 weeks',
    progress: '76%',
    endsAt: dayjs(),
  },
  {
    id: '7',
    title: 'Practice serve v3',
    type: PRACTICE_TYPE.TENNIS,
    description:
      'Practice serve for 45 minutes a day every morning to improve second serve. Goal is to be able to hit 10 kick serves in a row in 3 weeks.',
    duration: '2 weeks',
    progress: '100%',
    endsAt: dayjs(),
  },
];

export enum ASSESSMENT_STATUS {
  FEEDBACK = 'Waiting for feedback',
  REVIEW = 'Ready for review',
  COMPLETED = 'Completed',
}

export const tempAssessments = [
  {
    id: '1',
    title: 'Assessment #1',
    description: 'Robert vs Rune match assessment',
    status: ASSESSMENT_STATUS.FEEDBACK,
    created: dayjs(),
  },
  {
    id: '2',
    title: 'Assessment #2',
    description: 'Robert vs Rune match assessment',
    status: ASSESSMENT_STATUS.REVIEW,
    created: dayjs(),
  },
  {
    id: '3',
    title: 'Assessment #3',
    description: 'Robert vs Rune match assessment',
    status: ASSESSMENT_STATUS.COMPLETED,
    created: dayjs(),
  },
  {
    id: '4',
    title: 'Assessment #4',
    description: 'Robert vs Rune match assessment',
    status: ASSESSMENT_STATUS.COMPLETED,
    created: dayjs(),
  },
  {
    id: '5',
    title: 'Assessment #5',
    description: 'Robert vs Rune match assessment',
    status: ASSESSMENT_STATUS.REVIEW,
    created: dayjs(),
  },
  {
    id: '6',
    title: 'Assessment #6',
    description: 'Robert vs Rune match assessment',
    status: ASSESSMENT_STATUS.FEEDBACK,
    created: dayjs(),
  },
];

export enum QUESTION_TYPE {
  TEXT = 'TEXT',
  RADIO = 'RADIO',
  SLIDER = 'SLIDER',
  RICH_TEXT = 'RICH_TEXT',
  NUMBER = 'NUMBER',
}

export const tempAssessmentQuestionary = {
  title: 'Robert Assessment',
  description: 'Match assessment for last Robert’s match',
  notes:
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
  questionary: {
    status: ASSESSMENT_STATUS.COMPLETED,
    id: '00000000-0000-1000-c000-100000000000',
    organizationId: '00000000-0000-1000-o000-000000000000',
    questions: [
      {
        slug: '1',
        question: 'Did I respect this my pre-match goals?',
        type: QUESTION_TYPE.RADIO,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
        order: 1,
        isMandatory: true,
        role: 'player',
      },
      {
        slug: '2',
        question: 'How well did I respect my pre-match goals?',
        type: QUESTION_TYPE.SLIDER,
        options: [
          { value: 0, label: '0' },
          { value: 25, label: '25' },
          { value: 50, label: '5' },
          { value: 75, label: '75' },
          { value: 100, label: '100' },
        ],
        order: 2,
        isMandatory: true,
        role: 'player',
      },
      {
        slug: '3',
        question: 'Why?',
        type: QUESTION_TYPE.RICH_TEXT,
        order: 3,
        isMandatory: true,
        role: 'player',
      },
      {
        slug: '4',
        question: 'Why Did I Win/ Lose?',
        type: QUESTION_TYPE.RICH_TEXT,
        order: 4,
        isMandatory: true,
        role: 'player',
      },
      {
        slug: '5',
        question:
          'If I play the same player tomorrow what would I do differently?',
        type: QUESTION_TYPE.RICH_TEXT,
        order: 5,
        isMandatory: true,
        role: 'player',
      },

      {
        slug: '6',
        question: 'Did my player respect this pre-match goal?',
        type: QUESTION_TYPE.RADIO,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
        order: 1,
        isMandatory: true,
        role: 'coach',
      },
      {
        slug: '7',
        question: 'How well did my player respect this pre-match goal?',
        type: QUESTION_TYPE.SLIDER,
        options: [
          { value: 0, label: '0' },
          { value: 25, label: '25' },
          { value: 50, label: '50' },
          { value: 75, label: '75' },
          { value: 100, label: '100' },
        ],
        order: 1,
        isMandatory: true,
        role: 'coach',
      },
      {
        slug: '8',
        question: 'Why did my player lose?',
        type: QUESTION_TYPE.RICH_TEXT,
        order: 1,
        isMandatory: true,
        role: 'coach',
      },
      {
        slug: '9',
        question: 'Before the match',
        type: QUESTION_TYPE.RICH_TEXT,
        order: 1,
        isMandatory: true,
        role: 'coach',
        title: 'As a coach, what could I have done to help the player win?',
      },
      {
        slug: '10',
        question: 'During the match',
        type: QUESTION_TYPE.RICH_TEXT,
        order: 1,
        isMandatory: true,
        role: 'coach',
      },
      {
        slug: '11',
        question: 'In my pre match briefing, what helped the player win?',
        type: QUESTION_TYPE.RICH_TEXT,
        order: 1,
        isMandatory: true,
        role: 'coach',
      },
    ],
  },
  answers: [
    {
      answer: 'Yes!',
      questionSlug: '1',
    },
    {
      answer: '100',
      questionSlug: '2',
    },
    {
      answer:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      questionSlug: '3',
    },
    {
      answer:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      questionSlug: '4',
    },
    {
      answer:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      questionSlug: '5',
    },
    {
      answer: 'No!',
      questionSlug: '6',
    },
    {
      answer: '100',
      questionSlug: '7',
    },
    {
      answer:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      questionSlug: '8',
    },
    {
      answer:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      questionSlug: '9',
    },
    {
      answer:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      questionSlug: '10',
    },
    {
      answer:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
      questionSlug: '11',
    },
  ],
};
