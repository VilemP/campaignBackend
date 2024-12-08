import { ClientError } from './types.js';

export class InvalidIdError implements ClientError {
    readonly kind = 'client_error';
    readonly message: string;
    readonly suggestedAction: string;
    
    constructor(value: string) {
        this.message = `Invalid UUID format: ${value}`;
        this.suggestedAction = "Please provide a valid UUID following RFC 4122";
    }
}
