import { CurriculumTopic } from '../../types/curriculum';
import { getVectorBlueprintForTopic, VectorBlueprintData } from './vectorBlueprints';

export type ResolvedBlueprint = VectorBlueprintData;

/**
 * Universal Dynamic Blueprint Resolver
 * Delegates to getVectorBlueprintForTopic in vectorBlueprints.ts to guarantee
 * 100% domain correlation and zero cross-contamination across all curriculum modules.
 */
export function resolveBlueprintForTopic(topicOrId: CurriculumTopic | string, allTopics: CurriculumTopic[] = []): ResolvedBlueprint {
  return getVectorBlueprintForTopic(topicOrId, allTopics);
}
