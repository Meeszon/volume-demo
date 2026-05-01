import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddActivityModal } from "./AddActivityModal";
import type { ActivityType, ActivityDetails, FocusOption } from "../../types";

describe("AddActivityModal", () => {
  let onClose: () => void;
  let onAdd: (
    type: ActivityType,
    title: string,
    focus?: FocusOption,
    durationMinutes?: number,
    details?: ActivityDetails,
  ) => void;

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

  describe("Step 2: Climbing Session", () => {
    async function goToClimbing() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /climbing session/i }));
      return user;
    }

    it("shows four duration preset buttons", async () => {
      await goToClimbing();
      expect(screen.getByRole("button", { name: "60 min" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "90 min" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "120 min" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "150 min" })).toBeTruthy();
    });

    it("90 min is pre-selected by default", async () => {
      await goToClimbing();
      expect(screen.getByRole("button", { name: "90 min" }).getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByRole("button", { name: "60 min" }).getAttribute("aria-pressed")).toBe("false");
    });

    it("clicking a preset selects it and deselects 90", async () => {
      const user = await goToClimbing();
      await user.click(screen.getByRole("button", { name: "120 min" }));
      expect(screen.getByRole("button", { name: "120 min" }).getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByRole("button", { name: "90 min" }).getAttribute("aria-pressed")).toBe("false");
    });

    it("shows all five focus options", async () => {
      await goToClimbing();
      for (const focus of ["Endurance", "Power", "Technique", "Footwork", "Finger Strength"]) {
        expect(screen.getByRole("button", { name: focus })).toBeTruthy();
      }
    });

    it("no focus is selected by default", async () => {
      await goToClimbing();
      for (const focus of ["Endurance", "Power", "Technique", "Footwork", "Finger Strength"]) {
        expect(screen.getByRole("button", { name: focus }).getAttribute("aria-pressed")).toBe("false");
      }
    });

    it("selecting a focus marks it as pressed", async () => {
      const user = await goToClimbing();
      await user.click(screen.getByRole("button", { name: "Endurance" }));
      expect(screen.getByRole("button", { name: "Endurance" }).getAttribute("aria-pressed")).toBe("true");
    });

    it("submitting without focus calls onAdd with duration and no focus", async () => {
      const user = await goToClimbing();
      await user.click(screen.getByRole("button", { name: /add climbing session/i }));
      expect(onAdd).toHaveBeenCalledWith("climbing", "Climbing Session", undefined, 90);
      expect(onClose).toHaveBeenCalled();
    });

    it("submitting with focus calls onAdd with focus and selected duration", async () => {
      const user = await goToClimbing();
      await user.click(screen.getByRole("button", { name: "Endurance" }));
      await user.click(screen.getByRole("button", { name: "120 min" }));
      await user.click(screen.getByRole("button", { name: /add climbing session/i }));
      expect(onAdd).toHaveBeenCalledWith("climbing", "Climbing Session", "Endurance", 120);
      expect(onClose).toHaveBeenCalled();
    });

    it("back button returns to category picker and resets state", async () => {
      const user = await goToClimbing();
      await user.click(screen.getByRole("button", { name: "Endurance" }));
      await user.click(screen.getByRole("button", { name: "120 min" }));
      await user.click(screen.getByRole("button", { name: /back/i }));

      expect(screen.getByRole("button", { name: /climbing session/i })).toBeTruthy();

      await user.click(screen.getByRole("button", { name: /climbing session/i }));
      expect(screen.getByRole("button", { name: "90 min" }).getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByRole("button", { name: "Endurance" }).getAttribute("aria-pressed")).toBe("false");
    });
  });

  describe("Step 2: Conditioning — tab browser", () => {
    async function goToConditioning() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /conditioning/i }));
      return user;
    }

    it("shows Blocks and Exercises tabs", async () => {
      await goToConditioning();
      expect(screen.getByRole("tab", { name: /blocks/i })).toBeTruthy();
      expect(screen.getByRole("tab", { name: /exercises/i })).toBeTruthy();
    });

    it("Exercises tab shows all 5 conditioning templates by default", async () => {
      await goToConditioning();
      expect(screen.getByText("Weighted Pull Ups")).toBeTruthy();
      expect(screen.getByText("Shoulder Press")).toBeTruthy();
      expect(screen.getByText("Bench Press")).toBeTruthy();
      expect(screen.getByText("Deadlift")).toBeTruthy();
      expect(screen.getByText("Seated Shoulder Rotation")).toBeTruthy();
    });

    it("clicking Blocks tab hides exercise templates", async () => {
      const user = await goToConditioning();
      await user.click(screen.getByRole("tab", { name: /blocks/i }));
      expect(screen.queryByText("Weighted Pull Ups")).toBeNull();
    });

    it("clicking a template navigates to the edit screen", async () => {
      const user = await goToConditioning();
      await user.click(screen.getByText("Weighted Pull Ups"));
      expect(screen.queryByRole("tab", { name: /exercises/i })).toBeNull();
      expect(screen.getByLabelText(/sets for weighted pull ups/i)).toBeTruthy();
    });

    it("back from tabs returns to category picker", async () => {
      const user = await goToConditioning();
      await user.click(screen.getByRole("button", { name: /back/i }));
      expect(screen.getByRole("button", { name: /climbing session/i })).toBeTruthy();
    });
  });

  describe("Step 2: Mobility — tab browser", () => {
    async function goToMobility() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /mobility/i }));
      return user;
    }

    it("Exercises tab shows single-exercise mobility templates", async () => {
      await goToMobility();
      expect(screen.getByText("Pancake Stretch")).toBeTruthy();
      expect(screen.getByText("Revolver Stretch")).toBeTruthy();
      expect(screen.getByText("Cossack Squats")).toBeTruthy();
      expect(screen.getByText("Pigeon Pose")).toBeTruthy();
      expect(screen.queryByText("Ankle Flexibility")).toBeNull();
    });

    it("Blocks tab shows Ankle Flexibility", async () => {
      const user = await goToMobility();
      await user.click(screen.getByRole("tab", { name: /blocks/i }));
      expect(screen.getByText("Ankle Flexibility")).toBeTruthy();
    });

    it("Ankle Flexibility block shows sub-exercise names", async () => {
      const user = await goToMobility();
      await user.click(screen.getByRole("tab", { name: /blocks/i }));
      const ankleItem = screen.getByText("Ankle Flexibility").closest("button")!;
      expect(within(ankleItem).getByText(/Calf Stretch/)).toBeTruthy();
      expect(within(ankleItem).getByText(/Donkey Calf Raise/)).toBeTruthy();
      expect(within(ankleItem).getByText(/Fishermans - Passive/)).toBeTruthy();
    });
  });

  describe("Step 2: Warm Up — tab browser", () => {
    async function goToWarmUp() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /warm up/i }));
      return user;
    }

    it("Blocks tab shows General Warm Up", async () => {
      const user = await goToWarmUp();
      await user.click(screen.getByRole("tab", { name: /blocks/i }));
      expect(screen.getByText("General Warm Up")).toBeTruthy();
    });

    it("General Warm Up block shows its exercises", async () => {
      const user = await goToWarmUp();
      await user.click(screen.getByRole("tab", { name: /blocks/i }));
      const warmUpItem = screen.getByText("General Warm Up").closest("button")!;
      expect(within(warmUpItem).getByText(/Leg Swings/)).toBeTruthy();
      expect(within(warmUpItem).getByText(/Scapular Push Ups/)).toBeTruthy();
    });
  });

  describe("Step 3: Edit — single exercise (Weighted Pull Ups)", () => {
    async function goToEditWeightedPullUps() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /conditioning/i }));
      await user.click(screen.getByText("Weighted Pull Ups"));
      return user;
    }

    it("shows the exercise name", async () => {
      await goToEditWeightedPullUps();
      expect(screen.getByText("Weighted Pull Ups")).toBeTruthy();
    });

    it("sets is pre-filled with default (3)", async () => {
      await goToEditWeightedPullUps();
      const input = screen.getByLabelText(/sets for weighted pull ups/i) as HTMLInputElement;
      expect(input.value).toBe("3");
    });

    it("value is pre-filled with default (10)", async () => {
      await goToEditWeightedPullUps();
      const input = screen.getByLabelText(/reps for weighted pull ups/i) as HTMLInputElement;
      expect(input.value).toBe("10");
    });

    it("unit is shown as read-only text (reps)", async () => {
      await goToEditWeightedPullUps();
      expect(screen.getByText("reps")).toBeTruthy();
    });

    it("rest is pre-filled with default (60)", async () => {
      await goToEditWeightedPullUps();
      const input = screen.getByLabelText(/rest for weighted pull ups/i) as HTMLInputElement;
      expect(input.value).toBe("60");
    });

    it("confirming with defaults calls onAdd with exercise ActivityDetails", async () => {
      const user = await goToEditWeightedPullUps();
      await user.click(screen.getByRole("button", { name: /add activity/i }));
      expect(onAdd).toHaveBeenCalledWith(
        "conditioning",
        "Weighted Pull Ups",
        undefined,
        undefined,
        { kind: "exercise", sets: 3, value: 10, unit: "reps", rest: 60 },
      );
      expect(onClose).toHaveBeenCalled();
    });

    it("editing sets changes the ActivityDetails on confirm", async () => {
      const user = await goToEditWeightedPullUps();
      const setsInput = screen.getByLabelText(/sets for weighted pull ups/i);
      await user.clear(setsInput);
      await user.type(setsInput, "5");
      await user.click(screen.getByRole("button", { name: /add activity/i }));
      expect(onAdd).toHaveBeenCalledWith(
        "conditioning",
        "Weighted Pull Ups",
        undefined,
        undefined,
        { kind: "exercise", sets: 5, value: 10, unit: "reps", rest: 60 },
      );
    });

    it("back from edit returns to tab browser", async () => {
      const user = await goToEditWeightedPullUps();
      await user.click(screen.getByRole("button", { name: /back/i }));
      expect(screen.getByRole("tab", { name: /exercises/i })).toBeTruthy();
    });
  });

  describe("Step 3: Edit — block (Ankle Flexibility)", () => {
    async function goToEditAnkleFlexibility() {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole("button", { name: /mobility/i }));
      await user.click(screen.getByRole("tab", { name: /blocks/i }));
      await user.click(screen.getByText("Ankle Flexibility"));
      return user;
    }

    it("shows the block name", async () => {
      await goToEditAnkleFlexibility();
      expect(screen.getByText("Ankle Flexibility")).toBeTruthy();
    });

    it("shows exercises with their default values", async () => {
      await goToEditAnkleFlexibility();
      expect(
        (screen.getByLabelText(/sets for calf stretch/i) as HTMLInputElement).value,
      ).toBe("3");
      expect(
        (screen.getByLabelText(/seconds for calf stretch/i) as HTMLInputElement).value,
      ).toBe("30");
      expect(
        (screen.getByLabelText(/sets for donkey calf raise/i) as HTMLInputElement).value,
      ).toBe("3");
      expect(
        (screen.getByLabelText(/reps for donkey calf raise/i) as HTMLInputElement).value,
      ).toBe("10");
    });

    it("confirming with defaults calls onAdd with block ActivityDetails", async () => {
      const user = await goToEditAnkleFlexibility();
      await user.click(screen.getByRole("button", { name: /add activity/i }));
      expect(onAdd).toHaveBeenCalledWith(
        "mobility",
        "Ankle Flexibility",
        undefined,
        undefined,
        {
          kind: "block",
          exercises: [
            { name: "Calf Stretch", sets: 3, value: 30, unit: "seconds", rest: 60 },
            { name: "Donkey Calf Raise", sets: 3, value: 10, unit: "reps", rest: 60 },
            { name: "Fishermans - Passive", sets: 3, value: 30, unit: "seconds", rest: 60 },
          ],
        },
      );
      expect(onClose).toHaveBeenCalled();
    });

    it("back from edit returns to tab browser on Blocks tab", async () => {
      const user = await goToEditAnkleFlexibility();
      await user.click(screen.getByRole("button", { name: /back/i }));
      expect(screen.getByRole("tab", { name: /blocks/i })).toBeTruthy();
      expect(screen.getByText("Ankle Flexibility")).toBeTruthy();
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
