import { allCurriculumTopics } from '../data/curriculumData.ts';
import { resolveCurriculumDomainKey, getTextbookChapterForTopic } from '../data/textbookData.ts';
import { getAuthenticTextbookDiagram } from '../data/authenticTextbookDiagrams.ts';

console.log('=== DETAILED TOPIC TO CONTENT & DIAGRAM CORRESPONDENCE REPORT ===\n');

for (let i = 0; i < allCurriculumTopics.length; i++) {
  const topic = allCurriculumTopics[i];
  const domainKey = resolveCurriculumDomainKey(topic);
  const chapter = getTextbookChapterForTopic(topic);
  
  console.log(`[#${i + 1}] TOPIC ID: "${topic.id}"`);
  console.log(`     TITLE: "${topic.title}"`);
  console.log(`     TIER: ${topic.tier} | DOMAIN: ${domainKey}`);
  console.log(`     CHAPTER TITLE: "${chapter.title}"`);
  console.log(`     STEPS COUNT: ${chapter.proceduralMethodology?.numberedMethod?.length || 0}`);
  
  if (chapter.figures && chapter.figures.length > 0) {
    chapter.figures.forEach((fig, fIdx) => {
      const diag = getAuthenticTextbookDiagram({
        topicId: topic.id,
        topicTitle: topic.title,
        figureTitle: fig.title,
        svgType: fig.svgType,
        figureNumber: fig.figureNumber
      });
      console.log(`     FIG #${fIdx + 1}: [${fig.svgType}] "${fig.title}" -> DIAG TITLE: "${diag.title}" | PROOF: "${diag.mathematicalProof?.slice(0, 45)}..."`);
    });
  } else {
    console.log(`     FIG: NONE!`);
  }
  console.log('------------------------------------------------------------');
}
