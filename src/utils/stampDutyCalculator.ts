/**
 * Hong Kong Residential Property Stamp Duty Calculator (AVD Scale 2)
 * Effective February 26, 2025
 * 
 * Calculates stamp duty based on the latest AVD Scale 2 bands with marginal relief
 * BSD, SSD, and NRSD are abolished as of February 2024
 */

export interface StampDutyResult {
  amount: number; // Stamp duty amount in HKD
  noteEligibleForRefund: boolean; // Whether buyer may be eligible for refund
}

/**
 * Calculate stamp duty for residential property purchase
 * @param price - Property price in HKD
 * @param isHKPR - Whether buyer is Hong Kong Permanent Resident
 * @param isFirstHome - Whether buyer is first-time home buyer
 * @returns StampDutyResult with amount and refund eligibility
 */
export function calculateStampDuty(
  price: number, 
  isHKPR: boolean = true, 
  isFirstHome: boolean = false
): StampDutyResult {
  let stampDuty = 0;

  // AVD Scale 2 bands (effective Feb 26, 2025)
  if (price <= 4000000) {
    // ≤ 4,000,000: HK$ 100
    stampDuty = 100;
  } else if (price <= 4323780) {
    // > 4,000,000 – ≤ 4,323,780: HK$ 100 + 20% of excess over 4,000,000
    stampDuty = 100 + (price - 4000000) * 0.20;
  } else if (price <= 4500000) {
    // > 4,323,780 – ≤ 4,500,000: 1.5% of purchase price
    stampDuty = price * 0.015;
  } else if (price <= 4935480) {
    // > 4,500,000 – ≤ 4,935,480: HK$ 67,500 + 10% of excess over 4,500,000
    stampDuty = 67500 + (price - 4500000) * 0.10;
  } else if (price <= 6000000) {
    // > 4,935,480 – ≤ 6,000,000: 2.25% of purchase price
    stampDuty = price * 0.0225;
  } else if (price <= 6642860) {
    // > 6,000,000 – ≤ 6,642,860: HK$ 135,000 + 10% of excess over 6,000,000
    stampDuty = 135000 + (price - 6000000) * 0.10;
  } else if (price <= 9000000) {
    // > 6,642,860 – ≤ 9,000,000: 3% of purchase price
    stampDuty = price * 0.03;
  } else if (price <= 10080000) {
    // > 9,000,000 – ≤ 10,080,000: HK$ 270,000 + 10% of excess over 9,000,000
    stampDuty = 270000 + (price - 9000000) * 0.10;
  } else if (price <= 20000000) {
    // > 10,080,000 – ≤ 20,000,000: 3.75% of purchase price
    stampDuty = price * 0.0375;
  } else {
    // > 20,000,000: HK$ 750,000 + 10% of excess over 20,000,000
    stampDuty = 750000 + (price - 20000000) * 0.10;
  }

  // Round up to the nearest dollar
  stampDuty = Math.ceil(stampDuty);

  // Check if eligible for refund (HKPR first-home buyers who sell original property within 12 months)
  const noteEligibleForRefund = isHKPR && isFirstHome;

  return {
    amount: stampDuty,
    noteEligibleForRefund
  };
}

/**
 * Get stamp duty rate information for display purposes
 * @param price - Property price in HKD
 * @returns Object with rate percentage and description
 */
export function getStampDutyRateInfo(price: number): {
  rate: number;
  description: string;
} {
  if (price <= 4000000) {
    return { rate: 0, description: 'Fixed HK$ 100' };
  } else if (price <= 4323780) {
    return { rate: 20, description: 'HK$ 100 + 20% of excess over HK$ 4M' };
  } else if (price <= 4500000) {
    return { rate: 1.5, description: '1.5% of purchase price' };
  } else if (price <= 4935480) {
    return { rate: 10, description: 'HK$ 67,500 + 10% of excess over HK$ 4.5M' };
  } else if (price <= 6000000) {
    return { rate: 2.25, description: '2.25% of purchase price' };
  } else if (price <= 6642860) {
    return { rate: 10, description: 'HK$ 135,000 + 10% of excess over HK$ 6M' };
  } else if (price <= 9000000) {
    return { rate: 3, description: '3% of purchase price' };
  } else if (price <= 10080000) {
    return { rate: 10, description: 'HK$ 270,000 + 10% of excess over HK$ 9M' };
  } else if (price <= 20000000) {
    return { rate: 3.75, description: '3.75% of purchase price' };
  } else {
    return { rate: 10, description: 'HK$ 750,000 + 10% of excess over HK$ 20M' };
  }
}

/**
 * Format stamp duty amount for display
 * @param amount - Stamp duty amount in HKD
 * @returns Formatted string
 */
export function formatStampDuty(amount: number): string {
  return `HK$ ${amount.toLocaleString()}`;
}

/**
 * Get refund eligibility message
 * @param isEligible - Whether buyer is eligible for refund
 * @param language - Language for message ('en' or 'zh')
 * @returns Formatted message
 */
export function getRefundMessage(isEligible: boolean, language: 'en' | 'zh' = 'en'): string {
  if (!isEligible) return '';
  
  return language === 'zh' 
    ? '注意：首置香港永久居民如在12個月內出售原有物業，可申請退稅'
    : 'Note: First-time HKPR buyers may apply for refund if they sell their original property within 12 months';
} 