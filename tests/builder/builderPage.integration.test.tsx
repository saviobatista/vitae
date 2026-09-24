import { describe, it, expect } from "vitest";
import { SegmentationResult } from "@/types";

// Test the business logic that would be used in the builder page
describe("BuilderPage Business Logic", () => {
  const validateJobDescription = (text: string): string[] => {
    const errors: string[] = [];
    
    if (text.length < 50) {
      errors.push("Job description must be at least 50 characters");
    }
    
    if (text.length > 5000) {
      errors.push("Job description must be less than 5000 characters");
    }
    
    return errors;
  };

  const canSubmitForm = (
    parsedResume: SegmentationResult | null,
    jobDescription: string,
    errors: string[]
  ): boolean => {
    return !!(parsedResume && jobDescription.trim() && errors.length === 0);
  };

  const formatTailoringRequest = (
    parsedResume: SegmentationResult,
    jobDescription: string
  ) => {
    return {
      resumeContent: JSON.stringify(parsedResume.blocks),
      jobDescription: jobDescription.trim()
    };
  };

  describe("Form Validation", () => {
    it("allows submission with valid data", () => {
      const mockResume: SegmentationResult = {
        blocks: { experience: "Developer experience" },
        warnings: [],
        metadata: { totalBlocks: 1, confidence: 0.8, detectedSections: ["experience"] }
      };
      
      const validJobDescription = "This is a valid job description that meets the minimum length requirement and provides enough detail for the AI to work with effectively.";
      const errors: string[] = [];
      
      const canSubmit = canSubmitForm(mockResume, validJobDescription, errors);
      
      expect(canSubmit).toBe(true);
    });

    it("prevents submission without parsed resume", () => {
      const validJobDescription = "This is a valid job description that meets the minimum length requirement.";
      const errors: string[] = [];
      
      const canSubmit = canSubmitForm(null, validJobDescription, errors);
      
      expect(canSubmit).toBe(false);
    });

    it("prevents submission with empty job description", () => {
      const mockResume: SegmentationResult = {
        blocks: { experience: "Developer experience" },
        warnings: [],
        metadata: { totalBlocks: 1, confidence: 0.8, detectedSections: ["experience"] }
      };
      
      const emptyJobDescription = "";
      const errors: string[] = [];
      
      const canSubmit = canSubmitForm(mockResume, emptyJobDescription, errors);
      
      expect(canSubmit).toBe(false);
    });

    it("prevents submission with whitespace-only job description", () => {
      const mockResume: SegmentationResult = {
        blocks: { experience: "Developer experience" },
        warnings: [],
        metadata: { totalBlocks: 1, confidence: 0.8, detectedSections: ["experience"] }
      };
      
      const whitespaceJobDescription = "   \n\t  ";
      const errors: string[] = [];
      
      const canSubmit = canSubmitForm(mockResume, whitespaceJobDescription, errors);
      
      expect(canSubmit).toBe(false);
    });

    it("prevents submission with validation errors", () => {
      const mockResume: SegmentationResult = {
        blocks: { experience: "Developer experience" },
        warnings: [],
        metadata: { totalBlocks: 1, confidence: 0.8, detectedSections: ["experience"] }
      };
      
      const validJobDescription = "This is a valid job description.";
      const errors = ["Some validation error"];
      
      const canSubmit = canSubmitForm(mockResume, validJobDescription, errors);
      
      expect(canSubmit).toBe(false);
    });
  });

  describe("Job Description Validation", () => {
    it("validates minimum length correctly", () => {
      const shortText = "Short";
      const errors = validateJobDescription(shortText);
      
      expect(errors).toContain("Job description must be at least 50 characters");
    });

    it("validates maximum length correctly", () => {
      const longText = "A".repeat(5001);
      const errors = validateJobDescription(longText);
      
      expect(errors).toContain("Job description must be less than 5000 characters");
    });

    it("returns no errors for valid length", () => {
      const validText = "This is a valid job description that meets the minimum length requirement and provides enough detail for the AI to work with effectively.";
      const errors = validateJobDescription(validText);
      
      expect(errors).toHaveLength(0);
    });
  });

  describe("Tailoring Request Formatting", () => {
    it("formats request correctly", () => {
      const mockResume: SegmentationResult = {
        blocks: {
          experience: "Developer at Company",
          education: "Bachelor's degree",
          skills: "JavaScript, Python"
        },
        warnings: [],
        metadata: { totalBlocks: 3, confidence: 0.9, detectedSections: ["experience", "education", "skills"] }
      };
      
      const jobDescription = "  Job description with whitespace  ";
      
      const request = formatTailoringRequest(mockResume, jobDescription);
      
      expect(request.resumeContent).toBe(JSON.stringify(mockResume.blocks));
      expect(request.jobDescription).toBe("Job description with whitespace");
    });

    it("handles resume with missing sections", () => {
      const mockResume: SegmentationResult = {
        blocks: {
          experience: "Developer at Company"
        },
        warnings: [],
        metadata: { totalBlocks: 1, confidence: 0.7, detectedSections: ["experience"] }
      };
      
      const jobDescription = "Job description";
      
      const request = formatTailoringRequest(mockResume, jobDescription);
      
      expect(request.resumeContent).toBe(JSON.stringify(mockResume.blocks));
      expect(request.jobDescription).toBe("Job description");
    });
  });

  describe("Edge Cases", () => {
    it("handles resume with empty blocks", () => {
      const mockResume: SegmentationResult = {
        blocks: {
          experience: "",
          education: "",
          skills: ""
        },
        warnings: [],
        metadata: { totalBlocks: 3, confidence: 0.5, detectedSections: ["experience", "education", "skills"] }
      };
      
      const jobDescription = "Job description";
      
      const request = formatTailoringRequest(mockResume, jobDescription);
      
      expect(request.resumeContent).toBe(JSON.stringify(mockResume.blocks));
    });

    it("handles job description with special characters", () => {
      const mockResume: SegmentationResult = {
        blocks: { experience: "Developer experience" },
        warnings: [],
        metadata: { totalBlocks: 1, confidence: 0.8, detectedSections: ["experience"] }
      };
      
      const jobDescription = "Job description with special chars: éñtèrñåtîøñ, 中文, 🚀";
      
      const request = formatTailoringRequest(mockResume, jobDescription);
      
      expect(request.jobDescription).toBe("Job description with special chars: éñtèrñåtîøñ, 中文, 🚀");
    });
  });
});
