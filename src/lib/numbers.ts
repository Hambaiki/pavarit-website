export function truncateNumber(
  num: number,
  config?: {
    skips?: number[];
    additionalSuffixes?: { [key: number]: string };
    thousandsSeparator?: string;
  }
): string {
  try {
    const skips = config?.skips || [];
    const additionalSuffixes = config?.additionalSuffixes || {};
    const thousandsSeparator = config?.thousandsSeparator || ",";

    for (const [threshold, suffix] of Object.entries(additionalSuffixes)) {
      const thresholdNum = Number(threshold);
      if (num >= thresholdNum && !skips.includes(thresholdNum)) {
        return (num / thresholdNum).toFixed(1).replace(/\.0$/, "") + suffix;
      }
    }

    if (num >= 1_000_000_000_000 && !skips.includes(1_000_000_000_000)) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
    }

    if (num >= 1_000_000_000 && !skips.includes(1_000_000_000)) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1_000_000 && !skips.includes(1_000_000)) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000 && !skips.includes(1_000)) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }

    if (num >= 1_000) {
      return num
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    }

    return num.toString();
  } catch (error) {
    return num.toString();
  }
}
