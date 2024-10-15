import { readFileSync } from 'fs';

export function importJson(path) {
    const file = readFileSync(path, 'utf8');
    return JSON.parse(file);
}

