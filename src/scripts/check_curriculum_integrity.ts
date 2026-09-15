import fs from 'fs';
import { allCurriculumTopics } from '../data/curriculumData.ts';
import { resolveCurriculumDomainKey, getTextbookChapterForTopic } from '../data/textbookData.ts';
import { getAuthenticTextbookDiagram } from '../data/authenticTextbookDiagrams.ts';

console.log(`Checking all ${allCurriculumTopics.length} topics...`);

let issues = [];

for (const topic of allCurriculumTopics) {
  const domainKey = resolveCurriculumDomainKey(topic);
  const chapter = getTextbookChapterForTopic(topic);
  let steps = [];
  try {
    const params = topic.parameters?.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue }), {}) || {};
    steps = topic.generateSteps(params);
  } catch (err) {
    issues.push(`Topic ${topic.id}: generateSteps threw error: ${err.message}`);
  }

  // Check if domainKey resolves
  if (!domainKey) {
    issues.push(`Topic ${topic.id}: No domainKey resolved`);
  }

  // Check if steps generate properly
  if (!steps || steps.length === 0) {
    issues.push(`Topic ${topic.id}: No steps generated`);
  } else {
    // Check if steps have elements
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      if (!s.elements || s.elements.length === 0) {
        issues.push(`Topic ${topic.id}: Step ${i + 1} (${s.title}) has 0 elements!`);
      }
    }
  }

  // Check figures in chapter
  if (!chapter.figures || chapter.figures.length === 0) {
    issues.push(`Topic ${topic.id}: No figures in chapter`);
  } else {
    for (const fig of chapter.figures) {
      const diagData = getAuthenticTextbookDiagram({
        topicId: topic.id,
        topicTitle: topic.title,
        figureTitle: fig.title,
        svgType: fig.svgType,
        figureNumber: fig.figureNumber
      });
      if (!diagData) {
        issues.push(`Topic ${topic.id}: Diagram for svgType "${fig.svgType}" not found!`);
      } else if (!diagData.elements || diagData.elements.length === 0) {
        issues.push(`Topic ${topic.id}: Diagram for svgType "${fig.svgType}" has 0 elements!`);
      }
    }
  }
}

console.log(`Finished check. Found ${issues.length} issues.`);
if (issues.length > 0) {
  console.log(issues.slice(0, 50).join('\n'));
} else {
  console.log('ALL TOPICS, STEPS, AND DIAGRAMS VALIDATED 100% SUCCESSFULLY!');
}

