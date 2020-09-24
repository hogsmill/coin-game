
const StringFuns = {

  htmlDecode: function(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html')
    return doc.documentElement.textContent
  }
}

export default StringFuns
