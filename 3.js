// #  +  #  +  #
//  +  +  +  +
//   +  #  +
//    +  +
//     #
// row genap(index ganjil) hanya '+'

function cetakPola(n) {
  for (i = 0; i < n; i++) {
    let row = '';

    for (j = 0; j < i; j++) {
      row += ' ';
    }

    for (k = 0; k < n - i; k++) {
      if (i == 2) {
        if (k % 2 != 0) {
          row += '# ';
        } else {
          row += '+ ';
        }
      } else if (i % 2 == 0) {
        if (k % 2 != 0) {
          row += '+ ';
        } else {
          row += '# ';
        }
      } else {
        row += '+ ';
      }
    }
    console.log(row);
  }
}
console.log('No.3');
cetakPola(5);
