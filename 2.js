// [“u”, “D”, “m”, “w”, “b”, “a”, “y”, “s”, “i”, “s”, “w”, “a”, “e”, “s”, “e”, “o”, “m”,” “ ,” “]

// output Dumbways is awesome [19 char]

//selection sort

function sortArray(arr) {
  const correct = ['D', 'u', 'm', 'b', 'w', 'a', 'y', 's', ' ', 'i', 's', ' ', 'a', 'w', 'e', 's', 'o', 'm', 'e'];

  for (i = 0; i < arr.length; i++) {
    let min = i;

    for (j = i + 1; j < arr.length; j++) {
      let indexJ = correct.indexOf(arr[j], i);
      let indexMin = correct.indexOf(arr[min], i);

      if (indexJ < indexMin) {
        min = j;
      }
    }

    if (min !== i) {
      let temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;
    }
  }
  console.log('No. 2');
  console.log(arr.join(''));
}

sortArray(['u', 'D', 'm', 'w', 'b', 'a', 'y', 's', 'i', 's', 'w', 'a', 'e', 's', 'e', 'o', 'm', ' ', ' ']);
