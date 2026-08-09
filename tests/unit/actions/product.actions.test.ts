import { describe, it, expect, beforeEach, vi } from "vitest";
import * as repository from "@/modules/product/repositories/product.repository";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  toggleProductFeaturedAction,
  getProductBySlugAction,
  getProductsAction,
  getProductsByBusinessAction,
  getRelatedProductsAction,
} from "@/modules/product/actions/product.actions";

vi.mock("@/modules/product/repositories/product.repository", () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  toggleProductFeatured: vi.fn(),
  getProductBySlug: vi.fn(),
  getProducts: vi.fn(),
  getProductsByBusiness: vi.fn(),
  getRelatedProducts: vi.fn(),
}));

const repo = vi.mocked(repository);
const validUuid = "550e8400-e29b-41d4-a716-446655440000";
const validInput = { business_id: validUuid, category_id: validUuid, name: "Silla de Madera", price: 15000 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createProductAction", () => {
  it("slugifies the name before inserting", async () => {
    repo.createProduct.mockResolvedValue({ id: "p1" } as never);
    await expect(createProductAction({ ...validInput, name: "Silla de Café" })).resolves.toEqual({ success: true });
    expect(repo.createProduct).toHaveBeenCalledWith(expect.objectContaining({ slug: "silla-de-cafe" }));
  });

  it("rejects invalid input without hitting the repository", async () => {
    await expect(createProductAction({ ...validInput, name: "A" })).resolves.toEqual({
      success: false,
      error: "Revisa los datos ingresados",
    });
    expect(repo.createProduct).not.toHaveBeenCalled();
  });

  it("reports a repository failure", async () => {
    repo.createProduct.mockResolvedValue(null);
    await expect(createProductAction(validInput)).resolves.toEqual({
      success: false,
      error: "No fue posible crear el producto",
    });
  });
});

describe("updateProductAction", () => {
  it("forwards the parsed patch", async () => {
    repo.updateProduct.mockResolvedValue({ id: "p1" } as never);
    await expect(updateProductAction("p1", { price: 200 })).resolves.toEqual({ success: true });
    expect(repo.updateProduct).toHaveBeenCalledWith("p1", { price: 200 });
  });

  it("rejects invalid input", async () => {
    await expect(updateProductAction("p1", { price: -5 })).resolves.toEqual({
      success: false,
      error: "Revisa los datos ingresados",
    });
    expect(repo.updateProduct).not.toHaveBeenCalled();
  });

  it("reports a repository failure", async () => {
    repo.updateProduct.mockResolvedValue(null);
    await expect(updateProductAction("p1", { price: 200 })).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar el producto",
    });
  });
});

describe("deleteProductAction", () => {
  it("delegates to the repository", async () => {
    await expect(deleteProductAction("p1")).resolves.toEqual({ success: true });
    expect(repo.deleteProduct).toHaveBeenCalledWith("p1");
  });
});

describe("toggleProductFeaturedAction", () => {
  it("forwards the featured flag", async () => {
    await expect(toggleProductFeaturedAction("p1", true)).resolves.toEqual({ success: true });
    expect(repo.toggleProductFeatured).toHaveBeenCalledWith("p1", true);
  });
});

describe("read-through actions", () => {
  it("returns the product for a slug", async () => {
    repo.getProductBySlug.mockResolvedValue({ id: "p1" } as never);
    await expect(getProductBySlugAction("silla")).resolves.toEqual({ id: "p1" });
    expect(repo.getProductBySlug).toHaveBeenCalledWith("silla");
  });

  it("forwards list options", async () => {
    repo.getProducts.mockResolvedValue([]);
    await getProductsAction({ category_id: "c1", limit: 5 });
    expect(repo.getProducts).toHaveBeenCalledWith({ category_id: "c1", limit: 5 });
  });

  it("returns products for a business", async () => {
    repo.getProductsByBusiness.mockResolvedValue([{ id: "p1" }] as never);
    await expect(getProductsByBusinessAction("b1")).resolves.toEqual([{ id: "p1" }]);
  });

  it("forwards the related-products limit", async () => {
    repo.getRelatedProducts.mockResolvedValue([]);
    await getRelatedProductsAction("p1", "c1", 8);
    expect(repo.getRelatedProducts).toHaveBeenCalledWith("p1", "c1", 8);
  });
});
