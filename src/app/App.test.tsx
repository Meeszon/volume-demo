import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

const { mockGetSession, mockOnAuthStateChange, mockSignOut } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockSignOut: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signOut: mockSignOut,
    },
  },
}));

describe("App", () => {
  it("shows login page when unauthenticated", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    render(<App />);
    await act(() => Promise.resolve());

    expect(screen.getByPlaceholderText(/email/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /send magic link/i })).toBeTruthy();
  });

  it("shows app content when authenticated", async () => {
    const fakeSession = { user: { id: "user-1" }, access_token: "tok" };
    mockGetSession.mockResolvedValue({ data: { session: fakeSession } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    render(<App />);
    await act(() => Promise.resolve());

    expect(screen.queryByPlaceholderText(/email/i)).toBeNull();
  });
});
