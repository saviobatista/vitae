import { SegmentationResult, SegmentationError } from "@/types";
import {
  SECTION_PATTERNS,
  JOB_INDICATORS,
  EDUCATION_INDICATORS,
  CONFIDENCE_CONSTANTS,
  SKILL_PATTERNS,
  SECTION_PROCESSING_CONFIG,
} from "@/parser/config";
import {
  SectionDetectionResult,
  ProcessingBlocks,
  FinalBlocks,
  SkillsExtractionResult,
  WarningContext,
  ResultBuildingContext,
} from "@/parser/types";

/**
 * Normalize section labels to standard keys
 */
function normalizeSectionLabel(label: string): string {
  const lowerLabel = label.toLowerCase();

  for (const [sectionKey, patterns] of Object.entries(SECTION_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(lowerLabel))) {
      return sectionKey;
    }
  }

  return label.toLowerCase().replace(/\s+/g, "_");
}

/**
 * Extract skills from experience and education content
 */
function extractSkillsFromContent(content: string): SkillsExtractionResult {
  const skills: string[] = [];

  SKILL_PATTERNS.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      skills.push(...matches.map((skill) => skill.trim()));
    }
  });

  // Remove duplicates and normalize - preserve original case for display
  const uniqueSkills = [...new Set(skills)];
  const skillsText = uniqueSkills.join(
    SECTION_PROCESSING_CONFIG.SKILLS_SEPARATOR
  );

  return { skills: uniqueSkills, skillsText };
}

/**
 * Merge bullet points with their descriptions
 */
function mergeBulletPoints(content: string): string {
  const lines = content.split(SECTION_PROCESSING_CONFIG.LINE_SEPARATOR);
  const merged: string[] = [];
  let currentItem = "";

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if this is a new bullet point
    if (
      JOB_INDICATORS.some((pattern) => pattern.test(line)) ||
      EDUCATION_INDICATORS.some((pattern) => pattern.test(line))
    ) {
      // Save previous item if exists
      if (currentItem) {
        merged.push(currentItem);
      }
      currentItem = trimmedLine;
    } else if (trimmedLine && currentItem) {
      // Continue building current item
      currentItem += " " + trimmedLine;
    } else if (trimmedLine) {
      // Standalone line (like section headers)
      merged.push(trimmedLine);
    }
  }

  // Add the last item
  if (currentItem) {
    merged.push(currentItem);
  }

  return merged.join(SECTION_PROCESSING_CONFIG.LINE_SEPARATOR);
}

/**
 * Calculate confidence score based on detection quality
 */
function calculateConfidence(
  detectedSections: string[],
  totalLines: number
): number {
  let confidence = CONFIDENCE_CONSTANTS.BASE_CONFIDENCE;

  // Bonus for each detected section
  confidence += detectedSections.length * CONFIDENCE_CONSTANTS.SECTION_BONUS;

  // Bonus for having both experience and education
  if (
    detectedSections.includes("experience") &&
    detectedSections.includes("education")
  ) {
    confidence += CONFIDENCE_CONSTANTS.EXPERIENCE_EDUCATION_BONUS;
  }

  // Penalty for very short text
  if (totalLines < CONFIDENCE_CONSTANTS.MIN_LINES) {
    confidence -= CONFIDENCE_CONSTANTS.SHORT_TEXT_PENALTY;
  }

  // Penalty for very long text (might indicate parsing issues)
  if (totalLines > CONFIDENCE_CONSTANTS.MAX_LINES) {
    confidence -= CONFIDENCE_CONSTANTS.LONG_TEXT_PENALTY;
  }

  return Math.min(
    Math.max(confidence, CONFIDENCE_CONSTANTS.MIN_CONFIDENCE),
    CONFIDENCE_CONSTANTS.MAX_CONFIDENCE
  );
}

/**
 * Save section content to blocks and update detected sections
 */
function saveSectionContent(
  blocks: ProcessingBlocks,
  detectedSections: string[],
  currentSection: string,
  currentContent: string[],
  startLine: number,
  endLine: number
): void {
  if (!currentSection || currentContent.length === 0) {
    return;
  }

  const normalizedSection = normalizeSectionLabel(currentSection);

  // Ensure section exists in blocks
  if (!blocks[normalizedSection]) {
    blocks[normalizedSection] = [];
  }

  const sectionContent = createSectionContent(
    currentContent,
    startLine,
    endLine
  );
  blocks[normalizedSection].push(sectionContent);

  if (!detectedSections.includes(normalizedSection)) {
    detectedSections.push(normalizedSection);
  }
}

/**
 * Helper function to create section content object
 */
function createSectionContent(
  content: string[],
  startLine: number,
  endLine: number
) {
  return {
    rawContent: content,
    processedContent: content.join(SECTION_PROCESSING_CONFIG.LINE_SEPARATOR),
    startLine,
    endLine,
  };
}

/**
 * Detect sections and their boundaries in the text
 */
function detectSections(lines: string[]): SectionDetectionResult {
  const blocks: ProcessingBlocks = {};
  const detectedSections: string[] = [];

  let currentSection = "";
  let currentContent: string[] = [];
  let sectionStartLine = 0;

  // First pass: identify sections and their boundaries
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line is a section header
    let sectionFound = false;
    for (const [, patterns] of Object.entries(SECTION_PATTERNS)) {
      if (patterns.some((pattern) => pattern.test(line))) {
        // Save previous section content
        saveSectionContent(
          blocks,
          detectedSections,
          currentSection,
          currentContent,
          sectionStartLine,
          i - 1
        );

        // Start new section
        currentSection = line;
        currentContent = [];
        sectionStartLine = i;
        sectionFound = true;
        break;
      }
    }

    if (!sectionFound && currentSection) {
      // Add line to current section content
      currentContent.push(line);
    }
  }

  // Save the last section
  saveSectionContent(
    blocks,
    detectedSections,
    currentSection,
    currentContent,
    sectionStartLine,
    lines.length - 1
  );

  return { blocks, detectedSections };
}

/**
 * Process section content and merge multiple sections of the same type
 */
function processSectionContent(blocks: ProcessingBlocks): FinalBlocks {
  const finalBlocks: FinalBlocks = {};

  for (const [sectionKey, contentArray] of Object.entries(blocks)) {
    if (SECTION_PROCESSING_CONFIG.SECTIONS_WITH_BULLET_POINTS.has(sectionKey)) {
      // Merge all content and then process bullet points
      const mergedContent = contentArray
        .map((content) => content.processedContent)
        .join(SECTION_PROCESSING_CONFIG.MERGE_SEPARATOR);
      finalBlocks[sectionKey] = mergeBulletPoints(mergedContent);
    } else {
      finalBlocks[sectionKey] = contentArray
        .map((content) => content.processedContent)
        .join(SECTION_PROCESSING_CONFIG.MERGE_SEPARATOR);
    }
  }

  return finalBlocks;
}

/**
 * Extract skills from experience and education content
 */
function extractSkillsFromSections(
  finalBlocks: FinalBlocks,
  detectedSections: string[]
): void {
  const skillsContent = [
    finalBlocks.experience || "",
    finalBlocks.education || "",
  ].join(SECTION_PROCESSING_CONFIG.LINE_SEPARATOR);

  const { skillsText } = extractSkillsFromContent(skillsContent);
  if (skillsText) {
    finalBlocks.skills = skillsText;
    if (!detectedSections.includes("skills")) {
      detectedSections.push("skills");
    }
  }
}

/**
 * Generate warnings for missing sections and edge cases
 */
function generateWarnings(context: WarningContext): string[] {
  const { finalBlocks, detectedSections } = context;
  const warnings: string[] = [];

  // Generate warnings for missing sections
  if (!finalBlocks.experience) {
    warnings.push("Could not detect experience section");
  }
  if (!finalBlocks.education) {
    warnings.push("Could not detect education section");
  }
  if (!finalBlocks.skills) {
    warnings.push("Could not detect skills section");
  }

  // Handle edge cases
  if (detectedSections.length === 1) {
    warnings.push("Only one section detected");
  }

  if (detectedSections.length === 0) {
    warnings.push("No sections detected - text may be malformed");
  }

  return warnings;
}

/**
 * Build the final segmentation result
 */
function buildFinalResult(context: ResultBuildingContext): SegmentationResult {
  const { finalBlocks, warnings, detectedSections, totalLines } = context;
  const confidence = calculateConfidence(detectedSections, totalLines);
  const totalBlocks = Object.keys(finalBlocks).length;

  return {
    blocks: finalBlocks,
    warnings,
    metadata: {
      totalBlocks,
      confidence,
      detectedSections,
    },
  };
}

/**
 * Segment extracted text into logical blocks
 */
export async function segmentBlocks(text: string): Promise<SegmentationResult> {
  try {
    const lines = text
      .split(SECTION_PROCESSING_CONFIG.LINE_SEPARATOR)
      .map((line) => line.trim())
      .filter(Boolean);

    // Detect sections and their boundaries
    const { blocks, detectedSections } = detectSections(lines);

    // Process section content
    const finalBlocks = processSectionContent(blocks);

    // Extract skills from experience and education content
    extractSkillsFromSections(finalBlocks, detectedSections);

    // Generate warnings
    const warnings = generateWarnings({ finalBlocks, detectedSections });

    // Build and return final result
    return buildFinalResult({
      finalBlocks,
      warnings,
      detectedSections,
      totalLines: lines.length,
    });
  } catch (error) {
    throw new SegmentationError(
      `Failed to segment text: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export { SegmentationError };
export default segmentBlocks;
