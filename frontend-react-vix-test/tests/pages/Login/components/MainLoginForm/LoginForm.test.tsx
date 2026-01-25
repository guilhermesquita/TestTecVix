
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "../../../../../src/pages/Login/components/MainLoginForm/LoginForm";
import "@testing-library/jest-dom/vitest";

// Mock hooks
vi.mock("../../../../../src/stores/useZTheme", () => ({
    useZTheme: () => ({
        theme: {
            light: {
                dark: "#000",
                blue: "#00F",
                tertiary: "#ccc",
                light: "#fff",
            },
            dark: {
                dark: "#fff",
                blue: "#00F",
                tertiary: "#333",
                light: "#000",
            },
        },
        mode: "light",
    }),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("LoginForm", () => {
    const defaultProps = {
        username: "",
        setUsername: vi.fn(),
        email: "",
        setEmail: vi.fn(),
        password: "",
        setPassword: vi.fn(),
        onEnterPassword: vi.fn(),
    };

    it("should match snapshot", () => {
        const { container } = render(<LoginForm {...defaultProps} />);
        expect(container).toMatchSnapshot();
    });

    it("renders email and password inputs", () => {
        render(<LoginForm {...defaultProps} />);

        expect(screen.getByText("loginRegister.email")).toBeInTheDocument();
        expect(screen.getByText("loginRegister.password")).toBeInTheDocument();
    });

    it("calls setEmail when email input changes", () => {
        render(<LoginForm {...defaultProps} />);

        const elements = screen.getAllByRole("textbox");
        // Usually the first one or we can find by id if we really trust it
        // But testing library suggests label. 
        // Now that we fixed the label htmlFor, we can try getByLabelText?
        // However, input is inside SimpleInput which handles its own IDs inside an InputBase... 
        // Let's assume the first textbox is email (standard structure).
        const emailInput = elements[0];

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        expect(defaultProps.setEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("calls setPassword when password input changes", () => {
        const { container } = render(<LoginForm {...defaultProps} />);

        // Password input is type="password"
        const passwordInput = container.querySelector('input[type="password"]');

        expect(passwordInput).toBeInTheDocument();
        if (passwordInput) {
            fireEvent.change(passwordInput, { target: { value: "secret123" } });
            expect(defaultProps.setPassword).toHaveBeenCalledWith("secret123");
        }
    });
});

