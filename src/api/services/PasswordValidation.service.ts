export class PasswordValidationService {
    static validate(password: string): void {
        if (password.length < 9) {
            throw new Error('Invalid password lenght.');
        }

        if (!/\d/.test(password)) {
            throw new Error('Password has to contain at least one number.');
        }

        if (!/[A-Z]/.test(password)) {
            throw new Error('Password has to contain one uppercase letter.');
        }

        if (!/\W/.test(password)) {
            throw new Error('Password has to contain one special character.');
        }
    }
}