import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../auth/login-form';
import { RegisterForm } from '../auth/register-form';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    register: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('LoginForm', () => {
  it('renders login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login|sign in|دخول/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /login|sign in|دخول/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required|البريد الإلكتروني مطلوب/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required|كلمة المرور مطلوبة/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login|sign in|دخول/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email|البريد الإلكتروني غير صالح/i)
      ).toBeInTheDocument();
    });
  });

  it('calls login function with correct data on submit', async () => {
    const mockLogin = jest.fn();
    jest.mock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        login: mockLogin,
        isLoading: false,
        error: null,
      }),
    }));

    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login|sign in|دخول/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
    });
  });

  it('disables submit button while loading', () => {
    jest.mock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        login: jest.fn(),
        isLoading: true,
        error: null,
      }),
    }));

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /login|sign in|دخول/i });
    expect(submitButton).toBeDisabled();
  });
});

describe('RegisterForm', () => {
  it('renders register form correctly', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/name|الاسم/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password|كلمة المرور$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password|تأكيد كلمة المرور/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register|sign up|تسجيل/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /register|sign up|تسجيل/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required|الاسم مطلوب/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required|البريد الإلكتروني مطلوب/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required|كلمة المرور مطلوبة/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for weak password', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^password|كلمة المرور$/i);
    const submitButton = screen.getByRole('button', { name: /register|sign up|تسجيل/i });

    await user.type(passwordInput, 'weak');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least|كلمة المرور يجب أن تكون/i)
      ).toBeInTheDocument();
    });
  });

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^password|كلمة المرور$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password|تأكيد كلمة المرور/i);
    const submitButton = screen.getByRole('button', { name: /register|sign up|تسجيل/i });

    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'DifferentPassword123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/passwords do not match|كلمات المرور غير متطابقة/i)
      ).toBeInTheDocument();
    });
  });

  it('calls register function with correct data on submit', async () => {
    const mockRegister = jest.fn();
    jest.mock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        register: mockRegister,
        isLoading: false,
        error: null,
      }),
    }));

    const user = userEvent.setup();
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name|الاسم/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password|كلمة المرور$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password|تأكيد كلمة المرور/i);
    const submitButton = screen.getByRole('button', { name: /register|sign up|تسجيل/i });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });
    });
  });
});
