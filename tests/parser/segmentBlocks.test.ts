import { describe, it, expect } from "vitest";
import { segmentBlocks } from "@/parser/segmentBlocks";

describe("segmentBlocks", () => {
  const sampleResumeText = `Alexandre Pereira da Costa Email: alex.pereira@example.com | Phone: +55 11 98765-4321 | LinkedIn: linkedin.com/in/alexpereira | GitHub: github.com/alexpereira

Innovative and results-driven Software Engineer with 12+ years of experience across Java Programming, Quality Assurance, and DevOps. Adept at delivering robust solutions, improving development pipelines, and fostering high-quality standards in software delivery.

Java Programming Experience
- Senior Java Developer – FinTech Solutions Inc. (2021–2023)
– Led a team in developing a microservices architecture handling $50M in monthly transactions. Designed and implemented RESTful APIs using Spring Boot, integrated with Apache Kafka for event-driven communication, and optimized database queries reducing response times by 60%. Mentored junior developers, conducted code reviews, and collaborated with the DevOps team to automate deployments via Jenkins. Actively participated in architecture decisions to migrate legacy systems to cloud-native solutions on AWS.

- Java Software Engineer – HealthTech Corp. (2019–2021)
– Built scalable APIs to integrate with nationwide hospital management systems, ensuring HIPAA compliance and secure data transfer. Leveraged Spring Cloud and Netflix OSS stack for service discovery and load balancing. Worked closely with QA teams to design automated test suites for integration and regression testing. Introduced caching strategies using Redis, improving API performance by over 40%.

- Backend Developer – Global Logistics SA (2017–2019)
– Developed a shipment tracking system using Spring Boot, Hibernate, and PostgreSQL. Implemented real-time tracking updates using WebSockets and improved the accuracy of delivery estimates with predictive analytics. Collaborated with front-end teams to design REST endpoints and optimized batch processing jobs for large datasets using Java Streams.

- Java Consultant – InnovApp Ltd. (2015–2017)
– Migrated monolithic ERP systems to modern REST-based services, reducing maintenance costs by 35%. Assisted in designing a role-based authentication and authorization mechanism using Spring Security. Provided performance tuning workshops to client teams and implemented monitoring solutions to track service performance.

- Junior Java Developer – WebPrime (2013–2015)
– Created internal tools for e-commerce analytics, including sales forecasting modules. Implemented unit and integration tests, participated in agile ceremonies, and improved application stability by fixing critical bugs. Collaborated with UX teams to ensure intuitive API designs for partner integrations.

Quality Assurance Experience
- QA Lead – SafePay Ltd. (2021–2023)
– Directed a team of QA engineers to implement an automated testing framework reducing production bugs by 40%. Coordinated with developers to create shift-left testing strategies, developed CI/CD integrated tests using Selenium, JUnit, and Cucumber, and implemented load testing with JMeter. Introduced code coverage metrics and facilitated bug triage meetings with stakeholders.

- Senior QA Engineer – CloudWare Systems (2019–2021)
– Designed and implemented performance testing strategies for SaaS products, ensuring the platform could handle peak loads of 100k concurrent users. Automated regression tests in Python and integrated them into the Jenkins pipeline. Conducted root cause analysis for critical incidents and provided recommendations to prevent recurrence.

- QA Analyst – EduPortal (2017–2019)
– Improved regression testing processes, reducing release cycle time by 25%. Designed comprehensive test cases, coordinated UAT sessions, and documented defects in Jira. Led the transition from manual to automated testing by introducing Selenium WebDriver and TestNG.

- Automation Tester – SmartBank (2015–2017)
– Developed Selenium-based automation scripts for online banking applications, improving release quality. Conducted security testing, verified compliance with PCI DSS standards, and implemented continuous testing in the CI pipeline. Collaborated with developers to identify and fix performance bottlenecks.

- Junior QA Tester – WebPrime (2013–2015)
– Performed manual testing for e-commerce platforms, documented reproducible bug reports, and collaborated with developers to ensure prompt resolution. Assisted in the setup of a bug tracking system and participated in smoke and sanity testing for each release.

DevOps Experience
- DevOps Architect – SkyDeploy (2021–2023)
– Designed CI/CD pipelines using GitLab CI for multiple microservices, reducing deployment time by 70%. Implemented infrastructure as code with Terraform, configured Kubernetes clusters on AWS EKS, and integrated monitoring with Prometheus, Grafana, and ELK stack. Led the adoption of canary releases and blue-green deployments.

- Senior DevOps Engineer – GreenCloud (2019–2021)
– Migrated infrastructure from on-premises to Kubernetes in AWS, ensuring zero downtime during migration. Designed autoscaling policies, improved disaster recovery procedures, and implemented centralized logging. Trained development teams on containerization best practices.

- DevOps Specialist – AutoScale Systems (2017–2019)
– Built scalable CI/CD systems for embedded IoT products. Implemented artifact storage in Nexus, automated security scans using OWASP ZAP, and deployed Helm charts for microservices. Improved provisioning speed by 50% using Ansible playbooks.

- Site Reliability Engineer – DataFlow Ltd. (2015–2017)
– Increased system uptime from 97% to 99.99% by improving monitoring and incident response. Built runbooks for on-call engineers, optimized alerting thresholds, and automated recovery scripts for common failures. Introduced chaos engineering experiments to validate resilience.

- DevOps Engineer – WebPrime (2013–2015)
– Automated deployment scripts for PHP and Java applications using Bash and Ansible. Improved server provisioning times and reduced manual configuration errors by introducing standardized configuration management templates.

Post-Degree Specializations
- Post-Graduate Specialization in Java Programming – University of São Paulo (2016)
- Post-Graduate Specialization in Quality Assurance – Federal University of Rio de Janeiro (2018)
- Post-Graduate Specialization in DevOps – Pontifical Catholic University of Paraná (2020)`;

  it("should detect and segment Experience blocks correctly", async () => {
    const result = await segmentBlocks(sampleResumeText);

    expect(result.blocks.experience).toBeDefined();
    expect(result.blocks.experience).toContain(
      "Senior Java Developer – FinTech Solutions Inc. (2021–2023)"
    );
    expect(result.blocks.experience).toContain(
      "QA Lead – SafePay Ltd. (2021–2023)"
    );
    expect(result.blocks.experience).toContain(
      "DevOps Architect – SkyDeploy (2021–2023)"
    );
  });

  it("should detect and segment Education blocks correctly", async () => {
    const result = await segmentBlocks(sampleResumeText);

    expect(result.blocks.education).toBeDefined();
    expect(result.blocks.education).toContain(
      "Post-Graduate Specialization in Java Programming – University of São Paulo (2016)"
    );
    expect(result.blocks.education).toContain(
      "Post-Graduate Specialization in Quality Assurance – Federal University of Rio de Janeiro (2018)"
    );
    expect(result.blocks.education).toContain(
      "Post-Graduate Specialization in DevOps – Pontifical Catholic University of Paraná (2020)"
    );
  });

  it("should detect and segment Skills/Technical blocks correctly", async () => {
    const result = await segmentBlocks(sampleResumeText);

    expect(result.blocks.skills).toBeDefined();
    expect(result.blocks.skills).toContain("Java");
    expect(result.blocks.skills).toContain("Spring Boot");
    expect(result.blocks.skills).toContain("Kubernetes");
    expect(result.blocks.skills).toContain("AWS");
  });

  it("should merge bullet points and multi-line descriptions correctly", async () => {
    const result = await segmentBlocks(sampleResumeText);

    // Check that bullet points are properly merged with their descriptions
    expect(result.blocks.experience).toContain(
      "Led a team in developing a microservices architecture"
    );
    expect(result.blocks.experience).toContain(
      "Designed and implemented RESTful APIs using Spring Boot"
    );
    expect(result.blocks.experience).toContain(
      "Mentored junior developers, conducted code reviews"
    );
  });

  it("should handle résumés with missing sections gracefully", async () => {
    const minimalResume = `John Doe
Software Engineer
Experience
- Developer at Company (2020-2023)
Worked on various projects.`;

    const result = await segmentBlocks(minimalResume);

    expect(result.blocks.experience).toBeDefined();
    expect(result.blocks.education).toBeUndefined();
    expect(result.warnings).toContain("Could not detect education section");
  });

  it("should normalize block labels to standard schema", async () => {
    const result = await segmentBlocks(sampleResumeText);

    // Check that all expected standard keys exist
    expect(result.blocks).toHaveProperty("experience");
    expect(result.blocks).toHaveProperty("education");
    expect(result.blocks).toHaveProperty("skills");

    // Check that the result follows the expected structure
    expect(result).toMatchObject({
      blocks: expect.any(Object),
      warnings: expect.any(Array),
      metadata: expect.objectContaining({
        totalBlocks: expect.any(Number),
        confidence: expect.any(Number),
      }),
    });
  });

  it("should handle single-section résumés", async () => {
    const singleSectionResume = `Jane Smith
Experience
- Developer at Company (2020-2023)
Built web applications.`;

    const result = await segmentBlocks(singleSectionResume);

    expect(result.blocks.experience).toBeDefined();
    expect(result.metadata.totalBlocks).toBe(1);
    expect(result.warnings).toContain("Only one section detected");
  });

  it("should provide confidence scores based on detection quality", async () => {
    const result = await segmentBlocks(sampleResumeText);

    expect(result.metadata.confidence).toBeGreaterThan(0.7);
    expect(result.metadata.confidence).toBeLessThanOrEqual(1.0);
    expect(result.metadata.totalBlocks).toBeGreaterThanOrEqual(3);
  });

  it("should handle edge cases with malformed text", async () => {
    const malformedText = `Name: John
Experience
- Job at Company
Education
- Degree from University
Skills
- Skill 1
- Skill 2`;

    const result = await segmentBlocks(malformedText);

    expect(result.blocks.experience).toBeDefined();
    expect(result.blocks.education).toBeDefined();
    expect(result.blocks.skills).toBeDefined();
    expect(result.metadata.totalBlocks).toBe(3);
  });
});
