
module.exports = {

  setCurrency: function(res, currency) {
    const curr = res.currencies.find(function(c) {
      return c.name == currency
    })
    return curr
  },

  updateDenomination: function(res, amount, number) {
    res.denominations[amount] = number
    return res.denominations
  }

}
