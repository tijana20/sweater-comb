import { RuleRunner, TestHelpers } from "@useoptic/rulesets-base";
import { context } from "./fixtures";
import { propertyRules } from "../property-rules";
import { OpenAPIV3 } from "@useoptic/openapi-utilities";

const baseOpenAPI = {
  ...TestHelpers.createEmptySpec(),
  paths: {
    "/example": {
      get: {
        responses: {},
      },
    },
  },
};

describe("body properties", () => {
  describe("key", () => {
    test("passes when snake case with more than one component", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          is_snake_case: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(baseOpenAPI, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((result) => result.passed)).toBe(true);
      expect(results).toMatchSnapshot();
    });

    test("passes when snake case with a number as an n+1 component", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          is_allowed_after_30_days: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(baseOpenAPI, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((result) => result.passed)).toBe(true);
      expect(results).toMatchSnapshot();
    });

    test("fails when number in n=1 snake case component", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          "30_days": { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(baseOpenAPI, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results).toMatchSnapshot();
    });

    test("passes when snake case with one component", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          technicallysnakecase: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(baseOpenAPI, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((result) => result.passed)).toBe(true);
      expect(results).toMatchSnapshot();
    });

    test("fails when not snake case", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          "not-snake-case": { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(baseOpenAPI, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results).toMatchSnapshot();
    });

    test("fails when not snake case in experimental", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          "not-snake-case": { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(baseOpenAPI, afterSpec),
        context: {
          ...context,
          changeVersion: {
            date: "2021-10-10",
            stability: "experimental",
          },
        },
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results).toMatchSnapshot();
    });

    test("fails when not snake case in nested field", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          snake_case: {
                            type: "object",
                            properties: {
                              notSNAKEcase: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(baseOpenAPI, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results).toMatchSnapshot();
    });

    test("allows non-snake case if already in spec", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          snake_case: {
                            type: "object",
                            properties: {
                              notSNAKEcase: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(afterSpec, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((result) => result.passed)).toBe(true);
      expect(results).toMatchSnapshot();
    });
  });

  describe("required properties", () => {
    const requiredOk: OpenAPIV3.SchemaObject = {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            something: {
              type: "string",
            },
            else: {
              type: "number",
            },
          },
          required: ["something"],
        },
        foo: {
          type: "string",
        },
      },
      required: ["data"],
    };
    test("passes when required properties are declared", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            post: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: requiredOk,
                  },
                },
              },
              responses: {
                "200": {
                  description: "ok",
                  content: {
                    "application/json": {
                      schema: requiredOk,
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(afterSpec, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((result) => result.passed)).toBe(true);
    });

    const missingRequiredTopLevel: OpenAPIV3.SchemaObject = {
      type: "object",
      properties: {
        something: {
          type: "string",
        },
      },
      required: ["something_else"],
    };
    const missingRequiredNested: OpenAPIV3.SchemaObject = {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            something: {
              type: "string",
            },
          },
          required: ["something_else"],
        },
      },
    };
    test("fails when required properties are missing in request body, top-level", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: missingRequiredTopLevel,
                  },
                },
              },
              responses: {},
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(afterSpec, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results.filter((result) => !result.passed)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            error: "missing required property something_else",
          }),
        ]),
      );
    });
    test("fails when required properties are missing in request body, nested", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: missingRequiredNested,
                  },
                },
              },
              responses: {},
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(afterSpec, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results.filter((result) => !result.passed)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            error: "missing required property data.something_else",
          }),
        ]),
      );
    });
    test("fails when required properties are missing in response, top-level", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: missingRequiredTopLevel,
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(afterSpec, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results.filter((result) => !result.passed)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            error: "missing required property something_else",
          }),
        ]),
      );
    });
    test("fails when required properties are missing in response, nested", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: missingRequiredNested,
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(afterSpec, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results.filter((result) => !result.passed)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            error: "missing required property data.something_else",
          }),
        ]),
      );
    });
  });

  describe("breaking changes", () => {
    test("fails if a property is removed", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const beforeSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          count: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {},
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(beforeSpec, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results).toMatchSnapshot();
    });

    test("fails if a required property is added", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const beforeSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {},
                    },
                  },
                },
              },
              responses: {},
            },
          },
        },
      };
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        count: { type: "number" },
                      },
                      required: ["count"],
                    },
                  },
                },
              },
              responses: {},
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(beforeSpec, afterSpec),
        context,
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.every((result) => result.passed)).toBe(false);
      expect(results).toMatchSnapshot();
    });

    test("passes if a property is removed in experimental", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const beforeSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          count: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              responses: {
                "200": {
                  description: "",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {},
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(beforeSpec, afterSpec),
        context: {
          ...context,
          changeVersion: {
            date: "2021-10-10",
            stability: "experimental",
          },
        },
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((result) => result.passed)).toBe(true);
      expect(results).toMatchSnapshot();
    });

    test("passes if a required property is added in experimental", () => {
      const ruleRunner = new RuleRunner([propertyRules]);
      const beforeSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {},
                    },
                  },
                },
              },
              responses: {},
            },
          },
        },
      };
      const afterSpec: OpenAPIV3.Document = {
        ...baseOpenAPI,
        paths: {
          "/example": {
            get: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        count: { type: "number" },
                      },
                      required: ["count"],
                    },
                  },
                },
              },
              responses: {},
            },
          },
        },
      };
      const ruleInputs = {
        ...TestHelpers.createRuleInputs(beforeSpec, afterSpec),
        context: {
          ...context,
          changeVersion: {
            date: "2021-10-10",
            stability: "experimental",
          },
        },
      };
      const results = ruleRunner.runRulesWithFacts(ruleInputs);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((result) => result.passed)).toBe(true);
      expect(results).toMatchSnapshot();
    });
  });
});
