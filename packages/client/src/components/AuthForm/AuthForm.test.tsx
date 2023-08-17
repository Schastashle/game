import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AuthForm, { IAuthFormProps } from './AuthForm'
import { LoginSchemas } from '../../schemas'
import { Provider } from 'react-redux'
import { store } from '../../store/index'

const testProps = {
  title: 'Test Title',
  linkTo: '/signup',
  linkText: 'Sign Up',
}

describe('AuthForm', () => {
  const testProps: IAuthFormProps = {
    title: 'Test Title',
    linkTo: '/signup',
    linkText: 'Sign Up',
    inputs: [
      { name: 'email', type: 'email', placeholder: 'Enter your email' },
      {
        name: 'password',
        type: 'password',
        placeholder: 'Enter your password',
      },
    ],
    schema: {} as LoginSchemas,
  }

  it('Вызов onSubmit с правильными данными при отправке формы', () => {
    const mockDispatch = jest.fn()
    const mockUseAppDispatch = jest.fn(() => mockDispatch)

    const mockUseForm = jest.fn(() => ({
      register: jest.fn(),
      handleSubmit: (callback: (data: any) => void) =>
        callback({ email: 'test@example.com', password: 'password123!' }),
      formState: { errors: {} },
    }))

    const mockSigninUser = jest.fn()
    const mockSignupUser = jest.fn()

    const mockActions = {
      signinUser: mockSigninUser,
      signupUser: mockSignupUser,
    }

    jest.mock('../../hooks/reduxHooks', () => ({
      useAppDispatch: mockUseAppDispatch,
    }))
    jest.mock('react-hook-form', () => ({ useForm: mockUseForm }))
    jest.mock('../../types/IUser', () => mockActions)

    render(<AuthForm {...testProps} />)
    const submitButton = screen.getByText('Отправить')
    fireEvent.click(submitButton)

    expect(mockUseAppDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledTimes(1)

    if (testProps.linkTo.includes('signup')) {
      expect(mockSigninUser).toHaveBeenCalledTimes(1)
      expect(mockSignupUser).not.toHaveBeenCalled()
    } else {
      expect(mockSigninUser).not.toHaveBeenCalled()
      expect(mockSignupUser).toHaveBeenCalledTimes(1)
    }
  })
})
