// 1.000.000.000
// 350.000.000 - deposito annual 0.035
// 650.000.000 * 0.3 - obligasi annual 0.13
// 650.000.000 * 0.35 - saham a annual 0.145
// 650.000.000 * 0.35 - saham b annual 0.125

function invest() {
  let deposito = 350000000;
  let depositoInterest = 0.035;
  let obligasi = 650000000 * 0.3;
  let obligasiInterest = 0.13;
  let sahamA = 650000000 * 0.35;
  let sahamAInterest = 0.145;
  let sahamB = 650000000 * 0.35;
  let sahamBInterest = 0.125;
  let years = 2;
  for (i = 0; i < years; i++) {
    deposito = deposito * depositoInterest + deposito;
    obligasi = obligasi * obligasiInterest + obligasi;
    sahamA = sahamA * sahamAInterest + sahamA;
    sahamB = sahamB * sahamBInterest + sahamB;
  }
  let twoYearProfit = deposito + obligasi + sahamA + sahamB;
  let profit = twoYearProfit.toLocaleString('id-ID');
  console.log('No. 1');
  console.log(`Investor's initial investment with profit of two years investment is Rp.${profit}`);
}

invest();
