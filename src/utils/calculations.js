/** Discount a nominal future value to today's purchasing power */
function adjustForInflation(nominalValue, inflationRate, years) {
  if (!inflationRate || years === 0) return nominalValue;
  return nominalValue / Math.pow(1 + inflationRate / 100, years);
}

/**
 * SIP Future Value:
 * FV = P × [((1 + r)^n – 1) / r] × (1 + r)
 * P = monthly investment, r = monthly rate, n = total months
 */
export function calculateSIP(monthlyInvestment, annualRate, years, inflation = 0) {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const totalInvested = monthlyInvestment * months;

  if (annualRate === 0) {
    const adjTotal = adjustForInflation(totalInvested, inflation, years);
    return {
      totalInvested: Math.round(totalInvested),
      estimatedReturns: 0,
      totalValue: Math.round(totalInvested),
      inflationAdjusted: Math.round(adjTotal),
    };
  }

  const futureValue =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate));

  const adjFV = adjustForInflation(futureValue, inflation, years);

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(futureValue - totalInvested),
    totalValue: Math.round(futureValue),
    inflationAdjusted: Math.round(adjFV),
  };
}

/**
 * Lumpsum Future Value:
 * FV = P × (1 + r)^n
 * P = one-time investment, r = annual rate / 100, n = years
 */
export function calculateLumpsum(investment, annualRate, years, inflation = 0) {
  const rate = annualRate / 100;
  const futureValue = investment * Math.pow(1 + rate, years);
  const adjFV = adjustForInflation(futureValue, inflation, years);

  return {
    totalInvested: Math.round(investment),
    estimatedReturns: Math.round(futureValue - investment),
    totalValue: Math.round(futureValue),
    inflationAdjusted: Math.round(adjFV),
  };
}

/**
 * SWP (Systematic Withdrawal Plan):
 * Simulates monthly withdrawals from a corpus that earns returns.
 * Each month: balance grows by monthly rate, then withdrawal is deducted.
 * If balance hits 0 mid-way, withdrawals stop.
 *
 * @param {number} corpus      - Initial invested amount
 * @param {number} withdrawal  - Monthly withdrawal amount
 * @param {number} annualRate  - Expected annual return %
 * @param {number} years       - Withdrawal duration in years
 * @param {number} inflation   - Yearly inflation % (optional)
 * @returns {{ totalInvested, totalWithdrawn, finalBalance, estimatedReturns, totalValue, inflationAdjusted }}
 */
export function calculateSWP(corpus, withdrawal, annualRate, years, inflation = 0) {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  let balance = corpus;
  let totalWithdrawn = 0;

  for (let m = 1; m <= months; m++) {
    balance *= (1 + monthlyRate);
    const deduction = Math.min(withdrawal, balance);
    balance -= deduction;
    totalWithdrawn += deduction;
    if (balance <= 0) { balance = 0; break; }
  }

  const totalValue = Math.round(balance + totalWithdrawn);
  const earnings = totalValue - corpus;
  const adjBalance = adjustForInflation(balance, inflation, years);

  return {
    totalInvested: Math.round(corpus),
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(balance),
    estimatedReturns: Math.round(earnings),
    totalValue,
    inflationAdjusted: Math.round(adjBalance),
  };
}

/** Year-by-year growth data for the bar/line chart */
export function getYearlyGrowth(mode, investment, annualRate, years, inflation = 0, swpWithdrawal = 0) {
  const data = [];
  for (let y = 1; y <= years; y++) {
    if (mode === 'swp') {
      const result = calculateSWP(investment, swpWithdrawal, annualRate, y, inflation);
      data.push({
        year: `Yr ${y}`,
        withdrawn: result.totalWithdrawn,
        balance: result.finalBalance,
        total: result.totalValue,
        inflationAdjusted: result.inflationAdjusted,
      });
    } else {
      const result =
        mode === 'sip'
          ? calculateSIP(investment, annualRate, y, inflation)
          : calculateLumpsum(investment, annualRate, y, inflation);
      data.push({
        year: `Yr ${y}`,
        invested: result.totalInvested,
        returns: result.estimatedReturns,
        total: result.totalValue,
        inflationAdjusted: result.inflationAdjusted,
      });
    }
  }
  return data;
}
