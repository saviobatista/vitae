/**
 * Interface for section content during processing
 */
export interface SectionContent {
  rawContent: string[];
  processedContent: string;
  startLine: number;
  endLine: number;
}

/**
 * Interface for intermediate blocks during processing
 */
export interface ProcessingBlocks {
  [key: string]: SectionContent[];
}

/**
 * Interface for final processed blocks
 */
export interface FinalBlocks {
  [key: string]: string;
}

/**
 * Interface for section detection result
 */
export interface SectionDetectionResult {
  blocks: ProcessingBlocks;
  detectedSections: string[];
}

/**
 * Interface for skills extraction result
 */
export interface SkillsExtractionResult {
  skills: string[];
  skillsText: string;
}

/**
 * Interface for warning generation context
 */
export interface WarningContext {
  finalBlocks: FinalBlocks;
  detectedSections: string[];
}

/**
 * Interface for final result building context
 */
export interface ResultBuildingContext {
  finalBlocks: FinalBlocks;
  warnings: string[];
  detectedSections: string[];
  totalLines: number;
}
