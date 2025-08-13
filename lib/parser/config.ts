/**
 * Configuration for section detection patterns and constants
 */

/**
 * Section detection patterns for different resume sections
 */
export const SECTION_PATTERNS = {
  experience: [
    /experience/i,
    /work\s+history/i,
    /employment/i,
    /career/i,
    /professional\s+background/i,
    /java\s+programming\s+experience/i,
    /quality\s+assurance\s+experience/i,
    /devops\s+experience/i,
  ],
  education: [
    /education/i,
    /academic/i,
    /qualifications/i,
    /degrees/i,
    /certifications/i,
    /post-degree\s+specializations/i,
  ],
  skills: [
    /skills/i,
    /technical\s+skills/i,
    /competencies/i,
    /technologies/i,
    /tools/i,
    /languages/i,
  ],
} as const;

/**
 * Keywords that indicate the start of a new job/position
 */
export const JOB_INDICATORS = [
  /^-\s*[A-Z][^–]*–\s*[A-Z]/m, // "- Job Title – Company"
  /^•\s*[A-Z][^–]*–\s*[A-Z]/m, // "• Job Title – Company"
  /^[A-Z][^–]*–\s*[A-Z]/m, // "Job Title – Company"
] as const;

/**
 * Keywords that indicate the start of a new education item
 */
export const EDUCATION_INDICATORS = [
  /^-\s*[A-Z][^–]*–\s*[A-Z]/m, // "- Degree – University"
  /^•\s*[A-Z][^–]*–\s*[A-Z]/m, // "• Degree – University"
  /^[A-Z][^–]*–\s*[A-Z]/m, // "Degree – University"
] as const;

/**
 * Constants for confidence calculation
 */
export const CONFIDENCE_CONSTANTS = {
  BASE_CONFIDENCE: 0.5,
  SECTION_BONUS: 0.15,
  EXPERIENCE_EDUCATION_BONUS: 0.2,
  SHORT_TEXT_PENALTY: 0.2,
  LONG_TEXT_PENALTY: 0.1,
  MIN_LINES: 10,
  MAX_LINES: 200,
  MIN_CONFIDENCE: 0.1,
  MAX_CONFIDENCE: 1.0,
} as const;

/**
 * Common technical skills patterns for extraction
 */
export const SKILL_PATTERNS = [
  /\b(Java|JavaScript|Python|React|Node\.js|Spring Boot|Kubernetes|AWS|Docker|Jenkins|Git|PostgreSQL|Redis|MongoDB|Selenium|JUnit|Cucumber|JMeter|Terraform|Ansible|Helm|Prometheus|Grafana|ELK|Apache Kafka|WebSockets|Hibernate|Spring Security|Spring Cloud|Netflix OSS|HIPAA|PCI DSS|OWASP ZAP|Nexus|GitLab CI|AWS EKS)\b/gi,
  /\b(RESTful APIs|microservices|CI\/CD|DevOps|QA|Quality Assurance|Site Reliability|SRE|Infrastructure as Code|Load Testing|Performance Testing|Security Testing|Regression Testing|Unit Testing|Integration Testing|Automated Testing|Manual Testing|Code Reviews|Mentoring|Architecture|Cloud-native|Event-driven|Real-time|Predictive Analytics|Batch Processing|Monitoring|Logging|Alerting|Disaster Recovery|Autoscaling|Canary Releases|Blue-green Deployments|Chaos Engineering)\b/gi,
] as const;

/**
 * Section types for type safety
 */
export type SectionType = keyof typeof SECTION_PATTERNS;

/**
 * Configuration for section processing
 */
export const SECTION_PROCESSING_CONFIG = {
  MERGE_SEPARATOR: "\n\n",
  LINE_SEPARATOR: "\n",
  SKILLS_SEPARATOR: ", ",
} as const;
