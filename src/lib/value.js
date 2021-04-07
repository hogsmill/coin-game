
const Value = {

  total: function(denominations) {
    let total = 0
    for (const denomination in denominations) {
      total += denominations[denomination] * denomination
    }
    const pounds = Math.floor(total / 100)
    let pence = total - pounds * 100
    if (pence < 10) {
      pence = '0' + pence
    }
    return pounds + ':' + pence
  }
}

export default Value
