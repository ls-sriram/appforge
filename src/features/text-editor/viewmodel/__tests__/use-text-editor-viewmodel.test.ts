import { act, renderHook } from "@testing-library/react-native";
import { useTextEditorViewModel } from "../../text-editor.viewmodel";

jest.mock("../../usecases/text-editor-actions", () => ({
  listDocuments: jest.fn().mockResolvedValue({ ok: true, data: [] }),
  saveDocument: jest.fn().mockResolvedValue({
    ok: true,
    data: {
      id: "doc-1",
      title: "Title",
      tag: "notes",
      version: "v1",
      content: "hello",
      contentLength: 5,
      createdAt: "2026-05-24T00:00:00.000Z",
      updatedAt: "2026-05-24T00:00:00.000Z",
    },
  }),
  loadTextEditorDraft: jest.fn().mockResolvedValue(undefined),
  saveTextEditorDraft: jest.fn().mockResolvedValue(undefined),
  clearTextEditorDraft: jest.fn().mockResolvedValue(undefined),
}));

describe("text-editor/viewmodel/useTextEditorViewModel", () => {
  it("clamps content at 20,000 characters", async () => {
    const { result } = renderHook(() => useTextEditorViewModel({ uid: "u1" }));
    const oversized = "a".repeat(21_000);

    await act(async () => {
      result.current.actions.setContent(oversized);
    });

    expect(result.current.state.content.length).toBe(20_000);
  });

  it("rejects save when title is missing", async () => {
    const { result } = renderHook(() => useTextEditorViewModel({ uid: "u1" }));

    await act(async () => {
      await result.current.actions.save();
    });

    expect(result.current.state.saveStatus).toBe("error");
    expect(result.current.state.error).toBe("Title is required.");
  });
});
