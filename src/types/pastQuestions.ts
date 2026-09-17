// Drafthands Past Questions Hub Types - WAEC (WASSCE), NECO, NABTEB (2016-2026)
import React from 'react';

export type ExamBody = 'WAEC' | 'NECO' | 'NABTEB';

export type PaperType = 'PAPER_1' | 'PAPER_2' | 'PAPER_3';

export interface MCQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  diagramSvg?: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  isoStandardRef: string;
  topicCategory: string;
  isFreePreview: boolean;
}

export interface ConstructionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  pencilGrade: string; // e.g. "3H/2H (Continuous Thin)" or "HB (Continuous Thick)"
  lineTypeISO: string; // e.g. "ISO 128 Type B (0.25mm)"
  compassSetting?: string;
  markAllocation?: string; // e.g. "2 Marks for locus arcs"
  svgElements: React.ReactNode;
}

export interface TheoryQuestion {
  id: string;
  questionNumber: number;
  title: string;
  description: string;
  category: 'GEOMETRIC' | 'ORTHOGRAPHIC' | 'DEVELOPMENTS' | 'BUILDING' | 'MECHANICAL';
  totalMarks: number;
  givenData: string[];
  steps: ConstructionStep[];
  markingSchemeNotes: string[];
  isFreePreview: boolean;
}

export interface PastPaperItem {
  id: string;
  examBody: ExamBody;
  year: number;
  paperType: PaperType;
  title: string;
  subTitle: string;
  durationMinutes: number;
  totalQuestions: number;
  mcqs?: MCQuestion[];
  theoryQuestions?: TheoryQuestion[];
}
