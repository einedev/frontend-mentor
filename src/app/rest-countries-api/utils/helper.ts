const formatNumber = (x: number | undefined) => {
  if (!x) { return; }
  else {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export {formatNumber};