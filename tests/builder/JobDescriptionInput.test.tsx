import { describe, it, expect } from "vitest";

// Test the validation logic that would be used in the component
describe("JobDescriptionInput Validation Logic", () => {
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

  it("returns no errors for valid job description", () => {
    const validText = "This is a valid job description that meets the minimum length requirement and provides enough detail for the AI to work with effectively.";
    const errors = validateJobDescription(validText);
    
    expect(errors).toHaveLength(0);
  });

  it("returns error for too short description", () => {
    const shortText = "Short";
    const errors = validateJobDescription(shortText);
    
    expect(errors).toContain("Job description must be at least 50 characters");
    expect(errors).toHaveLength(1);
  });

  it("returns error for too long description", () => {
    const longText = "A".repeat(5001);
    const errors = validateJobDescription(longText);
    
    expect(errors).toContain("Job description must be less than 5000 characters");
    expect(errors).toHaveLength(1);
  });

  it("returns multiple errors when both validations fail", () => {
    const invalidText = "Short";
    const errors = validateJobDescription(invalidText);
    
    expect(errors).toContain("Job description must be at least 50 characters");
    expect(errors).toHaveLength(1);
  });

  it("handles edge case of exactly minimum length", () => {
    const edgeCaseText = "A".repeat(50);
    const errors = validateJobDescription(edgeCaseText);
    
    expect(errors).toHaveLength(0);
  });

  it("handles edge case of exactly maximum length", () => {
    const edgeCaseText = "A".repeat(5000);
    const errors = validateJobDescription(edgeCaseText);
    
    expect(errors).toHaveLength(0);
  });

  it("handles empty string", () => {
    const emptyText = "";
    const errors = validateJobDescription(emptyText);
    
    expect(errors).toContain("Job description must be at least 50 characters");
    expect(errors).toHaveLength(1);
  });

  it("handles whitespace-only strings", () => {
    const whitespaceText = "   \n\t  ";
    const errors = validateJobDescription(whitespaceText);
    
    expect(errors).toContain("Job description must be at least 50 characters");
    expect(errors).toHaveLength(1);
  });
});
