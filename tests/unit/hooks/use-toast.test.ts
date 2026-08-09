import { describe, it, expect } from "vitest";
import { reducer } from "@/modules/shared/hooks/use-toast";

type State = Parameters<typeof reducer>[0];
type Toast = State["toasts"][number];

const makeToast = (id: string, overrides: Partial<Toast> = {}): Toast => ({ id, title: `Toast ${id}`, open: true, ...overrides });

describe("use-toast reducer", () => {
  it("adds a toast", () => {
    const state = reducer({ toasts: [] }, { type: "ADD_TOAST", toast: makeToast("1") });
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0]?.id).toBe("1");
  });

  it("keeps only the newest toast (TOAST_LIMIT = 1)", () => {
    const state = reducer({ toasts: [makeToast("1")] }, { type: "ADD_TOAST", toast: makeToast("2") });
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0]?.id).toBe("2");
  });

  it("updates a matching toast only", () => {
    const state = reducer(
      { toasts: [makeToast("1"), makeToast("2")] },
      { type: "UPDATE_TOAST", toast: { id: "2", title: "Actualizado" } }
    );
    expect(state.toasts[0]?.title).toBe("Toast 1");
    expect(state.toasts[1]?.title).toBe("Actualizado");
  });

  it("ignores updates for unknown ids", () => {
    const initial = { toasts: [makeToast("1")] };
    const state = reducer(initial, { type: "UPDATE_TOAST", toast: { id: "nope", title: "x" } });
    expect(state.toasts).toEqual(initial.toasts);
  });

  it("closes the dismissed toast", () => {
    const state = reducer({ toasts: [makeToast("1"), makeToast("2")] }, { type: "DISMISS_TOAST", toastId: "1" });
    expect(state.toasts[0]?.open).toBe(false);
    expect(state.toasts[1]?.open).toBe(true);
  });

  it("closes every toast when no id is given", () => {
    const state = reducer({ toasts: [makeToast("1"), makeToast("2")] }, { type: "DISMISS_TOAST" });
    expect(state.toasts.every((t) => t.open === false)).toBe(true);
  });

  it("removes a toast by id", () => {
    const state = reducer({ toasts: [makeToast("1"), makeToast("2")] }, { type: "REMOVE_TOAST", toastId: "1" });
    expect(state.toasts.map((t) => t.id)).toEqual(["2"]);
  });

  it("removes every toast when no id is given", () => {
    const state = reducer({ toasts: [makeToast("1"), makeToast("2")] }, { type: "REMOVE_TOAST" });
    expect(state.toasts).toEqual([]);
  });

  it("does not mutate the given state", () => {
    const initial = { toasts: [makeToast("1")] };
    reducer(initial, { type: "DISMISS_TOAST", toastId: "1" });
    expect(initial.toasts[0]?.open).toBe(true);
  });
});
