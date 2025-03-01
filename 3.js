// #  +  #  +  #
//  +  +  +  +
//   +  #  +
//    +  +
//     #
// row genap(index ganjil) hanya '+'

function cetakPola(n) {
  for (i = 0; i < n; i++) {
    //row nya
    let row = '';

    for (j = 0; j < i; j++) {
      //kasih spasi di awal
      row += ' ';
    }

    for (k = 0; k < n - i; k++) {
      if (i == 2) {
        //index 2
        if (k % 2 != 0) {
          row += '# '; //index k ganjil print #
        } else {
          row += '+ '; //index k genap prnit +
        }
      } else if (i % 2 == 0) {
        //index genap 0,4 (2 engga karena pake condition di atas)
        if (k % 2 != 0) {
          row += '+ '; //index k ganjil print +
        } else {
          row += '# '; //index k genap print #
        }
      } else {
        row += '+ '; //sisanya print +
      }
    }

    console.log(row);
  }
}

cetakPola(5);
