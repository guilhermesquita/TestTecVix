import request from "supertest";
import { app } from "../../src/app";
import { API_VERSION, ROOT_PATH } from "../../src/constants/basePathRoutes";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.BRANDMASTER;

import { prismaMock } from "../singleton";

describe("Testing API BrandMaster", () => {
  it("should return brand info for matching domain in /self", async () => {
    const brandData = {
      idBrandMaster: 1,
      brandName: "Brand Test",
      domain: "test.local",
      deletedAt: null,
    };

    // Mocking prisma response
    prismaMock.brandMaster.findFirst.mockResolvedValue(brandData as any);

    const res = await request(app)
      .get(`${BASE_PATH}/self`)
      .set("Host", "test.local");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(brandData);
    expect(prismaMock.brandMaster.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          domain: {
            contains: "test.local"
          }
        }
      })
    );
  });

  it("should return null for non-matching domain in /self", async () => {
    prismaMock.brandMaster.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .get(`${BASE_PATH}/self`)
      .set("Host", "unknown.local");

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
