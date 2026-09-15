import { allCurriculumTopics } from '../data/curriculumData.ts';
import { resolveCurriculumDomainKey, getTextbookChapterForTopic } from '../data/textbookData.ts';
import { getAuthenticTextbookDiagram } from '../data/authenticTextbookDiagrams.ts';

console.log('=== QUALITATIVE VERIFICATION OF ALL 47 TOPICS ===\n');

let issues = 0;

for (let i = 0; i < allCurriculumTopics.length; i++) {
  const topic = allCurriculumTopics[i];
  const domainKey = resolveCurriculumDomainKey(topic);
  const chapter = getTextbookChapterForTopic(topic);
  
  // Test 1: Procedural Steps
  const defaultParams: Record<string, number> = {};
  topic.parameters?.forEach(p => { defaultParams[p.id] = p.defaultValue; });
  const steps = topic.generateSteps(defaultParams);

  // Test 2: Authentic Diagram resolution
  const directDiag = getAuthenticTextbookDiagram({
    topicId: topic.id,
    topicTitle: topic.title,
    figureTitle: topic.title,
    svgType: undefined
  });

  const fig = chapter.figures?.[0];
  const chapterDiag = fig ? getAuthenticTextbookDiagram({
    topicId: topic.id,
    topicTitle: topic.title,
    figureTitle: fig.title,
    svgType: fig.svgType,
    figureNumber: fig.figureNumber
  }) : null;

  const hasSteps = steps && steps.length > 0;
  const hasDiagElements = directDiag && directDiag.elements && directDiag.elements.length > 0;
  const hasProof = Boolean(directDiag?.mathematicalProof);
  const hasDims = directDiag?.dimensions && directDiag.dimensions.length > 0;

  if (!hasSteps || !hasDiagElements || !chapter) {
    issues++;
    console.error(`[ISSUE] Topic ${i+1}: ${topic.id} (${topic.title}) - Steps: ${steps?.length}, Diag Elements: ${directDiag?.elements?.length}`);
  } else {
    console.log(`${i+1}. [${topic.tier}] id="${topic.id}" | ${topic.title}`);
    console.log(`   Steps: ${steps.length} | Chapter: "${chapter.title.slice(0, 35)}..."`);
    console.log(`   Diag Title: "${directDiag.title}" | Elements: ${directDiag.elements.length} | Proof: "${directDiag.mathematicalProof?.slice(0, 45)}..."`);
  }
}

console.log(`\nVerification finished with ${issues} issues found.`);
