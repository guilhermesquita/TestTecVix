import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FullFilledButton } from "../../../src/components/Buttons/FullFilledButton";
import "@testing-library/jest-dom/vitest";

// Mock the useZTheme hook
vi.mock("../../../src/stores/useZTheme", () => ({
    useZTheme: () => ({
        theme: {
            light: {
                blue: "#0000FF",
                btnText: "#FFFFFF",
            },
            dark: {
                blue: "#0000FF",
                btnText: "#FFFFFF",
            },
        },
        mode: "light",
    }),
}));

describe("FullFilledButton", () => {
    it("should match snapshot", () => {
        const { container } = render(<FullFilledButton label="Click me" />);
        expect(container).toMatchSnapshot();
    });

    it("renders with correct label", () => {
        render(<FullFilledButton label="Test Button" />);
        expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
        const handleClick = vi.fn();
        render(<FullFilledButton label="Click me" onClick={handleClick} />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
