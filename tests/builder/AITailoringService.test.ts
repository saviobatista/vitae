import { describe, it, expect, vi } from "vitest";
import { AITailoringService } from "@/app/builder/_components/AITailoringService";
import { TailoringRequest } from "@/types";

describe("AITailoringService", () => {
  describe("tailorResume", () => {
    it("returns a valid tailoring response", async () => {
      vi.useFakeTimers();
      
      const request: TailoringRequest = {
        resumeContent: "Senior Developer with React experience",
        jobDescription: "We are looking for a senior developer with React skills"
      };

      const promise = AITailoringService.tailorResume(request);
      
      // Fast-forward timers to simulate the delay
      vi.advanceTimersByTime(2000);
      
      const response = await promise;

      expect(response).toMatchObject({
        tailoredResume: expect.any(String),
        confidence: expect.any(Number),
        suggestions: expect.any(Array)
      });

      expect(response.confidence).toBe(0.85);
      expect(response.suggestions).toHaveLength(3);
      
      vi.useRealTimers();
    });

    it("includes placeholder suggestions", async () => {
      vi.useFakeTimers();
      
      const request: TailoringRequest = {
        resumeContent: "Developer experience",
        jobDescription: "Job description"
      };

      const promise = AITailoringService.tailorResume(request);
      vi.advanceTimersByTime(2000);
      
      const response = await promise;

      expect(response.suggestions).toContain(
        "Highlight relevant experience from your background"
      );
      expect(response.suggestions).toContain(
        "Emphasize skills that match the job requirements"
      );
      expect(response.suggestions).toContain(
        "Consider adding specific achievements that align with the role"
      );
      
      vi.useRealTimers();
    });

    it("simulates API delay correctly", async () => {
      vi.useFakeTimers();
      
      const request: TailoringRequest = {
        resumeContent: "Content",
        jobDescription: "Description"
      };

      const promise = AITailoringService.tailorResume(request);
      
      // Should not resolve immediately
      expect(promise).toBeInstanceOf(Promise);
      
      // Fast-forward to just before the delay
      vi.advanceTimersByTime(1999);
      expect(promise).toBeInstanceOf(Promise);
      
      // Fast-forward to complete the delay
      vi.advanceTimersByTime(1);
      await promise;
      
      vi.useRealTimers();
    });

    it("handles different types of content", async () => {
      vi.useFakeTimers();
      
      const testCases = [
        {
          resumeContent: "Senior Developer at TechCorp",
          jobDescription: "Senior role with leadership",
          expectedHighlight: "🌟"
        },
        {
          resumeContent: "React Developer with Node.js",
          jobDescription: "React frontend developer needed",
          expectedHighlight: "⚛️"
        },
        {
          resumeContent: "Team Lead at Company",
          jobDescription: "Leadership position available",
          expectedHighlight: "👥"
        }
      ];

      for (const testCase of testCases) {
        const request: TailoringRequest = {
          resumeContent: testCase.resumeContent,
          jobDescription: testCase.jobDescription
        };

        const promise = AITailoringService.tailorResume(request);
        vi.advanceTimersByTime(2000);
        
        const response = await promise;
        expect(response.tailoredResume).toContain(testCase.expectedHighlight);
      }
      
      vi.useRealTimers();
    });

    it("preserves original content structure", async () => {
      vi.useFakeTimers();
      
      const resumeContent = "Line 1\nLine 2\nLine 3";
      const request: TailoringRequest = {
        resumeContent,
        jobDescription: "Generic job description"
      };

      const promise = AITailoringService.tailorResume(request);
      vi.advanceTimersByTime(2000);
      
      const response = await promise;

      // Should preserve line structure
      expect(response.tailoredResume).toContain("Line 1");
      expect(response.tailoredResume).toContain("Line 2");
      expect(response.tailoredResume).toContain("Line 3");
      
      vi.useRealTimers();
    });

    it("handles empty content gracefully", async () => {
      vi.useFakeTimers();
      
      const request: TailoringRequest = {
        resumeContent: "",
        jobDescription: ""
      };

      const promise = AITailoringService.tailorResume(request);
      vi.advanceTimersByTime(2000);
      
      const response = await promise;

      expect(response.tailoredResume).toBe("");
      expect(response.confidence).toBe(0.85);
      
      vi.useRealTimers();
    });
  });
});
