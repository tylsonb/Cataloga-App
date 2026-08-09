import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import * as repository from "@/modules/business/repositories/business.repository";
import {
  createBusinessAction,
  updateBusinessAction,
  toggleBusinessStatusAction,
  getBusinessBySlugAction,
  getBusinessByOwnerAction,
} from "@/modules/business/actions/business.actions";
import { createSupabaseMock, type SupabaseMockOptions } from "../helpers/supabase-mock";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/modules/business/repositories/business.repository", () => ({
  createBusiness: vi.fn(),
  updateBusiness: vi.fn(),
  toggleBusinessStatus: vi.fn(),
  getBusinessBySlug: vi.fn(),
  getBusinessByOwner: vi.fn(),
}));

const repo = vi.mocked(repository);
const mockedCreateClient = vi.mocked(createClient);

function useSupabase(options: SupabaseMockOptions = {}) {
  const supabase = createSupabaseMock(options);
  mockedCreateClient.mockResolvedValue(supabase.client as never);
  return supabase;
}

const validInput = { name: "Café Central", whatsapp: "+56912345678" };

beforeEach(() => {
  vi.clearAllMocks();
  useSupabase({ user: { id: "u1" } });
});

describe("createBusinessAction", () => {
  it("attaches the owner and a slug derived from the name", async () => {
    repo.createBusiness.mockResolvedValue({ id: "b1" } as never);
    await expect(createBusinessAction(validInput)).resolves.toEqual({ success: true });
    expect(repo.createBusiness).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "cafe-central", owner_id: "u1" })
    );
  });

  it("requires an active session", async () => {
    useSupabase({ user: null });
    await expect(createBusinessAction(validInput)).resolves.toEqual({ success: false, error: "No hay sesión activa" });
    expect(repo.createBusiness).not.toHaveBeenCalled();
  });

  it("rejects invalid input", async () => {
    await expect(createBusinessAction({ name: "A", whatsapp: "1" })).resolves.toEqual({
      success: false,
      error: "Revisa los datos ingresados",
    });
    expect(repo.createBusiness).not.toHaveBeenCalled();
  });

  it("reports a repository failure", async () => {
    repo.createBusiness.mockResolvedValue(null);
    await expect(createBusinessAction(validInput)).resolves.toEqual({
      success: false,
      error: "No fue posible crear el negocio",
    });
  });
});

describe("updateBusinessAction", () => {
  it("forwards the parsed patch", async () => {
    repo.updateBusiness.mockResolvedValue({ id: "b1" } as never);
    await expect(updateBusinessAction("b1", { city: "Santiago" })).resolves.toEqual({ success: true });
    expect(repo.updateBusiness).toHaveBeenCalledWith("b1", { city: "Santiago" });
  });

  it("rejects invalid input", async () => {
    await expect(updateBusinessAction("b1", { whatsapp: "123" })).resolves.toEqual({
      success: false,
      error: "Revisa los datos ingresados",
    });
    expect(repo.updateBusiness).not.toHaveBeenCalled();
  });

  it("reports a repository failure", async () => {
    repo.updateBusiness.mockResolvedValue(null);
    await expect(updateBusinessAction("b1", { city: "Santiago" })).resolves.toEqual({
      success: false,
      error: "No fue posible actualizar el negocio",
    });
  });
});

describe("toggleBusinessStatusAction", () => {
  it("forwards the active flag", async () => {
    await expect(toggleBusinessStatusAction("b1", false)).resolves.toEqual({ success: true });
    expect(repo.toggleBusinessStatus).toHaveBeenCalledWith("b1", false);
  });
});

describe("read-through actions", () => {
  it("returns the business for a slug", async () => {
    repo.getBusinessBySlug.mockResolvedValue({ id: "b1" } as never);
    await expect(getBusinessBySlugAction("cafe-central")).resolves.toEqual({ id: "b1" });
  });

  it("returns the business for an owner", async () => {
    repo.getBusinessByOwner.mockResolvedValue(null);
    await expect(getBusinessByOwnerAction("u1")).resolves.toBeNull();
    expect(repo.getBusinessByOwner).toHaveBeenCalledWith("u1");
  });
});
