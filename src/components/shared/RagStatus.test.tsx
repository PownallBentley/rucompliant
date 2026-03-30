import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RagStatus } from "./RagStatus";
import type { HealthStatus } from "@/types";

describe("RagStatus", () => {
  // ── Dot variant ──
  describe("dot variant", () => {
    it("renders with default label for each status", () => {
      const statuses: { status: HealthStatus; label: string }[] = [
        { status: "green", label: "All clear" },
        { status: "amber", label: "Needs attention" },
        { status: "red", label: "Action required" },
      ];

      for (const { status, label } of statuses) {
        const { unmount } = render(
          <RagStatus status={status} variant="dot" />
        );
        expect(screen.getByText(label)).toBeInTheDocument();
        unmount();
      }
    });

    it("hides text label when showLabel is false but keeps aria-label", () => {
      render(<RagStatus status="green" variant="dot" showLabel={false} />);
      expect(screen.queryByText("All clear")).not.toBeInTheDocument();
      // aria-label should still be present for accessibility
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "All clear"
      );
    });

    it("shows text label when showLabel is true", () => {
      render(<RagStatus status="amber" variant="dot" showLabel={true} />);
      expect(screen.getByText("Needs attention")).toBeInTheDocument();
    });

    it("uses custom label when provided", () => {
      render(
        <RagStatus status="green" variant="dot" label="Custom status" />
      );
      expect(screen.getByText("Custom status")).toBeInTheDocument();
    });

    it("has aria-label for accessibility", () => {
      render(<RagStatus status="red" variant="dot" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Action required"
      );
    });
  });

  // ── Badge variant ──
  describe("badge variant", () => {
    it("renders with default label for each status", () => {
      const statuses: { status: HealthStatus; label: string }[] = [
        { status: "green", label: "All clear" },
        { status: "amber", label: "Needs attention" },
        { status: "red", label: "Action required" },
      ];

      for (const { status, label } of statuses) {
        const { unmount } = render(
          <RagStatus status={status} variant="badge" />
        );
        expect(screen.getByText(label)).toBeInTheDocument();
        unmount();
      }
    });

    it("uses custom label when provided", () => {
      render(
        <RagStatus status="amber" variant="badge" label="Warning!" />
      );
      expect(screen.getByText("Warning!")).toBeInTheDocument();
    });

    it("has aria-label for accessibility", () => {
      render(<RagStatus status="green" variant="badge" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "All clear"
      );
    });
  });

  // ── Card variant ──
  describe("card variant", () => {
    it("renders with title and default label", () => {
      render(
        <RagStatus
          status="green"
          variant="card"
          title="Data Protection"
        />
      );
      expect(screen.getByText("Data Protection")).toBeInTheDocument();
      expect(screen.getByText("All clear")).toBeInTheDocument();
    });

    it("renders default description", () => {
      render(<RagStatus status="amber" variant="card" />);
      expect(screen.getByText("Action needed soon")).toBeInTheDocument();
    });

    it("renders custom description", () => {
      render(
        <RagStatus
          status="red"
          variant="card"
          description="2 overdue tasks"
        />
      );
      expect(screen.getByText("2 overdue tasks")).toBeInTheDocument();
    });

    it("has aria-label including title when provided", () => {
      render(
        <RagStatus
          status="amber"
          variant="card"
          title="Employment"
        />
      );
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Employment: Needs attention"
      );
    });

    it("has aria-label without title when not provided", () => {
      render(<RagStatus status="green" variant="card" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "All clear"
      );
    });
  });

  // ── Large variant ──
  describe("large variant", () => {
    it("renders with large status display", () => {
      render(<RagStatus status="green" variant="large" />);
      expect(screen.getByText("All clear")).toBeInTheDocument();
      expect(screen.getByText("No outstanding actions")).toBeInTheDocument();
    });

    it("renders trend arrow when trend is provided", () => {
      render(
        <RagStatus status="green" variant="large" trend="improving" />
      );
      expect(screen.getByText("Improving")).toBeInTheDocument();
    });

    it("renders stable trend", () => {
      render(
        <RagStatus status="amber" variant="large" trend="stable" />
      );
      expect(screen.getByText("Stable")).toBeInTheDocument();
    });

    it("renders declining trend", () => {
      render(
        <RagStatus status="red" variant="large" trend="declining" />
      );
      expect(screen.getByText("Declining")).toBeInTheDocument();
    });

    it("does not render trend when not provided", () => {
      render(<RagStatus status="green" variant="large" />);
      expect(screen.queryByText("Improving")).not.toBeInTheDocument();
      expect(screen.queryByText("Stable")).not.toBeInTheDocument();
      expect(screen.queryByText("Declining")).not.toBeInTheDocument();
    });

    it("renders lastUpdated date", () => {
      const date = new Date("2026-03-15");
      render(
        <RagStatus
          status="green"
          variant="large"
          lastUpdated={date}
        />
      );
      expect(screen.getByText(/15 Mar 2026/)).toBeInTheDocument();
    });

    it("has aria-label for accessibility", () => {
      render(<RagStatus status="red" variant="large" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Health score: Action required"
      );
    });

    it("uses custom label and description", () => {
      render(
        <RagStatus
          status="amber"
          variant="large"
          label="Partially compliant"
          description="3 items need review"
        />
      );
      expect(screen.getByText("Partially compliant")).toBeInTheDocument();
      expect(screen.getByText("3 items need review")).toBeInTheDocument();
    });
  });
});
