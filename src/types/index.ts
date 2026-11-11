/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LanguageMode = 'vi' | 'bilingual' | 'en';

export type GradeClass =
  | '1/1' | '1/2' | '1/3' | '1/4' | '1/5' | '1/6' | '1/7' | '1/8' | '1/9' | '1/10'
  | '1/11' | '1/12' | '1/13' | '1/14' | '1/15' | '1/16' | '1/17' | '1/18' | '1/19' | '1/20'
  | '1/21' | '1/22' | '1/23' | '1/24' | '1/25' | '1/26';

export const ALL_CLASSES: GradeClass[] = [
  '1/1', '1/2', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8', '1/9', '1/10',
  '1/11', '1/12', '1/13', '1/14', '1/15', '1/16', '1/17', '1/18', '1/19', '1/20',
  '1/21', '1/22', '1/23', '1/24', '1/25', '1/26'
];

export interface StudentProfile {
  id: string; // Unique internal UUID
  fullName: string;
  className: GradeClass;
  avatar: string;
  createdAt: string;
  lastLoginAt: string;
  totalStars: number;
  badges: string[];
  collectedCarrots: number;
  collectedCups: number;
  collectedFish: number;
  collectedChests: number;
}

export interface ActivityRecord {
  id: string;
  studentId: string;
  type: 'lesson' | 'game' | 'daily' | 'review';
  targetId: string | number;
  targetName: string;
  topicId?: number;
  score: number;
  totalQuestions: number;
  starsEarned: number;
  timeSpentSeconds: number;
  completedAt: string;
  mistakes?: string[];
}

export interface LessonCertificate {
  id: string; // e.g. cert_${studentId}_${lessonId}
  studentId: string;
  studentName: string;
  className: string;
  lessonId: number;
  lessonTitle: string;
  completedAt: string; // ISO string
  formattedDate: string; // dd/mm/yyyy
  starCount: number; // 1 gold star awarded
}

export interface VocabItem {
  vi: string;
  en: string;
  ipa?: string;
  pronounce?: string;
  exampleVi: string;
  exampleEn: string;
  icon?: string;
  trickyNote?: string;
}

export type ExplorationType =
  | 'counting'
  | 'comparison'
  | 'partition_combine'
  | 'addition'
  | 'subtraction'
  | 'addition_subtraction_table'
  | '2d_shapes'
  | 'shape_assembly'
  | '3d_shapes'
  | 'spatial_orientation'
  | 'tens_ones_100'
  | 'compare_two_digit'
  | 'hundred_chart'
  | 'length_comparison'
  | 'ruler_measurement'
  | 'length_estimation'
  | 'two_digit_addition'
  | 'two_digit_subtraction'
  | 'clock_reading'
  | 'calendar_days'
  | 'calendar_practice'
  | 'comprehensive_review';

export interface LessonExplorationConfig {
  lessonId: number;
  lessonTitle: string;
  textbookVolume: 1 | 2;
  textbookPage: number;
  learningObjective: string;
  explorationType: ExplorationType;
  sceneDescription: string;
  robotIntroductionVi: string;
  guidingQuestionsVi: string;
  guidingQuestionsEn: string;
  interactionType:
    | 'tap_count'
    | 'pair_matching'
    | 'number_compare'
    | 'drag_split_merge'
    | 'add_combine'
    | 'remove_subtract'
    | 'pick_2d_shape'
    | 'tangram_assembly'
    | 'inspect_3d_solids'
    | 'spatial_grid_placement'
    | 'tens_ones_bundle'
    | 'ruler_measure_slider'
    | 'compare_length_bars'
    | 'interactive_clock'
    | 'weekly_calendar_pick'
    | 'two_digit_abacus'
    | 'hundred_chart_explore'
    | 'review_quest_board';
  illustrationData: any;
  correctResult: any;
  explanationVi: string;
  vocabularyEn: { en: string; vi: string; ipa?: string }[];
  sourceVerificationStatus: 'verified' | 'unverified';
}

export type VisualObjectType =
  | 'apple'
  | 'orange'
  | 'fish'
  | 'dolphin'
  | 'duck'
  | 'flower'
  | 'flower_red'
  | 'flower_yellow'
  | 'pencil'
  | 'crayon'
  | 'ball'
  | 'ball_red'
  | 'ball_blue'
  | 'cat'
  | 'bird'
  | 'carrot'
  | 'candy'
  | 'star'
  | 'car'
  | 'bus'
  | 'rabbit'
  | 'chick'
  | 'cube'
  | 'balloon';

export interface VisualItemConfig {
  mode:
    | 'count'
    | 'addition'
    | 'subtraction'
    | 'compare'
    | 'shape'
    | 'ruler'
    | 'clock'
    | 'calendar'
    | 'tens-ones'
    | 'equation'
    | 'traffic-sign'
    | 'traffic-light'
    | 'picture-frame';
  itemType?: VisualObjectType;
  count?: number;
  groupA?: { count: number; itemType?: VisualObjectType; labelVi?: string; labelEn?: string; color?: string };
  groupB?: { count: number; itemType?: VisualObjectType; labelVi?: string; labelEn?: string; color?: string };
  initialCount?: number;
  removedCount?: number;
  compareA?: { count: number; nameVi: string; itemType?: VisualObjectType };
  compareB?: { count: number; nameVi: string; itemType?: VisualObjectType };
  shapeType?: 'circle' | 'square' | 'triangle' | 'rectangle' | 'cube' | 'cuboid';
  frameShape?: 'square' | 'rectangle';
  signType?: 'warning_triangle' | 'prohibition_circle' | 'guide_square' | 'guide_rectangle' | 'pedestrian-crossing' | 'no-entry';
  lengthCm?: number;
  startCm?: number;
  objectName?: string;
  hour?: number;
  minute?: number;
  dayOfWeek?: string;
  tens?: number;
  ones?: number;
  equationText?: string;
  equation?: { left: string | number; op: string; right: string | number; label?: string };
}

export interface Question {
  id: string;
  type: 'fill' | 'choice' | 'compare' | 'count' | 'match' | 'shape';
  promptVi: string;
  promptEn: string;
  hintVi: string;
  hintEn: string;
  visualType?: 'apples' | 'fish' | 'cars' | 'cubes' | 'shapes' | 'clock' | 'ruler' | 'number-line';
  visualCount?: number;
  visualData?: any;
  visualConfig?: VisualItemConfig;
  options?: (string | number)[];
  answer: string | number;
  explanationVi: string;
  explanationEn: string;
}

export interface Lesson {
  id: number;
  volume: 1 | 2;
  topicId: number;
  topicName: string;
  title: string;
  enTitle: string;
  summary: string;
  enSummary: string;
  vocab: VocabItem[];
  exploreConcept: {
    headingVi: string;
    headingEn: string;
    descriptionVi: string;
    descriptionEn: string;
    interactiveType: 'counter' | 'comparator' | 'shape-shelf' | 'clock' | 'ruler' | 'tens-ones' | 'addition-bar';
    defaultData: any;
  };
  robotGuide: {
    tipVi: string;
    tipEn: string;
    keyPoints: string[];
  };
  sampleQuestions: Question[];
  recommendedGameId: string;
}

export interface Topic {
  id: number;
  volume: 1 | 2;
  name: string;
  enName: string;
  description: string;
  enDescription: string;
  icon: string;
  color: string;
  bgGradient: string;
  lessonIds: number[];
}

export interface GameMetadata {
  id: string;
  categoryId?: string;
  nameVi: string;
  nameEn: string;
  taglineVi: string;
  taglineEn: string;
  icon: string;
  themeColor: string;
  bgGradient: string;
  storyVi: string;
  storyEn: string;
  instructionsVi: string;
  instructionsEn: string;
  rewardType: 'carrot' | 'trophy' | 'fish' | 'key' | 'star' | 'badge' | 'rocket';
  badgeName: string;
  relatedTopicIds: number[];
  imageSrc?: string;
}

export interface AudioSettings {
  sfxEnabled: boolean;
  speechEnabled: boolean;
  bgmEnabled: boolean;
  volume: number; // 0 to 1
  selectedEnVoiceURI?: string;
  selectedViVoiceURI?: string;
  speechRate?: number; // 0.7 to 1.2, default 0.88 for children
  speechPitch?: number; // default 1.05
}
