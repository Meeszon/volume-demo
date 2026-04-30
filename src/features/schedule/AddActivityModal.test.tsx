import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddActivityModal } from "./AddActivityModal";
import type { ActivityType } from "../../types";

describe("AddActivityModal", () => {
  let onClose: () => void;
  let onAdd: (type: ActivityType, title: string) => void;

  beforeEach(() => {
    onClose = vi.fn();
    onAdd = vi.fn();
  });

  function renderModal() {
    return render(
      <AddActivityModal
        dayLabel="Monday 28 Apr"
        onClose={onClose}
        onAdd={onAdd}
      />,
    );
  }

  describe("Step 1: Category Picker", () => {
    it("shows four category buttons", () => {
      renderModal();

      expect(screen.getByRole("button", { name: /climbing session/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /conditioning/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /mobility/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /warm up/i })).toBeTruthy();
    });

    it("does not show back button on step 1", () => {
      renderModal();

      expect(screen.queryByRole("button", { name: /back/i })).toBeNull();
    });

    it("clicking a category advances to step 2", async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole("button", { name: /conditioning/i }));

      expect(screen.queryByRole("button", { name: /climbing session/i })).toBeNull();
      expect(screen.getByRole("button", { name: /back/i })).toBeTruthy();
    });
  });

  describe("Step 2: Back button", () => {
    it("returns to step 1 when clicked", async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByRole("button", { name: /conditioning/i }));
      await user.click(screen.getByRole("button", { name: /back/i }));

      expect(screen.getByRole("button", { name: /climbing session/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /conditioning/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /mobility/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /warm up/i })).toBeTruthy();
    });
  });

  describe("Step 2: Conditioning", () => {
    async function goToConditioning() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /conditioning/i }));
      return user;
    }

    it("shows all 5 conditioning templates", async () => {
      await goToConditioning();

      expect(screen.getByText("Weighted Pull Ups")).toBeTruthy();
      expect(screen.getByText("Shoulder Press")).toBeTruthy();
      expect(screen.getByText("Bench Press")).toBeTruthy();
      expect(screen.getByText("Deadlift")).toBeTruthy();
      expect(screen.getByText("Seated Shoulder Rotation")).toBeTruthy();
    });

    it("clicking a template calls onAdd with conditioning type and title", async () => {
      const user = await goToConditioning();

      await user.click(screen.getByText("Weighted Pull Ups"));

      expect(onAdd).toHaveBeenCalledWith("conditioning", "Weighted Pull Ups");
      expect(onClose).toHaveBeenCalled();
    });

    it("shows free-text input for custom activity", async () => {
      await goToConditioning();

      expect(screen.getByPlaceholderText(/custom activity/i)).toBeTruthy();
    });

    it("submitting custom text calls onAdd with typed name", async () => {
      const user = await goToConditioning();

      const input = screen.getByPlaceholderText(/custom activity/i);
      await user.type(input, "Barbell Rows");
      await user.click(screen.getByRole("button", { name: /^add$/i }));

      expect(onAdd).toHaveBeenCalledWith("conditioning", "Barbell Rows");
      expect(onClose).toHaveBeenCalled();
    });

    it("does not submit empty custom text", async () => {
      const user = await goToConditioning();

      await user.click(screen.getByRole("button", { name: /^add$/i }));

      expect(onAdd).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it("submitting custom text via Enter key calls onAdd", async () => {
      const user = await goToConditioning();

      const input = screen.getByPlaceholderText(/custom activity/i);
      await user.type(input, "Barbell Rows{Enter}");

      expect(onAdd).toHaveBeenCalledWith("conditioning", "Barbell Rows");
      expect(onClose).toHaveBeenCalled();
    });

    it("does not submit whitespace-only custom text", async () => {
      const user = await goToConditioning();

      const input = screen.getByPlaceholderText(/custom activity/i);
      await user.type(input, "   ");
      await user.click(screen.getByRole("button", { name: /^add$/i }));

      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe("Step 2: Mobility", () => {
    async function goToMobility() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /mobility/i }));
      return user;
    }

    it("shows all 5 mobility templates", async () => {
      await goToMobility();

      expect(screen.getByText("Ankle Flexibility")).toBeTruthy();
      expect(screen.getByText("Pancake Stretch")).toBeTruthy();
      expect(screen.getByText("Revolver Stretch")).toBeTruthy();
      expect(screen.getByText("Cossack Squats")).toBeTruthy();
      expect(screen.getByText("Pigeon Pose")).toBeTruthy();
    });

    it("Ankle Flexibility shows its 3 exercises", async () => {
      await goToMobility();

      const ankleItem = screen.getByText("Ankle Flexibility").closest("button")!;
      expect(within(ankleItem).getByText(/Calf Stretch/)).toBeTruthy();
      expect(within(ankleItem).getByText(/Donkey Calf Raise/)).toBeTruthy();
      expect(within(ankleItem).getByText(/Fishermans - Passive/)).toBeTruthy();
    });

    it("clicking a template calls onAdd with mobility type", async () => {
      const user = await goToMobility();

      await user.click(screen.getByText("Pancake Stretch"));

      expect(onAdd).toHaveBeenCalledWith("mobility", "Pancake Stretch");
      expect(onClose).toHaveBeenCalled();
    });

    it("shows free-text input for custom activity", async () => {
      await goToMobility();

      expect(screen.getByPlaceholderText(/custom activity/i)).toBeTruthy();
    });
  });

  describe("Step 2: Warm Up", () => {
    async function goToWarmup() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /warm up/i }));
      return user;
    }

    it("shows General Warm Up with all 5 exercises", async () => {
      await goToWarmup();

      expect(screen.getByText("General Warm Up")).toBeTruthy();
      expect(screen.getByText(/Leg Swings/)).toBeTruthy();
      expect(screen.getByText(/Scapular Push Ups/)).toBeTruthy();
      expect(screen.getByText(/Cossack Squats/)).toBeTruthy();
      expect(screen.getByText(/Face Pulls/)).toBeTruthy();
      expect(screen.getByText(/Split Squats/)).toBeTruthy();
    });

    it("clicking General Warm Up calls onAdd with warmup type", async () => {
      const user = await goToWarmup();

      await user.click(screen.getByText("General Warm Up"));

      expect(onAdd).toHaveBeenCalledWith("warmup", "General Warm Up");
      expect(onClose).toHaveBeenCalled();
    });

    it("does not show custom input field", async () => {
      await goToWarmup();

      expect(screen.queryByPlaceholderText(/custom activity/i)).toBeNull();
    });
  });

  describe("Step 2: Climbing Session", () => {
    async function goToClimbing() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /climbing session/i }));
      return user;
    }

    it("shows intent picker with skill tree categories", async () => {
      await goToClimbing();

      expect(screen.getByText("Technique")).toBeTruthy();
      expect(screen.getByText("Mental")).toBeTruthy();
      expect(screen.getByText("Longevity")).toBeTruthy();
      expect(screen.getByText("Strength")).toBeTruthy();
    });

    it("shows skill tree leaf nodes under their categories", async () => {
      await goToClimbing();

      expect(screen.getByRole("button", { name: "Footwork" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Body Positioning" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Core Tension" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Finger Strength" })).toBeTruthy();
    });

    it("shows duration input", async () => {
      await goToClimbing();

      expect(screen.getByLabelText(/duration/i)).toBeTruthy();
    });

    it("selecting an intent marks it as pressed", async () => {
      const user = await goToClimbing();

      const footwork = screen.getByRole("button", { name: "Footwork" });
      await user.click(footwork);

      expect(footwork.getAttribute("aria-pressed")).toBe("true");
    });

    it("submitting with intent and duration calls onAdd with all fields", async () => {
      const user = await goToClimbing();

      await user.click(screen.getByRole("button", { name: "Footwork" }));
      await user.type(screen.getByLabelText(/duration/i), "90");
      await user.click(screen.getByRole("button", { name: /add climbing session/i }));

      expect(onAdd).toHaveBeenCalledWith("climbing", "Footwork", "footwork", 90);
      expect(onClose).toHaveBeenCalled();
    });

    it("cannot submit without selecting an intent", async () => {
      const user = await goToClimbing();

      await user.type(screen.getByLabelText(/duration/i), "90");
      await user.click(screen.getByRole("button", { name: /add climbing session/i }));

      expect(onAdd).not.toHaveBeenCalled();
    });

    it("cannot submit without entering duration", async () => {
      const user = await goToClimbing();

      await user.click(screen.getByRole("button", { name: "Footwork" }));
      await user.click(screen.getByRole("button", { name: /add climbing session/i }));

      expect(onAdd).not.toHaveBeenCalled();
    });

    it("cannot submit with zero duration", async () => {
      const user = await goToClimbing();

      await user.click(screen.getByRole("button", { name: "Footwork" }));
      await user.type(screen.getByLabelText(/duration/i), "0");
      await user.click(screen.getByRole("button", { name: /add climbing session/i }));

      expect(onAdd).not.toHaveBeenCalled();
    });

    it("back button resets intent and duration state", async () => {
      const user = await goToClimbing();

      await user.click(screen.getByRole("button", { name: "Footwork" }));
      await user.type(screen.getByLabelText(/duration/i), "90");
      await user.click(screen.getByRole("button", { name: /back/i }));

      await user.click(screen.getByRole("button", { name: /climbing session/i }));

      const footwork = screen.getByRole("button", { name: "Footwork" });
      expect(footwork.getAttribute("aria-pressed")).toBe("false");
      expect((screen.getByLabelText(/duration/i) as HTMLInputElement).value).toBe("");
    });
  });

  describe("overlay close", () => {
    it("clicking overlay calls onClose", async () => {
      const user = userEvent.setup();
      renderModal();

      const overlay = screen.getByTestId("modal-overlay");
      await user.click(overlay);

      expect(onClose).toHaveBeenCalled();
    });
  });
});
