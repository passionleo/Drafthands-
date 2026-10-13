import React from 'react';
import { generateDomainVectorSVG } from './cad/domainGenerators';

// Drafthands Context-Aware Vector Blueprint Generator
export function getTopicSpecificSVG(topicId: string, topicTitle: string) {
  return generateDomainVectorSVG({ topicId, topicTitle });
}
