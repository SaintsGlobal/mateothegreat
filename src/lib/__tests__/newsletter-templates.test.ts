import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { newsletterSchema } from "../newsletter-schema";

const TEMPLATES_DIR = join(process.cwd(), "content/newsletters/templates");

describe("Newsletter Templates", () => {
  const templateFiles = readdirSync(TEMPLATES_DIR).filter((f) =>
    f.endsWith(".json")
  );

  it("should have at least one template", () => {
    expect(templateFiles.length).toBeGreaterThan(0);
  });

  describe.each(templateFiles)("Template: %s", (filename) => {
    const filePath = join(TEMPLATES_DIR, filename);
    const content = JSON.parse(readFileSync(filePath, "utf-8"));

    it("should validate against newsletter schema", () => {
      const result = newsletterSchema.safeParse(content);
      if (!result.success) {
        console.error("Validation errors:", result.error.format());
      }
      expect(result.success).toBe(true);
    });

    it("should have required fields", () => {
      expect(content.id).toBeDefined();
      expect(content.title).toBeDefined();
      expect(content.slug).toBeDefined();
      expect(content.template).toBeDefined();
      expect(content.status).toBeDefined();
      expect(content.author).toBeDefined();
      expect(content.version).toBeDefined();
      expect(content.blocks).toBeInstanceOf(Array);
    });
  });
});
