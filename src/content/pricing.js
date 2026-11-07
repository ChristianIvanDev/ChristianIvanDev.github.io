/** Precios en pesos mexicanos por clase de 60 minutos, en línea. Una sola fuente de verdad para la web. */
export const PRICING = {
  currency: 'MXN',
  firstClass: 0,
  superprof: 150,
  direct: 130,
  packages: [
    { id: 'p4', classes: 4, price: 480 },
    { id: 'p8', classes: 8, price: 920, popular: true },
    { id: 'p12', classes: 12, price: 1320 },
  ],
};

/** Precio por hora, ahorro y descuento de un paquete, siempre contra la tarifa directa (no contra Superprof). */
export function packageMath(pkg, direct = PRICING.direct) {
  const full = direct * pkg.classes;
  return {
    perHour: pkg.price / pkg.classes,
    savings: full - pkg.price,
    discountPct: Math.round(((full - pkg.price) / full) * 100),
  };
}

export const money = (n) => `$${n.toLocaleString('en-US')}`;
