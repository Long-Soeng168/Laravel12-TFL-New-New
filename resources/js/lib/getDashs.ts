export function getDashes(num: number): string {
    if (!num) return '';

    // Remove trailing zeros
    const numStr = num?.toString()?.replace(/0+$/, '');

    // Return dashes based on the remaining digits
    return '-'.repeat(numStr.length);
}
