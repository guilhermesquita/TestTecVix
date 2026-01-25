import { BrandMasterService } from "../../src/services/BrandMasterService";
import { BrandMasterModel } from "../../src/models/BrandMasterModel";
// Mocks
jest.mock("../../src/models/BrandMasterModel");


describe("BrandMasterService", () => {
  let brandMasterService: BrandMasterService;
  let brandMasterModel: any;

  beforeEach(() => {
    brandMasterService = new BrandMasterService();
    brandMasterModel = (brandMasterService as any).brandMasterModel;
  });

  describe("getSelf", () => {
    it("should call getSelf in model with correct domain", async () => {
      const domain = "test.local";
      brandMasterModel.getSelf.mockResolvedValue({ idBrandMaster: 1, brandName: "Test Brand" });

      const result = await brandMasterService.getSelf(domain);

      expect(brandMasterModel.getSelf).toHaveBeenCalledWith(domain);
      expect(result).toEqual({ idBrandMaster: 1, brandName: "Test Brand" });
    });
  });

  describe("updateBrandMaster", () => {
    it("updateBrandMaster should be called", async () => {
      const idbrandMaster = 1;
      brandMasterModel.updateBrandMaster.mockResolvedValue({} as any);
      brandMasterModel.getById.mockResolvedValue({ idbrandMaster: 1 } as any);
      await brandMasterService.updateBrandMaster(idbrandMaster, {}, {
        idBrandMaster: 1,
      } as any);

      expect(brandMasterModel.updateBrandMaster).toHaveBeenCalled();
    });

    it("updateBrandMaster should not be called", async () => {
      const idbrandMaster = 1;
      brandMasterModel.updateBrandMaster.mockResolvedValue({} as any);
      brandMasterModel.getById.mockResolvedValue({ idbrandMaster: 1 } as any);
      await expect(
        brandMasterService.updateBrandMaster(idbrandMaster, {}, {
          idBrandMaster: 2,
        } as any),
      ).rejects.toBeTruthy();
    });
  });
});
