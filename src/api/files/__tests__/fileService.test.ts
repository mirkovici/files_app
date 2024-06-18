import { describe, expect, it, vi } from "vitest";
import { fileService } from "@/api/files/fileService";
import { IData } from "@/common/types";

vi.mock("@/server", () => ({
  ...vi.importActual("@/server"),
  logger: {
    error: vi.fn(),
  },
}));

describe("mapResults", () => {
  it("map results", async () => {
    const mockData: IData = {
      items: [
        { fileUrl: "http://34.8.32.234:48183/SvnRep/ADV-H5-New/README.txt" },
        { fileUrl: "http://34.8.32.234:48183/SvnRep/ADV-H5-New/VisualSVN.lck" },
        {
          fileUrl: "http://34.8.32.234:48183/SvnRep/ADV-H5-New/hooks-env.tmpl",
        },
        { fileUrl: "http://34.8.32.234:48183/SvnRep/AT-APP/README.txt" },
        { fileUrl: "http://34.8.32.234:48183/SvnRep/AT-APP/VisualSVN.lck" },
        { fileUrl: "http://34.8.32.234:48183/SvnRep/AT-APP/hooks-env.tmpl" },
        { fileUrl: "http://34.8.32.234:48183/SvnRep/README.txt" },
        { fileUrl: "http://34.8.32.234:48183/SvnRep/VisualSVN.lck" },
        { fileUrl: "http://34.8.32.234:48183/SvnRep/hooks-env.tmpl" },
        { fileUrl: "http://34.8.32.234:48183/www/README.txt" },
        { fileUrl: "http://34.8.32.234:48183/www/VisualSVN.lck" },
        { fileUrl: "http://34.8.32.234:48183/www/hooks-env.tmpl" },
      ],
    };

    // Act
    const result = fileService.mapResults(mockData);
    expect(result).toEqual({
      "34.8.32.234": [
        {
          SvnRep: [
            {
              "ADV-H5-New": ["README.txt", "VisualSVN.lck", "hooks-env.tmpl"],
            },
            {
              "AT-APP": ["README.txt", "VisualSVN.lck", "hooks-env.tmpl"],
            },
            "README.txt",
            "VisualSVN.lck",
            "hooks-env.tmpl",
          ],
        },
        {
          www: ["README.txt", "VisualSVN.lck", "hooks-env.tmpl"],
        },
      ],
    });
  });
});
